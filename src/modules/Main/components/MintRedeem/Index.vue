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
        <span>${{ estimateResult }}</span>
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
        @on-click="approveToken"
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
import { mapActions, mapGetters } from 'vuex';
import SwitchTabs from '@/components/SwitchTabs/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import TokenForm from '@/modules/Main/components/MintRedeem/TokenForm.vue';
import { getAllowanceValue } from '@/utils/contract-approve.ts';
import { buildContract } from '@/utils/contractsMap.ts';
import { MINTREDEEM_SCHEME } from '@/store/mintRedeem/mocks.ts';
import debounce from 'lodash/debounce';

import { mintStatus, wrapStatus } from '@/modules/Main/components/MintRedeem/types/index.ts';
import {
  getNewInputToken, getReferralCode,
} from '@/store/helpers/index.ts';
import GasSettings from '@/modules/Main/components/MintRedeem/GasSettings.vue';
import BigNumber from 'bignumber.js';
import { ABI_Exchange } from '@/assets/abi/index.ts';

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
    ...mapGetters('web3', ['contracts', 'web3']),
    ...mapGetters('gasPrice', ['gasPriceGwei']),

    isMintActive() {
      return this.activeMintTab === 0;
    },

    estimateResult() {
      if (!this.inputToken.symbol || !this.inputToken.value) return '0.00';
      return new BigNumber(this.inputToken.value).times(0.9996).toFixed(2);
    },

  },
  methods: {
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('mintRedeem', ['initTokens']),
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('accTransaction', ['putTransaction', 'loadTransaction']),
    gasChange() {
      console.log('gasChange');
    },
    approveToken() {
      console.log('approveToken');
    },
    checkApprove: debounce(async (self: any) => {
      const networkId = self.networkId as keyof typeof MINTREDEEM_SCHEME;
      const exchangeContract = MINTREDEEM_SCHEME[networkId]
        .find((_) => _.token0.toLowerCase() === self.inputToken.address.toLowerCase());
      const tokenAddress = Object.values(self.contracts)
        .find((cData: any) => (cData ? cData._address === self.inputToken.address : false));

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
      if (!isInputToken) this.outputToken = token;
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
        console.log({
          asset: actionContract.options.address,
          amount: contractSum,
          referral,
          exchangeContract,
        }, '---exchangeContract1');
        methodParam = {
          asset: actionContract.options.address,
          amount: contractSum,
          referral,
        };

        console.log(exchangeContract, '---exchangeContract');

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

      if (exchangeMethodName === 'redeem') {
        if (action === 'market-redeem') {
          methodParam = {
            sum: contractSum,
          };
        } else if (
          action === 'swap-redeem'
          || action === 'dai-swap-redeem'
          || action === 'usdt-swap-redeem'
          || action === 'usdc-swap-redeem'
          || action === 'eth-swap-redeem'
        ) {
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
        const blockNum = await this.web3.eth.getBlockNumber();

        console.log(
          action,
          account,
          sum,
          exchangeContract,
          exchangeMethodName,
          actionContract,
          'PARAMS',
        );
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
          console.error(errorMessage);
          // this.showErrorModalWithMsg({
          //   errorType: 'approve',
          //   errorMsg: { code: 1, message: errorMessage },
          // });
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
        // this.showErrorModalWithMsg({ errorType: 'estimateGas', errorMsg: e });
        return -1;
      }

      console.log(result, 'result');
      return result;
    },
    // INSURANCE ESTIMATE
    // async estimateGas(sum: any) {
    //   const { contracts } = this;
    //   const from = this.account;

    //   let result = 0;
    //   const self = this;

    //   try {
    //     const estimateOptions = { from, gasPrice: this.gasPriceGwei };
    //     const blockNum = await this.web3.eth.getBlockNumber();

    //     const mintParams = {
    //       amount: sum,
    //     };

    //     await contracts.insurance[`${this.networkName}_exchanger`].methods
    //       .mint(mintParams)
    //       .estimateGas(estimateOptions)
    //       .then((gasAmount: any) => {
    //         result = gasAmount;
    //       })
    //       .catch((error: any) => {
    //         if (error && error.message) {
    //           const msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

    //           const errorMsg = {
    //             product: 'OVN INS',
    //             data: {
    //               from,
    //               to:
    //                 contracts.insurance[`${self.networkName}_exchanger`].options
    //                   .address,
    //               gas: null,
    //               gasPrice: parseInt(estimateOptions.gasPrice, 16),
    //               method: contracts.insurance[
    //                 `${self.networkName}_exchanger`
    //               ].methods
    //                 .mint(mintParams)
    //                 .encodeABI(),
    //               message: msg,
    //               block: blockNum,
    //             },
    //           };

    //           console.log(errorMsg);
    //         }

    //         return -1;
    //       });
    //   } catch (e) {
    //     console.log(e);
    //   }

    //   return result;
    // },
    async swapTokens() {
      try {
        console.log('swapTokens---');
        await this.refreshGasPrice();
        const networkId = this.networkId as keyof typeof MINTREDEEM_SCHEME;
        const exchangeAddress = MINTREDEEM_SCHEME[networkId]
          .find((_) => _.token0.toLowerCase() === this.inputToken.address.toLowerCase());
        let exchangeContract = null;

        if (exchangeAddress) {
          exchangeContract = buildContract(
            ABI_Exchange,
            this.web3,
            exchangeAddress.exchange,
          );
        }

        const actionContract = Object.values(this.contracts)
          .find((cData: any) => (cData ? cData._address === this.inputToken.address : false));
        const action = 'usdc-swap-invest';
        const exchangeMethodName = 'mint';

        console.log(this.inputToken.value, '-this.inputToken.value');
        const swapSum = BigNumber(this.inputToken.value)
          .times(10 ** this.inputToken.decimals).toString();

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
        if (!method) {
          const errorMessage = `Exchange Method type not found when create method params in buy action. MethodType: ${
            exchangeMethodName}`;
          console.error(errorMessage);
          // this.showErrorModalWithMsg({
          //   errorType: 'approve',
          //   errorMsg: { code: 1, message: errorMessage },
          // });
          return;
        }

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

            // if (self.networkName === 'zksync' && self.zksyncFeeHistory) {
            //   setTimeout(async () => {
            //     try {
            //       // get balance from eth token
            //       console.log('this.account after tx: ', self.account);
            //       const weiBalance = await self.web3.eth.getBalance(
            //         self.account,
            //       );
            //       const balance = self.web3.utils.fromWei(weiBalance);
            //       console.log(
            //         'Balance from eth token after tx',
            //         balance,
            //         balance * 1854.91,
            //       );
            //       self.zksyncFeeHistory.finalWeiBalance = balance;
            //     } catch (e) {
            //       console.error(
            //         'Error get balance from eth token  after tx',
            //         e,
            //       );
            //     }

            //     self.showSuccessModal({
            //       successTxHash: hash,
            //       successAction: resultTxInfo.successAction,
            //       etsData: resultTxInfo.etsData,
            //       zksyncFeeHistory: self.zksyncFeeHistory,
            //     });

            //     self.loadTransaction();
            //   }, 10000);
            // } else {
            //   self.showSuccessModal({
            //     successTxHash: hash,
            //     successAction: resultTxInfo.successAction,
            //     etsData: resultTxInfo.etsData,
            //     zksyncFeeHistory: self.zksyncFeeHistory,
            //   });

            //   self.loadTransaction();
            // }
          });
      } catch (e) {
        console.log(e, '-e');
        // this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
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
