<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="token-form">
    <div
      class="input-tokens"
    >
      <div class="input-tokens__row">
        <InputComponent
          custom-class="input-tokens__field"
          :value="tokenInfo.value"
          is-custom
          placeholder="0"
          full-width
          :disabled="!isInputToken"
          @input="inputUpdate"
        />

        <div
          v-if="tokenInfo.selected"
          class="input-tokens__selected"
          @click="toggleSelect"
          @keypress="toggleSelect"
        >
          <img
            :src="tokenInfo?.logoUrl"
            alt="select-token"
          >
          <span>
            {{ tokenInfo?.symbol }}
          </span>
        </div>
        <div
          v-else
          class="input-tokens__select"
          @click="toggleSelect"
          @keypress="toggleSelect"
        >
          Select token
        </div>
      </div>
      <div class="input-tokens__row">
        <div>
          <div
            v-if="tokenInfo.value && tokenInfo.price"
          >
            ~ ${{ formatMoney(tokenInfo.value * tokenInfo.price, 2) }}
          </div>
          <div v-else>
            $0
          </div>
        </div>
        <div
          :class="{ 'input-tokens__balance': isInputToken }"
          @click="maxUpdate"
          @keypress="maxUpdate"
        >
          <div class="select-token-balance-text">
            <div v-if="tokenInfo && tokenInfo.symbol">
              <span class="select-token-balance-text-enabled">
                <span v-if="isInputToken">Max</span> {{ tokenBalance }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition
      name="slide-fade-small"
    >
      <TokensChooseForm
        v-if="showTokenSelect"
        :tokens-list="tokensList"
        :reverse-array="reverseArray"
        :is-input-token="isInputToken"
        :selected-token="tokenInfo.symbol"
        :active-wrap="activeWrap"
        :is-loading="isLoading"
        @add-token="addSelectedTokenToList"
        @close-select="toggleSelect"
      />
    </Transition>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapGetters } from 'vuex';
import InputComponent from '@/components/Input/Index.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import TokensChooseForm from '@/modules/Main/components/MintRedeem/TokenSelect/Index.vue';
import { MINTREDEEM_SCHEME } from '@/store/views/main/mintRedeem/mocks.ts';
import { mintRedeemTypes, mintWrapStatus } from './types/index.ts';

const wrapStatusArr = [mintWrapStatus.WRAP, mintWrapStatus.UNWRAP];

export default {
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
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    activeWrap: {
      type: Number,
      required: true,
      default: -1,
    },
    reverseArray: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  emits: { 'update-token': null, 'add-token': null },
  data() {
    return {
      showTokenSelect: false,
    };
  },
  computed: {
    ...mapGetters('network', ['networkId']),
    ...mapGetters('mintRedeem', ['tokensListGetter']),
    tokenBalance() {
      if (!this.tokenInfo.balanceData.balanceInUsd) return '0';
      const usdBalance = Number(this.tokenInfo.balanceData.balanceInUsd);
      return formatMoney(usdBalance, fixedByPrice(usdBalance));
    },
    tokensList() {
      let list = this.tokensListGetter[this.networkId];
      const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
      const wrapUnwrapPairs = MINTREDEEM_SCHEME[networkId]
        .filter((_) => _.methodName[0] === mintRedeemTypes.WRAP);

      // FILTERING tokens from wrap/unwrap, based on tab
      if (list?.length > 0) list = this.filterTokens(list, this.activeWrap, wrapUnwrapPairs);

      if (list) {
        let mappedList;
        if (this.isInputToken) {
          mappedList = list.map((_: any[]) => (this.reverseArray ? _[0] : _[1]));
        } else {
          mappedList = list.map((_: any[]) => (this.reverseArray ? _[1] : _[0]));
        }
        const uniqueTokens = new Set();

        const filteredList = mappedList.filter((token: any) => {
          const duplicate = uniqueTokens.has(token.symbol);
          uniqueTokens.add(token.symbol);
          return !duplicate;
        });

        return filteredList;
      }

      return [];
    },
  },
  methods: {
    formatMoney,
    filterTokens(list: any[], wrapType: mintWrapStatus, schemePair: any): any[] {
      const arr = list.filter((_: any) => {
        if (wrapStatusArr.includes(wrapType)) {
          const itemInScheme = schemePair.find(
            (schemeItem: any) => schemeItem.token0?.toLowerCase() === _[0].address?.toLowerCase(),
          );

          return !!itemInScheme;
        }

        if (!wrapStatusArr.includes(wrapType)) {
          const itemInScheme = schemePair.find(
            (schemeItem: any) => schemeItem.token0?.toLowerCase() === _[0].address?.toLowerCase(),
          );

          return !itemInScheme;
        }

        return false;
      });

      return arr;
    },
    addSelectedTokenToList(token: any, isInputToken: boolean) {
      this.$emit('add-token', token, isInputToken);

      // if inputToken choosen, we can know output already
      if (isInputToken) {
        const output = this.tokensListGetter[this.networkId].find((_: any) => {
          const index = _.map((item: any) => item.address).indexOf(token.address);
          const pairAddress = _[this.reverseArray ? 0 : 1].address === token.address;

          // pair found, additional checking with mock
          if (index !== -1 && pairAddress) return _;
          return false;
        });

        if (!output) return;
        this.$emit('add-token', {
          ...output[this.reverseArray ? 1 : 0],
          value: '',
          selected: true,
        }, !isInputToken);
      }

      // if output choosen, we can know input already
      if (!isInputToken) {
        const output = this.tokensListGetter[this.networkId].find((_: any) => {
          const index = _.map((item: any) => item.address).indexOf(token.address);
          const pairAddress = _[this.reverseArray ? 1 : 0].address === token.address;

          // pair found, additional checking with mock
          if (index !== -1 && pairAddress) return _;
          return false;
        });

        this.$emit('add-token', {
          ...output[this.reverseArray ? 0 : 1],
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
        ...this.tokenInfo,
        value,
      }, this.isInputToken, false);
    },
    maxUpdate() {
      // todo rates pair
      this.$emit('update-token', {
        ...this.tokenInfo,
      }, this.isInputToken, true);
    },
  },
};
</script>

<style>
.input-tokens__row .input-tokens__field input {
    padding-left: 0;
}
</style>

<style lang="scss" scoped>
.input-tokens {
  height: 100%;
  position: relative;
  background-color: var(--color-5);
  border-radius: 10px;
  padding: 20px 15px 15px 15px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.input-tokens__field {
  font-size: 20px;
  color: var(--color-1);
  font-weight: 600;
  transition: box-shadow .2s ease;
  border-radius: 0;

  [data-theme="dark"] & {
    color: var(--color-4);
  }

  &:hover, &:focus-within {
    box-shadow: inset 0px -2px 0px 0px var(--color-6);
  }
}

.input-tokens__balance {
  cursor: pointer;
  transition: color .2s ease, transform .15s ease;

  [data-theme="dark"] & {
    color: var(--color-18);
  }

  &:hover {
    color: var(--color-3);
    transform: translateX(2px);
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
.select-token-balance-text-enabled span {
  color: var(--color-3);
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

  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-18);
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);

    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
    }
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

  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4);
  }

  img {
    width: 22px;
    height: 22px;
    margin-right: 4px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }

  &:hover {
    background-color: var(--color-6);
    color: var(--color-1);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
    }
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
