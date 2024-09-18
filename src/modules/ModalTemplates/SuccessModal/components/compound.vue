<template>
  <div class="success-modal-content-wrapper">
    <span class="divider" />

    <div class="zap-header-container">
      <PoolLabel :pool="successData.pool" />
      <div class="modal-content__data-row">
        <a
          :href="openPositionOnPool(successData.pool)"
          target="_blank"
          rel="noopener noreferrer"
          class="view-position-link"
        >
          <ButtonComponent btn-styles="link">
            VIEW POSITION
            <BaseIcon name="PayoutArrow" />
          </ButtonComponent>
        </a>
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
      </div>
    </div>

    <span class="divider" />
    <div
      v-if="successData.inputTokens?.length > 0"
      class="modal-content__data"
    >
      <div class="modal-content__data-main">
        <div
          v-if="tokensClaimedList.length > 0"
          class="data-row returned"
        >
          <div class="success-row-title">
            Claimed:
          </div>
          <div class="success-data-list">
            <div
              v-for="rewardToken in tokensClaimedList"
              :key="rewardToken.symbol"
              class="token-amount"
            >
              <span>{{ `${rewardToken.displayedValue} ${rewardToken.symbol}` }}</span>
              <span class="usd-value">~ ${{ rewardToken.displayedUsdValue }}</span>
            </div>
          </div>
        </div>

        <div class="data-row returned">
          <div class="success-row-title">
            Returned:
          </div>
          <div class="success-data-list">
            <div
              v-for="returnData in tokensReturnedList"
              :key="returnData.id"
              class="token-amount"
            >
              <span>{{ `${returnData.displayedValue} ${returnData.symbol}` }}</span>
              <span class="usd-value">~ ${{ returnData.displayedUsdValue }}</span>
            </div>
          </div>
        </div>

        <div class="data-row staked">
          <div class="success-row-title">
            Staked:
          </div>
          <div class="success-data-list">
            <div
              v-for="stakeData in tokensStakedList"
              :key="stakeData.id"
              class="token-amount"
            >
              <span>{{ `${stakeData.displayedValue} ${stakeData.symbol}` }}</span>
              <span class="usd-value">~ ${{ stakeData.displayedUsdValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="divider" />
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import PoolLabel from '@/components/ZapModal/PoolLabel.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import type { PropType } from 'vue';
import type { TPoolInfo } from '@/types/common/pools';
import type { TFormatTokenInfo } from '../helpers';

export default {
  name: 'ZapinContent',
  components: {
    PoolLabel,
    ButtonComponent,
    BaseIcon,
  },
  props: {
    tokensStakedList: {
      type: Array as PropType<TFormatTokenInfo[]>,
      required: true,
    },
    tokensReturnedList: {
      type: Array as PropType<TFormatTokenInfo[]>,
      required: true,
    },
    tokensClaimedList: {
      type: Array as PropType<TFormatTokenInfo[]>,
      required: true,
    },
    openPositionOnPool: {
      type: Function as PropType<(pool: TPoolInfo) => string>,
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
    ]),
  },
};
</script>

<style scoped lang="scss" src="../styles.scss" />
