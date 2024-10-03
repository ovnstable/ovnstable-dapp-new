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
        :order-type="orderType"
      />
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
} from 'vuex';

import ZapModal from '@/components/ZapModal/Index.vue';
import PoolsTable from '@/components/Pools/PoolsTable/PoolsTableNew.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import { defineComponent, type PropType } from 'vue';
import { usePoolsQueryNew } from '@/hooks/fetch/usePoolsQuery.ts';
import { POOL_CATEGORIES, type TFilterPoolsParams } from '@/types/common/pools/index.ts';
import { ORDER_TYPE } from '@/services/PoolService/utils/poolsSort.ts';

export default defineComponent({
  name: 'PoolsContainer',
  components: {
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
    const {
      data: poolList,
      isLoading: isPoolsLoading,
    } = usePoolsQueryNew();
    return {
      poolList,
      isPoolsLoading,
    };
  },
  data: () => ({
    poolTabType: POOL_TYPES.ALL,
    isOpenHiddenPools: false,

    isShowOnlyZap: false,
    isShowAprLimit: false,

    networkIds: [] as number[],
    category: POOL_CATEGORIES.ALL,
    searchQuery: '',

    orderType: ORDER_TYPE.TVL_UP,
    isDefaultOrder: true,
  }),

  computed: {
    ...mapState('poolsData', ['currentZapPool', 'isZapModalShow', 'activeChain', 'activePlat']),
    displayedPools() {
      let sortedPools = this.poolList

      if (this.activeChain !== 'ALL') {
        sortedPools = sortedPools.filter((_) => _.chain === this.activeChain);
      };

      console.log(this.activePlat, sortedPools, '__this.activePlat')
      if (this.activePlat !== 'ALL') {
        sortedPools = sortedPools.filter((_) => _.platform[0] === this.activePlat);
      };

      return sortedPools
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
    handleClickSearch() {
      const filterParams: Partial<TFilterPoolsParams> = {
        token0: 'USD+',
      };
      this.setFilterParams(filterParams);
    },
    setOrderType(orderType: ORDER_TYPE) {
      this.isDefaultOrder = false;
      console.log('_setOrderType', orderType);
      this.orderType = orderType;
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
