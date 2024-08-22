<template>
  <div class="manage-wrap">
    <div class="manage-wrap__title">
      <router-link to="/positions">
        <ButtonComponent btn-styles="grey">
          <BaseIcon name="ArrowLeft" />
          <span>
            BACK
          </span>
        </ButtonComponent>
      </router-link>
      <h1>MANAGE POSITION</h1>
    </div>

    <PoolData
      v-if="!isLoadingData"
      :all-tokens-list="allTokensList"
      :zap-pool="zapPool"
    />

    <div class="manage-wrap__tabs">
      <SwitchTabs
        :tabs="filterTabs"
        :active-tab="activeTab"
        tab-style="white"
        type="large"
        @tab-change="changeTab"
      />
    </div>

    <div
      v-if="isLoadingData"
      class="pools-wrap__loader"
    >
      <TableSkeleton />
    </div>
    <div
      v-else-if="activeTab === manageTab.REBALANCE"
      class="manage-wrap__content"
    >
      <RebalanceForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
        :all-tokens-list="allTokensList"
        :balance-list="balanceList"
        :gauge-address="gaugeAddress"
      />
    </div>
    <div
      v-else-if="activeTab === manageTab.WITHDRAW"
      class="manage-wrap__content"
    >
      <WithdrawForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
        :all-tokens-list="allTokensList"
        :gauge-address="gaugeAddress"
      />
    </div>
    <div
      v-else-if="activeTab === manageTab.HARVEST"
      class="manage-wrap__content manage-wrap__content--harvest"
    >
      <HarvestForm
        :zap-pool="zapPool"
        :active-tab="activeTab"
        :all-tokens-list="allTokensList"
        :gauge-address="gaugeAddress"
      />
    </div>

    <SuccessZapModal
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<script lang="ts">
import {
  mapActions,
  useStore,
} from 'vuex';
import SuccessZapModal from '@/modules/ModalTemplates/SuccessModal/SuccessZapModal.vue';
import RebalanceForm from '@/modules/ManagePosition/ZapForm/Index.vue';
import WithdrawForm from '@/modules/ManagePosition/ZapForm/Withdraw.vue';
import HarvestForm from '@/modules/ManagePosition/ZapForm/Harvest.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import PoolData from '@/modules/ManagePosition/PoolData.vue';
import { usePositionsQuery } from '@/hooks/fetch/usePositionsQuery.ts';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { inject } from 'vue';
import { isEmpty } from 'lodash';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import type { ITokenService } from '@/services/TokenService/TokenService';
import type { IPoolService } from '@/services/PoolService/PoolService';
import type { TFilterPoolsParams } from '@/types/common/pools';

export enum MANAGE_TAB {
  REBALANCE,
  WITHDRAW,
  HARVEST
}

export default {
  name: 'PositionForm',
  components: {
    PoolData,
    RebalanceForm,
    HarvestForm,
    WithdrawForm,
    SuccessZapModal,
    ButtonComponent,
    BaseIcon,
    TableSkeleton,
    SwitchTabs,
  },
  setup() {
    const { state } = useStore() as any;

    const tokenService = inject('tokenService') as ITokenService;
    const poolService = inject('poolService') as IPoolService;

    const { data: getUserPositions } = usePositionsQuery(tokenService, poolService, state);
    const { data: balanceList, isLoading: tokensLoading } = useTokensQuery(tokenService, state);
    const { data: allTokensList } = useTokensQueryNew(tokenService, state);
    const { data: poolList } = usePoolsQueryNew();

    return {
      allTokensList,
      balanceList,
      poolList,
      tokensLoading,
      getUserPositions,
    };
  },
  data() {
    return {
      zapPool: null as any,
      manageTab: MANAGE_TAB,
      activeTab: MANAGE_TAB.REBALANCE,
      gaugeAddress: '',
      filterTabs: [
        {
          id: MANAGE_TAB.REBALANCE,
          name: 'Rebalance',
        },
        {
          id: MANAGE_TAB.WITHDRAW,
          name: 'Withdraw',
        },
        {
          id: MANAGE_TAB.HARVEST,
          name: 'Harvest',
        },
      ],
    };
  },
  computed: {
    isLoadingData() {
      return isEmpty(this.zapPool)
        || isEmpty(this.allTokensList)
        || isEmpty(this.balanceList)
        || !this.gaugeAddress;
    },
  },
  watch: {
    getUserPositions() {
      this.searchPool();
    },
    poolList() {
      this.init();
    },
    zapPool() {
      this.handleClickSearch();
    },
  },
  async mounted() {
    if (this.getUserPositions?.length > 0) this.searchPool();
    this.handleClickSearch();
    this.init();
  },
  methods: {
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('poolsData', ['setFilterParams']),
    handleClickSearch() {
      const tokens = (this.zapPool.name as string)?.split('/');
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: tokens[0],
        // token1: tokens[1],
      };
      this.setFilterParams(filterParams);
    },
    init() {
      console.log(this.poolList, '__this.poolList');
      if (!this.poolList || this.poolList?.length === 0 || !this.zapPool) return;
      const foundPool = this.poolList
        .find((_: any) => _.address?.toLowerCase() === this.zapPool.address?.toLowerCase());

      console.log(foundPool, '__foundPool');
      if (foundPool) this.gaugeAddress = foundPool.gauge;
    },
    changeTab(id: number) {
      this.activeTab = id;
    },
    searchPool() {
      const foundPool = this.getUserPositions
        .find((_: any) => _?.tokenId?.toString() === this.$route?.params?.id);

      if (foundPool) this.zapPool = foundPool;
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-wrap__content {
  padding: 20px;
  background-color: var(--color-4);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 2px solid var(--color-1);
  [data-theme="dark"] & {
        background-color: var(--color-6);
        background-blend-mode: unset;
    }
}

.manage-wrap__content--harvest {
  max-width: 600px;
  margin: 0 auto;
}

.manage-wrap__tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40px
}

.manage-wrap__title {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  color: var(--color-1);

  h1 {
    font-size: 26px;
    font-weight: 800;
  }

  span {
    margin-left: 8px;
  }
}
</style>
