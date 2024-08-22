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
          v-if="!isPoolsLoading && isMorePoolsToShow"
          #footer
        >
          <PaginationComponent
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
  mapActions, mapState, mapMutations,
  useStore,
} from 'vuex';

import ZapModal from '@/components/ZapModal/Index.vue';
import PaginationComponent from '@/components/Pagination/Index.vue';
import PoolsTable from '@/components/Pools/PoolsTable/PoolsTableNew.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import { defineComponent, inject, type PropType } from 'vue';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { POOL_CATEGORIES, type TFilterPoolsParams } from '@/types/common/pools/index.ts';
import PoolService, { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { ORDER_TYPE } from '@/services/PoolService/utils/poolsSort.ts';
import { POOL_SHOW_LIMIT } from '@/constants/pools/index.ts';

export default defineComponent({
  name: 'PoolsContainer',
  components: {
    PaginationComponent,
    TableSkeleton,
    PoolsTable,
    ZapModal,
  },
  props: {
    poolType: {
      type: Number as PropType<POOL_TYPES>,
      default: POOL_TYPES.ALL,
      required: false,
    },
  },
  setup: () => {
    const { state } = useStore();

    const poolServiceInstance = inject('poolService') as IPoolService;
    const {
      data: poolList,
      isLoading: isPoolsLoading,
    } = usePoolsQueryNew(poolServiceInstance, state);
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
      perPage: 1000,
      total: null,
    },

    isShowOnlyZap: false,
    isShowAprLimit: false,

    networkIds: [] as number[], // [] for ALL or networks,
    category: POOL_CATEGORIES.ALL as POOL_CATEGORIES,
    searchQuery: '',

    orderType: ORDER_TYPE.TVL_UP,
    isDefaultOrder: true as boolean,
    ORDER_TYPE,
  }),

  computed: {
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
    this.handleClickSearch();
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn', 'setIsZapModalShow', 'setFilterParams']),
    ...mapMutations('poolsData', ['changeState']),

    changePerPage() {
      console.log('changePerPage');
    },
    changePage() {
      console.log('changePage');
    },
    handleClickSearch() {
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: 'USD+',
      };
      this.setFilterParams(filterParams);
    },
    setOrderType(orderType: keyof typeof ORDER_TYPE) {
      this.isDefaultOrder = false;
      this.orderType = ORDER_TYPE[orderType];
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

<style lang="scss" src="./stylesNew.scss" scoped />
