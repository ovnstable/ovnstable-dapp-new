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
      >
        <template
          v-if="!isOverview"
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
        <template
          v-if="!isPoolsLoading && isMorePoolsToShow"
          #footer
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
              {{ isOpenHiddenPools ? "CLOSE POOLS" : "OPEN HIDDEN POOLS" }}
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

import ZapModal from '@/modules/Main/components/ZapModal/Index.vue';
import PoolsFilter from '@/components/Pools/PoolsFilter/Index.vue';
import PoolsTable from '@/components/Pools/PoolsTable/Index.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import { defineComponent, type PropType } from 'vue';
import { usePoolsQuery } from '@/hooks/fetch/usePoolsQuery.ts';
import { POOL_CATEGORIES } from '@/types/common/pools/index.ts';
import PoolService from '@/services/PoolService/PoolService.ts';
import { ORDER_TYPE } from '@/services/PoolService/utils/poolsSort.ts';

const POOL_SHOW_LIMIT = 10;

export default defineComponent({
  name: 'PoolsContainer',
  components: {
    BaseIcon,
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
    const { data: poolList, isLoading: isPoolsLoading } = usePoolsQuery();
    return {
      poolList,
      isPoolsLoading,
    };
  },
  data: () => ({
    poolTabType: POOL_TYPES.ALL,
    isMorePoolsToShow: true,
    isOpenHiddenPools: false,

    selectedTabs: ['ALL'],

    selectedNetworks: [] as number[], // [] for ALL or networks,
    isShowOnlyZap: false,
    isShowAprLimit: false,

    networkIds: [] as number[], // [] for ALL or networks,
    category: POOL_CATEGORIES.ALL as POOL_CATEGORIES,
    searchQuery: '',

    orderType: 'TVL_UP', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    newOrderType: ORDER_TYPE.TVL_UP,
    isDefaultOrder: true as boolean,
    // displayedPools: [] as TPoolInfo[],
  }),

  computed: {
    ...mapGetters('network', ['isShowDeprecated']),
    ...mapState('poolsData', [
      'currentZapPool',
      'isZapModalShow',
    ]),
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
        .sortPools(filteredPools, this.newOrderType, this.isDefaultOrder);

      const pools = sortedPools;

      // const pools = this.isOpenHiddenPools
      //   ? sortedPools
      //   : sortedPools.slice(0, POOL_SHOW_LIMIT);

      console.log('__poolsMethod', pools, this.isOpenHiddenPools);

      return pools;
    },
  },

  // watch: {
  //   filterParams() {
  //     console.log('__watchPrams');
  //     this.getDisplayedPools();
  //   },
  //   newOrderType() {
  //     console.log('__watchOrderType');
  //     this.getDisplayedPools();
  //   },
  //   isDefaultOrder() {
  //     console.log('__watchOrderDef');
  //     this.getDisplayedPools();
  //   },
  //   isOpenHiddenPools() {
  //     console.log('__watchIsOpen');
  //     this.getDisplayedPools();
  //   },
  // },

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

    switchPoolsTab(type: POOL_CATEGORIES) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      console.log('__switchTab', type);
      this.category = type;
    },
    updateSearch(searchQuery: string) {
      this.isDefaultOrder = true;
      this.isOpenHiddenPools = false;
      this.searchQuery = searchQuery;
    },
    setOrderType(orderType: keyof typeof ORDER_TYPE) {
      this.isDefaultOrder = false;
      // ?
      this.newOrderType = ORDER_TYPE[orderType];
      console.log('__switchOrder', this.newOrderType);
    },
    setSelectedNetwork(selectedChain: number | 'ALL') {
      this.isOpenHiddenPools = false;
      this.isDefaultOrder = true;
      if (selectedChain === 'ALL') this.selectedNetworks = [];
      else if (this.selectedNetworks.includes(selectedChain)) {
        this.selectedNetworks = this.selectedNetworks
          .filter((network) => network !== selectedChain);
        // ?
        this.networkIds = this.networkIds
          .filter((network) => network !== selectedChain);
      } else this.selectedNetworks.push(selectedChain);
      // ?
      this.networkIds.push(selectedChain as number);
    },
    clearAllFilters() {
      this.isOpenHiddenPools = false;
      this.isShowOnlyZap = false;
      this.isShowAprLimit = false;
      this.selectedTabs = ['ALL'];
      this.selectedNetworks = [];
      this.isDefaultOrder = true;

      this.networkIds = [];
      this.category = POOL_CATEGORIES.ALL;
      this.searchQuery = '';
    },
  },
});
</script>

<style lang="scss" src='./styles.scss' scoped />
