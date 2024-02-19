<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="input-tokens">
    <div class="input-tokens__row">
      <InputComponent
        customClass="input-tokens__field"
        :value="isInputToken ? token.value : token.sum"
        is-custom
        placeholder="0"
        full-width
        :disabled="disabled"
        @input="inputUpdate"
      />

      <div
        v-if="token.selectedToken"
        @click="selectTokenFunc(isInputToken)"
        @keypress="selectTokenFunc(isInputToken)"
        class="input-tokens__selected"
        :class="{ 'input-tokens__select--disabled': disabled }"
      >
        <img
          :src="token.selectedToken.logoUrl"
          alt="select-token"
        >
        <span>
          {{token.selectedToken.symbol}}
        </span>
      </div>
      <div
        v-else
        @click="selectTokenFunc(isInputToken)"
        @keypress="selectTokenFunc(isInputToken)"
        class="input-tokens__select"
      >
        Select token
      </div>

      <div
        v-if="isTokenRemovable"
        class="input-tokens_rmv-btn"
        @click="removeItemFunc(tokenInfo.id)"
        @keypress="removeItemFunc(tokenInfo.id)"
      >
        <BaseIcon
          name="RemoveToken"
        />
      </div>
    </div>
    <div class="input-tokens__row">
      <div class="input-tokens__balance">
        <div
          v-if="isInputToken && token.selectedToken"
        >
          ~ ${{formatMoney(token.usdValue, 2)}}
        </div>
        <div
          v-else-if="!isInputToken && token.sum && token.selectedToken"
        >
          ~ ${{formatMoney(token.sum * token.selectedToken.price, 2)}}
        </div>
        <div v-else>
          $0
        </div>
      </div>
      <div
        @click="
          clickOnBalance()"
        @keypress="clickOnBalance()"
        class="input-tokens__balance"
      >
        <div class="select-token-balance-text">
          <div v-if="token.selectedToken && token.selectedToken?.balanceData?.balance">
            <span class="select-token-balance-text-enabled">
              {{formatMoney(token.selectedToken.balanceData.balance,
                            fixedByPrice(token.selectedToken.price))}}
            </span>
          </div>
          <div v-else>
            Balance: 0
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'InputToken',
  components: {
    BaseIcon,
    InputComponent,
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
    selectTokenFunc: {
      type: Function,
      required: true,
    },
    removeItemFunc: {
      type: Function,
      required: false,
      default: () => null,
    },
    isTokenRemovable: {
      type: Boolean,
      required: true,
    },
    updateTokenValueFunc: {
      type: Function,
      required: false,
      default: () => null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mounted() {
    this.token.selectedToken = this.tokenInfo.selectedToken;
  },
  data() {
    return {
      token: {
        value: null,
        usdValue: null,
        selectedToken: null,
      } as any,
    };
  },
  watch: {
    'tokenInfo.value': function (val) {
      if (val) {
        this.token.value = val;
      }
    },
    'tokenInfo.sum': function (val) {
      if (val) {
        this.token.sum = val;
      }
    },
    'tokenInfo.usdValue': function (val) {
      if (val) {
        this.token.usdValue = val;
      }
    },
  },
  methods: {
    formatMoney,
    fixedByPrice,
    isNumber(evt: any) {
      evt = (evt) || window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;

      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else if (charCode === 46 && (!this.token.value || this.token.value.includes('.'))) {
        evt.preventDefault();
      } else {
        return true;
      }
      return true;
    },
    inputUpdate(value: any) {
      this.updateTokenValueFunc(this.tokenInfo, value);
    },
    clickOnBalance() {
      if (this.token.selectedToken && this.token.selectedToken.balanceData.balance) {
        this.token.value = this.token.selectedToken.balanceData.balance;
        this.inputUpdate(this.token.value);
      }
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
  border-radius: 0;
  transition: box-shadow .2s ease;
  [data-theme="dark"] & {
    color: var(--color-4);
  }

  &:hover, &:focus-within {
    box-shadow: inset 0px -2px 0px 0px var(--color-6);
  }
}

.input-tokens__balance {
  [data-theme="dark"] & {
    color: var(--color-18);
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

.input-tokens__select--disabled {
  pointer-events: none;
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
</style>
