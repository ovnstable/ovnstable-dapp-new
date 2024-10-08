<template>
  <div class="pools-wrap">
    <div
      v-if="!isLoading && searchQuery === '' && (!walletConnected
        || !account
        || !isSupportedNetwork
        || !displayedPools
        || displayedPools?.length === 0
        || displayedPools?.[0] === 0)"
      class="unavailable-container"
    >
      <div
        v-if="!walletConnected
          || !account
          || !isSupportedNetwork"
      >
        <div
          v-if="!walletConnected || !account"
          class="unavailable-row"
        >
          <p>
            PLEASE
          </p>
          <ButtonComponent
            class="connect-btn"
            @on-click="connectWallet"
          >
            CONNECT WALLET
          </ButtonComponent>
          <p>
            TO SEE YOUR PROFITS GROW
          </p>
        </div>
        <div
          v-if="!supportedNetworks[networkName]"
          class="unavailable-row"
        >
          <p>
            PLEASE SELECT ONE OF THE CURRENTLY SUPPORTED NETWORKS: BASE, ARBITRUM
          </p>
        </div>
      </div>
      <div
        v-else-if="(!displayedPools
          || displayedPools.length === 0
          || displayedPools?.[0] === 0)"
        class="unavailable-row"
      >
        <p>
          NO POSITIONS TO DISPLAY YET
        </p>
      </div>
      <img
        alt="sloth"
        :src="getImageUrl(`assets/icons/common/SlothUnavailable.png`)"
      />
    </div>
    <div v-else>
      <div
        v-if="isLoading"
        class="pools-wrap__loader"
      >
        <TableSkeleton />
      </div>
      <div
        v-else
        class="pools-container"
      >
        <PoolsTable
          :pools="displayedPools"
          :set-order-type-func="toggleOrderType"
          :position-size-sort-func="togglePositionSizeSort"
          :apy-order-type="orderType"
          :position-size-order-type="positionSizeOrder"
          :claim-loading="isClaiming"
          @claim="handleClaim"
          @stake="stakeTrigger"
        >
          <template #filters>
            <PoolsFilter
              :selected-network="selectedNetworks"
              :is-show-deprecated="isShowDeprecated"
              :search-query="searchQuery"
              @change-tab="switchPoolsTab"
              @change-network="setSelectedNetwork"
              @search="updateSearch"
            />
          </template>
        </PoolsTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PoolsTable from '@/components/Pools/PositionsTable/Index.vue';
import PoolsFilter from '@/components/Pools/PositionsFilter/Index.vue';
import { mapActions, mapGetters } from 'vuex';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { awaitDelay, getImageUrl } from '@/utils/const.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import { defineComponent } from 'vue';
import { usePositionsQuery, useRefreshPositions } from '@/hooks/fetch/usePositionsQuery.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import { initZapinContracts } from '@/services/Web3Service/utils/index.ts';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import type { PLATFORMS, TFilterPoolsParams, TPoolInfo } from '@/types/common/pools/index.ts';
import ZapinService from '@/services/Web3Service/Zapin-service.ts';
import type { IPositionsInfo } from '@/types/positions';

interface IEnumIterator {
  next: () => number,
  reset: () => void,
}

function iterateEnum(enumObj: any): IEnumIterator {
  const keys = Object.values(enumObj).filter((key) => typeof key === 'number');
  let index = 0;

  return {
    next: () => {
      const key = keys[index] as number;
      index = (index + 1) % keys.length;
      return key;
    },
    reset: () => {
      index = 0;
    },
  };
}

const sortByTagAndValue = (
  tag: any,
  pools: any[],
  isDefault: boolean = false,
) => (valueExtractor: any) => pools.sort(
  (a, b) => {
    if (isDefault) {
      if (a.poolTag === tag && b.poolTag !== tag) return -1;
      if (b.poolTag === tag && a.poolTag !== tag) return 1;
    }
    return valueExtractor(b) - valueExtractor(a);
  },
);

enum APR_ORDER_TYPE {
  'APR', 'APR_UP', 'APR_DOWN',
}
enum POSITION_SIZE_ORDER_TYPE {
  'VALUE', 'VALUE_UP', 'VALUE_DOWN',
}
enum SUPPORTED_REBALANCE_NETWORKS {
  arbitrum, base,
}

export default defineComponent({
  name: 'PositionsTable',
  components: {
    PoolsTable,
    PoolsFilter,
    TableSkeleton,
    ButtonComponent,
  },
  setup() {
    const { data: positionData, isLoading } = usePositionsQuery();
    const { data: allTokensList } = useTokensQuery();
    const { data: balanceList } = useTokensQueryNew();
    const { data: poolList } = usePoolsQueryNew();

    return {
      isLoading,
      positionData,
      allTokensList,
      balanceList,
      poolList,

      resetData: useRefreshBalances(),
      reloadData: useRefreshPositions(),

      poolTabType: POOL_TYPES.ALL,
      isOpenHiddenPools: false,
      isClaiming: false,

      selectedTabs: ['ALL'],
      selectedNetworks: [] as number[], // [] for ALL or networks,
      isShowOnlyZap: false,
      isShowAprLimit: false,
      searchQuery: '',

      orderType: APR_ORDER_TYPE.APR_UP,
      isDefaultOrder: true as boolean,

      aprSortIterator: {} as IEnumIterator,
      aprOrder: 0 as number,
      positionSizeSortIterator: {} as IEnumIterator,
      positionSizeOrder: 0 as number,
      isManualLoading: false as boolean,
      supportedNetworks: SUPPORTED_REBALANCE_NETWORKS,
      isInit: false as boolean,
    };
  },
  computed: {
    ...mapGetters('network', ['getParams', 'isShowDeprecated']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('network', ['networkName']),
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('network', ['networkId']),
    mergedAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
    },
    filteredPools() {
      const sortByHotTagAndValue = sortByTagAndValue(
        'NEW',
        this.filteredBySearchQuery,
        this.isDefaultOrder,
      );

      if (this.positionSizeOrder === POSITION_SIZE_ORDER_TYPE.VALUE_UP) {
        return sortByHotTagAndValue((pool: any) => pool.position.usdValue);
      }

      if (this.positionSizeOrder === POSITION_SIZE_ORDER_TYPE.VALUE_DOWN) {
        return sortByHotTagAndValue((pool: any) => -pool.position.usdValue);
      }

      return this.filteredBySearchQuery;
    },
    displayedPools() {
      if (this.positionData.length > 0) return this.filteredPools;
      return this.filteredPools;
    },
    filteredBySearchQuery() {
      if (!this.searchQuery || this.searchQuery.trim().length === 0) return this.filteredByNetwork;

      return this.filteredByNetwork
        .filter((pool: any) => [pool.name, pool.id, pool.chainName, pool.address, pool.platform?.join('')]
          .some((col: any) => col?.toLowerCase()?.includes(this.searchQuery.toLowerCase())));
    },
    filteredByNetwork() {
      if (this.selectedNetworks.length === 0) return this.positionData;

      return this.positionData
        .filter((pool: any) => this.selectedNetworks.includes(
          this.getParams(pool.chain).networkId,
        ));
    },
    isSupportedNetwork() {
      return Object.values(this.supportedNetworks).includes(this.networkName);
    },
  },
  watch: {
    async networkName() {
      if (this.isSupportedNetwork) {
        await this.resetData();
      }
    },
    async account(account: string) {
      if (this.isSupportedNetwork && account) {
        await this.resetData();
      }
    },
  },
  async mounted() {
    this.clearAllFilters();
    this.aprSortIterator = iterateEnum(APR_ORDER_TYPE);
    this.aprOrder = this.aprSortIterator.next();
    this.positionSizeSortIterator = iterateEnum(POSITION_SIZE_ORDER_TYPE);
    this.positionSizeOrder = this.positionSizeSortIterator.next();
  },
  methods: {
    ...mapActions('waitingModal', ['closeWaitingModal', 'showWaitingModal']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('poolsData', ['setIsZapModalShow', 'setFilterParams']),
    handleClickSearch(zapPool: any) {
      if (!zapPool) return;
      const tokens = (zapPool?.name as string)?.split('/');

      const filterParams: Partial<TFilterPoolsParams> = {
        token0: tokens[0],
      };
      this.setFilterParams(filterParams);
    },
    searchGauge(pool: TPoolInfo) {
      if (!this.poolList || this.poolList?.length === 0 || !pool) return '';
      const foundPool = this.poolList
        .find((_: any) => _.address?.toLowerCase() === pool.address?.toLowerCase());

      if (foundPool) return foundPool.gauge;
      return '';
    },
    async approveNftGauge(poolTokenContract: any, gaugeContract: any, tokenId: any) {
      this.showWaitingModal('Approving NFT in process');

      try {
        const params = { from: this.account };
        const tx = await poolTokenContract
          .approve(gaugeContract?.target, tokenId, params);

        await tx.wait();
      } catch (e: any) {
        this.closeWaitingModal();
        throw new Error(e);
      }
    },
    async stakeTrigger(pool: IPositionsInfo) {
      this.setIsZapModalShow(false);
      this.handleClickSearch(pool);
      await awaitDelay(1000);
      const gaugeAdd = this.searchGauge(pool);

      if (!gaugeAdd) {
        this.showErrorModalWithMsg({ errorType: "zap", errorMsg: 'Gauge not found' });
        return;
      }

      const contractsData = await initZapinContracts(
        pool,
        this.mergedAllTokens,
        this.evmSigner,
        gaugeAdd,
      );

      console.log(pool, '___pool');

      try {
        this.showWaitingModal('staking');
        this.isClaiming = true;
        await this.approveNftGauge(
          contractsData.poolTokenContract,
          contractsData.gaugeContract,
          pool.tokenId,
        );
        await ZapinService.stakeTrigger(
          pool.platform[0] as PLATFORMS,
          contractsData.gaugeContract,
          pool.tokenId,
          this.account,
          contractsData.poolTokenContract,
        );

        this.reloadData();
        this.closeWaitingModal();
      } catch (e) {
        this.isClaiming = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: parseErrorLog(e) });
      }
    },
    async handleClaim(pool: IPositionsInfo) {
      this.setIsZapModalShow(false);
      this.handleClickSearch(pool);
      await awaitDelay(1000);
      const gaugeAdd = this.searchGauge(pool);

      console.log(gaugeAdd, this.poolList, '___gaugeAdd')
      if (!gaugeAdd) {
        this.showErrorModalWithMsg({ errorType: "zap", errorMsg: 'Gauge not found' });
        return;
      }

      const contractsData = await initZapinContracts(
        pool,
        this.mergedAllTokens,
        this.evmSigner,
        gaugeAdd,
      );

      try {
        this.showWaitingModal('unstaking');
        this.isClaiming = true;
        // if (pool.isStaked && pool.platform[0] === "Pancake") {
        //   await this.approveNftGauge(
        //     contractsData.poolTokenContract,
        //     contractsData.gaugeContract,
        //     pool.tokenId,
        //   );
        // }

        await ZapinService.claimPosition(
          pool,
          contractsData.gaugeContract,
          contractsData.poolTokenContract,
          this.triggerSuccessZapin,
          this.account,
          this.evmSigner,
          this.networkId
        );
        this.closeWaitingModal();
      } catch (e) {
        this.isClaiming = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: "zap", errorMsg: parseErrorLog(e) });
      }
    },
    switchPoolsTab(type: POOL_TYPES) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      this.poolTabType = type;
    },
    updateSearch(searchQuery: string) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      this.searchQuery = searchQuery;
      this.$store.commit('accountData/triggerPositionRefresh');
    },
    toggleOrderType() {
      this.orderType = this.aprSortIterator.next();
    },
    togglePositionSizeSort() {
      this.positionSizeOrder = this.positionSizeSortIterator.next();
    },
    setSelectedNetwork(selectedChain: number | 'ALL') {
      this.isOpenHiddenPools = false;
      this.isDefaultOrder = true;
      if (selectedChain === 'ALL') this.selectedNetworks = [];
      else if (this.selectedNetworks.includes(selectedChain)) {
        this.selectedNetworks = this.selectedNetworks
          .filter((network) => network !== selectedChain);
      } else this.selectedNetworks.push(selectedChain);
    },
    clearAllFilters() {
      this.isOpenHiddenPools = false;
      this.isShowOnlyZap = false;
      this.isShowAprLimit = false;
      this.selectedTabs = ['ALL'];
      this.selectedNetworks = [];
      this.isDefaultOrder = true;
    },
    connectWallet() {
      this.$store.dispatch('walletAction/connectWallet');
    },
    getImageUrl,
  },
});
</script>
<style lang="scss" scoped src="./styles.scss" />
