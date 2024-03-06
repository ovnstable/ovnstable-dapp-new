<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="input-tokens">
    <div class="input-tokens__row">
      <InputComponent
        customClass="input-tokens__field"
        is-custom
        placeholder="0"
        full-width
        :value="tokenVal"
        @input="inputUpdate"
      />
      <div class="input-tokens__selected">
        <BaseIcon
          :name="isMint ? 'InsuranceOVNVault' : 'InsuranceModalINS'"
        />
        <p>{{ isMint ? 'OVN' : 'OVN INS' }}</p>
      </div>
    </div>
    <div class="input-tokens__balance-info">
      <div>
        ~ ${{ formatMoney(0, 2) }}
      </div>
      <div>
        Balance: {{ tokenBalance }}
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import InputComponent from '@/components/Input/Index.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import BigNumber from 'bignumber.js';

export default {
  name: 'InputTokenInsurance',
  components: {
    BaseIcon,
    InputComponent,
  },
  props: {
    isMint: {
      type: Boolean,
      required: true,
    },
    tokenVal: {
      type: String,
      required: false,
      default: '',
    },
    originalBalance: {
      type: Array,
      default: (() => []),
      required: true,
    },
  },
  computed: {
    tokenBalance() {
      const symbol = this.isMint ? 'OVN' : 'OVNINS';
      const token: any = this.originalBalance
        .find((_: any) => _?.symbol === symbol);
      return token ? new BigNumber(token.balance).div(10 ** 18).toFixed(4) : '0';
    },
  },
  methods: {
    formatMoney,
    fixedByPrice,
    inputUpdate(value: string) {
      this.$emit('input-change', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-tokens {
  position: relative;
  background-color: var(--color-5);
  border-radius: 10px;
  padding: 14px 10px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }
}

.input-tokens__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-tokens__selected {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-4);
  color: var(--color-2);
  font-size: 15px;
  border-radius: 30px;
  padding: 4px 10px;
  white-space: nowrap;
  svg {
    margin-right: 10px;
  }
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.input-tokens__balance-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--color-2);
  font-size: 14px;
  [data-theme="dark"] & {
    color: var(--color-18);
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
</style>
