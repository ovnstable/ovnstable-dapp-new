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
      >
        {{ selectedAction === 'mint' ? 'ENTER AMOUNT TO MINT' : 'ENTER AMOUNT TO REDEEM' }}
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
      <div class="insurance__modal-stages">
        <p :class="{ 'active-stage': currentStage === 'Start' }">Start</p>
        <BaseIcon name="InsuranceModalArrowRight" />
        <p :class="{ 'active-stage': currentStage === 'Approve' }">Approve</p>
        <BaseIcon name="InsuranceModalArrowRight" />
        <p :class="{ 'active-stage': currentStage === 'Confirmation' }">Confirmation</p>
      </div>
    </div>
  </ModalComponent>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import InsuranceGasSettings from '@/modules/Insurance/InsuranceGasSettings.vue';
import InputTokenInsurance from '@/modules/Insurance/InsuranceTokenForm.vue';
import BigNumber from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { debounce } from 'lodash';

export default {
  name: 'MintRedeemModal',
  components: {
    ModalComponent,
    InsuranceGasSettings,
    ButtonComponent,
    BaseIcon,
    InputTokenInsurance,
  },
  data() {
    return {
      showModal: false,
      ovnAmount: 0,
      ovnDecimals: 18,
      selectedAction: 'mint',
      currentStage: 'Start',
      isShowSelectTokensModal: false,
      tokenApproved: false,
      fromValue: '',
      toValue: '',
      gas: '',
      gasAmountInMatic: '',
      gasAmountInUsd: '',
      estimatedGas: '',
    };
  },
  watch: {
    fromValue() {
      this.checkApprove(this);
    },
  },
  mounted() {
    console.log(this.originalBalance, '---originalBalance');
  },
  computed: {
    ...mapGetters('network', ['networkName']),
    ...mapGetters('gasPrice', ['gasPriceGwei']),
    ...mapGetters('accountData', ['account', 'originalBalance']),
    ...mapGetters('web3', ['contracts', 'evmProvider', 'evmSigner']),
    ...mapGetters('gasPrice', ['gasPriceGwei', 'gasPrice', 'gasPriceStation']),
  },
  methods: {
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('errorModal', ['showErrorModal', 'showErrorModalWithMsg']),
    ...mapActions('insuranceData', ['refreshInsurance']),
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
    async estimateGas(sum: string) {
      const from = this.account;

      let result;

      console.log(this.contracts, '---contracts');

      try {
        const estimateOptions = { from, gasPrice: this.gasPriceGwei };
        const mintParams = {
          amount: sum,
        };
        const self = this;

        await this.contracts.insurance[`${this.networkName}_exchanger`].methods
          .mint(mintParams)
          .estimateGas(estimateOptions)
          .then((gasAmount: any) => {
            result = gasAmount;
          })
          .catch((error: any) => {
            if (error && error.message) {
              const msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

              const errorMsg = {
                product: 'OVN INS',
                data: {
                  from,
                  to:
                    this.contracts.insurance[`${self.networkName}_exchanger`].target,
                  gas: null,
                  gasPrice: parseInt(estimateOptions.gasPrice, 16),
                  method: this.contracts.insurance[
                    `${self.networkName}_exchanger`
                  ].methods
                    .mint(mintParams)
                    .encodeABI(),
                  message: msg,
                },
              };

              console.log(errorMsg);
            } else {
              console.error(
                `Mint Insurance blockcnain estimateGas error: ${error}. Sum: ${self.fromValue}. Account: ${self.account}. `,
              );
            }

            return -1;
          });
      } catch (e) {
        console.error(
          `Mint Insurance estimateGas error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
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

        console.log('2');
        await tx.wait();

        this.tokenApproved = true;
        console.log(tx, 'TX___');

        this.closeWaitingModal();
      } catch (e) {
        console.error(
          `Mint Insurance approve action error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
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
          return;
        }

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

        console.log(sum, decimals, this.fromValue, '---sum');
        const { contracts } = this;
        const from = this.account;
        const self = this;

        try {
          await this.refreshGasPrice();

          let buyParams;

          if (this.gas == null) {
            buyParams = { from, gasPrice: this.gasPriceGwei };
          } else {
            buyParams = {
              from,
              gasPrice: this.gasPriceGwei,
              gas: this.gas,
            };
          }

          const mintParams = {
            amount: sum,
          };

          console.debug(
            `Insurance blockchain. Mit action Sum: ${sum} usdSum: ${sum}. Account: ${this.account}`,
          );
          const buyResult = await contracts.insurance[
            `${this.networkName}_exchanger`
          ].mint(mintParams, buyParams);

          await buyResult.wait();

          self.showSuccessModal({
            successTxHash: buyResult.hash,
            successAction: 'mintInsurance',
          });
        } catch (e) {
          console.error(
            `Mint Insurance error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
          );
          this.showErrorModalWithMsg({ errorType: 'buy', errorMsg: e });
          return;
        }

        self.refreshInsurance();
        self.fromValue = '0';
      } catch (e) {
        console.error(
          `Mint Insurance by action error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
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
          `Mint Insurance Confirm swap error: ${e}. Sum: ${this.fromValue}. Account: ${this.account}. `,
        );
        this.showErrorModalWithMsg({ errorType: 'swap', errorMsg: e });
      }
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
.insurance__modal-info-mint {
  display: flex;
  flex-direction: row;
  font-size: 14px;
}

.insurance__modal-info-fee :nth-child(1),
 .insurance__modal-info-mint :nth-child(1){
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
