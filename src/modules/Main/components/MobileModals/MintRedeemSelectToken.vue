<template>
  <ModalComponent
    :customClass="'mob-menu'"
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="mob-menu__header">
      <div
        class="mob-menu__header-arr"
        @click="closeModal"
        @keypress="closeModal"
      >
        <BaseIcon
          class="mob-menu__arr"
          name="ArrowLeft"
        />
      </div>
    </div>
    <div
      class="tokens-select"
    >
      <div
        class="tokens-select__header"
        @click="closeSelect"
        @keypress="closeSelect"
      >
        <p>mobile</p>
        <h1>
          Choose token to use for {{getStatus}}
        </h1>
        <div
          class="slider__arrow-wrapper"
        >
          <BaseIcon
            name="ArrowRight"
            class="slider__arrow-icon"
          />
        </div>
      </div>

      <div
        v-if="tokensList?.length === 0 && isLoading"
        class="token-select__spinner"
      >
        <Spinner size="40px" />
      </div>

      <template v-else>
        <TokensList
          :tokens="tokensList"
          :is-input-token="isInputToken"
          :selected-token="selectedToken"
          @select-token="selectToken"
          @remove-token="removeToken"
          @close-select="closeSelect"
        />
      </template>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import Spinner from '@/components/Spinner/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import TokensList from '@/modules/Main/components/MintRedeem/TokenSelect/TokensList.vue';
import { mintWrapStatus } from '@/modules/Main/components/MintRedeem/types/index.ts';

export default {
  name: 'MintRedeemSelectToken',
  components: {
    TokensList,
    BaseIcon,
    Spinner,
    ModalComponent,
  },
  emits: ['close', 'close-select', 'add-token', 'remove-token'],
  data() {
    return {
      showModal: false,
    };
  },
  props: {
    tokensList: {
      type: Array,
      default: () => [],
    },
    activeWrap: {
      type: Number,
      required: true,
      default: -1,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    reverseArray: {
      type: Boolean,
      required: true,
      default: false,
    },
    isInputToken: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedToken: {
      type: String,
      required: false,
      default: '',
    },
  },

  computed: {
    getStatus() {
      if (this.activeWrap === mintWrapStatus.MINT) return 'minting';
      if (this.activeWrap === mintWrapStatus.REDEEM) return 'redeeming';
      if (this.activeWrap === mintWrapStatus.WRAP) return 'wraping';
      if (this.activeWrap === mintWrapStatus.UNWRAP) return 'unwraping';
      return '';
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    closeSelect() {
      this.$emit('close-select', false);
    },
    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      this.$emit('add-token', {
        ...token,
        selected: true,
      }, this.isInputToken);
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      this.$emit('remove-token', {
        ...token,
        selected: true,
      }, this.isInputToken);
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background-color: var(--color-4);
  border-radius: 10px;
}

.tokens-select__header {
  padding: 15px;
  border: 2px solid var(--color-5);
  border-bottom: 0;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-6);
  }

  h1 {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      color: var(--color-2);
      margin-bottom: 10px;
      [data-theme="dark"] & {
        color: var(--color-18);
      }
  }
  cursor: pointer;
  transition: background-color .15s ease;

  &:hover {
    background-color: var(--color-5);
    [data-theme="dark"] & {
      background-color: var(--color-7);
    }
  }
}

.slider__arrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 24px;
  height: 24px;
  right: 10px;
  top: 14px;
  color: var(--color-3);
}

.token-select__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border: 2px solid var(--color-5);
  background-color: var(--color-4);
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
  }
}
</style>
