<template>
  <div class="pools-wrap">
    <!-- for debug -->
    <div v-if="false"> {{ lastUpdateAgoMinutes }}</div>

    <div
      class="pools-wrap__loader"
      v-if="isPoolsLoading"
    >
      <TableSkeleton />
    </div>

    <div
      v-else
      class="pools-container"
    >
      <PoolsTable
        :pools="mergedPools"
        :is-show-only-zap="isShowOnlyZap"
        :is-show-apr-limit="isShowAprLimit"
        :open-zap-in-func="openZapIn"
        :set-order-type-func="setOrderType"
        :order-type="orderType"
      >
        <template #filters>
          <PoolsFilter
            :selected-network="selectedTabs"
            @change-tab="changePoolsTab"
            @change-network="setSelectedNetwork"
            @search="updateSearch"
          />
        </template>
        <template
          #footer
          v-if="!isPoolsLoading && typeOfPool === 'ALL' && filteredPoolsForSecondTab?.length > 0"
        >
          <div
            class="table-extend"
            @click="openPoolList = !openPoolList"
            @keypress="openPoolList = !openPoolList"
          >
            <div
              class="table-extend__arrow"
            >
              <BaseIcon name="ArrowDown" />
            </div>
            <h1>
              {{openPoolList ? "CLOSE" : "OPEN"}} Pools with TVL less than $300K
            </h1>
            <div
              class="table-extend__arrow"
            >
              <BaseIcon name="ArrowDown" />
            </div>
          </div>
        </template>
      </PoolsTable>
    </div>

    <ZapModal
      :zap-pool="currentZapPool"
      :is-show="isZapModalShow"
      @toggle-modal="setIsZapModalShow"
    />
  </div>
</template>

<script lang="ts">

import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { poolTypes } from '@/modules/Main/components/PoolsTable/types/index.ts';
import {
  getSortedSecondPools, getSortedPools,
} from '@/store/views/main/pools/helpers.ts';

import utc from 'dayjs/plugin/utc';

import ZapModal from '@/modules/Main/components/ZapModal/Index.vue';
import PoolsFilter from '@/modules/Main/components/PoolsTable/PoolsFilter.vue';
import PoolsTable from '@/components/PoolsTable/Index.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import dayjs from 'dayjs';

dayjs.extend(utc);

export default {
  name: 'PoolsContainer',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: {
    BaseIcon,
    PoolsFilter,
    TableSkeleton,
    PoolsTable,
    ZapModal,
  },

  data: () => ({
    avgApy: null,
    poolTabType: poolTypes.ALL,

    openPoolList: false,

    selectedTabs: ['ALL'], // ALL or networkName,
    isShowOnlyZap: false,
    isShowAprLimit: false,
    aprLimitForFilter: 15,
    searchQuery: '',

    orderType: 'APR', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
  }),

  computed: {
    ...mapGetters('theme', ['light']),
    ...mapGetters('network', ['getParams', 'networkId']),
    ...mapState('poolsData', [
      'sortedPoolSecondList',
      'sortedPoolList',
      'typeOfPool',
      'isPoolsLoading',
      'currentZapPool',
      'isZapModalShow',
    ]),
    mergedPools() {
      return this.openPoolList
        ? [...this.filteredPools, ...this.filteredPoolsForSecondTab] : this.filteredPools;
    },
    filteredPools() {
      if (this.orderType === 'APR') {
        // last step filter
        return getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN', this.poolTabType);
      }

      if (this.orderType === 'APR_UP') {
        // last step filter
        return this.filteredBySearchQueryPools
          .slice()
          .sort((a: any, b: any) => b.apr - a.apr);
      }

      if (this.orderType === 'APR_DOWN') {
        // last step filter
        return this.filteredBySearchQueryPools
          .slice()
          .sort((a: any, b: any) => a.apr - b.apr);
      }

      if (this.orderType === 'TVL') {
        // last step filter. same like type 'APR'
        return getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN', this.poolTabType);
      }

      if (this.orderType === 'TVL_UP') {
        // last step filter
        return this.filteredBySearchQueryPools
          .slice()
          .sort((a: any, b: any) => b.tvl - a.tvl);
      }

      if (this.orderType === 'TVL_DOWN') {
        // last step filter
        return this.filteredBySearchQueryPools
          .slice()
          .sort((a: any, b: any) => a.tvl - b.tvl);
      }

      console.error('Order type not found when order pools', this.orderType);
      return [];
    },

    filteredPoolsForSecondTab() {
      if (this.orderType === 'APR') {
        // last step filter
        return getSortedSecondPools(this.filteredBySearchQuerySecondPools, this.poolTabType);
      }

      if (this.orderType === 'APR_UP') {
        // last step filter
        return this.filteredBySearchQuerySecondPools
          .slice()
          .sort((a: any, b: any) => b.apr - a.apr);
      }

      if (this.orderType === 'APR_DOWN') {
        // last step filter
        return this.filteredBySearchQuerySecondPools
          .slice()
          .sort((a: any, b: any) => a.apr - b.apr);
      }

      if (this.orderType === 'TVL') {
        // last step filter. same like type 'APR'
        return getSortedSecondPools(this.filteredBySearchQuerySecondPools, this.poolTabType);
      }

      if (this.orderType === 'TVL_UP') {
        // last step filter
        return this.filteredBySearchQuerySecondPools
          .slice()
          .sort((a: any, b: any) => b.tvl - a.tvl);
      }

      if (this.orderType === 'TVL_DOWN') {
        // last step filter
        return this.filteredBySearchQuerySecondPools
          .slice()
          .sort((a: any, b: any) => a.tvl - b.tvl);
      }

      console.error('Order type not found when order pools', this.orderType);
      return [];
    },

    filteredBySearchQueryPools() {
      if (!this.searchQuery) {
        return this.filteredAprPools;
      }

      return this.filteredAprPools
        .filter((pool: any) => pool.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.id.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.address.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.platform.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredBySearchQuerySecondPools() {
      if (!this.searchQuery) {
        return this.filteredAprSecondPools;
      }

      return this.filteredAprSecondPools
        .filter((pool: any) => pool.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.id.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.address.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.platform.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredAprPools() {
      if (!this.isShowAprLimit) {
        return this.filteredZappablePools;
      }

      return this.filteredZappablePools
        .filter((pool: any) => pool.apr && this.aprLimitForFilter <= pool.apr * 1);
    },
    filteredAprSecondPools() {
      if (!this.isShowAprLimit) {
        return this.filteredZappableSecondPools;
      }

      return this.filteredZappableSecondPools
        .filter((pool: any) => pool.apr && this.aprLimitForFilter <= pool.apr * 1);
    },

    filteredZappablePools() {
      if (!this.isShowOnlyZap) {
        return this.filteredByTabPools;
      }

      return this.filteredByTabPools.filter((pool: any) => this.isShowOnlyZap && pool.zappable);
    },
    filteredZappableSecondPools() {
      if (!this.isShowOnlyZap) {
        return this.filteredBySecondTabPools;
      }

      return this.filteredBySecondTabPools
        .filter((pool: any) => this.isShowOnlyZap && pool.zappable);
    },
    filteredByTabPools() {
      if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
        return this.sortedPoolList;
      }

      return this.sortedPoolList
        .filter((pool: any) => this.selectedTabs.includes(this.getParams(pool.chain).networkId));
    },
    filteredBySecondTabPools() {
      if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
        return this.sortedPoolSecondList;
      }

      return this.sortedPoolSecondList
        .filter((pool: any) => this.selectedTabs.includes(this.getParams(pool.chain).networkId));
    },

    lastUpdateAgoMinutes() {
      if (!this.sortedPoolList || !this.sortedPoolList.length) {
        return null;
      }

      const firstPool = this.sortedPoolList[0].data;
      const lastUpdateDate = firstPool.updateDate;
      if (!lastUpdateDate) {
        return null;
      }

      const lastUpdateMoment = dayjs.utc(lastUpdateDate);
      const now = dayjs.utc();
      return now.diff(lastUpdateMoment, 'minutes');
    },
  },
  async mounted() {
    if (this.type === 'OVN') {
      this.changeState({
        field: 'typeOfPool',
        val: 'OVN',
      });
    } else {
      this.changeState({
        field: 'typeOfPool',
        val: 'ALL',
      });
    }

    this.clearAllFilters();
    await this.loadPools();
  },

  methods: {
    ...mapActions('poolsData', ['loadPools', 'openZapIn', 'setIsZapModalShow']),
    ...mapMutations('poolsData', ['changeState']),

    changePoolsTab(type: poolTypes) {
      this.poolTabType = type;
    },
    updateSearch(searchQuery: string) {
      this.searchQuery = searchQuery;
    },
    setOrderType(orderType: any) {
      this.orderType = orderType;
    },
    zapFilter(isShow: boolean) {
      this.isShowOnlyZap = isShow;
      console.log('Is show zap? ', this.isShowOnlyZap);
    },
    aprLimitFilter(isShow: boolean, limit: any) {
      this.isShowAprLimit = isShow;
      this.aprLimitForFilter = limit;
      console.log('Apr limit ', isShow, limit);
    },
    setSelectedNetwork(tab: string) {
      if (tab === 'all' && this.selectedTabs.includes('ALL')) {
        this.selectedTabs = ['ALL'];
        return;
      }

      if (tab === 'all') {
        this.selectedTabs = ['ALL'];
        return;
      }

      // remove all if click other
      if (tab !== 'all' && !this.tabExistInTabs(this.selectedTabs, tab)) {
        this.selectedTabs = this.selectedTabs.filter((selectedTab) => selectedTab !== 'ALL');
      }

      if (this.tabExistInTabs(this.selectedTabs, tab)) {
        this.selectedTabs = this.selectedTabs.filter((selectedTab) => selectedTab !== tab);
        if (this.selectedTabs.length === 0) {
          this.selectedTabs = ['ALL'];
        }

        return;
      }

      this.selectedTabs.push(tab);
    },
    tabExistInTabs(tabs: any[], tab: string) {
      for (let i = 0; i < tabs.length; i++) {
        if (tab === tabs[i]) {
          return true;
        }
      }

      return false;
    },
    clearAllFilters() {
      this.isShowOnlyZap = false;
      this.isShowAprLimit = false;
      this.selectedTabs = ['ALL'];
    },
  },
};
</script>

<style lang="scss" scoped>
.pools-wrap {
  margin: 30px 0;
}

.pools-wrap__loader {
  min-height: 300px;
  width: 100%;
  display: flex;
  padding-bottom: 50vh;
  justify-content: center;
  align-items: center;
}

.table-extend {
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  width: 100%;
  border-radius: 30px;
  border: 1px solid var(--color-7);
  color: var(--color-7);
  cursor: pointer;
  transition: background-color .2s ease;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    color: var(--color-2);
  }

  h1 {
    font-weight: 500;
    text-transform: uppercase;
    margin: 0 10px;
    transition: color .2s ease;
  }

  &:hover {
    color: var(--color-1);
    background-color: var(--color-4);
    [data-theme="dark"] & {
      color: var(--color-17);
    }
  }
}
</style>
