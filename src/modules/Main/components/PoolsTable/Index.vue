<template>
  <div class="mb-15">
    <div class="row">
      <div class="col-12 col-lg-6 col-md-6 col-sm-6">
        <div class="mt-lg-5 mt-md-5 mt-sm-5 mb-lg-10 mb-md-5 mb-sm-5">
          <div
            v-if="type === 'OVN'"
            class="title-label"
          >
            OVN POOLS
          </div>
          <div
            v-else
            class="title-label"
          >
            ALL POOLS
          </div>
        </div>

      </div>
      <div
        v-if="lastUpdateAgoMinutes"
        class="col-12 col-lg-6 col-md-6 col-sm-6"
      >
        <div class="mt-lg-10 mt-md-5 mt-sm-3 mb-lg-10 mb-md-5 mb-sm-3">
          <div class="updated-title">
            Data updated <span class="update-time">{{lastUpdateAgoMinutes}}</span> min ago
          </div>
        </div>
      </div>
    </div>

    <v-row v-if="isPoolsLoading">
      <v-row
        align="center"
        justify="center"
        class="py-15"
      >
        <v-progress-circular
          width="2"
          size="24"
          color="#8FA2B7"
          indeterminate
        />
      </v-row>
    </v-row>

    <div v-else>
      <div
        v-if="typeOfPool === 'ALL'"
        class="pools-header-container"
      >
        <!-- <div class="row">
          <div class="col-12 col-lg-12 col-md-12 col-sm-12">
            <PoolFilter
              :set-selected-tab-func="setSelectedTab"
              :selected-tabs="selectedTabs"
              :zap-filter-func="zapFilter"
              :is-show-only-zap="isShowOnlyZap"
              :apr-limit-filter-func="aprLimitFilter"
              :update-search-func="updateSearch"
              :is-show-apr-limit="isShowAprLimit"
            />
          </div>
        </div> -->
      </div>

      <div class="pools-container">
        <!-- <PoolTable
          :pools="filteredPools"
          :is-show-only-zap="isShowOnlyZap"
          :is-show-apr-limit="isShowAprLimit"
          :open-zap-in-func="openZapIn"
          :set-order-type-func="setOrderType"
          :order-type="orderType"
          :type-of-pool="typeOfPool"
        /> -->
      </div>
    </div>

    <!-- <ZapModal
      :set-show-func='setIsZapModalShow'
      :zap-pool="currentZapPool"
      :is-show="isZapModalShow"
      :type-of-pool="typeOfPool"
      :pool-tokens-for-zap-map="poolTokensForZapMap"
    /> -->

    <template v-if="!isPoolsLoading && typeOfPool === 'ALL'">
      <v-row
        class="ma-0 mb-1 mt-5"
        align="center"
      >
        <div
          class="circle-icon"
        >
          <BaseIcon name="CircleMultiple" />
        </div>
        <div
          class="show-more ml-2"
          @click="openPoolList = !openPoolList"
          @keypress="openPoolList = !openPoolList"
        >Pools with TVL less than $300K</div>
        <div
          class="select-bar-main-container ml-7"
          @click="openPoolList = !openPoolList"
          @keypress="openPoolList = !openPoolList"
        >
          <v-row
            justify="end"
            align="center"
            class="select-bar-container"
          >
            <BaseIcon name="ArrowDown" />
          </v-row>
        </div>
      </v-row>
      <v-divider class="prototypes-list-divider" />

      <template v-if="openPoolList">

        <PoolTable
          class="mt-2"
          :pools="filteredPoolsForSecondTab"
          :is-show-only-zap="isShowOnlyZap"
          :is-show-apr-limit="isShowAprLimit"
          :open-zap-in-func="openZapIn"
          :set-order-type-func="setOrderType"
          :order-type="orderType"
        />
      </template>

    </template>
  </div>
</template>

<script lang="ts">

import { mapActions, mapGetters, mapState } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import {
  getSortedSecondPools, getSortedPools,
} from '@/store/views/main/pools/helpers.ts';

import utc from 'dayjs/plugin/utc';

// import ZapModal from '@/components/zap/modals/ZapModal.vue';
// import PoolFilter from '@/components/pool/PoolFilter.vue';
import PoolTable from '@/modules/Main/components/PoolsTable/Table.vue';
import dayjs from 'dayjs';

dayjs.extend(utc);

export default {
  name: 'PoolsContainer',
  props: {
    type: { // OVN, ALL
      type: String,
      required: true,
    },
  },
  components: {
    BaseIcon,
    PoolTable,
  },

  data: () => ({
    avgApy: null,

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
    ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
    ...mapState('poolsData', [
      'sortedPoolSecondList',
      'sortedPoolList',
      'typeOfPool',
      'isPoolsLoading',
    ]),
    filteredPools() {
      if (this.orderType === 'APR') {
        // last step filter
        return getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN');
      }

      if (this.orderType === 'APR_UP') {
        // last step filter
        return this.filteredBySearchQueryPools.slice()
          .sort((a: any, b: any) => b.apr - a.apr);
      }

      if (this.orderType === 'APR_DOWN') {
        // last step filter
        return this.filteredBySearchQueryPools.slice()
          .sort((a: any, b: any) => a.apr - b.apr);
      }

      if (this.orderType === 'TVL') {
        // last step filter. same like type 'APR'
        return getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN');
      }

      if (this.orderType === 'TVL_UP') {
        // last step filter
        return this.filteredBySearchQueryPools.slice()
          .sort((a: any, b: any) => b.tvl - a.tvl);
      }

      if (this.orderType === 'TVL_DOWN') {
        // last step filter
        return this.filteredBySearchQueryPools.slice()
          .sort((a: any, b: any) => a.tvl - b.tvl);
      }

      console.error('Order type not found when order pools', this.orderType);
      return [];
    },

    filteredPoolsForSecondTab() {
      if (this.orderType === 'APR') {
        // last step filter
        return getSortedSecondPools(this.filteredBySearchQuerySecondPools);
      }

      if (this.orderType === 'APR_UP') {
        // last step filter
        return this.filteredBySearchQuerySecondPools.slice()
          .sort((a: any, b: any) => b.apr - a.apr);
      }

      if (this.orderType === 'APR_DOWN') {
        // last step filter
        return this.filteredBySearchQuerySecondPools.slice()
          .sort((a: any, b: any) => a.apr - b.apr);
      }

      if (this.orderType === 'TVL') {
        // last step filter. same like type 'APR'
        return getSortedSecondPools(this.filteredBySearchQuerySecondPools);
      }

      if (this.orderType === 'TVL_UP') {
        // last step filter
        return this.filteredBySearchQuerySecondPools.slice()
          .sort((a: any, b: any) => b.tvl - a.tvl);
      }

      if (this.orderType === 'TVL_DOWN') {
        // last step filter
        return this.filteredBySearchQuerySecondPools.slice()
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
        .filter((pool: any) => this.selectedTabs.includes(this.getParams(pool.chain).networkName));
    },
    filteredBySecondTabPools() {
      if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
        return this.sortedPoolSecondList;
      }

      return this.sortedPoolSecondList
        .filter((pool: any) => this.selectedTabs.includes(this.getParams(pool.chain).networkName));
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
    networkId() {
      this.clearAllFilters();
      this.loadPools();
    },
  },
  async mounted() {
    if (this.type === 'OVN') {
      this.typeOfPool = 'OVN';
    } else {
      this.typeOfPool = 'ALL';
    }

    this.clearAllFilters();
    await this.loadPools();
  },

  methods: {
    ...mapActions('poolsData', ['loadPools', 'openZapIn']),

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
    setSelectedTab(tab: string) {
      if (tab === 'ALL' && !this.tabExistInTabs(this.selectedTabs, tab)) {
        this.selectedTabs = [tab];
        return;
      }

      // remove all if click other
      if (tab !== 'ALL' && !this.tabExistInTabs(this.selectedTabs, tab)) {
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

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
  .title-label {

      font-style: normal;
      font-weight: 300;
      font-size: 32px;
      line-height: 40px;
  }

  .updated-title {
      text-align: left!important;
  }

}
/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .title-label {
      font-style: normal;
      font-weight: 300;
      font-size: 54px;
      line-height: 60px;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .title-label {
      font-style: normal;
      font-weight: 300;
      font-size: 54px;
      line-height: 60px;
  }
}

@media only screen and (min-width: 1300px) {
  .title-label {
      font-style: normal;
      font-weight: 300;
      font-size: 48px;
      line-height: 60px;
  }
}

.title-label {
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--main-gray-text);
}

.updated-title {
  text-align: right;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: var(--pools-updated-time-color);
}

.update-time {
  color: var(--pools-updated-time-minutes-color);
}

.show-more {
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: var(--main-gray-text);
  cursor: pointer;
  text-transform: uppercase;
}

.prototypes-list-divider {
  border-color: var(--fourth-gray-text) !important;
}

.arrow {
  margin-top: 5px;
  width: 12px;
  height: 12px;
}

.circle-img-icon {
  margin-top: 5px;
  width: 20px;
  height: 20px;
}

.circle-icon {
  width: 24px;
  height: 24px;
}
</style>
