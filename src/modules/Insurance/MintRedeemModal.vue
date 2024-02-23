<template>
  <ModalComponent
    type-modal="custom"
    v-model="showModal"
    @close="closeModal"
  >
    <div class="insurance__modal-mint-redeem">
      <div class="insurance__modal-mint-redeem-buttons">
        <ButtonComponent
          :class="{
            'insurance__modal-mint-redeem-button-selected': selectedAction === 'mint',
            'insurance__modal-mint-redeem-button-first': true,
            'insurance__modal-mint-redeem-button-overlap-first': selectedAction !== 'mint',
          }"
          @click="selectedAction = 'mint'"
        >
          <p>MINT</p>
        </ButtonComponent>
        <ButtonComponent
          :class="{
            'insurance__modal-mint-redeem-button-selected': selectedAction === 'redeem',
            'insurance__modal-mint-redeem-button-last': true,
            'insurance__modal-mint-redeem-button-overlap-last': selectedAction === 'redeem',
          }"
          @click="selectedAction = 'redeem'"
        >
          <p>REDEEM</p>
        </ButtonComponent>
      </div>
      <p class="insurance__modal-mint-redeem-mint-text">You {{selectedAction === 'mint' ? "Mint" : "Redeem"}}</p>
      <div class="insurance__modal-input-group">
        <InputTokenInsurance
          :is-mint="selectedAction === 'mint'"
          :original-balance="originalBalance"
          :token-val="fromValue"
          @input-change="changeInput"
        />
        <!-- <p class="insurance__modal-input-group-slider"> slider</p> -->
        <InputTokenInsurance
          :is-mint="selectedAction !== 'mint'"
          :original-balance="originalBalance"
          :token-val="toValue"
          @input-change="changeInput"
        />
      </div>
      <div class="insurance__modal-info">
        <div class="insurance__modal-info-fee">
          <p>Overight fee:</p>
          <p>0.0%</p>
        </div>
        <div class="insurance__modal-info-mint">
          <p>You mint:</p>
          <p>0$</p>
        </div>
        <p>1 OVN = 1 OVN INS</p>
      </div>
      <InsuranceGasSettings />
      <ButtonComponent
        v-if="!fromValue"
        btn-size="medium"
        btn-styles="faded"
        class="insurance__modal-mint-button"
        disabled
      >
        {{ selectedAction === 'mint' ? 'ENTER AMOUNT TO MINT' : 'ENTER AMOUNT TO REDEEM' }}
      </ButtonComponent>
      <ButtonComponent
        v-else-if="requestRequired"
        btn-size="medium"
        class="insurance__modal-mint-button"
        @on-click="sendRedemptionRequest"
      >
        Send redeem request (72 hours)
      </ButtonComponent>
      <ButtonComponent
        v-else-if="pendingRedemption"
        btn-size="medium"
        :btn-styles="redemptionDisabled ? 'faded' : 'primary'"
        :disabled="redemptionDisabled"
        class="insurance__modal-mint-button"
        @on-click="sendRedemptionRequest"
      >
        Wait for redeem ({{ insuranceRedemptionData?.hours?.toFixed(2) }} hours)
      </ButtonComponent>
      <ButtonComponent
        btn-styles="primary"
        btn-size="medium"
        v-else-if="!tokenApproved"
        class="insurance__modal-mint-button"
        @on-click="triggerApprove"
      >
        APPROVE
      </ButtonComponent>
      <ButtonComponent
        btn-size="medium"
        btn-styles="primary"
        class="insurance__modal-mint-button"
        v-else
        @on-click="confirmSwapAction"
      >
        {{ selectedAction === 'mint' ? 'MINT' : 'REDEEM' }}
      </ButtonComponent>
    </div>
    <StepsRow :current-stage="currentStage" />
  </ModalComponent>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import ButtonComponent from '@/components/Button/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import InsuranceGasSettings from '@/modules/Insurance/InsuranceGasSettings.vue';
import InputTokenInsurance from '@/modules/Insurance/InsuranceTokenForm.vue';
import BigNumber from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { debounce } from 'lodash';
import StepsRow, { mintRedeemStep } from '@/components/StepsRow/Index.vue';

export default {
  name: 'MintRedeemModal',
  components: {
    ModalComponent,
    InsuranceGasSettings,
    ButtonComponent,
    StepsRow,
    InputTokenInsurance,
  },
  data() {
    return {
      showModal: false,
      ovnAmount: 0,
      ovnDecimals: 18,
      selectedAction: 'mint',
      currentStage: mintRedeemStep.START,
      isShowSelectTokensModal: false,
      tokenApproved: false,
      fromValue: '',
      toValue: '',
      gas: '',
      gasAmountInMatic: '',
      gasAmountInUsd: '',
      estimatedGas: '',
      redemptionRequestSent: false,
    };
  },
  watch: {
    fromValue() {
      if (!this.fromValue) this.currentStage = mintRedeemStep.START;
      this.checkApprove(this);
    },
    account(val) {
      if (val) {
        this.refreshClientData();
      }
    },
  },
  mounted() {
    console.log(this.originalBalance, '---originalBalance');
  },
  computed: {
    ...mapGetters('network', ['networkName', 'networkId']),
    ...mapGetters('gasPrice', ['gasPriceGwei']),
    ...mapGetters('insuranceData', ['insuranceRedemptionData']),
    ...mapGetters('accountData', ['account', 'originalBalance']),
    ...mapGetters('web3', ['contracts', 'evmProvider', 'evmSigner']),
    ...mapGetters('gasPrice', ['gasPriceGwei', 'gasPrice', 'gasPriceStation']),

    redemptionDisabled() {
      if (this.selectedAction === 'redeem' && this.insuranceRedemptionData.hours > 0) {
        return true;
      }
      return false;
    },
    pendingRedemption() {
      if (this.selectedAction === 'redeem'
      && this.insuranceRedemptionData.hours > 0 && this.insuranceRedemptionData.hours < 72) {
        return true;
      }
      return false;
    },
    requestRequired() {
      if (this.insuranceRedemptionData.hours > 0 && this.insuranceRedemptionData.hours < 72) {
        return false;
      }
      if (this.selectedAction === 'redeem' && !this.redemptionRequestSent) return true;
      return false;
    },
  },
  methods: {
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('errorModal', ['showErrorModal', 'showErrorModalWithMsg']),
    ...mapActions('insuranceData', ['refreshInsurance', 'refreshClientData']),
    ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    closeModal() {
      this.showModal = false;
    },
    changeInput(val: string) {
      this.fromValue = val;
    },
    showSelectTokensModals(isShow: any) {
      this.isShowSelectTokensModal = isShow;
    },
    redemptionRequestAction() {
      console.log('SEND REQUEST');
    },
    async estimateGas(sum: string) {
      const from = this.account;

      let result;

      console.log(this.contracts, '---contracts');

      try {
        if (this.networkId === 10) return -1;
        const estimateOptions = { from, gasPrice: this.gasPriceGwei };
        const params = {
          amount: sum,
        };
        const methodEstimate = this.selectedAction === 'mint'
          ? this.contracts.insurance[`${this.networkName}_exchanger`].mint
          : this.contracts.insurance[`${this.networkName}_exchanger`].redeem;

        console.log(methodEstimate, '--val1');
        const gasVal = await methodEstimate
          .estimateGas(params, estimateOptions)
          .catch((error: any) => {
            console.log(error, '--estimateGas');
          });

        console.log(gasVal, '---gasVal');
        result = gasVal;
      } catch (e) {
        console.error(
          `Insurance estimateGas error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
        );
        this.showErrorModalWithMsg({ errorType: 'estimateGas', errorMsg: e });
        return -1;
      }

      return result;
    },

    async triggerApprove() {
      try {
        this.showWaitingModal('Approving in process');

        const approveSum = new BigNumber(10 ** 25).toFixed(0);
        const ovnContract = this.selectedAction === 'mint'
          ? this.contracts.ovn
          : this.contracts.insurance[`${this.networkName}_token`];

        console.log(
          ovnContract,
          this.contracts.insurance[`${this.networkName}_exchanger`].target,
          approveSum,
          this.account,
          this.gasPriceGwei,
          '---approveToken',
        );
        const tx = await approveToken(
          ovnContract,
          this.contracts.insurance[`${this.networkName}_exchanger`].target,
          approveSum,
          this.evmSigner,
          this.gasPriceGwei,
        );

        await tx.wait();

        this.tokenApproved = true;
        this.currentStage = mintRedeemStep.CONFIRMATION;
        console.log(tx, 'TX___');

        this.closeWaitingModal();
      } catch (e) {
        console.error(
          `Insurance approve action error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
        );
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
      }
    },
    checkApprove: debounce(async (self: any) => {
      console.log(self.fromValue, '---self.fromValue');
      const sum = new BigNumber(self.fromValue)
        .times(10 ** self.ovnDecimals)
        .toFixed(0);

      try {
        if (!self.fromValue || new BigNumber(self.fromValue).isNaN() || !self.account) {
          return;
        }

        const contractToApprove = self.contracts.insurance[`${self.networkName}_exchanger`].target;
        const ovnContract = self.selectedAction === 'mint'
          ? self.contracts.ovn
          : self.contracts.insurance[`${self.networkName}_token`];

        console.log(contractToApprove, ovnContract, '--self.contract');
        const allowanceValue = await getAllowanceValue(
          ovnContract,
          self.account,
          contractToApprove,
        );

        console.log(sum, allowanceValue.toString(), '---sum');
        if (!allowanceValue || new BigNumber(allowanceValue).lt(sum)) {
          self.tokenApproved = false;
          self.currentStage = mintRedeemStep.APPROVE;
          return;
        }

        self.currentStage = mintRedeemStep.CONFIRMATION;
        self.tokenApproved = true;
      } catch (e) {
        console.error(
          `Market Withdraw approve action error: ${e}. sum:${sum} Account: ${self.account}. `,
        );
        self.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
        self.tokenApproved = false;
      }
    }, 250),
    async buyAction() {
      try {
        const decimals = this.ovnDecimals === 18 ? 18 : 9;
        const sum = new BigNumber(this.fromValue).times(10 ** decimals).toFixed(0);
        await this.checkApprove(this);

        console.log(this.estimatedGas, '---estimatedGas');
        const { contracts } = this;
        const from = this.account;
        const self = this;

        try {
          await this.refreshGasPrice();

          let gasParams;

          if (!this.gas) {
            gasParams = { from, gasPrice: this.gasPriceGwei };
          } else {
            gasParams = {
              from,
              gasPrice: this.gasPriceGwei,
              gas: this.gas,
            };
          }

          const params = {
            amount: sum,
          };

          console.debug(
            `Insurance blockchain. Sum: ${sum} usdSum: ${sum}. Account: ${this.account}`,
          );

          if (this.selectedAction === 'mint') {
            console.log(contracts.insurance[`${this.networkName}_exchanger`], gasParams, 'MINT');
            const tx = await contracts.insurance[`${this.networkName}_exchanger`].mint(params, gasParams);

            await tx.wait();

            self.showSuccessModal({
              successTxHash: tx.hash,
              successAction: 'mintInsurance',
            });
          } else {
            console.log('REDEEM');
            const tx = await contracts.insurance[
              `${this.networkName}_exchanger`
            ].redeem(params, gasParams);

            await tx.wait();

            self.showSuccessModal({
              successTxHash: tx.hash,
              successAction: 'mintInsurance',
            });
          }

          this.currentStage = mintRedeemStep.START;
        } catch (e) {
          console.error(
            `Insurance error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
          );
          this.showErrorModalWithMsg({ errorType: 'buy', errorMsg: e });
          return;
        }

        self.refreshInsurance();
        self.fromValue = '0';
      } catch (e) {
        console.error(
          `Insurance by action error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
        );
        this.showErrorModalWithMsg({ errorType: 'mint', errorMsg: e });
      }
    },

    async confirmSwapAction() {
      console.log(this.gasPrice, this.gasPriceStation, 'confirmSwapAction');

      if (!this.gasPrice || !this.gasPriceStation) return;
      try {
        const sum = new BigNumber(this.fromValue).times(10 ** this.ovnDecimals).toString();
        const estimatedGasValue = await this.estimateGas(sum);
        if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
          this.gas = '';
          this.gasAmountInMatic = '';
          this.gasAmountInUsd = '';

          await this.buyAction();
        } else {
          this.estimatedGas = estimatedGasValue;

          this.gas = new BigNumber(this.estimatedGas)
            .multipliedBy(1.1)
            .integerValue(BigNumber.ROUND_DOWN).toString();
          const gasInWei = new BigNumber(this.gas)
            .multipliedBy(this.gasPrice)
            .integerValue(BigNumber.ROUND_DOWN);
          this.gasAmountInMatic = gasInWei.times(10 ** 9).toFixed(0);
          const gasInWeiForUsd = new BigNumber(this.gas)
            .multipliedBy(this.gasPrice)
            .multipliedBy(this.gasPriceStation.usdPrice)
            .integerValue(BigNumber.ROUND_DOWN);
          this.gasAmountInUsd = gasInWeiForUsd.times(10 ** 9).toFixed(0);

          await this.buyAction();
        }
      } catch (e) {
        console.error(
          `Insurance Confirm swap error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
        );
        this.showErrorModalWithMsg({ errorType: 'swap', errorMsg: e });
      }
    },

    async sendRedemptionRequest() {
      const insurance = {
        chainName: ['optimism', 'arbitrum'],
      };

      const estimateResult = await this.estimateRedemptionRequest();

      if (!insurance.chainName.includes(this.networkName)) return;

      console.log(this.networkName, estimateResult, 'sendRedemptionRequest---');
      if (estimateResult?.haveError) {
        this.showErrorModalWithMsg({
          errorType: 'redemptionRequest',
          errorMsg: estimateResult,
        });
      } else {
        this.redemptionRequestSent = true;

        const requestParams = { from: this.account, gasPrice: this.gasPriceGwei };

        console.log(requestParams, '---requestParams');
        console.log(
          `${this.networkName}_exchanger`,
          'this.networkName + "_exchanger"',
        );
        console.log(this.contracts.insurance, '--this.contracts.insurance');
        try {
          const tx = await this.contracts.insurance[
            `${this.networkName}_exchanger`
          ].requestWithdraw(requestParams);

          tx.wait();
          this.redemptionRequestSent = true;
          alert('success');
        } catch (e) {
          this.redemptionRequestSent = false;
        }
      }
    },

    async estimateRedemptionRequest() {
      let result;

      try {
        const contract = this.contracts.insurance[
          `${this.networkName}_exchanger`
        ];
        const estimateOptions = {
          from: this.account,
          gasPrice: this.gasPriceGwei,
        };

        const tx = await contract
          .requestWithdraw
          .estimateGas(estimateOptions)
          .catch((e: any) => {
            console.log(e, 'e---');
          });

        result = tx;
      } catch (e) {
        result = {
          haveError: true,
          message: 'Unexpected error',
        };
      }

      return result;
    },

    async redemptionRequest() {
      await this.contracts.insurance[`${this.networkName}_exchanger`].methods
        .requestWithdraw()
        .call();
    },

  },
};
</script>

<style lang="scss" scoped>
.insurance__modal-mint-redeem {
  width: 560px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
}

.insurance__modal-mint-redeem-buttons {
  display: flex;
  flex-direction: row;
  align-self: center;
  position: relative;

  button {
    font-size: 14px;
    background-color: var(--color-5);
    color: var(--color-2);
    border: 1px solid var(--color-6);
    box-shadow: none;
    margin-right: -10px;
    position: relative;
    z-index: 0;

    &:first-child {
      border-radius: 30px;
    }

    &:last-child {
      border-radius: 0px 30px 30px 0px;
      margin-right: 0
    }
  }
  .insurance__modal-mint-redeem-button-overlap-first {
    border-radius: 30px 0px 0px 30px !important;
    margin-left: 0
  }
  .insurance__modal-mint-redeem-button-overlap-last {
    border-radius: 30px 30px 30px 30px !important;
  }

  .insurance__modal-mint-redeem-button-selected {
    background-color: var(--color-6);
    color: var(--color-1);
    border-color: var(--color-1);
    z-index: 1;
    padding: 2px 26px;
  }
}

.insurance__modal-mint-redeem-mint-text {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 28px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__modal-input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  * {
    width: 100%;
  }
}

.insurance__modal-input-group-slider {
  margin-top: 8px;
}
.insurance__modal-input-ovn {
  display: flex;
  flex-direction: row;
  background-color: var(--color-5);
  svg {
    width: 10%;
  }
}
.insurance__modal-input-ovn-balances {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  :nth-child(2) {
    text-align: right;
  }
}

.insurance__modal-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--color-1);
  font-weight: 600;
  margin-top: 20px;
  p {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.insurance__modal-info-fee,
.insurance__modal-info-{
  display: flex;
  flex-direction: row;
  font-size: 14px;
}

.insurance__modal-info-fee :nth-child(1),
 .insurance__modal-info-:nth-child(1){
  margin-right: 70px;
}

.insurance__modal-mint-button {
  margin: 15px 0;
}

.insurance__modal-stages {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--color-7);
  [data-theme="dark"] & {
    color: var(--color-2);
  }
}

.active-stage {
  text-decoration: underline;
  color: var(--color-2);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
</style>
