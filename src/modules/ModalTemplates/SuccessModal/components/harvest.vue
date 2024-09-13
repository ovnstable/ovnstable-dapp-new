<template>
  <div>
    <span class="divider" />

    <div class="zap-header-container">
      <PoolLabel :pool="successData.pool" />
      <div class="modal-content__data-row">
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
              class="token-amount token-amount--green"
            >
              {{ getSymbolToken }}
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
import { REWARD_TOKEN } from '@/store/views/main/zapin/index.ts';
import getPlatformLink from '../helpers.ts';

export default {
  name: 'ZapinContent',
  components: {
    PoolLabel,
    BaseIcon,
    ButtonComponent,
  },
  computed: {
    ...mapState('odosData', [
      'successData',
    ]),
    getSymbolToken() {
      const { pool } = this.successData;
      if (pool.platform[0] === 'Pancake') return REWARD_TOKEN.CAKE;
      if (pool.platform[0] === 'Aerodrome') return REWARD_TOKEN.AERO;
      return '';
    },
    openPositionOnPool(): string {
      const { pool } = this.successData;
      if (pool.address || pool.platform[0]) return getPlatformLink(pool.platform[0], pool.address);
      return '';
    },
  },
};
</script>

<style scoped>
.view-position-link {
  margin: 0 auto;
}
</style>

<style scoped lang="scss" src="../styles.scss" />
