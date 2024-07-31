<template>
  <div class="pools-wrap">
    <div
      v-if="!walletConnected || !account || !Object.values(supportedNetworks).includes(networkName)"
      class="unavailable-container"
    >
      <div>
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
import {
  mapActions, mapGetters,
} from 'vuex';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { getImageUrl } from '@/utils/const.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import { formatPositionData } from '../../../components/Pools/PositionsTable/helpers.ts';

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

export default {
  name: 'PositionsTable',
  components: {
    PoolsTable,
    PoolsFilter,
    TableSkeleton,
    ButtonComponent,
  },
  data: () => ({
    poolTabType: POOL_TYPES.ALL,
    isOpenHiddenPools: false,

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
    isLoading: true as boolean,
    positionData: [] as any,
    supportedNetworks: SUPPORTED_REBALANCE_NETWORKS,
  }),
  computed: {
    ...mapGetters('network', ['getParams', 'isShowDeprecated']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('poolsData', ['allPoolsMap']),
    ...mapGetters('odosData', ['allTokensMap', 'isTokensLoaded']),
    ...mapGetters('network', ['networkName']),
    ...mapGetters('walletAction', ['walletConnected']),
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
      return this.positionData;
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
  },
  watch: {
    async allTokensMap() {
      if (!this.isTokensLoaded) this.isLoading = true;
      else if (this.isTokensLoaded && this.allTokensMap.size > 0) {
        const posData = await this.getFormatPositions();
        if (posData.length > 0) {
          this.positionData = posData;
          this.isLoading = false;
        }
      }
    },
    async networkName() {
      this.isLoading = true;
      await this.init();
    },
  },
  async mounted() {
    this.clearAllFilters();
    await this.loadPools();

    this.aprSortIterator = iterateEnum(APR_ORDER_TYPE);
    this.aprOrder = this.aprSortIterator.next();
    this.positionSizeSortIterator = iterateEnum(POSITION_SIZE_ORDER_TYPE);
    this.positionSizeOrder = this.positionSizeSortIterator.next();

    await this.init();
  },
  methods: {
    ...mapActions('poolsData', ['loadPools']),
    ...mapActions('zapinData', ['loadPositionContract']),
    ...mapActions('odosData', ['loadTokens', 'initData', 'loadChains', 'initContractData']),
    async init() {
      this.$store.commit('odosData/changeState', {
        field: 'isTokensLoadedAndFiltered',
        val: false,
      });
      await this.loadTokens();
      await this.loadChains();
      await this.initContractData();
      await this.initData();
      this.$store.commit('odosData/changeState', {
        field: 'isTokensLoadedAndFiltered',
        val: true,
      });
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
    async getFormatPositions() {
      const poolInfo = this.allPoolsMap;
      const tokensList = this.allTokensMap;

      const positionData = await this.loadPositionContract(this.account);

      console.log(positionData, '__positionData');
      return formatPositionData(positionData, poolInfo, tokensList);
    },
    connectWallet() {
      this.$store.dispatch('walletAction/connectWallet');
    },
    getImageUrl,
  },
};
</script>
<style lang="scss" scoped src="./styles.scss" />
