<template>
  <div
    v-if="deviceSize.isMobile"
    class="mintredeem-form__row-switches"
  >
    <SwitchTabs
      :tabs="mintTabs"
      :active-tab="activeMintTab"
      @tab-change="changeMintTab"
    />
    <SwitchTabs
      :tabs="wrapTabs"
      :active-tab="activeWrapTab"
      @tab-change="changeWrapTab"
    />
  </div>
  <div class="mintredeem-form">
    <div
      v-if="deviceSize.isMobile"
      class="mintredeem-form-steps"
    >
      <StepsRow :current-stage="currentStage" />
    </div>

    <div
      v-if="!deviceSize.isMobile"
      class="mintredeem-form__row"
    >
      <SwitchTabs
        :tabs="mintTabs"
        :active-tab="activeMintTab"
        @tab-change="changeMintTab"
      />
      <h1>You {{ swapMsg }}</h1>
      <SwitchTabs
        :tabs="wrapTabs"
        :active-tab="activeWrapTab"
        @tab-change="changeWrapTab"
      />
    </div>
    <div class="mintredeem-form__inputs">
      <p v-if="deviceSize.isMobile">
        You send
      </p>
      <TokenForm
        :token-info="inputToken"
        :is-token-removable="true"
        :is-input-token="true"
        :reverse-array="isReverseArray"
        :active-wrap="mintWrapTab"
        :is-loading="isLoading"
        @add-token="selectFormToken"
        @update-token="updateTokenValueMethod"
      />
      <p v-if="deviceSize.isMobile">
        You receive
      </p>
      <TokenForm
        :token-info="outputToken"
        :is-token-removable="true"
        :is-input-token="false"
        :reverse-array="isReverseArray"
        :active-wrap="mintWrapTab"
        :is-loading="isLoading"
        @add-token="selectFormToken"
      />
    </div>

    <div class="mintredeem-form__row mintredeem-form__row--fees">
      <div class="mintredeem-form__row-item">
        <h1>Overnight Fee:</h1>
        <span>{{ getFee }}%</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h1>You {{ swapMsg }}</h1>
        <span>${{ estimateResultDisplay }}</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h2>{{ inputToken?.symbol ? `${inputIndex} ${inputToken.symbol} = ${outputIndex} ${outputToken.symbol}` : 'Exchange rates' }}</h2>
      </div>
    </div>

    <GasSettings />

    <div class="mintredeem-form__btns">
      <ButtonComponent
        v-if="!account"
        btn-size="large"
        full
        @on-click="connectWallet"
      >
        CONNECT WALLET
      </ButtonComponent>
      <ButtonComponent
        v-else-if="!inputToken.symbol"
        btn-size="large"
        disabled
        full
      >
        SELECT TOKEN
      </ButtonComponent>
      <ButtonComponent
        v-else-if="!isApprovedToken"
        btn-size="large"
        full
        :loading="approveLoading"
        @on-click="approveTrigger"
      >
        APPROVE REQUIRED
      </ButtonComponent>
      <ButtonComponent
        v-else
        btn-size="large"
        full
        @on-click="swapTokens"
      >
        {{ swapMsg.toUpperCase() }}
      </ButtonComponent>
    </div>

    <div v-if="!deviceSize.isMobile">
      <StepsRow :current-stage="currentStage" />
    </div>
  </div>
</template>
<!-- eslint-disable camelcase -->
<!-- eslint-disable consistent-return -->
<!-- eslint-disable no-underscore-dangle -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { deviceType } from '@/utils/deviceType.ts';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';
import {
  buildERC20Contract, buildEvmContract, buildInsuranceContract, buildOvnContract,
} from '@/utils/contractsMap.ts';
import { MINTREDEEM_SCHEME } from '@/store/views/main/mintRedeem/mocks.ts';
import debounce from 'lodash/debounce';
import StepsRow, { mintRedeemStep } from '@/components/StepsRow/Index.vue';
import { DUPLICATED_TOKEN_CHAINS } from '@/utils/const.ts';

import {
  mintWrapStatus,
  mintRedeemTypes,
  type IMethodData,
} from '@/modules/Main/components/MintRedeem/types/index.ts';
import {
  getNewInputToken, getReferralCode,
} from '@/store/helpers/index.ts';
import GasSettings from '@/modules/Main/components/MintRedeem/GasSettings.vue';
import BigNumber from 'bignumber.js';
import { ABI_Exchange, ABI_Market } from '@/assets/abi/index.ts';
import { getAllowanceValue, approveToken } from '@/utils/contractApprove.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import { defineComponent } from 'vue';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { parseErrorLog } from '@/utils/errors.ts';

export default defineComponent({
  name: 'MintRedeem',
  components: {
    SwitchTabs,
    StepsRow,
    TokenForm,
    GasSettings,
    ButtonComponent,
  },
  setup: () => {
    const {
      data: allTokensList,
      isLoading,
    } = useTokensQuery();

    return {
      allTokensList,
      isLoading,
      refreshBalances: useRefreshBalances(),
    };
  },
  data() {
    return {
      inputToken: getNewInputToken(),
      outputToken: getNewInputToken(),
      activeMintTab: mintWrapStatus.MINT as mintWrapStatus | -1,
      activeWrapTab: -1,
      approveLoading: false,
      isApprovedToken: false,
      wrapVal: 1,
      updatingWrapUnwrapAmount: false,
      currentStage: mintRedeemStep.START,

      mintTabs: [
        {
          id: mintWrapStatus.MINT,
          name: 'MINT',
        },
        {
          id: mintWrapStatus.REDEEM,
          name: 'REDEEM',
        },
      ],
      wrapTabs: [
        {
          id: mintWrapStatus.WRAP,
          name: 'WRAP',
        },
        {
          id: mintWrapStatus.UNWRAP,
          name: 'UNWRAP',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('network', ['networkId', 'networkName']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('web3', ['evmSigner']),

    getFee() {
      return this.networkId === 8453 ? 0.01 : 0.04;
    },
    inputIndex() {
      return '1';
    },
    outputIndex() {
      if (this.activeWrapTab > 0) return this.wrapVal;
      return '1';
    },
    isMintActive() {
      return this.activeMintTab === mintWrapStatus.MINT;
    },
    deviceSize() {
      return deviceType();
    },
    isWrapActive() {
      return this.activeWrapTab === mintWrapStatus.WRAP;
    },

    estimateResult() {
      if ((!this.updatingWrapUnwrapAmount && this.activeWrapTab > 0)
        || !this.inputToken.symbol
        || !this.inputToken.value) return '0.00';
      return new BigNumber(this.inputToken.value).times(1 - this.getFee / 100).toFixed(6);
    },
    estimateResultDisplay() {
      if (!this.inputToken.symbol
        || !this.inputToken.value) return '0.00';
      return new BigNumber(this.inputToken.value).times(1 - this.getFee / 100).toFixed(6);
    },
    swapMsg() {
      if (this.activeMintTab === mintWrapStatus.MINT) return 'mint';
      if (this.activeMintTab === mintWrapStatus.REDEEM) return 'redeem';
      if (this.activeWrapTab === mintWrapStatus.WRAP) return 'wrap';
      if (this.activeWrapTab === mintWrapStatus.UNWRAP) return 'unwrap';

      return '';
    },

    isReverseArray() {
      return this.isMintActive || this.isWrapActive;
    },

    mintWrapTab() {
      return this.activeMintTab >= 0 ? this.activeMintTab : this.activeWrapTab;
    },
    // If looks unused, check again before removing
    // eslint-disable-next-line vue/no-unused-properties
    contracts() {
      return {
        insurance: buildInsuranceContract(this.evmSigner, this.networkName),
        ovn: buildOvnContract(this.evmSigner, this.networkName),

      };
    },
  },
  watch: {
    inputToken() {
      this.checkApprove(this);

      if (this.activeWrapTab > 0) this.previewUnwrap(this);
    },
    'inputToken.value': {
      async handler() {
        await this.previewUnwrap(this);
        this.updatingWrapUnwrapAmount = false;
      },
    },
    activeWrapTab() {
      if (this.inputToken?.symbol) {
        const input = this.inputToken;
        const output = this.outputToken;
        this.inputToken = output;
        this.outputToken = input;
        this.checkApprove(this);
      }
    },
    activeMintTab() {
      if (this.inputToken?.symbol) {
        const input = this.inputToken;
        const output = this.outputToken;
        this.inputToken = output;
        this.outputToken = input;
        this.checkApprove(this);
      }
    },
    allTokensList(tokenList: TTokenInfo[]) {
      const params = {
        tokenList,
        networkId: this.networkId,
      };
      if (tokenList.length > 0) {
        this.initTokenSchema(params);
        // this.initForm();
      }
    },
    networkId(val: number | string) {
      if (val) this.initForm();
    },
  },
  methods: {
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('mintRedeem', ['initTokenSchema']),
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('successModal', ['showSuccessModal']),
    initForm() {
      this.inputToken = getNewInputToken();
      this.outputToken = getNewInputToken();
    },
    async approveTrigger() {
      this.showWaitingModal('Approving in process');
      this.currentStage = mintRedeemStep.APPROVE;

      const tokenData = this.inputToken;
      const tokenContract = TokenService
        .loadTokenContract(tokenData.address, this.$store.state.web3.evmSigner);
      const approveValue = new BigNumber(10)
        .pow(this.inputToken.decimals)
        .times(10 ** 18)
        .toFixed(0);

      const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
      const pairData = MINTREDEEM_SCHEME[networkId]
        .find((_) => {
          const tokenAddress = this.isReverseArray
            ? _.token1.toLowerCase() : _.token0.toLowerCase();

          // some chains have duplicates of tokens in input, some in output
          if (DUPLICATED_TOKEN_CHAINS.includes(networkId) && !this.isReverseArray) {
            return _.token1.toLowerCase() === this.inputToken.address.toLowerCase();
          }

          return tokenAddress === this.outputToken.address.toLowerCase();
        });
      let exchangeAddress = null;

      if (pairData) exchangeAddress = pairData.exchange;
      if (!exchangeAddress) return;

      const tx = await approveToken(
        tokenContract,
        exchangeAddress,
        approveValue,
        this.account,
      )
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: parseErrorLog(e) });
        });

      const finishTx = () => {
        this.checkApprove(this);
        this.closeWaitingModal();
        this.currentStage = mintRedeemStep.CONFIRMATION;
      };

      if (!tx) {
        finishTx();
        return;
      }

      await tx.wait();
      finishTx();
    },
    checkApprove: debounce(async (self: any) => {
      if (!self.inputToken.address) return;
      self.approveLoading = true;

      const networkId = self.networkId as keyof typeof MINTREDEEM_SCHEME;
      const exchangeContract = MINTREDEEM_SCHEME[networkId]
        .find((_) => {
          const tokenAddress = self.isReverseArray
            ? _.token1.toLowerCase() : _.token0.toLowerCase();

          // some chains have duplicates of tokens in input, some in output
          if (DUPLICATED_TOKEN_CHAINS.includes(networkId) && !self.isReverseArray) {
            return _.token1.toLowerCase() === self.inputToken.address.toLowerCase();
          }

          return tokenAddress === self.outputToken.address.toLowerCase();
        });

      const tokenСontract = buildERC20Contract(
        self.evmSigner,
        self.inputToken.address.toLowerCase(),
      );

      if (!exchangeContract || !tokenСontract) return;

      const allowanceValue = await getAllowanceValue(
        tokenСontract,
        self.account,
        exchangeContract?.exchange,
      );

      const inputValue = self.inputToken.value
        ? BigNumber(self.inputToken.value)
          .times(10 ** self.inputToken.decimals)
        : BigNumber(0);

      const isAllowedToSwap = inputValue.isLessThanOrEqualTo(allowanceValue);

      self.approveLoading = false;
      self.isApprovedToken = isAllowedToSwap;
      if (isAllowedToSwap) self.currentStage = mintRedeemStep.CONFIRMATION;
      if (!isAllowedToSwap) self.currentStage = mintRedeemStep.APPROVE;
    }, 250),
    selectFormToken(data: any, isInputToken: boolean) {
      if (isInputToken) {
        this.inputToken = data;
        return;
      }

      this.outputToken = data;
    },
    updateTokenValueMethod(token: any, isInputToken: boolean, isMaxBal: boolean) {
      if (isInputToken && !isMaxBal) this.inputToken = { ...token, originalVal: 0 };
      if (isInputToken && isMaxBal) {
        this.inputToken = {
          ...token,
          value: token.balanceData.balance,
          originalVal: token.balanceData.originalBalance,
        };
      }

      this.outputToken = {
        ...this.outputToken,
        value: this.estimateResult,
      };
    },
    changeWrapTab(id: number) {
      if (this.activeMintTab >= 0) this.initForm();
      this.activeWrapTab = id;
      this.activeMintTab = -1;
    },
    changeMintTab(id: number) {
      if (this.activeWrapTab >= 0) this.initForm();

      this.activeMintTab = id;
      this.activeWrapTab = -1;
    },

    getContractMethodWithParams(
      account: any,
      contractSum: any,
      exchangeMethodName: any,
      actionContract: any,
    ): IMethodData | null {
      let methodParam;

      const referral = getReferralCode() || '0xEd446C56F89e84b3dC9ACec060154eC6BC6bB299';

      if (exchangeMethodName === 'mint') {
        methodParam = {
          asset: actionContract.target,
          amount: contractSum,
          referral,
        };

        return {
          name: exchangeMethodName,
          params: methodParam,
          iterateArgs: false,
        };
      }

      if (exchangeMethodName === 'buy') {
        methodParam = {
          sum: contractSum,
          referral,
        };

        return {
          name: exchangeMethodName,
          params: { ...Object.values(methodParam) },
          iterateArgs: true,
        };
      }

      if (exchangeMethodName === 'wrap') {
        methodParam = {
          asset: actionContract.target,
          sum: contractSum,
          account,
        };

        return {
          name: exchangeMethodName,
          params: { ...Object.values(methodParam) },
          iterateArgs: true,
        };
      }

      if (exchangeMethodName === 'unwrap') {
        methodParam = {
          asset: actionContract.target,
          sum: contractSum,
          account,
        };

        return {
          name: exchangeMethodName,
          params: { ...Object.values(methodParam) },
          iterateArgs: true,
        };
      }

      if (exchangeMethodName === 'redeem') {
        methodParam = {
          asset: actionContract.target,
          sum: contractSum,
        };

        return {
          name: exchangeMethodName,
          params: { ...Object.values(methodParam) },
          iterateArgs: true,
        };
      }

      return null;
    },
    async swapTokens() {
      try {
        await this.refreshGasPrice();
        this.showWaitingModal('swaping in process');
        const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;

        const pairData = MINTREDEEM_SCHEME[networkId]
          .find((_) => {
            const tokenAddress = this.isReverseArray
              ? _.token1.toLowerCase() : _.token0.toLowerCase();

            // some chains have duplicates of tokens in input, some in output
            if (DUPLICATED_TOKEN_CHAINS.includes(networkId) && !this.isReverseArray) {
              return _.token1.toLowerCase() === this.inputToken.address.toLowerCase();
            }
            return tokenAddress === this.outputToken.address.toLowerCase();
          });

        let exchangeContract = null;

        if (pairData) {
          // abi for wrap/unwrap is different
          exchangeContract = buildEvmContract(
            pairData?.methodName[0] === mintRedeemTypes.WRAP ? ABI_Market : ABI_Exchange,
            this.evmSigner,
            pairData.exchange,
          );
        }

        if (!exchangeContract) return;

        const tokenAddress = this.isReverseArray
          ? this.inputToken.address
          : this.outputToken.address;

        const actionContract = buildERC20Contract(this.evmSigner, tokenAddress.toLowerCase());

        // if mint active, using 1st method, else 2nd
        const exchangeMethodName = this.isReverseArray
          ? pairData?.methodName[0] : pairData?.methodName[1];
        const swapSum = new BigNumber(this.inputToken.value)
          .times(10 ** this.inputToken.decimals)
          .toFixed(0);
        const mainValue = new BigNumber(this.inputToken.originalVal).gt(0)
          ? this.inputToken.originalVal : swapSum;

        const buyParams = {
          from: this.account,
          // gasPrice: ethers.parseUnits('100', 'gwei'),
          // gasLimit: 1000000,
        };

        const method = this.getContractMethodWithParams(
          this.account,
          mainValue,
          exchangeMethodName,
          actionContract,
        );

        if (!method) return;

        console.log(method, '__METH');
        console.log(exchangeContract, '__METH2');
        const txData = method.iterateArgs
          ? await exchangeContract[method.name](
            ...Object.values(method.params),
            { ...buyParams },
          )
          : await exchangeContract[method.name](
            method.params,
            { ...buyParams },
          );

        if (txData) {
          await txData.wait();

          this.showSuccessModal({
            successTxHash: txData.hash,
            from: [this.inputToken],
            to: [this.outputToken],
            type: this.swapMsg.toUpperCase(),
          });
          this.closeWaitingModal();
        }

        console.log('__mintRedeemRefresh');
        this.initForm();
        this.refreshBalances();
      } catch (e) {
        console.log(e, '-e');
        this.closeWaitingModal();
        // this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
      }
    },
    async previewUnwrap(self: any) {
      if (self.activeWrapTab > 0) {
        const networkId = self.networkId as keyof typeof MINTREDEEM_SCHEME;
        const pairData = MINTREDEEM_SCHEME[networkId]
          .find((_) => {
            const tokenAddress = self.isReverseArray
              ? _.token1.toLowerCase() : _.token0.toLowerCase();
            return tokenAddress === self.outputToken?.address?.toLowerCase();
          });
        let exchangeAddress = null;
        if (pairData) exchangeAddress = pairData.exchange;
        if (!exchangeAddress || pairData === undefined) return;
        const exchangeContract = buildEvmContract(
          ABI_Market,
          self.evmSigner,
          exchangeAddress,
        );
        const exchangeMethodName = self.isReverseArray
          ? pairData?.methodName[0] : pairData?.methodName[1];
        const methodName = exchangeMethodName === 'wrap' ? 'previewWrap' : 'previewUnwrap';

        const wrapSumPerUsd = new BigNumber(1)
          .times(10 ** 2)
          .toFixed(0);
        const rawValuePerUsd = await exchangeContract[methodName](pairData.token0, wrapSumPerUsd);

        self.wrapVal = new BigNumber(rawValuePerUsd).div(100).toFixed(2);

        if (!self.inputToken?.value) return;

        const wrapSum = new BigNumber(self.inputToken.value)
          .times(10 ** self.inputToken.decimals)
          .toFixed(0);
        const rawValue = await exchangeContract[methodName](pairData.token0, wrapSum);

        const adjustedValue = self.adjustScale(rawValue, self.inputToken.decimals);
        self.outputToken.value = adjustedValue;
        self.updatingWrapUnwrapAmount = true;
      }
      self.updatingWrapUnwrapAmount = true;
    },
    // If seems unused - double check, uses self
    // eslint-disable-next-line vue/no-unused-properties
    adjustScale(rawValue: any, decimals = 6) {
      let valueStr = rawValue.toString();
      while (valueStr.length <= decimals) {
        valueStr = `0${valueStr}`;
      }
      const index = valueStr.length - decimals;
      return `${valueStr.slice(0, index)}.${valueStr.slice(index)}`;
    },
  },
});
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
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  h2 {
    font-weight: 500;
    font-size: 14px;
    color: var(--color-2);
    [data-theme="dark"] & {
      color: var(--color-18);
    }
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
  margin-bottom: 20px;
  button {
    [data-theme="dark"] & {
      box-shadow: none;
      border: none;
      background-color: var(--color-7);
      color: var(--color-18);
    }
  }
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

.mintredeem-form__modal-stages {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--color-7);
  margin-top: 20px;

  [data-theme="dark"] & {
    color: var(--color-2);
  }

  .active-stage {
    text-decoration: underline;
    color: var(--color-1);
  }
}
@media (max-width: 640px) {
  .mintredeem-form-steps {
    margin-top: 18px;
    margin-bottom: 30px;
  }
  .mintredeem-form__inputs p,
  .gas-block {
    margin-bottom: 24px;
  }
  .mintredeem-form__row-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between !important;
  }
  .mintredeem-form__row {
    gap: 5px;
    flex-direction: column;
  }
  .mintredeem-form__row-switches {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

</style>
