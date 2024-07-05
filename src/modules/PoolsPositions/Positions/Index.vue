<template>
  <div class="pools-wrap">
    <div
      v-if="isPoolsLoading"
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
        :apy-order-type="orderType"
      >
        <template
          #filters
        >
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
</template>

<script lang="ts">
import PoolsTable from '@/components/Pools/PositionsTable/Index.vue';
import PoolsFilter from '@/components/Pools/PositionsFilter/Index.vue';
import {
  mapActions, mapGetters, mapState,
} from 'vuex';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { POOL_TAG } from '@/store/views/main/pools/mocks.ts';
import { getSortedPools } from '@/store/views/main/pools/helpers.ts';

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

enum APR_ORDER_TYPE {
  'APR', 'APR_UP', 'APR_DOWN',
}

export default {
  name: 'PositionsTable',
  components: {
    PoolsTable,
    PoolsFilter,
    TableSkeleton,
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
  }),
  computed: {
    ...mapGetters('network', ['getParams', 'isShowDeprecated']),
    ...mapState('poolsData', [
      'sortedPoolList',
      'isPoolsLoading',
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

      if (this.orderType === APR_ORDER_TYPE.APR_UP) {
        return sortByHotTagAndValue((pool: any) => pool.apr);
      }
      if (this.orderType === APR_ORDER_TYPE.APR_DOWN) {
        return sortByHotTagAndValue((pool: any) => -pool.apr);
      }

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
        .filter((pool: any) => [pool.name, pool.id, pool.chainName, pool.address, pool.platform?.join('')]
          .some((col: any) => col?.toLowerCase()?.includes(this.searchQuery.toLowerCase())));
    },
    filteredByNetwork() {
      if (this.selectedNetworks.length === 0) return this.sortedPoolList;

      return this.sortedPoolList
        .filter((pool: any) => this.selectedNetworks.includes(
          this.getParams(pool.chain).networkId,
        ));
    },
  },
  async mounted() {
    this.clearAllFilters();
    await this.loadPools();

    this.aprSortIterator = iterateEnum(APR_ORDER_TYPE);

    this.aprOrder = this.aprSortIterator.next();
  },

  methods: {
    ...mapActions('poolsData', ['loadPools']),
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
