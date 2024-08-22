<template>
  <div>
    <div class="pools-table">
      <slot name="filters" />

      <div class="pools-header">
        <div class="pools-header__item">
          Chain
        </div>
        <div class="pools-header__item">
          Pool name
        </div>
        <div
          class="pools-header__item pools-header__item--hover"
          @click="toggleOrderType('APR')"
          @keypress="toggleOrderType('APR')"
        >
          APR
          <BaseIcon :name="iconNameSort('APR')" />
        </div>
        <div
          class="pools-header__item pools-header__item--hover"
          @click="toggleOrderType('TVL')"
          @keypress="toggleOrderType('TVL')"
        >
          TVL
          <BaseIcon :name="iconNameSort('TVL')" />
        </div>
        <div class="pools-header__item">
          Platforms
        </div>
        <div class="pools-header__item" />
      </div>

      <div class="pools-table__content">
        <template v-if="pools.length > 0">
          <div
            v-for="(pool, key) in (pools as any)"
            :key="key"
            class="pools-table__row"
            :class="{
              'pools-table__new': key === indexOfLastNewPool,
              'pools-table__blast': pool.platform[0] === 'Thruster',
            }"
          >
            <div class="pools-table__chain">
              <BaseIcon :name="pool.chainName" />
            </div>
            <div class="pools-table__tokens-wrap">
              <div class="pools-table__tokens">
                <div
                  v-if="pool.token0Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token0Icon"
                  />
                </div>
                <div
                  v-if="pool.token1Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token1Icon"
                  />
                </div>
              </div>
              <div class="pools-table__details">
                <div class="pools-table__details-row">
                  <div>
                    {{ pool.name }}
                  </div>
                  <div
                    v-if="pool.poolTag && !pool.token2Icon"
                    class="pools-table__tag"
                    :class="{
                      'pools-table--hot': pool.poolTag === POOL_TAG.HOT,
                      'pools-table--new': pool.poolTag === POOL_TAG.NEW,
                    }"
                  >
                    {{ getTagName(pool.poolTag) }}
                    <BaseIcon :name="getIconName(pool.poolTag)" />
                  </div>
                  <div
                    v-if="pool.zappable"
                    class="pools-table__tag pools-table--zapin"
                  >
                    {{ getTagName(POOL_TAG.ZAPIN) }}
                    <BaseIcon :name="getIconName(POOL_TAG.ZAPIN)" />
                  </div>
                </div>
                <div class="pools-table__tokens-details">
                  {{ poolVolatileType(pool) }}
                </div>
              </div>
            </div>
            <div class="pools-table__apy">
              <div
                v-if="pool.apr"
                class="card-label text-center"
              >
                {{ formatMoneyComma(pool.apr, 2) }}%
                <sup v-if="APY_POOLS.includes(pool.platform[0])">(apy)</sup>
              </div>
              <div
                v-else
                class="card-label see-on-dex-label see-on-dex-another"
              >
                see on platform
              </div>
            </div>
            <div class="pools-table__tvl">
              <div class="pool-table-header-item">
                <div
                  v-if="pool.tvl"
                  class="card-label"
                >
                  <template v-if="pool.tvl >= 1000000">
                    ${{ formatNumberToMln(pool.tvl, 2) }}M
                  </template>
                  <template v-if="pool.tvl < 1000000">
                    ${{ formatNumberToThousands(pool.tvl, 0) }}K
                  </template>
                </div>
                <div
                  v-else
                  class="card-label see-on-dex-label see-on-dex-another"
                >
                  see on platform
                </div>
              </div>
            </div>
            <div class="pools-table__platform-row">
              <a
                :key="key"
                target="_blank"
                rel="noopener noreferrer"
                class="pools-table__platform"
                :href="getPlatformLink(pool, pool.platform)"
              >
                <BaseIcon
                  class="pools-table__platform-icon"
                  :name="pool.platform"
                />

                <span v-if="pool.poolNameForAgregator">
                  {{ pool.poolNameForAgregator.toUpperCase() }}
                </span>
                <span v-else>
                  {{ pool.platform[0].toUpperCase() }}
                </span>
                <div class="button-link">
                  <BaseIcon
                    name="LinkExtra"
                  />
                </div>
              </a>
            </div>

            <ButtonComponent
              :disabled="!pool.zappable"
              btn-styles="faded"
              @click="openZapIn(pool)"
            >
              DEPOSIT
            </ButtonComponent>
          </div>
        </template>
        <div
          v-else
          class="pools-table__empty"
        >
          pools not found
        </div>
      </div>

      <div
        v-if="pools.length > 0"
        class="pools-table__footer"
      >
        <slot name="footer" />
      </div>
    </div>

    <ZapInComponent />
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapActions } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { formatMoneyComma, formatNumberToMln, formatNumberToThousands } from '@/utils/numbers.ts';
import ZapInComponent from '@/components/ZapModal/Index.vue';
import { buildLink, checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';
import { APY_POOLS } from '@/store/views/main/pools/mocks.ts';

enum POOL_TAG {
  NEW,
  PROMO,
  HOT,
  ZAPIN,
}

const tagIconMap = {
  [POOL_TAG.HOT]: 'CommonHot',
  [POOL_TAG.NEW]: 'CommonStar',
  [POOL_TAG.PROMO]: 'CommonPromo',
  [POOL_TAG.ZAPIN]: 'CommonStar',
};

const getPoolDescStr = (
  isStable: boolean,
  version: string,
) => `${version.toUpperCase()} ${version.includes('3') ? 'Concentrated' : 'Basic'} ${isStable ? 'Stable' : 'Volatile'} pool`;

export default {
  name: 'PoolsTable',
  components: {
    BaseIcon,
    ZapInComponent,
    ButtonComponent,
  },
  props: {
    pools: {
      type: Array,
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
  },
  data() {
    return {
      POOL_TAG,
      APY_POOLS,
    };
  },
  computed: {
    indexOfLastNewPool() {
      let lastNewPoolIndex = -1;
      this.pools.forEach((pool: any, index) => {
        if (pool.poolTag === '0') {
          lastNewPoolIndex = index;
        }
      });

      return lastNewPoolIndex;
    },
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    formatMoneyComma,
    formatNumberToMln,
    formatNumberToThousands,
    poolVolatileType(poolD: any) {
      const isStable = checkIsEveryStable(poolD);
      return getPoolDescStr(isStable, poolD.poolVersion);
    },
    getTagName(poolTag: POOL_TAG) {
      return POOL_TAG[poolTag as number];
    },
    getIconName(poolTag: POOL_TAG) {
      return tagIconMap[poolTag];
    },
    getPlatformLink(pool: any, platform: string) {
      return buildLink(pool, platform) ?? '';
    },
    toggleOrderType(type: string) {
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
        }
      }
    },
    iconNameSort(type: string) {
      if (type === 'APR') {
        if (['APR_UP'].includes(this.orderType)) {
          return 'ArrowUpSort';
        } if (['APR_DOWN'].includes(this.orderType)) {
          return 'ArrowDownSort';
        }
      } else {
        if (['TVL_UP'].includes(this.orderType)) {
          return 'ArrowUpSort';
        } if (['TVL_DOWN'].includes(this.orderType)) {
          return 'ArrowDownSort';
        }
      }

      return 'ArrowsFilter';
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped />
