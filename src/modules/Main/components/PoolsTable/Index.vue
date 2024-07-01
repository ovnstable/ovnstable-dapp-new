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
        :pools="displayedPools"
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
            :selectedNetwork="selectedNetworks"
            :isShowDeprecated="isShowDeprecated"
            :searchQuery="searchQuery"
            @changeTab="switchPoolsTab"
            @changeNetwork="setSelectedNetwork"
            @search="updateSearch"
          />
        </template>
        <template
          #footer
          v-if="!isPoolsLoading && isMorePoolsToShow"
        >
          <div
            class="table-extend"
            @click="isOpenHiddenPools = !isOpenHiddenPools"
            @keypress="isOpenHiddenPools = !isOpenHiddenPools"
          >
            <div
              class="table-extend__arrow"
            >
              <BaseIcon name="ArrowDown" />
            </div>
            <h1>
              {{isOpenHiddenPools ? "CLOSE POOLS" : "OPEN HIDDEN POOLS"}}
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
import { getSortedPools } from '@/store/views/main/pools/helpers.ts';
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

const sortByTagAndValue = (
  tag: POOL_TAG,
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

const POOL_SHOW_LIMIT = 10;

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
    showingPools: POOL_SHOW_LIMIT,
    isMorePoolsToShow: true,
    isOpenHiddenPools: false,

    selectedTabs: ['ALL'],
    selectedNetworks: [] as number[], // [] for ALL or networks,
    isShowOnlyZap: false,
    isShowAprLimit: false,
    aprLimitForFilter: 15,
    searchQuery: '',

    orderType: 'TVL_UP', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    isDefaultOrder: true as boolean,
  }),

  watch: {
    filteredPools(arr: any[]) {
      this.isMorePoolsToShow = this.showingPools <= (arr?.length ?? 0);
    },
  },

  computed: {
    ...mapGetters('network', ['getParams', 'networkId', 'isShowDeprecated']),
    ...mapState('poolsData', [
      'sortedPoolList',
      'isPoolsLoading',
      'currentZapPool',
      'isZapModalShow',
    ]),
    filteredPools() {
      const tabFilteredPools = getSortedPools(
        this.filteredBySearchQuery,
        true,
        this.poolTabType,
      );

      const sortByHotTagAndValue = sortByTagAndValue(
        POOL_TAG.HOT,
        tabFilteredPools,
        this.isDefaultOrder,
      );

      if (this.orderType === 'APR_UP') return sortByHotTagAndValue((pool: any) => pool.apr);
      if (this.orderType === 'APR_DOWN') return sortByHotTagAndValue((pool: any) => -pool.apr);
      if (this.orderType === 'TVL_UP') return sortByHotTagAndValue((pool: any) => pool.tvl);
      if (this.orderType === 'TVL_DOWN') return sortByHotTagAndValue((pool: any) => -pool.tvl);

      return sortByHotTagAndValue(() => 0);
    },
    displayedPools() {
      return this.isOpenHiddenPools
        ? this.filteredPools
        : this.filteredPools.slice(0, POOL_SHOW_LIMIT);
    },
    filteredBySearchQuery() {
      if (!this.searchQuery || this.searchQuery.trim().length === 0) return this.filteredByNetwork;

      return this.filteredByNetwork
        .filter((pool: any) => pool.name.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.id.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.address.toLowerCase().includes(this.searchQuery.toLowerCase())
              || pool.platform.join('').toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredByNetwork() {
      if (this.selectedNetworks.length === 0) return this.sortedPoolList;

      return this.sortedPoolList
        .filter((pool: any) => this.selectedNetworks.includes(
          this.getParams(pool.chain).networkId,
        ));
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
    setOrderType(orderType: any) {
      this.isDefaultOrder = false;
      this.orderType = orderType;
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
