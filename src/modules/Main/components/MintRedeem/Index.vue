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

import { mintStatus, wrapStatus, mintRedeemTypes } from '@/modules/Main/components/MintRedeem/types/index.ts';
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
    ...mapGetters('web3', ['contracts', 'evmProvider']),
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

      console.log(self.inputToken.address, '-self.self.inputToken.address');
      console.log(self.contracts, '-self.contracts');
      console.log(tokenAddress, '-self.tokenAddress');
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

    async getContractMethodWithParams(
      action: any,
      account: any,
      contractSum: any,
      exchangeContract: any,
      exchangeMethodName: any,
      actionContract: any,
    ) {
      let methodParam;

      let referral = getReferralCode();
      referral = referral || '';

      if (exchangeMethodName === 'mint') {
        methodParam = {
          asset: actionContract.options.address,
          amount: contractSum,
          referral,
        };

        return exchangeContract.methods[exchangeMethodName](methodParam);
      }

      if (exchangeMethodName === 'buy') {
        methodParam = {
          sum: contractSum,
          referral,
        };

        return exchangeContract.methods[exchangeMethodName](
          ...Object.values(methodParam),
        );
      }

      if (exchangeMethodName === 'wrap') {
        methodParam = {
          asset: actionContract.options.address,
          sum: contractSum,
          account,
        };

        return exchangeContract.methods[exchangeMethodName](
          ...Object.values(methodParam),
        );
      }

      if (exchangeMethodName === 'unwrap') {
        methodParam = {
          asset: actionContract.options.address,
          sum: contractSum,
          account,
        };

        return exchangeContract.methods[exchangeMethodName](
          ...Object.values(methodParam),
        );
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
            asset: actionContract.options.address,
            sum: contractSum,
          };
        } else {
          console.error(
            `Exchange Method redeem error. Action not found when create method params in estimate gas. action: ${
              action}`,
          );
          return null;
        }

        return exchangeContract.methods[exchangeMethodName](
          ...Object.values(methodParam),
        );
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
      let result = 0;

      try {
        const estimateOptions = { from, gasPrice: this.gasPriceGwei };
        const blockNum = await this.evmProvider.getBlockNumber();

        const method = await this.getContractMethodWithParams(
          action,
          account,
          sum,
          exchangeContract,
          exchangeMethodName,
          actionContract,
        );
        if (!method) {
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
        console.log(method, 'method');

        // if (this.networkName === 'zksync') {
        //   await this.addedZkSyncGasHistoryData(method, estimateOptions);
        // }

        result = await method
          .estimateGas(estimateOptions)
          .catch((error: any) => {
            if (error && error.message) {
              const msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

              const errorMsg = {
                product: productName,
                data: {
                  from,
                  to: actionContract.options.address,
                  gas: null,
                  gasPrice: parseInt(estimateOptions.gasPrice, 16),
                  method: method.encodeABI(),
                  message: msg,
                  block: blockNum,
                },
              };

              console.error(errorMsg);
            } else {
              console.error(error);
            }

            return -1;
          });
      } catch (e) {
        this.showErrorModalWithMsg({ errorType: 'estimateGas', errorMsg: e });
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
            this.evmProvider,
            pairData.exchange,
          );
        }

        const actionContract = Object.values(this.contracts)
          .find((cData: any) => {
            const tokenAddress = this.isMintActive
              ? this.inputToken.address : this.outputToken.address;
            return cData ? cData._address === tokenAddress : false;
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

        const method = await this.getContractMethodWithParams(
          action,
          this.account,
          swapSum,
          exchangeContract,
          exchangeMethodName,
          actionContract,
        );

        console.log(method, '---method');
        console.log(this.gasPriceGwei, '---send');
        await method
          .send(buyParams)
          .on('transactionHash', async (hash: string) => {
            const tx = {
              hash,
              amount: this.inputToken.value,
            };

            this.putTransaction(tx);
            this.closeWaitingModal();
            this.showSuccessModal({
              successTxHash: hash,
              from: [this.inputToken],
              to: [this.outputToken],
            });
          });

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
