<template>
  <ModalComponent
    :modelValue="showModal"
    :show-close="false"
    type-modal="custom"
  >
    <div class="container_body align-center pt-4 px-8 pb-10">
      <div
        class="container_header"
        flat
      >
        <button
          icon
          class="ml-auto mr-5 mt-10"
          type="button"
          @click="close"
        >
          <img
            :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')"
            alt="close icon"
          >
        </button>
      </div>
      <div class="px-5 pt-5">
        <div
          justify="center"
          align="center"
          class="mb-5"
        >
          <!-- <div class="loading-img">
            <div :src="tokenActionIcon" />
          </div> -->
          icon
        </div>
        <div
          justify="center"
          class="mb-8"
        >
          <div
            v-if="successAction === 'swapOdosUsdPlus'"
            class="success-div"
          >
            You successfully swapped USD+
          </div>
          <div
            v-else
            class="success-div"
          >
            Transaction successfully submitted
          </div>
        </div>

        <div v-if="zksyncFeeHistory">
          <RefundInfo :zksync-fee-history="zksyncFeeHistory" />
        </div>

        <div
          v-if="!zksyncFeeHistory"
          justify="center"
          class="mb-5"
        >
          <button
            dark
            height="40"
            width="300"
            class="dismiss-btn mb-3"
            type="button"
            @click="goToTransactionHistory"
          >
            Go to my transaction history
          </button>
        </div>
        <div class="mt-8 mb-5">
          <div :cols="$wu.isMobile() ? 12 : 6">
            <div
              :justify="$wu.isMobile() ? 'center' : 'start'"
              align="center"
              :class="$wu.isMobile() ? '' : 'ml-8'"
            >
              <div
                class="success-link"
                @click="addTokenAction"
                @keypress="addTokenAction"
              >Add {{ actionSuccessToken }} to your
                wallet
              </div>
              <div class="action-icons ml-1">
                <div :src="require('@/assets/icon/wallet_plus.svg')" />
              </div>
            </div>
          </div>
          <div :cols="$wu.isMobile() ? 12 : 6">
            <div
              :justify="$wu.isMobile() ? 'center' : 'end'"
              align="center"
              :class="$wu.isMobile() ? '' : 'mr-8'"
            >
              <div
                class="success-link"
                @click="openOnExplorer(successTxHash)"
                @keypress="openOnExplorer(successTxHash)"
              >View transaction</div>
              <div class="action-icons ml-1">
                <div :src="require('@/assets/icon/open_in_new_blue.svg')" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isPoolsLoading">
        <BestAprPromotion :pool="topPool" />
      </div>
    </div>
  </ModalComponent>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import RefundInfo from '@/components/CustomModals/action/component/RefundInfo.vue';
import BestAprPromotion from '@/components/CustomModals/action/component/BestAprPromotion.vue';

export default {
  name: 'SuccessModal',
  components: {
    BestAprPromotion,
    RefundInfo,
  },

  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('network', ['explorerUrl']),
    ...mapGetters('theme', ['light']),
    ...mapGetters('successModal', ['show', 'successTxHash', 'successAction', 'etsData', 'zksyncFeeHistory']),

    actionSuccessToken() {
      switch (this.successAction) {
        case 'mintUsdPlus':
          return 'USD+';
        case 'redeemUsdPlus':
          return 'USD+';
        case 'mintDaiPlus':
          return 'DAI+';
        case 'redeemDaiPlus':
          return 'DAI+';
        case 'mintUsdtPlus':
          return 'USDT+';
        case 'redeemUsdtPlus':
          return 'USDT+';
        case 'wrapUsdPlus':
          return 'wUSD+';
        case 'unwrapUsdPlus':
          return 'wUSD+';
        case 'wrapEthPlus':
          return 'wETH+';
        case 'unwrapEthPlus':
          return 'wETH+';
        case 'mintEts':
          return `ETS ${this.etsData ? this.etsData.nameToken : ''}`;
        case 'redeemEts':
          return `ETS ${this.etsData ? this.etsData.nameToken : ''}`;
        case 'swapOdosUsdPlus':
          return 'USD+';
        default:
          return '';
      }
    },

    // tokenActionIcon() {
    //   switch (this.successAction) {
    //     case 'mintUsdPlus':
    //       return require('@/assets/icon/minted.svg');
    //     case 'redeemUsdPlus':
    //       return require('@/assets/icon/redeemed.svg');
    //     case 'mintDaiPlus':
    //       return require('@/assets/icon/mintedDai.png');
    //     case 'redeemDaiPlus':
    //       return require('@/assets/icon/redeemedDai.png');
    //     case 'mintUsdtPlus':
    //       return require('@/assets/icon/mintedUsdt.png');
    //     case 'redeemUsdtPlus':
    //       return require('@/assets/icon/redeemedUsdt.png');
    //     case 'mintEthPlus':
    //       return require('@/assets/icon/mintedEth.png');
    //     case 'redeemEthPlus':
    //       return require('@/assets/icon/redeemedEth.png');
    //     case 'wrapUsdPlus':
    //       return require('@/assets/icon/wrap.svg');
    //     case 'unwrapUsdPlus':
    //       return require('@/assets/icon/unwrap.svg');
    //     case 'wrapEthPlus':
    //       return require('@/assets/icon/wETHwrap.svg');
    //     case 'unwrapEthPlus':
    //       return require('@/assets/icon/wETHunwrap.svg');
    //     case 'mintEts':
    //       if (this.etsData) {
    //         return require(`@/assets/currencies/market/ets_${this.etsData.name}.svg`);
    //       }
    //       return require('@/assets/icon/minted.svg');

    //     case 'redeemEts':
    //       if (this.etsData) {
    //         return require(`@/assets/currencies/market/ets_${this.etsData.name}.svg`);
    //       }
    //       return require('@/assets/icon/redeemed.svg');

    //     case 'mintInsurance':
    //       return require('@/assets/currencies/insurance/round_insurance_optimism.svg');
    //     case 'withdrawInsurance':
    //       return require('@/assets/currencies/insurance/round_insurance_optimism.svg');
    //     case 'swapOdosUsdPlus':
    //       return require('@/assets/icon/minted.svg');
    //     default:
    //       return '';
    //   }
    // },
  },
  mounted() {
    this.loadPools();
  },

  methods: {
    ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('tokenAction', ['addUsdPlusToken', 'addDaiPlusToken', 'addUsdtPlusToken', 'addwUsdPlusToken', 'addEthPlusToken', 'addwEthPlusToken', 'addEtsToken', 'addInsuranceToken']),
    ...mapActions('swapModal', ['closeSwapModal']),
    ...mapActions('wrapModal', ['closeWrapModal']),
    ...mapActions('investModal', ['closeInvestModal']),
    ...mapActions('track', ['trackClick']),
    ...mapActions('accountUI', ['showTxHistory']),

    addTokenAction() {
      console.log(this.successAction);
      switch (this.successAction) {
        case 'mintUsdPlus':
        case 'redeemUsdPlus':
          this.addUsdPlusToken();
          break;
        case 'mintDaiPlus':
        case 'redeemDaiPlus':
          this.addDaiPlusToken();
          break;
        case 'swapOdosUsdPlus':
          this.addUsdPlusToken();
          break;
        case 'mintUsdtPlus':
        case 'redeemUsdtPlus':
          this.addUsdtPlusToken();
          break;
        case 'mintEthPlus':
        case 'redeemEthPlus':
          this.addEthPlusToken();
          break;
        case 'wrapUsdPlus':
        case 'unwrapUsdPlus':
          this.addwUsdPlusToken();
          break;
        case 'wrapEthPlus':
        case 'unwrapEthPlus':
          this.addwEthPlusToken();
          break;
        case 'mintEts':
        case 'redeemEts':
          this.addEtsToken(this.etsData);
          break;
        case 'mintInsurance':
        case 'withdrawInsurance':
          this.addInsuranceToken();
          break;
        default:
          break;
      }
    },

    openOnExplorer(hash) {
      if (hash) {
        window.open(`${this.explorerUrl}tx/${hash}`, '_blank').focus();
      }
    },

    close() {
      this.closeSuccessModal();

      this.$emit('input', false);
      this.$emit('m-close');
    },

    dismiss() {
      this.close();
    },

    goToTransactionHistory() {
      this.closeSwapModal();
      this.closeWrapModal();
      this.closeInvestModal();

      this.showTxHistory();

      this.close();
    },
  },
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .success-div {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .success-div {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .success-div {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.loading-img {
    width: 120px;
    height: 120px;
}

.success-div {
    color: var(--secondary-gray-text);
    text-align: center !important;
}

.success-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.success-link:hover {
    text-decoration: underline;
}

.dismiss-btn {
    background: var(--blue-gradient) !important;
    height: 40px;
    border-radius: 2px;

    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.promo-container {
    background: rgba(252, 202, 70, 0.05);
    border-radius: 4px;
}

.promo-div-title {
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.promo-div-text {
    color: var(--secondary-gray-text);
}

.action-icons {
    width: 20px;
    height: 20px;
    margin-top: 2px;
}

.divider {
    border-top: 1px solid #ADB3BD;
}
</style>
