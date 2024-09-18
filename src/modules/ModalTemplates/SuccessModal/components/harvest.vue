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
      </div>
    </div>

    <span class="divider" />
    <div class="modal-content__data">
      <div class="modal-content__data-main">
        <div
          class="data-row returned"
        >
          <div class="success-row-title">
            Claimed
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
import type { TFormatTokenInfo } from '../helpers';
import type { TPoolInfo } from '@/types/common/pools';

export default {
  name: 'ZapinContent',
  components: {
    PoolLabel,
    BaseIcon,
    ButtonComponent,
  },
  props: {
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
    ]),
  },
};
</script>

<style scoped>
.view-position-link {
  margin: 0 auto;
}
</style>

<style scoped lang="scss" src="../styles.scss" />
