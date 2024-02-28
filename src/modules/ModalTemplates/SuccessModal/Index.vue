<template>
  <ModalComponent
    :modelValue="showModal"
    type-modal="custom"
    @close="close"
  >
    <div class="modal-content">
      <BaseIcon
        class="modal-content__icon"
        name="CommonSuccess"
      />
      <h1>
        You successfully swapped
      </h1>

      <div class="modal-content__tokens">
        <div class="modal-content__tokens-col">
          <h3>From</h3>
          <div
            v-for="(item, key) in swapData?.from"
            :key="key"
            class="modal-content__tokens-col-item"
          >
            <span>-{{ item?.value }} {{ item?.symbol }}</span>
          </div>
        </div>
        <div class="modal-content__tokens-col">
          <h3>To</h3>
          <div
            v-for="(item, key) in swapData?.to"
            :key="key"
            class="modal-content__tokens-col-item"
          >
            <span>+{{ item.value }} {{ item.symbol }}</span>
          </div>
        </div>
      </div>

      <div v-if="zksyncFeeHistory">
        <RefundInfo :zksync-fee-history="zksyncFeeHistory" />
      </div>

      <div
        v-if="!zksyncFeeHistory"
        justify="center"
        class="modal-content__close"
      >
        <ButtonComponent
          @on-click="goToTransactionHistory"
        >
          Close
        </ButtonComponent>
      </div>
      <!-- <div class="mt-8 mb-5">
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
        </div> -->
      <!-- <div v-if="false">
        <BestAprPromotion :pool="topPool" />
      </div> -->
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import RefundInfo from '@/modules/ModalTemplates/components/RefundInfo.vue';
// import BestAprPromotion from '@/modules/ModalTemplates/components/BestAprPromotion.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'SuccessModal',
  components: {
    // BestAprPromotion,
    RefundInfo,
    ModalComponent,
    BaseIcon,
    ButtonComponent,
  },

  props: {
    showModal: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('network', ['explorerUrl']),
    ...mapGetters('theme', ['light']),
    ...mapGetters('successModal', ['successTxHash', 'swapData', 'successAction', 'etsData', 'zksyncFeeHistory']),

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
  // mounted() {
  //   this.loadPools();
  // },

  methods: {
    ...mapActions('successModal', ['closeSuccessModal']),
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('tokenAction', ['addUsdPlusToken', 'addDaiPlusToken', 'addUsdtPlusToken', 'addwUsdPlusToken', 'addEthPlusToken', 'addwEthPlusToken', 'addEtsToken', 'addInsuranceToken']),
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

    close() {
      this.closeSuccessModal();

      this.$emit('input', false);
      this.$emit('m-close');
    },

    dismiss() {
      this.close();
    },

    goToTransactionHistory() {
      this.showTxHistory();

      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 70px 30px 70px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-4);
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
  }
}

.modal-content__icon {
  width: 90px;
  height: 90px;
  margin-bottom: 20px;
}

.modal-content__tokens {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 50px;
  margin-bottom: 30px;
}

.modal-content__tokens-col {
  text-align: center;

  span, h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  &:first-child {
    span {
      color: var(--color-18);
    }
  }

  &:last-child {
    span {
      color: var(--color-12);
    }
  }
}

.modal-content__close {
  button {
    [data-theme="dark"] & {
      box-shadow: none;
    }
  }
}
</style>
