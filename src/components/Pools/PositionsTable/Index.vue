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
        <div
          class="pools-header__item center pools-header__item--hover"
          @click="positionSizeSortFunc()"
          @keypress="positionSizeSortFunc()"
        >
          Position size, USD
          <BaseIcon :name="toggleSortIcon()" />
        </div>
        <!-- <div class="pools-header__item">
          Daily rewards
        </div> -->
        <div
          class="pools-header__item "
        >
          Earned
        </div>
        <div class="pools-header__item center">
          Platforms
        </div>
        <div class="pools-header__item" />
      </div>

      <div class="pools-table__content">
        <template v-if="getUserPositions.length > 0">
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
                <div class="pools-table__details-row">
                  <div class="pools-table__tokens-details">
                    ID#{{ pool.tokenId }}
                  </div>
                  <div
                    class="pools-table__tag is-in-range"
                    :class="{ 'out-range': !pool.position.isInRange }"
                  >
                    {{ pool.position.isInRange ? 'IN RANGE' : 'OUT OF RANGE' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="pools-table__position-size">
              <div>{{ pool.position.displayedUsdValue }}$</div>
              <div>
                {{ pool.tokenNames.token0 }} {{ pool.position.tokenProportions.token0 }} % |
                {{ pool.tokenNames.token1 }} {{ pool.position.tokenProportions.token1 }} %
              </div>
            </div>
            <div class="pools-table__apy">
              {{ pool.rewards.displayedUsdValue }}$
            </div>
            <div class="pools-table__platform-row center">
              <a
                v-for="({ platform, link }, platKey) in pool.platformLinks"
                :key="platKey"
                target="_blank"
                rel="noopener noreferrer"
                class="pools-table__platform"
                :href="link"
              >
                <BaseIcon
                  class="pools-table__platform-icon"
                  :name="platform"
                />
              </a>
            </div>

            <!-- <ButtonComponent
              :disabled="!pool.zappable"
              btn-styles="faded"
              @click="openZapIn(pool)"
            >
              MANAGE
            </ButtonComponent> -->
          </div>
        </template>
        <div
          v-else
          class="pools-table__empty"
        >
          POSITIONS NOT FOUND
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
import type { PropType } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import type { IPositionsInfo } from './helpers.ts';

enum POSITION_SIZE_ORDER_TYPE {
  'VALUE', 'VALUE_UP', 'VALUE_DOWN',
}

const iconNameSort = (orderTypeStr: string) => {
  if (orderTypeStr.includes('UP')) return 'ArrowUpSort';
  if (orderTypeStr.includes('DOWN')) return 'ArrowDownSort';
  return 'ArrowsFilter';
};

export default {
  name: 'PositionsTable',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    pools: {
      type: Array as PropType<IPositionsInfo[]>,
      required: true,
    },
    positionSizeOrderType: {
      type: Number as PropType<POSITION_SIZE_ORDER_TYPE>,
      required: true,
      default: POSITION_SIZE_ORDER_TYPE.VALUE,
    },
    positionSizeSortFunc: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters('zapinData', ['getUserPositions']),
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    toggleSortIcon() {
      return iconNameSort(POSITION_SIZE_ORDER_TYPE[this.positionSizeOrderType]);
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped />
