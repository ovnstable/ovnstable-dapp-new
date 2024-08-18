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
        v-if="displayedPools"
        :pools="displayedPools"
        :is-show-only-zap="isShowOnlyZap"
        :is-show-apr-limit="isShowAprLimit"
        :open-zap-in-func="openZapIn"
        :set-order-type-func="setOrderType"
        :order-type="ORDER_TYPE[orderType]"
      >
        <template
          v-if="!isOverview"
          #filters
        >
          <PoolsFilter
            :selected-network="networkIds"
            :is-show-deprecated="isShowDeprecated"
            :search-query="searchQuery"
            @change-tab="switchPoolsTab"
            @change-network="setSelectedNetwork"
            @search="updateSearch"
          />
        </template>
        <template
          v-if="!isPoolsLoading && isMorePoolsToShow"
          #footer
        >
          <pagination-component
            :page="tableSettings.page"
            :per-page="tableSettings.perPage"
            :total="tableSettings.total || displayedPools.length"
            @change-page="changePage"
            @change-per-page="changePerPage"
          />
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

import ZapModal from '@/components/ZapModal/Index.vue';
import PaginationComponent from '@/components/Pagination/Index.vue';
import PoolsFilter from '@/components/Pools/PoolsFilter/Index.vue';
import PoolsTable from '@/components/Pools/PoolsTable/Index.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import { defineComponent, type PropType } from 'vue';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { POOL_CATEGORIES } from '@/types/common/pools/index.ts';
import PoolService from '@/services/PoolService/PoolService.ts';
import { ORDER_TYPE } from '@/services/PoolService/utils/poolsSort.ts';
import { POOL_SHOW_LIMIT } from '@/constants/pools/index.ts';

export default defineComponent({
  name: 'PoolsContainer',
  components: {
    PaginationComponent,
    PoolsFilter,
    TableSkeleton,
    PoolsTable,
    ZapModal,
  },
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

  setup: () => {
    const { data: poolList, isLoading: isPoolsLoading } = usePoolsQueryNew();
    return {
      poolList,
      isPoolsLoading,
    };
  },
  data: () => ({
    poolTabType: POOL_TYPES.ALL,
    isMorePoolsToShow: true,
    isOpenHiddenPools: false,
    tableSettings: {
      page: 1,
      perPage: 10,
      total: null,
    },

    isShowOnlyZap: false,
    isShowAprLimit: false,

    networkIds: [] as number[], // [] for ALL or networks,
    category: POOL_CATEGORIES.ALL as POOL_CATEGORIES,
    searchQuery: '',

    // New filter
    // token0: '' as string,
    // token1: '' as string,
    // chain: [] as number[],
    // minTvl: 0 as number,
    // protocol: [] as string[],
    // page: 0 as number,
    // limit: 0 as number,
    // sort: '' as string,

    orderType: ORDER_TYPE.TVL_UP,
    isDefaultOrder: true as boolean,
    ORDER_TYPE,
  }),

  computed: {
    ...mapGetters('network', ['isShowDeprecated']),
    ...mapState('poolsData', ['currentZapPool', 'isZapModalShow']),
    displayedPools() {
      const filterParams = {
        networkIds: this.networkIds,
        category: this.category,
        searchQuery: this.searchQuery,
      };

      const displayedPools = PoolService
        .getDisplayedPool(this.poolList!, false);
      const filteredPools = PoolService
        .filterPools(displayedPools, filterParams);
      const sortedPools = PoolService
        .sortPools(filteredPools, this.orderType, this.isDefaultOrder);

      const pools = this.isOpenHiddenPools
        ? sortedPools
        : sortedPools.slice(0, POOL_SHOW_LIMIT);

      return pools;
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
      this.poolTabType = this.poolType;
    }
    this.setIsZapModalShow(false);
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn', 'setIsZapModalShow']),
    ...mapMutations('poolsData', ['changeState']),

    changePerPage() {
      console.log('changePerPage');
    },
    changePage() {
      console.log('changePage');
    },
    switchPoolsTab(type: POOL_CATEGORIES) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      this.category = type;
    },
    updateSearch(searchQuery: string) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      this.searchQuery = searchQuery;
    },
    setOrderType(orderType: keyof typeof ORDER_TYPE) {
      this.isDefaultOrder = false;
      this.orderType = ORDER_TYPE[orderType];
    },
    setSelectedNetwork(selectedChain: number | 'ALL') {
      this.isOpenHiddenPools = false;
      this.isDefaultOrder = true;
      if (selectedChain === 'ALL') this.networkIds = [];
      else if (this.networkIds.includes(selectedChain)) {
        this.networkIds = this.networkIds
          .filter((network) => network !== selectedChain);
      } else this.networkIds.push(selectedChain as number);
    },
    clearAllFilters() {
      this.isOpenHiddenPools = false;
      this.isShowOnlyZap = false;
      this.isShowAprLimit = false;
      this.isDefaultOrder = true;

      this.networkIds = [];
      this.category = POOL_CATEGORIES.ALL;
      this.searchQuery = '';
    },
  },
});
</script>

<style lang="scss" src='./styles.scss' scoped />
