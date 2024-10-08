<template>
  <ModalComponent
    v-model="showModal"
    type-modal="custom"
    @close="closeModal"
  >
    <div
      class="tokens-modal"
    >
      <div
        class="tokens-modal__header"
      >
        <h1
          v-if="selectTokenInput"
        >
          {{ `Select ${token0Name}` }}
        </h1>
        <h1
          v-else
        >
          {{ `Select ${token1Name}` }}
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
            :remove-native="removeNative"
            :is-input-tokens="selectTokenInput"
            :max-token-count="maxTokenCount"
            :is-overnight-first="isOvernightFirst"
            @add-token="selectToken"
            @remove-token="removeToken"
          />
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import { type PropType, type Ref } from 'vue';
import SelectTokenWithSearch from '@/components/TokensModal/SelectTokenWithSearch.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BN from 'bignumber.js';
import { mapGetters } from 'vuex';
import BalanceService from '@/services/BalanceService/BalanceService.ts';

export default {
  name: 'SelectTokensModal',
  components: {
    SelectTokenWithSearch,
    ModalComponent,
    Spinner,
    ButtonComponent,
  },
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
      type: Boolean as PropType<boolean | Ref<boolean>>,
      required: false,
      default: false,
    },
    isAllDataLoaded: {
      type: Boolean as PropType<boolean | Ref<boolean>>,
      required: true,
    },
    token0Name: {
      type: String,
      required: false,
      default: 'Input token',
    },
    token1Name: {
      type: String,
      required: false,
      default: 'Output token',
    },
    maxTokenCount: {
      type: Number,
      required: false,
      default: 3,
    },
    isOvernightFirst: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['set-show', 'add-token-to-list', 'remove-token-from-list', 'connect-wallet', 'reload'],
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapGetters('accountData', ['account']),
    ...mapGetters('web3', ['evmSigner']),
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
    async selectToken(token: any) {
      let tokenBalance = token.balanceData;

      if (new BN(tokenBalance?.balance).eq(0)) {
        const balance = await BalanceService
          .fetchBalanceByAddress(this.evmSigner, this.account, token.address);
        const balanceUsd = new BN(balance?.toString())
          .div(10 ** tokenBalance.decimal)
          .times(token.price)
          .toFixed();

        tokenBalance = {
          ...tokenBalance,
          originalBalance: balance?.toString(),
          balanceInUsd: balanceUsd,
          balance: new BN(balance).div(10 ** tokenBalance.decimal),
        };
      }

      // eslint-disable-next-line no-param-reassign
      token.selected = true;
      this.$emit('add-token-to-list', {
        tokenData: {
          ...token,
          balanceData: tokenBalance,
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
  min-width: 500px;
  max-width: 500px;
  border-radius: 20px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
  }
}

.tokens-modal__header {
  padding: 15px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
  h1 {
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    color: var(--color-1);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.token-select__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border: 2px solid var(--color-5);
  background-color: var(--color-4);
  min-height: 50vh;

  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
  }
}

.tokens-container__empty {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 500;
}

.tokens__connect {
  margin: auto auto 0 auto;
}
@media (max-width: 500px) {
  .tokens-modal {
    min-width: auto;
  }
}
</style>
