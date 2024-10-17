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
        <div
          class="pools-header__item center"
        >
          Earned
        </div>
        <div
          class="pools-header__item center"
        >
          Stake status
        </div>
        <div class="pools-header__item center">
          Platforms
        </div>
        <div class="pools-header__item" />
      </div>

      <div class="pools-table__content">
        <template v-if="pools.length > 0">
          <div
            v-for="(pool, key) in (pools)"
            :key="key"
            class="pools-table__row position-table_row"
          >
            <div class="pools-table__chain--container">
              <div class="pools-table__chain">
                <BaseIcon :name="pool.chainName" />
              </div>
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
                    v-if="pool.fee"
                    class="pool-fee"
                  >
                    {{ formatPoolFee(pool.fee) }}
                  </div>
                </div>
                <div
                  class="pools-table__tag is-in-range"
                  :class="{ 'out-range': !pool.position?.isInRange }"
                >
                  {{ pool.position?.isInRange ? 'IN RANGE' : 'OUT OF RANGE' }}
                </div>
                <div class="pools-table__details-row">
                  <div class="pools-table__tokens-details">
                    ID#{{ pool.tokenId }}
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
              <div
                v-if="pool.chain !== 56"
                class="pools-table__btn pools-table__btn--disabled"
                @click="handleOpenTab(pool, MANAGE_TAB.INCREASE)"
                @keypress="handleOpenTab(pool, MANAGE_TAB.INCREASE)"
              >
                INCREASE
              </div>
            </div>
            <div class="pools-table__emission">
              <div>
                Rewards: {{ getRewards(pool) }}$
              </div>
              <div v-if="pool.merkleData.toClaim">
                Merkle: {{ pool.merkleData.toClaim }}{{ " " }}{{ pool.merkleData.rewardToken?.symbol }}
              </div>
              <div
                v-else-if="pool.chain !== 56"
                class="pools-table__btn"
                :class="{ 'pools-table__btn--disabled': lessThanMin(pool.rewards.usdValue) }"
                @click="emitClaim(pool)"
                @keypress="emitClaim(pool)"
              >
                CLAIM
              </div>
            </div>
            <!-- <div class="pools-table__emission">
              <div>
                {{ pool.merkleData.toClaim }}{{ " " }}{{ pool.merkleData.rewardToken?.symbol }}
              </div>
              <div
                v-if="pool.merkleData?.rewardToken?.symbol"
                class="pools-table__btn"
                @click="emitClaimMerkle(pool)"
                @keypress="emitClaimMerkle(pool)"
              >
                Claim all
              </div>
            </div> -->
            <div class="pools-table__staked">
              <p
                v-if="pool.gauge !== ZERO_ADDRESS"
                :class="{ red: !pool.isStaked, green: pool.isStaked }"
              >
                {{ pool.isStaked ? "Staked" : "Unstaked" }}
              </p>
              <div
                v-if="!pool.isStaked && pool.gauge !== ZERO_ADDRESS"
                class="pools-table__btn"
                :class="{ 'pools-table__btn--disabled': lessThanMin(pool.rewards.usdValue) }"
                @click="emitStake(pool)"
                @keypress="emitStake(pool)"
              >
                STAKE
              </div>
              <div
                v-else-if="pool.gauge === ZERO_ADDRESS"
                :class="{ yellow: true }"
              >
                No gauge
              </div>
              <div
                v-else-if="pool.isStaked && pool.chain !== 56"
                class="pools-table__btn pools-table__btn--disabled"
                @click="handleOpenTab(pool, MANAGE_TAB.WITHDRAW)"
                @keypress="handleOpenTab(pool, MANAGE_TAB.WITHDRAW)"
              >
                UNSTAKE
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
              @click="handleOpenTab(pool)"
              :disabled="pool.chain === 56"
            >
              MANAGE
              <BaseIcon
                name="ArrowDown"
              />
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
        <ButtonComponent
          class="btn_add-position"
          btn-styles="faded"
          @click="handleOpenPools"
        >
          <p>+</p>
          <p>ADD NEW POSITION</p>
          <p>+</p>
        </ButtonComponent>
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
import BN, { BigNumber } from 'bignumber.js';
import { PLATFORMS } from '@/types/common/pools/index.ts';
import { MANAGE_TAB } from '@/modules/ManagePosition/Index.vue';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import type { IPositionsInfo } from '@/types/positions/index.d.ts';

enum POSITION_SIZE_ORDER_TYPE {
  'VALUE', 'VALUE_UP', 'VALUE_DOWN',
}

const iconNameSort = (orderTypeStr: string) => {
  if (orderTypeStr.includes('UP')) return 'ArrowUpSort';
  if (orderTypeStr.includes('DOWN')) return 'ArrowDownSort';
  return 'ArrowsFilter';
};

export const getPositionTabLink = (pool: any, action: MANAGE_TAB) => `/positions/${pool?.tokenId?.toString()}/${MANAGE_TAB[action].toLowerCase()}`;

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
  emits: ['claim', 'claim-merkle', 'stake'],
  data: () => ({
    ZERO_ADDRESS,
    MANAGE_TAB,
  }),
  computed: {
    lessThanMin() {
      return (val: string) => new BN(val).lt(0.02);
    },
    getRewards() {
      return (pool: IPositionsInfo) => {
        if ([PLATFORMS.PANCAKE, PLATFORMS.AERO]
          .includes(pool.platform[0] as PLATFORMS) && pool.isStaked) {
          return new BN(pool.emissionsUsd).gt(0.1) ? pool.emissionsUsd : '< 0.1';
        }

        if ([PLATFORMS.PANCAKE, PLATFORMS.AERO]
          .includes(pool.platform[0] as PLATFORMS) && !pool.isStaked) {
          return pool.rewards.displayedUsdValue;
        }

        if (pool.platform[0] === PLATFORMS.UNI) {
          return pool.rewards.displayedUsdValue;
        }

        return null;
      };
    },
  },
  methods: {
    ...mapActions('poolsData', ['openZapIn']),
    formatPoolFee(fee: string) {
      const formattedFee = new BigNumber(fee).multipliedBy(0.0001);
      return `${formattedFee} %`;
    },
    handleOpenTab(pool: any, tab: MANAGE_TAB = MANAGE_TAB.REBALANCE) {
      this.openZapIn(pool);
      console.log(getPositionTabLink(pool, tab), '___TAB')
      this.$router.replace(getPositionTabLink(pool, tab));
    },
    emitStake(pool: any) {
      this.$emit('stake', pool);
    },
    emitClaim(pool: any) {
      this.$emit('claim', pool);
    },
    // emitClaimMerkle(pool: any) {
    //   this.$emit('claim-merkle', pool);
    // },
    toggleSortIcon() {
      return iconNameSort(POSITION_SIZE_ORDER_TYPE[this.positionSizeOrderType]);
    },
    handleOpenPools() {
      this.$router.replace('/pools');
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped />
