<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="token-form">
    <div
      class="input-tokens"
    >
      <div class="input-tokens__row">
        <InputComponent
          customClass="input-tokens__field"
          :value="tokenInfo.value"
          is-custom
          placeholder="0"
          full-width
          :disabled="!isInputToken"
          @input="inputUpdate"
        />

        <div
          v-if="tokenInfo.selected"
          @click="toggleSelect"
          @keypress="toggleSelect"
          class="input-tokens__selected"
        >
          <img
            :src="tokenInfo?.logoUrl"
            alt="select-token"
          >
          <span>
            {{tokenInfo?.symbol}}
          </span>
        </div>
        <div
          v-else
          @click="toggleSelect"
          @keypress="toggleSelect"
          class="input-tokens__select"
        >
          Select token
        </div>
      </div>
      <div class="input-tokens__row">
        <div class="input-tokens__balance">
          <div
            v-if="isInputToken && tokenInfo.symbol"
          >
            ~ ${{formatMoney(tokenInfo.usdValue, 2)}}
          </div>
          <div
            v-else-if="!isInputToken && tokenInfo.sum && tokenInfo.selectedToken"
          >
            ~ ${{formatMoney(tokenInfo.sum * tokenInfo.selectedtoken?.price, 2)}}
          </div>
          <div v-else>
            $0
          </div>
        </div>
        <div
          class="input-tokens__balance"
        >
          <div class="select-token-balance-text">
            <div v-if="tokenInfo && tokenInfo.symbol">
              <span class="select-token-balance-text-enabled">
                {{tokenBalance + " " + tokenInfo.symbol}}
              </span>
            </div>
            <div v-else>
              Balance: 0
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="slide-fade-small">
      <TokensChooseForm
        v-if="showTokenSelect"
        :tokens-list="tokensList"
        :active-mint="activeMint"
        :is-input-token="isInputToken"
        :selected-token="tokenFullData.symbol"
        @add-token="addSelectedTokenToList"
        @remove-token="removeSelectedTokenFromList"
        @close-select="toggleSelect"
      />
    </Transition>

  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import InputComponent from '@/components/Input/Index.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import TokensChooseForm from '@/modules/Main/components/MintRedeem/TokenSelect/Index.vue';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'TokenForm',
  components: {
    InputComponent,
    TokensChooseForm,
  },
  props: {
    // inputToken = token which we want to swap
    isInputToken: {
      type: Boolean,
      required: true,
    },
    tokenInfo: {
      type: Object,
      required: true,
      default: () => {},
    },
    isTokenRemovable: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    activeMint: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data() {
    return {
      showTokenSelect: false,
    };
  },
  computed: {
    ...mapGetters('network', ['networkId']),
    ...mapGetters('mintRedeem', ['tokensListGetter']),
    ...mapGetters('accountData', ['account', 'originalBalance']),
    tokenBalance() {
      const balanceData = this.originalBalance.find((_: any) => _.symbol === this.tokenInfo.symbol);
      if (!balanceData) return '0';

      const formattedBalance = new BigNumber(balanceData.balance)
        .div(10 ** this.tokenInfo.decimals).toNumber();
      return formatMoney(formattedBalance, 2);
    },
    tokensList() {
      const list = this.tokensListGetter[this.networkId];

      if (list && this.isInputToken) return list.map((_: any[]) => _[0]);
      if (list && !this.isInputToken) return list.map((_: any[]) => _[1]);

      // when first choosen, searching for pair, and return
      return [];
    },

    tokenFullData() {
      return this.tokenInfo;
    },
  },
  methods: {
    formatMoney,
    fixedByPrice,
    removeSelectedTokenFromList() {
      console.log('removeSelectedTokenFromList');
    },
    addSelectedTokenToList(token: any, isInputToken: boolean) {
      this.$emit('add-token', token, isInputToken);

      // if inputToken choosen, we can know output already
      if (isInputToken) {
        const output = this.tokensListGetter[this.networkId].find((_: any) => {
          const index = _.map((item: any) => item.address).indexOf(token.address);

          // pair found, additional checking with mock
          if (index !== -1 && _[0].address === token.address) return _;
          return false;
        });

        this.$emit('add-token', {
          ...output[1],
          value: '',
          selected: true,
        }, !isInputToken);
      }

      // if output choosen, we can know input already
      if (!isInputToken) {
        const output = this.tokensListGetter[this.networkId].find((_: any) => {
          const index = _.map((item: any) => item.address).indexOf(token.address);

          // pair found, additional checking with mock
          if (index !== -1 && _[1].address === token.address) return _;
          return false;
        });

        this.$emit('add-token', {
          ...output[0],
          value: '',
          selected: true,
        }, !isInputToken);
      }
      this.toggleSelect();
    },
    toggleSelect() {
      this.showTokenSelect = !this.showTokenSelect;
    },
    inputUpdate(value: any) {
      // todo rates pair
      this.$emit('update-token', {
        ...this.tokenFullData,
        value,
      }, this.isInputToken);
    },
  },
});
</script>

<style>
.input-tokens__row .input-tokens__field input {
    padding-left: 0;
}
</style>

<style lang="scss" scoped>
.input-tokens {
  position: relative;
  background-color: var(--color-5);
  border-radius: 10px;
  padding: 20px 15px 15px 15px;
}

.input-tokens__field {
  font-size: 20px;
  color: var(--color-1);
  font-weight: 600;
  margin-right: 30px;
  transition: box-shadow .2s ease;

  &:hover, &:focus-within {
    box-shadow: inset 0px -2px 0px 0px var(--color-6);
  }
}

.input-tokens__row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:first-child {
    margin-bottom: 15px;
  }
}

.input-tokens__select {
  background-color: var(--color-4);
  color: var(--color-2);
  font-weight: 500;
  font-size: 15px;
  border-radius: 30px;
  padding: 10px 8px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color .2s ease, color .2s ease;

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
  }
}

.input-tokens__selected {
  display: flex;
  align-items: center;
  background-color: var(--color-4);
  color: var(--color-2);
  font-size: 15px;
  border-radius: 30px;
  padding: 5px 4px;
  transition: background-color .2s ease, color .2s ease;
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
    margin-right: 4px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
  }
}

.input-tokens_rmv-btn {
  position: absolute;
  right: 15px;
  top: -1px;
  padding: 3px 4px;
  cursor: pointer;
  transition: transform .2s ease;

  &:hover {
    transform: rotate(-90deg);
  }
}

.token-form {
  position: relative;
  margin-bottom: 30px;
}
</style>
