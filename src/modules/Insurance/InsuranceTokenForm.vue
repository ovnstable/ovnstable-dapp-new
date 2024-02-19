<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="input-tokens">
    <div class="input-tokens__row">
      <InputComponent
        customClass="input-tokens__field"
        :value="token.value"
        is-custom
        placeholder="0"
        full-width
        :disabled="disabled"
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
        Balance: 0
      </div>
    </div>
  </div>
</template>


<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { defineComponent } from 'vue';
import InputComponent from '@/components/Input/Index.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default defineComponent({
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
});
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
    margin: 0; // Remove margin to ensure alignment
    font-size: 14px;
    font-weight: 500;
  }
}

.input-tokens__balance-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px; // Add some space between the input and balance info
  color: var(--color-2);
  font-size: 14px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
</style>

