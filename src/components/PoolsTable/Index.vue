<template>
  <div>
    <div class="pools-table">
      <slot name="filters" />

      <div class="pools-header">
        <div class="pools-header__item">Chain</div>
        <div class="pools-header__item">Pool tokens</div>
        <div class="pools-header__item">Staking platform</div>
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
            @click="toggleDetails(pool)"
            @keypress="toggleDetails(pool)"
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
                  <span>
                    {{ getTokenNames(pool)[0] }}
                  </span>
                </div>
                <div
                  v-if="pool.token1Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token1Icon"
                  />
                  <span>
                    {{ getTokenNames(pool)[1] }}
                  </span>
                  <div
                    v-if="pool.poolTag && !pool.token2Icon"
                    class="pools-table__tag"
                    :class="{
                      'pools-table--hot': pool.poolTag === POOL_TAG.HOT,
                      'pools-table--new': pool.poolTag === POOL_TAG.NEW,
                    }"
                  >
                    <BaseIcon :name="getIconName(pool.poolTag)" />
                    {{ getTagName(pool.poolTag)}}
                  </div>
                </div>
                <div
                  v-if="pool.token2Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token2Icon"
                  />
                  <span>
                    {{ getTokenNames(pool)[2] }}
                  </span>
                  <div
                    class="pools-table__tag-token-3"
                    v-if="pool.poolTag && pool.token2Icon"
                  >
                    <BaseIcon :name="getIconName(pool.poolTag)" />
                    {{ getTagName(pool.poolTag)}}
                  </div>
                </div>
                <div
                  v-if="pool.token3Icon"
                  class="pools-table__tokens-item"
                >
                  <img
                    alt="token"
                    :src="pool.token3Icon"
                  />
                </div>
              </div>
            </div>
            <div class="pools-table__platform-row">
              <a
                target="_blank"
                rel="noopener noreferrer"
                class="pools-table__platform"
                v-for="(poolPlat, key) in pool.platform"
                :href="getPlatformLink(pool, poolPlat)"
                :key="key"
              >
                <BaseIcon
                  class="pools-table__platform-icon"
                  :name="poolPlat"
                />

                <span v-if="pool.poolNameForAgregator">
                  {{ pool.poolNameForAgregator.toUpperCase() }}
                </span>
                <span v-else>
                  {{ poolPlat.toUpperCase() }}
                </span>
                <div class="button-link">
                  <BaseIcon
                    name="PayoutArrow"
                  />
                </div>
              </a>
            </div>

            <div class="pools-table__apy">
              <div
                v-if="pool.apr"
                class="card-label text-center"
              >
                {{ formatMoneyComma(pool.apr, 2) }}%<sup
                  v-if="APY_POOLS.includes(pool.platform[0])"
                >(apy)</sup>
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
            <ButtonComponent
              v-if="pool.platform[0] === 'Thruster'"
              btnStyles="faded"
              class='pools-table__blast-pool'
              data-tooltip="Points / $1k ~25 / $1k"
            >
              <BaseIcon
                name="blastSidebar"
              />
              <a
                v-if="pool.platform[0] === 'Thruster'"
                href="https://app.hyperlock.finance/#/"
                target="_blank"
                rel="noopener noreferrer"
              >
                BLAST POINTS
              </a>
            </ButtonComponent>
            <ButtonComponent
              v-if="pool.zappable"
              btnStyles="faded"
              @click="openZapIn(pool)"
            >
              ZAP IN
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
import ZapInComponent from '@/modules/Main/components/ZapModal/Index.vue';
import { buildLink } from '@/store/views/main/pools/helpers.ts';
import { POOL_TAG, APY_POOLS } from '@/store/views/main/pools/mocks.ts';

export default {
  name: 'PoolsTable',
  components: {
    BaseIcon,
    ZapInComponent,
    ButtonComponent,
  },
  data() {
    return {
      POOL_TAG,
      APY_POOLS,
    };
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
    isShowOnlyZap: {
      type: Boolean,
      required: true,
    },
    isShowAprLimit: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    getTagName() {
      return (poolTag: string) => {
        if (poolTag === POOL_TAG.HOT) return 'HOT';
        if (poolTag === POOL_TAG.NEW) return 'NEW';
        if (poolTag === POOL_TAG.PROMO) return 'PROMO';
        return '';
      };
    },
    getIconName() {
      return (poolTag: string) => {
        if (poolTag === POOL_TAG.HOT) return 'CommonHot';
        if (poolTag === POOL_TAG.NEW) return 'CommonStar';
        if (poolTag === POOL_TAG.PROMO) return 'CommonPromo';
        return '';
      };
    },
    getTokenNames() {
      return (pool: any) => pool.name.split('/');
    },
    getPlatformLink() {
      return (pool: any, platform: string) => buildLink(pool, platform) ?? '';
    },
    indexOfLastNewPool() {
      let lastNewPoolIndex = -1;
      this.pools.forEach((pool: any, index) => {
        if (pool.poolTag === '0') {
          lastNewPoolIndex = index;
        }
      });

      return lastNewPoolIndex;
    },
    // getPoolType() {
    //   return (pool) => {
    //     if (pool.address === '0x4b9f00860d7f42870addeb687fa4e47062df71d9') {
    //       return 'LP V1';
    //     }

    //     if (pool.address === '0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6') {
    //       return 'LP V2';
    //     }

    //     return 'LP';
    //   };
    // },
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    formatMoneyComma,
    formatNumberToMln,
    formatNumberToThousands,
    toggleDetails(pool: any) {
      if (this.pools && this.pools.length) {
        pool.isOpened = !pool.isOpened;
        return;
      }

      // pools without aggregators always is opened
      pool.isOpened = true;
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
          return;
        }
      }

      console.error('Order type not found when toggle order.', type);
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

<style lang="scss" scoped>
.pools-table {
  position: relative;
  width: 100%;
  background-color: var(--color-8);
  color: var(--color-1);
  font-weight: 500;
  font-size: 14px;
  border-radius: 30px;
  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
}

.card-label {
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table__content {
  padding: 20px;
}
.pools-table__row,
.pools-table__new,
.pools-table__blast {
  display: grid;
  grid-template-columns: 0.5fr 2fr 2fr 1fr 1.35fr 0.65fr;
  justify-content: space-between;
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-17);
  button {
    border-radius: 30px;
  }

  @media (max-width: 1024px) {
    button {
      border-radius: 16px;
      white-space: nowrap;
    }
  }

  [data-theme="dark"] & {
    border-bottom-color: var(--color-7);
  }
}
.pools-table__new {
  border-bottom: 1px solid var(--color-2);
  margin-bottom: 10px;
  [data-theme="dark"] & {
    border-color: var(--color-18);
  }
}
.pools-table__blast {
  grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 0.45fr;
  @media (max-width: 1320px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.29fr 0.65fr;
  }
  @media (max-width: 1280px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.2fr 0.45fr;
  }
  @media (max-width: 1200px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.15fr 0.45fr;
  }
  @media (max-width: 1100px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.1fr 0.45fr;
  }
  @media (max-width: 1050px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.05fr 0.45fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.25fr 0.45fr;
  }
  @media (max-width: 1000px) {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 0.95fr 0.45fr;
  }
}

.pools-header {
  display: grid;
  grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 1fr;
  width: 100%;
  color: var(--color-2);
  margin-top: 20px;
  padding: 0 20px;
  overflow-y: hidden;
  [data-theme="dark"] & {
    background-color: none;
    color: var(--color-18);
  }
}

.pools-header__item {
  font-size: 15px;

  &:nth-child(2) {
    padding-left: 10px;
  }
}

.pools-filters {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}

.pools-table__chain {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  padding: 4px;
  background-color: var(--color-4);
  border: 1px solid var(--color-17);
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-2);
  }

  svg {
    width: 80%;
    height: 80%;
  }
}

.pools-table__tokens-wrap {
  position: relative;
  width: fit-content;
}

.pools-table__tokens {
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  border-radius: 30px;
  [data-theme="dark"] & {
    border: none;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid var(--color-17);
    background-color: var(--color-4);
    padding: 5px;
    border-radius: 10px;
    [data-theme="dark"] & {
      background: none;
    }
  }
}

.pools-table__tokens-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px 30px 2px 9px;
  border: 1px solid var(--color-17);
  background-color: var(--color-4);
  border-radius: 30px;
  right: 26px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
    color: var(--color-4);
  }

  &:first-child {
    right: 0;
  }

  &:last-child {
    padding: 2px 9px;
  }

  &:nth-child(3) {
    right: 52px;

    span {
      display: none;
    }
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    border-radius: 50%;
  }

  @media (max-width: 1024px) {
    right: 0;
    border: unset;
    background-color: unset;
    padding: 2px 9px;

    &:nth-child(3) {
      right: unset;

      span {
        display: block;
      }
    }
  }

  @media (max-width: 1024px) {
    right: 0;
    border: unset;
    background-color: unset;
    padding: 2px 9px;
  }
}

.pools-table__platform-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 10px;
}

.pools-table__platform {
  width: fit-content;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    transition: .2s ease color;

    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  &:hover {
    span {
      color: var(--color-3);
    }
    .button-link {
      transform: translate(3px, -3px);
    }
  }
}

.pools-table__platform-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.pools-table__tvl {
  display: flex;
  align-items: center;
}

.pools-table__apy {
  display: flex;
  align-items: center;

  sup {
    position: relative;
    font-size: 10px;
    top: -10px;
  }

  .card-label {
    display: flex;
  }
}

.pools-table__empty {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.pools-table__footer {
  padding: 0 20px 20px 20px;
}

.button-link {
  position: relative;
  top: -10px;
  box-shadow: none;
  align-items: center;
  border-radius: 10px;
  padding: 0 4px;
  transition: .2s ease transform;

  svg {
    fill: var(--color-2);
    width: 8px;
    height: 8px;
    overflow: visible;
  }

  [data-theme="dark"] & {
    svg {
      fill: var(--color-4)
    }
  }
}

.pools-table__tag,
.pools-table__tag-token-3 {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 10px;
  height: 19px;
  padding: 0 4px;
  border: 1px solid var(--color-6);
  background-color: var(--color-4);

  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.pools-table--new {
  color: var(--color-12);
  animation: pulse-animation-green 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table--hot {
  color: var(--color-10);
  animation: pulse-animation-red 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table--promo {
  color: var(--color-3);
  animation: pulse-animation-blue 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table__tag {
  top: -12px;
  right: -25px;
}
.pools-table__tag-token-3  {
  top: -12px;
  right: -25px;
}
.pools-header__item--hover {
  transition: transform .2s ease, color .2s ease;
  cursor: pointer;

  &:hover {
    color: var(--color-3);
  }
}
.pools-table__blast-pool {
  padding: 5px 10px;
  svg {
    margin-right: 4px;
    fill: var(--color-2);
  }
  [data-theme="dark"] & {
    svg {
      fill: var(--color-18)
    }
  }
}

.pools-table__blast-pool:hover {

  background-color: var(--color-1);
  a {
    color: var(--color-18);
  }
  svg {
    fill: var(--color-18);
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
    a {
     color: var(--color-20);
    }
    svg {
      fill: var(--color-20);
    }
  }
}
.pools-table__blast-pool {
  position: relative;
}

.pools-table__blast-pool:hover::after {
  content: attr(data-tooltip);
  white-space: pre;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-3);
  color: var(--color-4);
  padding: 5px 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease;
  [data-theme="dark"] & {
    color: var(--color-1);
    background-color: var(--color-17);
  }
}

.pools-table__blast-pool:hover::after {
  visibility: visible;
  opacity: 1;
}
.pools-table__blast-pool:hover::after {
  content: attr(data-tooltip);
  content: replace(attr(data-tooltip), ' | ', '\A ');
  white-space: pre-wrap;
  display: block;
  width: 80%;
}

@media (max-width: 1320px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    min-width: auto;
    left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 150%;
    overflow-x: scroll;
  }
}
@media (max-width: 1024px) {
  .pools-table__tag,
  .pools-table__tag-token-3 {
    top: -36px;
    right: -35px;
  }
}
@media (max-width: 1000px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    min-width: auto;
      left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 1000px;
    overflow-x: scroll;
  }
}
@media (max-width: 640px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 750px;
    overflow-x: scroll;
  }
  .pools-table__platform-row {
    flex-wrap: wrap;
  }
  .pools-header__item {
    font-size: 12px;
  }
  .pools-table__row {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1.35fr 0.9fr;
    button {
      font-size: 14px;
    }
  }
  .pools-table__tag {
    top: -40px;
    right: -31px;
  }
  .pools-table__tag-token-3  {
    top: -60px;
    right: -36px;
  }
  .pools-table__blast {
    grid-template-columns: 0.5fr 2fr 2fr 1fr 0.8fr 0.9fr;
  }
}

</style>
