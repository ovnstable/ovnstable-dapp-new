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
      />
    </div>

    <div class="mintredeem-form__row mintredeem-form__row--fees">
      <div class="mintredeem-form__row-item">
        <h1>Overnight Fee:</h1>
        <span>0.04%</span>
      </div>
      <div class="mintredeem-form__row-item">
        <h1>You mint</h1>
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
        Choose token
      </ButtonComponent>
      <ButtonComponent
        v-else-if="!isApprovedToken"
        @on-click="approveTrigger"
        btn-size="large"
        full
      >
        Approve Required
      </ButtonComponent>
      <ButtonComponent
        v-else
        @on-click="swapTokens"
        btn-size="large"
        full
      >
        {{isMintActive ? "MINT" : "REDEEM"}}
      </ButtonComponent>
    </div>
  </div>

</template>
<!-- eslint-disable camelcase -->
<!-- eslint-disable consistent-return -->
<!-- eslint-disable no-underscore-dangle -->
<script lang="ts">
import { mapActions, mapGetters, mapState } from 'vuex';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';
import { getAllowanceValue, approveToken } from '@/utils/contract-approve.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { MINTREDEEM_SCHEME } from '@/store/mintRedeem/mocks.ts';
import debounce from 'lodash/debounce';
import { fixedByPrice } from '@/utils/numbers.ts';

import {
  mintStatus, wrapStatus, mintRedeemTypes, type IMethodData,
} from '@/modules/Main/components/MintRedeem/types/index.ts';
import {
  getNewInputToken, getReferralCode,
} from '@/store/helpers/index.ts';
import GasSettings from '@/modules/Main/components/MintRedeem/GasSettings.vue';
import BigNumber from 'bignumber.js';
import { ABI_Exchange, ABI_Market } from '@/assets/abi/index.ts';

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
      inputToken: getNewInputToken() as any,
      outputToken: getNewInputToken(),
      activeMintTab: 0,
      activeWrapTab: 0,
      allTokensList: [],
      isAllDataLoaded: false,
      isApprovedToken: false,

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
  watch: {
    inputToken() {
      this.checkApprove(this);
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
      this.initTokens();
    },
  },
  mounted() {
    this.initTokens();
  },
  computed: {
    ...mapGetters('network', ['networkId', 'networkName']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('web3', ['contracts', 'evmProvider', 'evmSigner']),
    ...mapGetters('gasPrice', ['gasPriceGwei']),
    ...mapState('odosData', ['tokensContractMap']),

    isMintActive() {
      return this.activeMintTab === 0;
    },

    estimateResult() {
      if (!this.inputToken.symbol || !this.inputToken.value) return '0.00';
      return new BigNumber(this.inputToken.value)
        .times(0.9996).toFixed(fixedByPrice(this.inputToken.value));
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
    gasChange() {
      console.log('gasChange');
    },
    // checkForApprove(token: any, val: string) {

    // },
    async approveTrigger() {
      this.showWaitingModal('Approving in process');

      const tokenData = this.inputToken;
      const tokenContract = this.tokensContractMap[tokenData.address];
      const approveValue = '10000000000000';

      const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
      const pairData = MINTREDEEM_SCHEME[networkId]
        .find((_) => {
          const tokenAddress = this.isMintActive
            ? _.token0.toLowerCase() : _.token1.toLowerCase();
          return tokenAddress === this.inputToken.address.toLowerCase();
        });
      let exchangeAddress = null;

      if (pairData) exchangeAddress = pairData.exchange;
      if (!exchangeAddress) return;

      const transaction = await approveToken(
        tokenContract,
        exchangeAddress,
        approveValue,
        this.account,
        this.gasPriceGwei,
      )
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
        });

      if (transaction) {
        transaction.wait();
        this.closeWaitingModal();
        this.checkApprove(this);
      }
    },
    checkApprove: debounce(async (self: any) => {
      const networkId = self.networkId as keyof typeof MINTREDEEM_SCHEME;
      const exchangeContract = MINTREDEEM_SCHEME[networkId]
        .find((_) => _.token0.toLowerCase() === self.inputToken.address.toLowerCase());
      const tokenAddress = Object.values(self.contracts)
        .find((cData: any) => (
          cData ? cData.target.toLowerCase() === self.inputToken.address.toLowerCase() : false
        ));

      if (!exchangeContract || !tokenAddress) return;

      const allowanceValue = await getAllowanceValue(
        tokenAddress,
        self.account,
        exchangeContract?.exchange,
      );

      const inputValue = self.inputToken.value
        ? BigNumber(self.inputToken.value)
          .times(10 ** self.inputToken.decimals)
        : BigNumber(0);

      const isAllowedToSwap = inputValue.isLessThanOrEqualTo(allowanceValue);

      // eslint-disable-next-line no-param-reassign
      self.isApprovedToken = isAllowedToSwap;
    }, 250),
    selectFormToken(data: any, isInputToken: boolean) {
      if (isInputToken) {
        this.inputToken = data;
        return;
      }

      this.outputToken = data;
    },
    updateTokenValueMethod(token: any, isInputToken: boolean) {
      if (isInputToken) this.inputToken = token;
      this.outputToken = {
        ...this.outputToken,
        value: this.estimateResult,
      };
    },
    changeWrapTab(id: number) {
      this.activeWrapTab = id;
    },
    changeMintTab(id: number) {
      this.activeMintTab = id;
    },

    getContractMethodWithParams(
      action: any,
      account: any,
      contractSum: any,
      exchangeMethodName: any,
      actionContract: any,
    ): IMethodData | null {
      let methodParam;

      const referral = getReferralCode() || '0x4473D652fb0b40b36d549545e5fF6A363c9cd686';

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

      console.log(exchangeMethodName, 'TESSSSTTT____1');
      if (exchangeMethodName === 'redeem') {
        if (action === 'market-redeem') {
          methodParam = {
            sum: contractSum,
          };
        } else if (
          action === 'non-market-redeem'
          // || action === 'dai-swap-redeem'
          // || action === 'usdt-swap-redeem'
          // || action === 'usdc-swap-redeem'
          // || action === 'eth-swap-redeem'
        ) {
          console.log('TESSSSTTT____');
          methodParam = {
            asset: actionContract.target,
            sum: contractSum,
          };
        } else {
          console.error(
            `Exchange Method redeem error. Action not found when create method params in estimate gas. action: ${
              action}`,
          );
          return null;
        }

        return {
          name: exchangeMethodName,
          params: { ...Object.values(methodParam) },
          iterateArgs: true,
        };
      }

      return null;
    },

    async estimateGas(
      action: any,
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
        const estimateOptions = { from, gasPrice: this.gasPriceGwei };
        blockNum = await this.evmProvider.getBlockNumber();

        const methodData = this.getContractMethodWithParams(
          action,
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

        console.log(estimateOptions, 'estimateOptions');
        console.log(methodData, 'method');

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

      console.log(result, 'result');
      return result;
    },
    async swapTokens() {
      try {
        await this.refreshGasPrice();
        this.showWaitingModal('swaping in process');
        const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
        const pairData = MINTREDEEM_SCHEME[networkId]
          .find((_) => {
            const tokenAddress = this.isMintActive
              ? _.token0.toLowerCase() : _.token1.toLowerCase();
            return tokenAddress === this.inputToken.address.toLowerCase();
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
            const tokenAddress = this.isMintActive
              ? this.inputToken.address : this.outputToken.address;
            return cData ? cData.target.toLowerCase() === tokenAddress.toLowerCase() : false;
          });

        const action = 'non-market-redeem';
        // if mint active, using 1st method, else 2nd
        const exchangeMethodName = this.activeMintTab === 0
          ? pairData?.methodName[0] : pairData?.methodName[1];

        const swapSum = BigNumber(this.inputToken.value)
          .times(10 ** this.inputToken.decimals).toString();

        console.log(
          action,
          this.account,
          swapSum,
          'test-product',
          exchangeContract,
          exchangeMethodName,
          actionContract,
          '---params',
        );
        const estimatedGasValue = await this.estimateGas(
          action,
          this.account,
          swapSum,
          'test-product',
          exchangeContract,
          exchangeMethodName,
          actionContract,
        );
        console.log(estimatedGasValue, '-estimatedGasValue');
        if (!estimatedGasValue) return;

        const gasValue = new BigNumber(estimatedGasValue)
          .multipliedBy(1.1)
          .integerValue(BigNumber.ROUND_DOWN);

        const buyParams = {
          from: this.account,
          gasPrice: this.gasPriceGwei,
          gas: gasValue,
        };

        const method = this.getContractMethodWithParams(
          action,
          this.account,
          swapSum,
          exchangeMethodName,
          actionContract,
        );

        if (!method) return;

        console.log(method, '---method');
        console.log(this.gasPriceGwei, '---send');
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

          this.putTransaction(tx);
          this.closeWaitingModal();
          this.showSuccessModal({
            successTxHash: txData.hash,
            from: [this.inputToken],
            to: [this.outputToken],
          });
        }

        console.log(txData, '---txData');
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
