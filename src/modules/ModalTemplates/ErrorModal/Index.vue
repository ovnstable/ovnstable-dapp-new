<template>
  <ModalComponent
    :modelValue="showModal"
    type-modal="custom"
    overlayModals
    @close="close"
  >
    <div class="modal-content">
      <div v-if="errorViewType === 'gas'">
        <GasError
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'rpc'">
        <RpcError
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'slippage'">
        <SlippageError
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType && errorViewType.includes('odos')">
        <OdosError
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'highload-network'">
        <HighLoadInfo
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'gas-price-increase'">
        <GasPriceIncreaseInfo
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'over-rate-limit'">
        <OverRateLimitInfo
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else-if="errorViewType === 'insufficient-funds'">
        <InsufficientFundsInfo
          :error-msg="errorText"
          :error-code="errorCode"
          :copy-error="copyErrorToClipboard"
        />
      </div>
      <div v-else>
        <UndefinedError
          :error-msg="errorMsg"
          :copy-error="copyErrorToClipboard"
        />
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import ModalComponent from '@/components/Modal/Index.vue';
import UndefinedError from '@/modules/ModalTemplates/ErrorModal/UndefinedError.vue';
import RpcError from '@/modules/ModalTemplates/ErrorModal/RpcError.vue';
import GasError from '@/modules/ModalTemplates/ErrorModal/GasError.vue';
import SlippageError from '@/modules/ModalTemplates/ErrorModal/SlippageError.vue';
import OdosError from '@/modules/ModalTemplates/ErrorModal/OdosError.vue';
import HighLoadInfo from '@/modules/ModalTemplates/ErrorModal/HighLoadInfo.vue';
import GasPriceIncreaseInfo from '@/modules/ModalTemplates/ErrorModal/GasPriceIncreaseInfo.vue';
import OverRateLimitInfo from '@/modules/ModalTemplates/ErrorModal/OverRateLimitInfo.vue';
import InsufficientFundsInfo from '@/modules/ModalTemplates/ErrorModal/InsufficientFundsInfo.vue';

export default {
  name: 'ErrorModal',
  components: {
    InsufficientFundsInfo,
    OverRateLimitInfo,
    GasPriceIncreaseInfo,
    HighLoadInfo,
    OdosError,
    SlippageError,
    GasError,
    RpcError,
    UndefinedError,
    ModalComponent,
  },

  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showCopyTooltip: false,
    showCopyTooltipContainer: false,

    errorText: '',
    errorCode: 0,
    errorViewType: '',
  }),

  computed: {
    ...mapGetters('errorModal', ['show', 'errorType', 'errorMsg']),
    ...mapGetters('theme', ['light']),
  },

  watch: {
    show(val) {
      if (val) {
        this.initError();
      }
    },
    errorType() {
      this.initError();
    },
    errorMsg() {
      this.initError();
    },
  },

  methods: {
    ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal', 'showErrorModalWithMsg']),

    initError() {
      if (!this.errorMsg) {
        return;
      }

      this.errorCode = this.errorMsg.code;
      // eslint-disable-next-line no-nested-ternary
      this.errorText = this.errorMsg
        ? (this.errorMsg.message ? this.errorMsg.message : this.errorMsg) : null;

      if (this.errorType === 'slippage') {
        this.errorViewType = 'slippage';
        return;
      }

      if (this.errorType === 'highload-network') {
        this.errorViewType = 'highload-network';
        return;
      }

      if (this.errorType === 'gas-price-increase') {
        this.errorViewType = 'gas-price-increase';
        return;
      }

      if (this.errorType === 'over-rate-limit') {
        this.errorViewType = 'over-rate-limit';
        return;
      }

      if (this.errorType === 'insufficient-funds') {
        this.errorViewType = 'insufficient-funds';
        return;
      }

      if (this.errorType.includes('odos')) {
        this.errorViewType = 'odos';
        return;
      }

      if (this.errorMsg.code === 4001) {
        // user cancel transaction
        console.log('User cancel transaction');
        // this.closeErrorModal();
        return;
      }

      if (this.isRpcError(this.errorMsg)) {
        this.errorViewType = 'rpc';
        return;
      }

      if (!this.errorMsg.message) {
        console.log('Error type not found.');
        return;
      }

      if (this.errorMsg.message.includes('Out of Gas')) {
        this.errorViewType = 'gas';
        return;
      }

      console.log('Error type not found.');
    },

    isRpcError(errorMsg: any) {
      if (errorMsg.code === -32016 || errorMsg.code === -32603) {
        return true;
      }

      if (!errorMsg.message) {
        return false;
      }

      if (errorMsg.message.includes('-32016') || errorMsg.message.includes('-32603')) {
        return true;
      }

      return false;
    },

    async copyErrorToClipboard(copyTooltip: string) {
      if (copyTooltip === 'container') {
        this.showCopyTooltipContainer = true;
      }
      if (copyTooltip === 'link') {
        this.showCopyTooltip = true;
      }

      await navigator.clipboard.writeText(JSON.stringify(this.errorMsg));

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (copyTooltip === 'container') {
        this.showCopyTooltipContainer = false;
      }
      if (copyTooltip === 'link') {
        this.showCopyTooltip = false;
      }
    },

    close() {
      this.closeErrorModal();

      this.$emit('input', false);
      this.$emit('m-close');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 50px 70px 30px 70px;
  max-width: 538px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-4);
  }
}
</style>
