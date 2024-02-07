<template>
  <div>
    <div class="pools-header">
      <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
        <div class="pool-table-header-item">Chain {{ typeOfPool }}</div>
      </div>
      <div class="col-3 col-xl-2 col-lg-2 col-md-2 col-sm-3">
        <div class="pool-table-header-item">Tokens</div>
      </div>
      <div class="col-3 col-xl-6 col-lg-6 col-md-6 col-sm-3">
        <div class="pool-table-header-item">Pool name</div>
      </div>
    </div>

    <!--          Hide on mobile          -->
    <div
      class="pools-filters"
    >
      <div class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
        <div class="pool-table-header-item">Staking platform</div>
      </div>

      <div
        @click="toggleOrderType('APR')"
        @keypress="toggleOrderType('APR')"
        class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4 cursor-pointer"
      >
        <div
          :class="
            orderType.startsWith('APR') ? 'pool-table-header-item-selected' : ''
          "
          class="pool-table-header-item"
        >
          APR
          <div
            class="pool-table-header-logo"
          >
            <BaseIcon
              v-if="orderType === 'APR'"
              name="mdi-filter"
            />
            <BaseIcon
              v-else-if="orderType === 'APR_UP'"
              name="mdi-sort-ascending-white"
            />
            <BaseIcon
              v-else-if="orderType === 'APR_DOWN'"
              name="mdi-sort-descending-white"
            />
            <BaseIcon
              v-else
              name="mdi-filter"
            />
          </div>
        </div>
      </div>
      <div
        @click="toggleOrderType('TVL')"
        @keypress="toggleOrderType('TVL')"
        class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4 cursor-pointer"
      >
        <div
          :class="
            orderType.startsWith('TVL') ? 'pool-table-header-item-selected' : ''
          "
          class="pool-table-header-item"
        >
          TVL

          <div
            class="pool-table-header-logo"
          >
            <BaseIcon
              v-if="orderType === 'TVL'"
              name="mdi-filter"
            />
            <BaseIcon
              v-else-if="orderType === 'TVL_UP'"
              name="mdi-sort-ascending-white"
            />
            <BaseIcon
              v-else-if="orderType === 'TVL_DOWN'"
              name="mdi-sort-descending-white"
            />
            <BaseIcon
              v-else
              name="mdi-filter"
            />
          </div>
        </div>
      </div>
      <div class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
        <div class="pool-table-header-item" />
      </div>
    </div>

    <div class="pools-table">
      <div
        v-for="pool in pools"
        :key="pool.id"
        :style="poolTableBodyStyle(pool)"
        class="pools-table__row"
        @click="toggleDetails(pool)"
        @keypress="toggleDetails(pool)"
      >
        <div class="pool-table-body-item">
          <div class="icon mr-3">
            {{ pool.chainName }}
            <BaseIcon :name="pool.chainName" />
          </div>
        </div>
        <div class="pool-table-body-item pt-3">
          <div
            justify="start"
            align="center"
          >
            <div
              v-if="pool.token0Icon"
              class="icon"
            >
              <img
                alt="token"
                :src="pool.token0Icon"
              />
            </div>
            <div
              v-if="pool.token1Icon"
              class="icon ml-n2 mr-2"
            >
              <img
                alt="token"
                :src="pool.token1Icon"
              />
            </div>
            <div
              v-if="pool.token2Icon"
              class="icon ml-n2 mr-2"
            >
              <img
                alt="token"
                :src="pool.token2Icon"
              />
            </div>
            <div
              v-if="pool.token3Icon"
              class="icon ml-n2 mr-2"
            >
              <img
                alt="token"
                :src="pool.token3Icon"
              />
            </div>
          </div>
        </div>
        <div class="col-3 col-xl-6 col-lg-6 col-md-6 col-sm-3">
          <div
            v-if="pool.address === '0x4b9f00860d7f42870addeb687fa4e47062df71d9'"
            class="pool-table-body-item d-inline-block mr-2"
          >
            <!--                                        {{pool.name}} LP {{pool.address}}-->
            {{ pool.name }} LP V1
          </div>
          <div
            v-else-if="
              pool.address === '0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6'
            "
            class="pool-table-body-item d-inline-block mr-2"
          >
            <!--                                        {{pool.name}} LP {{pool.address}}-->
            {{ pool.name }} LP V2
          </div>
          <div
            v-else
            class="pool-table-body-item d-inline-block mr-2"
          >
            <!--                                        {{pool.name}} LP {{pool.address}}-->
            {{ pool.name }} LP
          </div>

          <div class="platform-label-container d-inline-block">
            <div class="platform-label">
              <div v-if="pool.platform === 'Swapbased'">
                <!-- <Tooltip
                          text="This pool have 1% deposit fee"
                          bottom
                        /> -->
              </div>

              <span v-if="pool.poolNameForAgregator">
                {{ pool.poolNameForAgregator.toUpperCase() }}
              </span>
              <span v-else>
                {{
                  pool.platform === "Shekel"
                    ? "Shekelswap"
                    : pool.platform.toUpperCase()
                }}
              </span>
            </div>
          </div>
        </div>

        <!--          Hide on mobile          -->
        <!-- <PoolTableDetails
                :pool="pool"
                :open-zap-in-func="openZapInFunc"
                :is-show-only-zap="isShowOnlyZap"
                :is-show-apr-limit="isShowAprLimit"
                :toggle-details-func="toggleDetails"
              /> -->

        <!-- <div
            v-if="!isShowOnlyZap && pool.aggregators && pool.aggregators.length"
            @click="toggleDetails(pool)"
            @keypress="toggleDetails(pool)"
            class="toggle-icon-container"
          >
            <img
              :src="require('@/assets/icon/pool/toggle-open-pool.svg')"
              :style="pool.isOpened ? '' : 'transform: rotate(180deg);'"
              alt="toggle-open-pool"
            />
          </div> -->
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
// import PoolTableDetails from '@/components/pool/PoolTableDetails.vue';

export default defineComponent({
  name: 'PoolTable',
  components: {
    BaseIcon,
  },
  props: {
    pools: {
      type: Array,
      required: true,
    },
    openZapInFunc: {
      type: Function,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
      default: 'APR', // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    },
    setOrderTypeFunc: {
      type: Function,
      required: true,
    },
    isShowOnlyZap: {
      type: Boolean,
      required: true,
    },
    isShowAprLimit: {
      type: Boolean,
      required: true,
    },
    typeOfPool: {
      // OVN, ALL, null
      type: String,
      default: 'OVN',
      required: false,
    },
  },
  computed: {
    ...mapGetters('theme', ['light']),
    ...mapGetters('network', ['getParams']),

    poolTableBodyStyle() {
      return (pool) => {
        if (!pool) {
          return '';
        }

        if (this.typeOfPool === 'OVN') {
          return '';
        }

        let style = pool.feature
          ? `background: linear-gradient(76.21deg, ${
            this.getParams(pool.chain).networkColor
          } -77%, var(--swap-main-banner-background) 36%);`
          : '';

        style += pool.aggregators && pool.aggregators.length ? 'cursor:pointer;' : '';
        return style;
      };
    },
  },
  methods: {
    toggleDetails(pool) {
      if (pool.aggregators && pool.aggregators.length) {
        pool.isOpened = !pool.isOpened;
        return;
      }

      // pools without aggregators always is opened
      pool.isOpened = true;
    },
    toggleOrderType(type) {
      if (type === 'APR') {
        if (!this.orderType.startsWith('APR')) {
          this.setOrderTypeFunc('APR');
          this.setOrderTypeFunc('APR_UP');
        }

        if (this.orderType === 'APR') {
          this.setOrderTypeFunc('APR_UP');
          return;
        }

        if (this.orderType === 'APR_UP') {
          this.setOrderTypeFunc('APR_DOWN');
          return;
        }

        if (this.orderType === 'APR_DOWN') {
          this.setOrderTypeFunc('APR');
          return;
        }
      }

      if (type === 'TVL') {
        if (!this.orderType.startsWith('TVL')) {
          this.setOrderTypeFunc('TVL');
          this.setOrderTypeFunc('TVL_UP');
        }

        if (this.orderType === 'TVL') {
          this.setOrderTypeFunc('TVL_UP');
          return;
        }

        if (this.orderType === 'TVL_UP') {
          this.setOrderTypeFunc('TVL_DOWN');
          return;
        }

        if (this.orderType === 'TVL_DOWN') {
          this.setOrderTypeFunc('TVL');
          return;
        }
      }

      console.error('Order type not found when toggle order.', type);
    },
  },
});
</script>

<style scoped>
.pools-table {
  width: 100%;
}
.pools-table__row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.pools-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}

.pools-filters {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}
</style>
