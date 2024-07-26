<template>
  <ModalComponent
    v-model="showModal"
    custom-class="success-modal"
    type-modal="custom"
    @close="closeModal"
  >
    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1>
        YOU SUCCESSFULLY ZAP IN
      </h1>

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
                ~ {{ lastParsedClaimedRewardsEvent }} USD
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
                + {{ returnData.value }}
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
                + {{ stakeData.value }}
                {{ stakeData.symbol }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span class="divider" />

      <div class="zap-modal-footer">
        Leave your feedback on Zap In feature and win $50 reward
        <a
          href="https://forms.gle/BCwwX4yhGW7EadTCA"
          target="_blank"
          rel="noopener noreferrer"
          class="leave-feedback-link"
        >
          <ButtonComponent btn-styles="link">
            <BaseIcon name="Pencil" />
            LEAVE FEEDBACK
            <BaseIcon name="Pencil" />
          </ButtonComponent>
        </a>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from '@/components/Modal/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import { mapGetters, mapState } from 'vuex';
import { defineComponent } from 'vue';
import { getTransactionTotal } from '@/utils/tokens.ts';
import { checkIsEveryStable } from '@/store/views/main/pools/helpers.ts';
// import _ from 'lodash';
import {
  mapEventTokenData, mapInputTokenData, getPlatformLink, type TFormatTokenInfo,
} from './helpers.ts';

// const EVENT_DISPATCH_OFFSET = 3000;

export default defineComponent({
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
    PoolLabel,
    BaseIcon,
  },
  props: {
    setShowFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      tokensSentList: [] as TFormatTokenInfo[],
      tokensReturnedList: [] as TFormatTokenInfo[],
      tokensStakedList: [] as TFormatTokenInfo[],
      showModal: false,
      isInit: false,
    };
  },
  computed: {
    ...mapState('odosData', [
      'allTokensMap',
      'successData',
      'showSuccessZapin',
      'lastParsedReturnedToUserEvent',
      'lastParsedPutIntoPoolEvent',
      'lastParsedTokenIdEvent',
    ]),
    ...mapState('poolsData', [
      'lastParsedBurnedTokenIdEvent',
      'lastParsedClaimedRewardsEvent',
    ]),
    ...mapGetters('odosData', ['allTokensMap']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('posthog', ['posthogService']),
    openPositionOnPool(): string {
      // eslint-disable-next-line prefer-destructuring
      const pool = this.successData.pool;
      if (pool.address || pool.platform[0]) return getPlatformLink(pool.platform[0], pool.address);
      return '';
    },
  },
  watch: {
    showSuccessZapin(currVal: boolean) {
      this.showModal = currVal;
      if (!this.isInit && currVal) {
        console.log('__triggerModal');
        // TODO: move Posthog logic up to store
        const posthogEventData = {
          txUrl: this.openPositionOnPool,
          poolName: this.successData.pool.name,
          poolVersion: this.successData.pool.poolVersion,
          totalAmount: getTransactionTotal(this.tokensSentList),
          poolType: checkIsEveryStable(this.successData.pool) ? 'Stable' : 'Volatile',
          walletAddress: this.account,
          chainName: this.successData.pool.chainName,
          poolPlatform: this.successData.pool.platform.toString(),
        };

        if (this.lastParsedClaimedRewardsEvent) {
          this.posthogService
            .rebalanceSuccessTrigger(posthogEventData);
        }
        this.posthogService.zapinSuccessTrigger(posthogEventData);
      }
    },
    successData(val) {
      if (val) {
        this.initStakedList();
        this.initReturnedList();
        this.initSentList();
      }
    },
  },
  mounted() {
    this.initReturnedList();
    this.initStakedList();
    this.initSentList();
  },
  methods: {
    closeModal() {
      this.setShowFunc({ isShow: false });
    },
    // Comes from values computed locally befor tx
    initSentList() {
      if (this.successData?.inputTokens?.length > 0) {
        this.tokensSentList = mapInputTokenData(
          this.successData.inputTokens,
        );
      }
    },
    // Comes from contract event log
    initReturnedList(): void {
      if (this.lastParsedReturnedToUserEvent?.amounts) {
        this.tokensReturnedList = mapEventTokenData(
          this.lastParsedReturnedToUserEvent,
          this.allTokensMap,
        );
      }
    },
    // Comes from contract event log
    initStakedList(): void {
      if (this.lastParsedPutIntoPoolEvent?.amounts) {
        this.tokensStakedList = mapEventTokenData(
          this.lastParsedPutIntoPoolEvent,
          this.allTokensMap,
        );
      }
    },
  },
});
</script>
<style scoped lang="scss" src="./styles.scss" />
