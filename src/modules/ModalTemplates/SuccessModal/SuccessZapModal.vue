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
              v-if="burnedNftId"
              class="nft-info-row"
            >
              <span>Burned NFT:</span><span>ID: #{{ burnedNftId }}</span>
            </div>
            <div
              v-if="nftId"
              class="nft-info-row"
            >
              <span>New NFT:</span><span>ID: #{{ nftId }}</span>
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

          <div class="data-row returned">
            <div class="success-row-title">
              Claimed
            </div>
            <div class="success-data-list">
              <div class="token-amount">
                ~ {{ claimedRewards }} USD
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
import { mapGetters } from 'vuex';
import { formatMoney } from '@/utils/numbers.ts';
import { defineComponent, type PropType } from 'vue';
import {
  mapEventTokenData, mapInputTokenData, getPlatformLink, type TFormatTokenInfo, type TTokenDataList,
} from './helpers.ts';

export default defineComponent({
  name: 'SuccessZapModal',
  components: {
    ModalComponent,
    ButtonComponent,
    PoolLabel,
    BaseIcon,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    setShowFunc: {
      type: Function,
      required: true,
    },
    successData: {
      type: Object,
      required: true,
    },
    returnedToUser: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
    putIntoPool: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
    burnedNftId: {
      type: String,
      required: true,
    },
    nftId: {
      type: String,
      required: true,
    },
    claimedRewards: {
      type: String,
      required: true,
    },
    inputTokens: {
      type: Object as PropType<TTokenDataList>,
      required: true,
    },
  },
  data() {
    return {
      tokensSentList: [] as TFormatTokenInfo[],
      tokensReturnedList: [] as TFormatTokenInfo[],
      tokensStakedList: [] as TFormatTokenInfo[],
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
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
  computed: {
    ...mapGetters('network', ['getParams']),
    ...mapGetters('odosData', ['allTokensMap']),
    openPositionOnPool(): string {
      // eslint-disable-next-line prefer-destructuring
      const pool = this.successData.pool;
      if (pool.address || pool.platform[0]) return getPlatformLink(pool.platform[0], pool.address);
      return '';
    },
    openOnExplorer() {
      const { explorerUrl } = this.getParams(this.successData.chain);
      return `${explorerUrl}tx/${this.successData.hash}`;
    },
  },
  methods: {
    formatMoney,
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
      if (this.returnedToUser?.amounts) {
        this.tokensReturnedList = mapEventTokenData(
          this.returnedToUser,
          this.allTokensMap,
        );
      }
    },
    // Comes from contract event log
    initStakedList(): void {
      if (this.putIntoPool?.amounts) {
        this.tokensStakedList = mapEventTokenData(
          this.putIntoPool,
          this.allTokensMap,
        );
      }
    },
  },
});
</script>
<style scoped lang="scss" src="./styles.scss" />
