<template>
  <div class="pools-wrap">
    <!-- for debug -->
    <div v-if="false">
      {{ lastUpdateAgoMinutes }}
    </div>

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
        v-if="isInit"
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
import { getSortedPools } from '@/store/views/main/pools/helpers.ts';
import utc from 'dayjs/plugin/utc';

import ZapModal from '@/modules/Main/components/ZapModal/Index.vue';
import PoolsFilter from '@/components/Pools/PoolsFilter/Index.vue';
import PoolsTable from '@/components/Pools/PoolsTable/Index.vue';
import TableSkeleton from '@/components/TableSkeleton/Index.vue';
import dayjs from 'dayjs';
import { POOL_TAG } from '@/store/views/main/pools/mocks.ts';
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import type { PropType } from 'vue';

dayjs.extend(utc);

// interface IEnumIterator {
//   next: () => number,
//   reset: () => void,
// }

// function iterateEnum(enumObj: any): IEnumIterator {
//   const keys = Object.values(enumObj).filter((key) => typeof key === 'number');
//   let index = 0;

//   return {
//     next: () => {
//       const key = keys[index] as number;
//       index = (index + 1) % keys.length;
//       return key;
//     },
//     reset: () => {
//       index = 0;
//     },
//   };
// }

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

// enum TVL_ORDER_TYPE {
// 'TVL', 'TVL_UP', 'TVL_DOWN',
// }
// enum APR_ORDER_TYPE {
//   'APR', 'APR_UP', 'APR_DOWN',
// }

export default {
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

  data: () => ({
    poolTabType: POOL_TYPES.ALL,
    showingPools: POOL_SHOW_LIMIT,
    isMorePoolsToShow: true,
    isOpenHiddenPools: false,

    selectedTabs: ['ALL'],
    selectedNetworks: [] as number[], // [] for ALL or networks,
    isShowOnlyZap: false,
    isShowAprLimit: false,
    searchQuery: '',

    orderType: 'TVL_UP', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    // tvlSortIterator: {} as IEnumIterator,
    // aprSortIterator: {} as IEnumIterator,
    // tvlOrder: 0 as number,
    // aprOrder: 0 as number,
    isDefaultOrder: true as boolean,

    isInit: true as boolean,
  }),
  computed: {
    ...mapGetters('network', ['getParams', 'isShowDeprecated']),
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
  watch: {
    filteredPools(arr: any[]) {
      if (arr.length > 0) this.isInit = true;
      this.isMorePoolsToShow = this.showingPools <= (arr?.length ?? 0);
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
    await this.loadTokens();
    await this.loadPools();
    this.setIsZapModalShow(false);
  },

  methods: {
    ...mapActions('poolsData', ['loadPools', 'openZapIn', 'setIsZapModalShow']),
    ...mapMutations('poolsData', ['changeState']),
    ...mapActions('odosData', ['loadTokens']),

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

<style lang="scss" src='./styles.scss' scoped />
