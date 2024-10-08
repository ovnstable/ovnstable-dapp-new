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
        <div
          class="pools-header__item"
        >
          Staked
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
                    :class="{ 'out-range': !pool.position?.isInRange }"
                  >
                    {{ pool.position?.isInRange ? 'IN RANGE' : 'OUT OF RANGE' }}
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
            <div class="pools-table__emission">
              <div>
                {{ pool.rewards.displayedUsdValue }}$
              </div>
              <div
                class="pools-table__btn"
                :class="{ 'pools-table__btn--disabled': lessThanMin(pool.rewards.usdValue) }"
                @click="emitClaim(pool)"
                @keypress="emitClaim(pool)"
              >
                Claim
              </div>
            </div>
            <div class="pools-table__staked">
              <div
                class="pools-table__staked-stat"
                :class="{ red: !pool.isStaked, green: pool.isStaked  }"
              >
                {{ pool.isStaked ? "YES" : "NO" }}
              </div>
              <div
                v-if="!pool.isStaked"
                class="pools-table__btn"
                :class="{ 'pools-table__btn--disabled': lessThanMin(pool.rewards.usdValue) }"
                @click="emitStake(pool)"
                @keypress="emitStake(pool)"
              >
                Stake
              </div>
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

            <ButtonComponent
              btn-styles="faded"
              @click="handleOpen(pool)"
            >
              MANAGE
            </ButtonComponent>
          </div>
        </template>
        <div
          v-else
          class="pools-table__empty"
        >
          <!-- <img
            alt="sloth"
            :src="getImageUrl(`assets/icons/common/SlothUnavailable.png`)"
          /> -->
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
import { mapActions } from 'vuex';
import { getImageUrl } from '@/utils/const.ts';
import BN from 'bignumber.js';
import type { IPositionsInfo } from '@/types/positions/index.d.ts';

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
  emits: ['claim', 'stake'],
  computed: {
    lessThanMin() {
      return (val: string) => new BN(val).lt(0.02);
    },
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    handleOpen(pool: any) {
      this.openZapIn(pool);
      this.$router.replace(`/positions/${pool?.tokenId?.toString()}`);
    },
    emitStake(pool: any) {
      this.$emit('stake', pool);
    },
    emitClaim(pool: any) {
      this.$emit('claim', pool);
    },
    toggleSortIcon() {
      return iconNameSort(POSITION_SIZE_ORDER_TYPE[this.positionSizeOrderType]);
    },
    getImageUrl,
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped />
