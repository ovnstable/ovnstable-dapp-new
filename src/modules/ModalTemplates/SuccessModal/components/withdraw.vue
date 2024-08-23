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
      v-if="tokensSentList?.length > 0"
      class="modal-content__data"
    >
      <div class="modal-content__data-main">
        <div
          class="data-row returned"
        >
          <div class="success-row-title">
            Received
          </div>
          <div class="success-data-list">
            <div
              v-for="sentData in tokensSentList as any"
              :key="sentData.id"
              class="token-amount token-amount--green"
            >
              + {{ sentData.value }} {{ sentData.symbol }}
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
import getPlatformLink from '../helpers.ts';

export default {
  name: 'ZapinContent',
  components: {
    PoolLabel,
    BaseIcon,
    ButtonComponent,
  },
  props: {
    // tokensStakedList: {
    //   type: Array,
    //   required: true,
    // },
    tokensSentList: {
      type: Array,
      required: true,
    },
    // tokensReturnedList: {
    //   type: Array,
    //   required: true,
    // },
  },
  computed: {
    ...mapState('odosData', [
      'successData',
      'lastParsedTokenIdEvent',
    ]),
    ...mapState('poolsData', [
      'lastParsedBurnedTokenIdEvent',
    ]),
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
