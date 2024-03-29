<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="input-tokens">
    <div class="input-tokens__row">
      <InputComponent
        customClass="input-tokens__field"
        :value="isInputToken ? tokenInfo.value : tokenInfo.sum"
        is-custom
        placeholder="0"
        full-width
        :disabled="disabled"
        @input="inputUpdate"
      />

      <div
        v-if="tokenInfo.selectedToken"
        @click="selectTokenFunc(isInputToken)"
        @keypress="selectTokenFunc(isInputToken)"
        class="input-tokens__selected"
      >
        <img
          :src="tokenInfo.selectedToken.logoUrl"
          alt="select-token"
        >
        <span>
          {{tokenInfo.selectedToken.symbol}}
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
      <div>
        <div
          v-if="balancesLoading"
          class="lineLoader lineLoader--balance"
        />
        <div
          v-else-if="isInputToken && tokenInfo.selectedToken"
        >
          ~ ${{formatMoney(tokenInfo.usdValue, 2)}}
        </div>
        <div
          v-else-if="!isInputToken && tokenInfo.sum && tokenInfo.selectedToken"
        >
          ~ ${{formatMoney(tokenInfo.sum * tokenInfo.selectedToken.price, 2)}}
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
        <div
          v-if="balancesLoading"
          class="lineLoader lineLoader--balance"
        />
        <div v-else-if="tokenInfo.selectedToken && tokenInfo.selectedToken?.balanceData?.balance">
          <div class="lineLoader--balance-max">
            <p v-if="isInputToken">
              Max&nbsp;
            </p>
            <span>
              {{formatMoney(tokenInfo.selectedToken.balanceData.balance,
                            fixedByPrice(tokenInfo.selectedToken.price))}}
            </span>
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
    balancesLoading: {
      type: Boolean,
      required: false,
      default: false,
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
  },
  methods: {
    formatMoney,
    fixedByPrice,
    removeItemFunc(id: string) {
      this.$emit('remove-token', id);
    },
    selectTokenFunc(val: boolean) {
      this.$emit('select-token', val);
    },
    isNumber(evt: any) {
      evt = (evt) || window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;

      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else if (charCode === 46 && (!this.tokenInfo.value || this.tokenInfo.value.includes('.'))) {
        evt.preventDefault();
      } else {
        return true;
      }
      return true;
    },
    inputUpdate(value: any) {
      this.$emit('update-token', {
        ...this.tokenInfo,
        value,
      }, false);
    },
    maxUpdate() {
      this.$emit('update-token', {
        ...this.tokenInfo,
        value: this.tokenInfo.selectedToken?.balanceData?.balance,
      }, true);
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
.lineLoader--balance-max {
  display: flex;
  flex-direction: row;
  p {
    color: var(--color-3);
  }
}
</style>
