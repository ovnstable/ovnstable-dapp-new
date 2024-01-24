<template>
  <div class="mintredeem-form">
    <div class="mintredeem-form__row">
      <SwitchTabs
        :tabs="mintTabs"
        @tab-change="changeMintTab"
      />
      <h1>You mint</h1>
      <SwitchTabs
        :tabs="wrapTabs"
        @tab-change="changeWrapTab"
      />
    </div>
    <div class="mintredeem-form__inputs">
      <TokenForm
        :token-info="inputToken"
        :is-token-removable="true"
        :is-input-token="true"
        :active-mint="isMintActive"
        @add-token="selectFormToken"
        @update-token="updateTokenValueMethod"
      />
      <TokenForm
        :token-info="outputToken"
        :is-token-removable="true"
        :is-input-token="false"
        :active-mint="isMintActive"
        @add-token="selectFormToken"
        @update-token="updateTokenValueMethod"
      />
    </div>

    <div class="mintredeem-form__row mintredeem-form__row--fees">
      <div class="mintredeem-form__row-item">
        <h1>Overnight Fee:</h1>
        <span>0.04%</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h1>You mint</h1>
        <span>$0</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h2>Exchange rates</h2>
      </div>
    </div>

    <GasSettings
      @gas-change="gasChange"
    />

    <div class="mintredeem-form__btns">
      <ButtonComponent
        v-if="!account"
        @click="connectWallet"
        btn-size="large"
        full
      >
        CONNECT WALLET
      </ButtonComponent>
      <ButtonComponent
        v-else
        @click="swapTokens"
        btn-size="large"
        full
      >
        {{isMintActive ? "MINT" : "REDEEM"}}
      </ButtonComponent>
    </div>
  </div>

</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';

import { mintStatus, wrapStatus } from '@/modules/Main/components/MintRedeem/types/index.ts';
import {
  getNewInputToken,
} from '@/store/helpers/index.ts';
import GasSettings from '@/modules/Main/components/MintRedeem/GasSettings.vue';

export default {
  name: 'MintRedeem',
  components: {
    SwitchTabs,
    TokenForm,
    GasSettings,
    ButtonComponent,
  },
  data() {
    return {
      inputToken: getNewInputToken(),
      outputToken: getNewInputToken(),
      activeMintTab: 0,
      activeWrapTab: 0,
      allTokensList: [],
      isAllDataLoaded: false,

      mintTabs: [
        {
          id: mintStatus.MINT,
          name: 'MINT',
        },
        {
          id: mintStatus.REDEEM,
          name: 'REDEEM',
        },
      ],
      wrapTabs: [
        {
          id: wrapStatus.WRAP,
          name: 'WRAP',
        },
        {
          id: wrapStatus.UNWRAP,
          name: 'UNWRAP',
        },
      ],
    };
  },
  mounted() {
    console.log('initTokens');
    this.initTokens();
  },
  computed: {
    ...mapGetters('accountData', ['account']),

    isMintActive() {
      return this.activeMintTab === 0;
    },
  },
  methods: {
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('mintRedeem', ['initTokens']),
    gasChange() {

    },
    selectFormToken(data: any, isInputToken: boolean) {
      console.log(data, isInputToken, 'selectFormToken');
      if (isInputToken) {
        this.inputToken = data;
        return;
      }

      this.outputToken = data;
    },
    updateTokenValueMethod(token: any) {
      this.inputToken = token;
    },
    changeWrapTab(id: number) {
      this.activeWrapTab = id;
    },
    changeMintTab(id: number) {
      this.activeMintTab = id;
    },
    swapTokens() {
      console.log('swapTokens');
    },
  },
};
</script>

<style lang="scss" scoped>
.mintredeem-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.mintredeem-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1, span {
    font-weight: 500;
    font-size: 14px;
    color: var(--color-1);
  }

  h2 {
    font-weight: 500;
    font-size: 14px;
    color: var(--color-2);
  }
}

.mintredeem-form__row--fees {
  margin-bottom: 0;
}

.mintredeem-form__inputs {
  margin-bottom: auto;
}

.mintredeem-form__btns {
  margin-top: auto;
}

.mintredeem-form__row-item {
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;

  &:first-child {
    justify-content: flex-start;
  }

  &:last-child {
    justify-content: flex-end;
  }
}
</style>
