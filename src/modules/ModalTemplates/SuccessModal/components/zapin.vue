<template>
  <div>
    <span class="divider" />

    <div class="zap-header-container">
      <PoolLabel :pool="successData.pool" />
      <div class="modal-content__data-row">
        <div class="nft-info">
          <div
            v-if="lastParsedBurnedTokenIdEvent"
            class="nft-info-row"
          >
            <span>Burned NFT:</span><span>ID: #{{ lastParsedBurnedTokenIdEvent }}</span>
          </div>
          <div
            v-if="lastParsedTokenIdEvent"
            class="nft-info-row"
          >
            <span>New NFT:</span><span>ID: #{{ lastParsedTokenIdEvent }}</span>
          </div>
        </div>
        <a
          :href="openPositionOnPool"
          target="_blank"
          rel="noopener noreferrer"
          class="view-position-link"
        >
          <ButtonComponent btn-styles="link">
            VIEW POSITION
            <BaseIcon name="PayoutArrow" />
          </ButtonComponent>
        </a>
      </div>
    </div>

    <span class="divider" />

    <div
      v-if="successData"
      class="modal-content__data"
    >
      <div class="modal-content__data-main">
        <div class="data-row sent">
          <div class="success-row-title">
            Sent
          </div>
          <div class="success-data-list">
            <div
              v-for="sentData in tokensSentList"
              :key="sentData.id"
              class="token-amount"
            >
              - {{ sentData.value }}
              {{ sentData.symbol }}
            </div>
          </div>
        </div>

        <div
          v-if="lastParsedClaimedRewardsEvent"
          class="data-row returned"
        >
          <div class="success-row-title">
            Claimed
          </div>
          <div class="success-data-list">
            <div class="token-amount">
              ~ {{ getFixedPrice(lastParsedClaimedRewardsEvent) }} USD
            </div>
          </div>
        </div>

        <div class="data-row returned">
          <div class="success-row-title">
            Returned
          </div>
          <div class="success-data-list">
            <div
              v-for="returnData in tokensReturnedList"
              :key="returnData.id"
              class="token-amount"
            >
              + {{ getFixedPrice(returnData.value) }}
              {{ returnData.symbol }}
            </div>
          </div>
        </div>

        <div class="data-row staked">
          <div class="success-row-title">
            Staked
          </div>
          <div class="success-data-list">
            <div
              v-for="stakeData in tokensStakedList"
              :key="stakeData.id"
              class="token-amount"
            >
              + {{ getFixedPrice(stakeData.value) }}
              {{ stakeData.symbol }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import PoolLabel from '@/components/ZapModal/PoolLabel.vue';
import { type PropType } from 'vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import BN from 'bignumber.js';
import { fixedByPrice } from '@/utils/numbers.ts';
import getPlatformLink from '../helpers.ts';

export default {
  name: 'ZapinContent',
  components: {
    PoolLabel,
    BaseIcon,
    ButtonComponent,
  },
  props: {
    tokensSentList: {
      type: Array as PropType<any>,
      required: true,
    },
    tokensStakedList: {
      type: Array as PropType<any>,
      required: true,
    },
    tokensReturnedList: {
      type: Array as PropType<any>,
      required: true,
    },
  },
  computed: {
    ...mapState('odosData', [
      'successData',
      'lastParsedTokenIdEvent',
    ]),
    ...mapState('poolsData', [
      'lastParsedBurnedTokenIdEvent',
      'lastParsedClaimedRewardsEvent',
    ]),
    getFixedPrice() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;

        return new BN(val).toFixed(fixedByPrice(+val));
      };
    },
    openPositionOnPool(): string {
      // eslint-disable-next-line prefer-destructuring
      const pool = this.successData.pool;
      if (pool.address || pool.platform[0]) return getPlatformLink(pool.platform[0], pool.address);
      return '';
    },
  },
};
</script>

<style scoped lang="scss" src="../styles.scss" />
