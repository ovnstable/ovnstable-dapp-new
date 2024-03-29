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
      <p v-if="deviceSize.isMobile">You send</p>
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
      <p v-if="deviceSize.isMobile">You receive</p>
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
        <span>0.04%</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h1>You {{ swapMsg }}</h1>
        <span>${{ estimateResult }}</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h2>{{ inputToken?.symbol ? `1 ${inputToken.symbol} = 1 ${outputToken.symbol}` : 'Exchange rates'}}</h2>
      </div>
    </div>

    <GasSettings
      @gas-change="gasChange"
    />

    <div class="mintredeem-form__btns">
      <ButtonComponent
        v-if="!account"
        @on-click="connectWallet"
        btn-size="large"
        full
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
        @on-click="approveTrigger"
        btn-size="large"
        full
        :loading="approveLoading"
      >
        APPROVE REQUIRED
      </ButtonComponent>
      <ButtonComponent
        v-else
        @on-click="swapTokens"
        btn-size="large"
        full
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { deviceType } from '@/utils/deviceType.ts';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';
import { buildEvmContract, buildEvmContractForChain } from '@/utils/contractsMap.ts';
import { MINTREDEEM_SCHEME } from '@/store/views/main/mintRedeem/mocks.ts';
import debounce from 'lodash/debounce';
import StepsRow, { mintRedeemStep } from '@/components/StepsRow/Index.vue';

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
import { ABI_Exchange, ABI_Market, ERC20_ABI } from '@/assets/abi/index.ts';
import { getAllowanceValue, approveToken } from '@/utils/contractApprove.ts';

export default {
  name: 'MintRedeem',
  components: {
    SwitchTabs,
    StepsRow,
    TokenForm,
    GasSettings,
    ButtonComponent,
  },
  data() {
    return {
      mintRedeemStep,
      inputToken: getNewInputToken(),
      outputToken: getNewInputToken(),
      activeMintTab: mintWrapStatus.MINT as mintWrapStatus | -1,
      activeWrapTab: -1,
      allTokensList: [],
      isAllDataLoaded: false,
      approveLoading: false,
      isApprovedToken: false,
      isLoading: false,
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
  watch: {
    inputToken() {
      this.checkApprove(this);
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
    networkId() {
      this.initMintRedeem();
    },
  },
  mounted() {
    this.initMintRedeem();
  },
  computed: {
    ...mapGetters('network', ['networkId', 'networkName']),
    ...mapGetters('accountData', ['account', 'originalBalance']),
    ...mapGetters('web3', ['contracts', 'evmProvider', 'evmSigner']),
    ...mapState('odosData', ['tokensContractMap']),

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
      if (!this.inputToken.symbol || !this.inputToken.value) return '0.00';
      return new BigNumber(this.inputToken.value).times(0.9996).toFixed(6);
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

  },
  methods: {
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('mintRedeem', ['initTokens']),
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('accountData', ['refreshBalance']),
    ...mapActions('accTransaction', ['putTransaction', 'loadTransaction']),
    ...mapActions('errorModal', ['showErrorModal', 'showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),
    ...mapActions('odosData', ['loadChains', 'loadTokens']),
    gasChange() {
      console.log('gasChange');
    },
    initForm() {
      this.inputToken = getNewInputToken();
      this.outputToken = getNewInputToken();
    },
    async initMintRedeem() {
      this.isLoading = true;
      await this.loadChains();
      await this.loadTokens();

      this.initForm();
      this.initTokens();
      this.isLoading = false;
    },
    async approveTrigger() {
      this.showWaitingModal('Approving in process');
      this.currentStage = mintRedeemStep.APPROVE;

      const tokenData = this.inputToken;
      let tokenContract = this.tokensContractMap[tokenData.address];
      const approveValue = new BigNumber(10 ** this.inputToken.decimals)
        .times(1000000)
        .toFixed(0);

      if (!tokenContract) {
        tokenContract = buildEvmContractForChain(
          ERC20_ABI,
          this.evmSigner,
          tokenData.address,
        );
      }

      const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
      const pairData = MINTREDEEM_SCHEME[networkId]
        .find((_) => {
          const tokenAddress = this.isReverseArray
            ? _.token1.toLowerCase() : _.token0.toLowerCase();
          return tokenAddress === this.outputToken.address.toLowerCase();
        });
      let exchangeAddress = null;

      if (pairData) exchangeAddress = pairData.exchange;
      if (!exchangeAddress) return;

      console.log(tokenContract, '---tokenContract');
      const tx = await approveToken(
        tokenContract,
        exchangeAddress,
        approveValue,
        this.account,
      )
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
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
          return tokenAddress === self.outputToken.address.toLowerCase();
        });

      const tokenСontract = Object.values(self.contracts)
        .find((cData: any) => (
          cData ? cData.target.toLowerCase() === self.inputToken.address.toLowerCase() : false
        ));

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
        const balData = this.originalBalance.find((_: any) => _.symbol === token.symbol);
        this.inputToken = {
          ...token,
          value: new BigNumber(balData.balance).div(10 ** token.decimals).toFixed(4),
          originalVal: balData.balance,
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

    async estimateGas(
      account: any,
      sum: any,
      productName: any,
      exchangeContract: any,
      exchangeMethodName: any,
      actionContract: any,
    ) {
      const from = account;
      let blockNum = 0;
      let result = 0;

      try {
        const estimateOptions = { from };
        blockNum = await this.evmProvider.getBlockNumber();

        const methodData = this.getContractMethodWithParams(
          account,
          sum,
          exchangeMethodName,
          actionContract,
        );

        if (!methodData) {
          const errorMessage = `Exchange Method type not found when create method params in estimate gas. MethodType: ${
            exchangeMethodName}`;
          this.showErrorModalWithMsg({
            errorType: 'approve',
            errorMsg: { code: 1, message: errorMessage },
          });
          this.closeWaitingModal();
          return;
        }

        // if (this.networkName === 'zksync') {
        //   await this.addedZkSyncGasHistoryData(method, estimateOptions);
        // }

        if (methodData.iterateArgs) {
          result = await exchangeContract[methodData.name]
            .estimateGas(...Object.values(methodData.params), estimateOptions);
        } else {
          result = await exchangeContract[methodData.name]
            .estimateGas(methodData.params, estimateOptions);
        }
      } catch (error: any) {
        this.showErrorModalWithMsg({ errorType: 'estimateGas', errorMsg: error });
        if (error && error.message) {
          const msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

          const errorMsg = {
            product: productName,
            data: {
              from,
              to: actionContract.target,
              gas: null,
              contract: 'ENCODEDABI',
              message: msg,
              block: blockNum,
            },
          };

          console.error(errorMsg);
        } else {
          console.error(error);
        }

        return -1;
      }

      return result;
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

        const actionContract = Object.values(this.contracts)
          .find((cData: any) => {
            const tokenAddress = this.isReverseArray
              ? this.inputToken.address : this.outputToken.address;
            return cData ? cData.target.toLowerCase() === tokenAddress.toLowerCase() : false;
          });

        // if mint active, using 1st method, else 2nd
        const exchangeMethodName = this.isReverseArray
          ? pairData?.methodName[0] : pairData?.methodName[1];

        const swapSum = new BigNumber(this.inputToken.value)
          .times(10 ** this.inputToken.decimals)
          .toFixed(0);

        const mainValue = new BigNumber(this.inputToken.originalVal).gt(0)
          ? this.inputToken.originalVal : swapSum;

        const estimatedGasValue = await this.estimateGas(
          this.account,
          mainValue,
          'test-product',
          exchangeContract,
          exchangeMethodName,
          actionContract,
        );

        if (!estimatedGasValue) return;

        const gasValue = new BigNumber(estimatedGasValue)
          .multipliedBy(1.1)
          .integerValue(BigNumber.ROUND_DOWN);

        const buyParams = {
          from: this.account,
          gas: gasValue,
        };

        const method = this.getContractMethodWithParams(
          this.account,
          mainValue,
          exchangeMethodName,
          actionContract,
        );

        if (!method) return;

        console.log(exchangeContract, 'exchangeContract1trigger');
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
          const tx = {
            hash: txData.hash,
            amount: this.inputToken.value,
          };

          this.showSuccessModal({
            successTxHash: txData.hash,
            from: [this.inputToken],
            to: [this.outputToken],
          });

          this.putTransaction(tx);
          this.closeWaitingModal();
          this.initMintRedeem();
        }

        this.refreshBalance();
      } catch (e) {
        console.log(e, '-e');
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
      }
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
