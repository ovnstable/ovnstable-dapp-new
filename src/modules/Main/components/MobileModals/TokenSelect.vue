<template>
  <ModalComponent
    :customClass="'mob-menu'"
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div
      class="tokens-modal"
    >
      <div
        class="tokens-modal__header"
      >
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
        <h1
          v-if="selectTokenInput"
        >
          YOU SEND
        </h1>
        <h1
          v-else
        >
          YOU RECEIVE
        </h1>
      </div>

      <div class="tokens-container">
        <div
          v-if="!isAllDataLoaded || balancesLoading && !userAccount"
          class="token-select__spinner"
        >
          <Spinner size="40px" />
        </div>
        <div
          v-else-if="userAccount && tokens.length === 0"
          class="tokens-container__empty"
        >
          <h1>Chain tokens failed to load, please reload list</h1>
          <ButtonComponent
            class="tokens__connect"
            btn-size="large"
            full
            @on-click="reloadTrigger"
          >
            RELOAD
          </ButtonComponent>
        </div>
        <div
          v-else-if="!userAccount && tokens.length === 0"
          class="tokens-container__empty"
        >
          <h1>Account not found, please connect Your wallet</h1>
          <ButtonComponent
            class="tokens__connect"
            btn-size="large"
            full
            @on-click="connectWallet"
          >
            CONNECT
          </ButtonComponent>
        </div>

        <div v-else>
          <SelectTokenWithSearch
            :tokens="tokens"
            :selected-tokens="selectedTokens"
            :removeNative="removeNative"
            :is-input-tokens="selectTokenInput"
            @add-token="selectToken"
            @remove-token="removeToken"
          />
        </div>
      </div>

    </div>
  </ModalComponent>
</template>

<script lang="ts">
import SelectTokenWithSearch from '@//components/TokensModal/SelectTokenWithSearch.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'SelectTokensModalMobile',
  components: {
    SelectTokenWithSearch,
    ModalComponent,
    Spinner,
    ButtonComponent,
    BaseIcon,
  },
  emits: ['set-show', 'add-token-to-list', 'remove-token-from-list', 'connect-wallet', 'reload'],
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    removeNative: {
      type: Boolean,
      required: false,
      default: false,
    },
    userAccount: {
      type: String,
      required: false,
      default: '',
    },
    selectTokenInput: {
      type: Boolean,
      required: true,
    },
    selectedTokens: {
      type: Array,
      required: true,
    },
    tokens: {
      type: Array,
      required: true,
    },
    balancesLoading: {
      type: Boolean,
      required: false,
    },
    isAllDataLoaded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    isShow(currVal: boolean) {
      this.showModal = currVal;
    },
  },
  methods: {
    reloadTrigger() {
      this.$emit('reload');
    },
    connectWallet() {
      this.$emit('connect-wallet', false);
    },
    closeModal() {
      this.$emit('set-show', false);
    },
    selectToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = true;
      this.$emit('add-token-to-list', {
        tokenData: {
          ...token,
          selected: true,
        },
        isInput: this.selectTokenInput,
      });
    },
    removeToken(token: any) {
      // eslint-disable-next-line no-param-reassign
      token.selected = false;
      this.$emit('remove-token-from-list', {
        tokenData: {
          ...token,
          selected: false,
        },
        isInput: this.selectTokenInput,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-modal {
  min-width: 100%;
}
@media (max-width: 640px) {
  .tokens-modal__header {
    margin-top: 16px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    h1 {
      color: var(--color-1);
      font-size: 16px;
      text-align: center;
      flex: 1;
      [data-theme="dark"] & {
        color: var(--color-4);
      }
    }
  }
  .mob-menu__header-arr {
    svg {
      fill: var(--color-1);
      [data-theme="dark"] & {
        fill: var(--color-4);
      }
    }
  }
}

</style>
