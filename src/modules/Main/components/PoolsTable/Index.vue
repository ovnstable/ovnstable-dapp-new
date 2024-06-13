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
        <template
          v-if="!isOverview"
          #filters
        >
          <PoolsFilter
            :selected-network="selectedTabs"
            :is-show-deprecated="isShowDeprecated"
            @change-tab="changePoolsTab"
            @change-network="setSelectedNetwork"
            @search="updateSearch"
          />
        </template>
        <template
          #footer
          v-if="!isPoolsLoading && filteredPoolsForSecondTab?.length > 0"
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
              {{openPoolList ? "CLOSE POOLS" : "OPEN HIDDEN POOLS"}}
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
import { getSortedSecondPools, getSortedPools } from '@/store/views/main/pools/helpers.ts';
import utc from 'dayjs/plugin/utc';

import ZapModal from '@/modules/Main/components/ZapModal/Index.vue';
import PoolsFilter from '@/modules/Main/components/PoolsTable/PoolsFilter.vue';
import PoolsTable from '@/components/PoolsTable/Index.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import dayjs from 'dayjs';
import { POOL_TAG } from '@/store/views/main/pools/mocks.ts';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import type { PropType } from 'vue';

dayjs.extend(utc);

const sortByTagAndValue = (tag: POOL_TAG, pools: any[]) => (valueExtractor: any) => pools.sort(
  (a, b) => {
    if (a.poolTag === tag && b.poolTag !== tag) return -1;
    if (b.poolTag === tag && a.poolTag !== tag) return 1;
    return valueExtractor(b) - valueExtractor(a);
  },
).slice(0, 10);

export default {
  name: 'PoolsContainer',
  props: {
    isOverview: {
      type: Boolean,
      required: true,
    },
    poolType: {
      type: Number as PropType<POOL_TYPES>,
      default: POOL_TYPES.ALL,
      required: false,
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
    poolTabType: POOL_TYPES.ALL,
    showingPools: 10,

    openPoolList: false,

    selectedTabs: ['ALL'], // ALL or networkName,
    isShowOnlyZap: false,
    isShowAprLimit: false,
    aprLimitForFilter: 15,
    searchQuery: '',

    orderType: 'TVL_UP', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
  }),

  watch: {
    filteredPools(arr: any[]) {
      this.showingPools = arr?.length;

      if (this.showingPools + (arr?.length ?? 0) > 10) {
        this.openPoolList = false;
      }

      if (this.showingPools + (arr?.length ?? 0) <= 10) {
        this.openPoolList = true;
      }
    },
  },

  computed: {
    ...mapGetters('network', ['getParams', 'networkId', 'isShowDeprecated']),
    ...mapState('poolsData', [
      'sortedPoolSecondList',
      'sortedPoolList',
      'isPoolsLoading',
      'currentZapPool',
      'isZapModalShow',
    ]),
    mergedPools() {
      return this.openPoolList
        ? [...this.filteredPools, ...this.filteredPoolsForSecondTab] : this.filteredPools;
    },
    filteredPools() {
      const tabOrderedPools = getSortedPools(
        this.filteredBySearchQueryPools,
        true,
        this.poolTabType,
      );

      const sortByNewTagAndValue = sortByTagAndValue(POOL_TAG.HOT, tabOrderedPools);

      if (this.orderType === 'APR_UP') return sortByNewTagAndValue((pool: any) => pool.apr);
      if (this.orderType === 'APR_DOWN') return sortByNewTagAndValue((pool: any) => -pool.apr);
      if (this.orderType === 'TVL_UP') return sortByNewTagAndValue((pool: any) => pool.tvl);
      if (this.orderType === 'TVL_DOWN') return sortByNewTagAndValue((pool: any) => -pool.tvl);

      return sortByNewTagAndValue(() => 0);
    },

    filteredPoolsForSecondTab() {
      const mainPools = getSortedPools(
        this.filteredBySearchQueryPools,
        true,
        this.poolTabType,
      );
      const secondaryPools = getSortedSecondPools(
        this.filteredBySearchQuerySecondPools,
        this.poolTabType,
      );

      const tabOrderedPools = [...mainPools, ...secondaryPools];

      if (['APR', 'TVL'].includes(this.orderType)) return tabOrderedPools.slice(this.showingPools, tabOrderedPools.length);

      if (this.orderType === 'APR_UP') {
        // last step filter
        return tabOrderedPools
          .sort((a: any, b: any) => b.apr - a.apr)
          .slice(this.showingPools, tabOrderedPools.length);
      }

      if (this.orderType === 'APR_DOWN') {
        // last step filter
        return tabOrderedPools
          .sort((a: any, b: any) => a.apr - b.apr)
          .slice(this.showingPools, tabOrderedPools.length);
      }

      if (this.orderType === 'TVL_UP') {
        // last step filter
        return tabOrderedPools
          .sort((a: any, b: any) => b.tvl - a.tvl)
          .slice(this.showingPools, tabOrderedPools.length);
      }

      if (this.orderType === 'TVL_DOWN') {
        // last step filter
        return tabOrderedPools
          .sort((a: any, b: any) => a.tvl - b.tvl)
          .slice(this.showingPools, tabOrderedPools.length);
      }

      return [];
    },

    filteredBySearchQueryPools() {
      if (!this.searchQuery) return this.filteredAprPools;

      return this.filteredAprPools
        .filter((pool: any) => pool.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.id.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.address.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.platform.join('').toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredBySearchQuerySecondPools() {
      if (!this.searchQuery) return this.filteredAprSecondPools;

      return this.filteredAprSecondPools
        .filter((pool: any) => pool.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.id.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.address.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.platform.join('').toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredAprPools() {
      if (!this.isShowAprLimit) return this.filteredByNetwork;

      return this.filteredByNetwork
        .filter((pool: any) => pool.apr && this.aprLimitForFilter <= pool.apr * 1);
    },
    filteredAprSecondPools() {
      if (!this.isShowAprLimit) return this.filteredByNetworkSecond;

      return this.filteredByNetworkSecond
        .filter((pool: any) => pool.apr && this.aprLimitForFilter <= pool.apr * 1);
    },
    filteredByNetwork() {
      if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
        return this.sortedPoolList;
      }

      return this.sortedPoolList
        .filter((pool: any) => this.selectedTabs.includes(this.getParams(pool.chain).networkId));
    },
    filteredByNetworkSecond() {
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
    this.clearAllFilters();

    // for main page + ovn pools page
    if (this.poolType !== undefined) {
      this.changeState({
        field: 'typeOfPool',
        val: this.poolType,
      });
      console.log(this.poolType, '__poolType');
      this.poolTabType = this.poolType;
    }

    await this.loadPools();
  },

  methods: {
    ...mapActions('poolsData', ['loadPools', 'openZapIn', 'setIsZapModalShow']),
    ...mapMutations('poolsData', ['changeState']),

    changePoolsTab(type: POOL_TYPES) {
      this.poolTabType = type;
    },
    updateSearch(searchQuery: string) {
      this.searchQuery = searchQuery;
    },
    setOrderType(orderType: any) {
      this.orderType = orderType;
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

  @media (max-width: 1024px) {
    margin: 30px 0 120px 0;
  }

  @media (max-width: 768px) {
    margin: 0 0 150px 0;
  }
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
    [data-theme="dark"] & {
      color: var(--color-21);
    }
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
