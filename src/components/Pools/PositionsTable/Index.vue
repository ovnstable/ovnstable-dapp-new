<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <div>
    <div class="pools-table">
      <slot name="filters" />

      <div class="pools-header positions-header">
        <div class="pools-header__item">
          Chain
        </div>
        <div class="pools-header__item">
          Pool name
        </div>
        <div class="pools-header__item center">
          Position size, USD
        </div>
        <div
          class="pools-header__item pools-header__item--hover"
          @click="setOrderTypeFunc()"
          @keypress="setOrderTypeFunc()"
        >
          APR
          <BaseIcon :name="iconNameSort()" />
        </div>
        <div class="pools-header__item">
          Daily rewards
        </div>
        <div class="pools-header__item">
          Earned
        </div>
        <div class="pools-header__item center">
          Platforms
        </div>
        <div class="pools-header__item" />
      </div>

      <div class="pools-table__content">
        <template v-if="pools.length > 0">
          <div
            v-for="(pool, key) in (pools as any)"
            :key="key"
            class="pools-table__row position-table_row"
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
              <div class="pools-table__details">
                <div class="pools-table__details-row">
                  <div>
                    {{ pool.name }}
                  </div>
                </div>
                <div class="pools-table__tokens-details">
                  ID#34597823
                </div>
              </div>
            </div>
            <div class="pools-table__position-size">
              <div>1234.5 Mln</div>
              <div>Ovn 100% | USD+ 46%</div>
            </div>
            <div class="pools-table__apy">
              34.8 Trln
            </div>
            <div class="pools-table__apy">
              $9000
            </div>
            <div class="pools-table__apy">
              <div
                v-if="pool.apr"
                class="card-label text-center"
              >
                {{ formatMoneyComma(pool.apr, 2) }}%
              </div>
              <div
                v-else
                class="card-label see-on-dex-label see-on-dex-another"
              >
                see on platform
              </div>
            </div>
            <div class="pools-table__platform-row center">
              <a
                v-for="(poolPlat, key) in pool.platform"
                :key="key"
                target="_blank"
                rel="noopener noreferrer"
                class="pools-table__platform"
                :href="getPlatformLink(pool, poolPlat)"
              >
                <BaseIcon
                  class="pools-table__platform-icon"
                  :name="poolPlat"
                />
              </a>
            </div>

            <ButtonComponent
              :disabled="!pool.zappable"
              btn-styles="faded"
              @click="openZapIn(pool)"
            >
              MANAGE
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
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { formatMoneyComma } from '@/utils/numbers.ts';
import { buildLink } from '@/store/views/main/pools/helpers.ts';
import type { PropType } from 'vue';
import { mapActions } from 'vuex';

enum APR_ORDER_TYPE {
  'APR', 'APR_UP', 'APR_DOWN',
}

export default {
  name: 'PositionsTable',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    pools: {
      type: Array,
      required: true,
    },
    apyOrderType: {
      type: Number as PropType<APR_ORDER_TYPE>,
      required: true,
      default: APR_ORDER_TYPE.APR,
    },
    setOrderTypeFunc: {
      type: Function,
      required: true,
    },
  },
  mounted() {
    this.loadPositionContract();
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    ...mapActions('zapinData', ['loadPositionContract']),
    formatMoneyComma,
    getTokenNames(pool: any) {
      return pool.name.split('/');
    },
    getPlatformLink(pool: any, platform: string) {
      return buildLink(pool, platform) ?? '';
    },
    iconNameSort() {
      const orderTypeStr = APR_ORDER_TYPE[this.apyOrderType];
      if (orderTypeStr.includes('UP')) return 'ArrowUpSort';
      if (orderTypeStr.includes('DOWN')) return 'ArrowDownSort';
      return 'ArrowsFilter';
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped />
