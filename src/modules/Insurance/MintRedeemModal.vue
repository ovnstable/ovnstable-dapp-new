<template>
  <ModalComponent
    v-if="!insuranceIsMobileMintRedeem && !device.isMobile"
    v-model="showModal"
    type-modal="custom"
    @close="closeModal"
  >
    <SwitchChainInsurance
      v-if="!isAvailableChain"
    />
    <div v-else>
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
        <p class="insurance__modal-mint-redeem-mint-text">
          You {{ selectedAction === 'mint' ? "Mint" : "Redeem" }}
        </p>
        <div class="insurance__modal-input-group">
          <InputTokenInsurance
            :is-mint="selectedAction === 'mint'"
            :original-balance="originalBalance"
            :token-val="fromValue"
            @input-change="changeInput"
          />
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
            <p>{{ fromValueInUsd }}$</p>
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
          v-else-if="!tokenApproved"
          btn-styles="primary"
          btn-size="medium"
          class="insurance__modal-mint-button"
          @on-click="triggerApprove"
        >
          APPROVE
        </ButtonComponent>
        <ButtonComponent
          v-else
          btn-size="medium"
          btn-styles="primary"
          class="insurance__modal-mint-button"
          @on-click="confirmSwapAction"
        >
          {{ selectedAction === 'mint' ? 'MINT' : 'REDEEM' }}
        </ButtonComponent>
      </div>
      <StepsRow
        class="insurance__modal-steps"
        :current-stage="currentStage"
      />
    </div>
  </ModalComponent>
  <div
    v-else-if="insuranceIsMobileMintRedeem"
    class="insurance__modal-mint-redeem"
  >
    <SwitchChainInsurance
      v-if="!isAvailableChain"
      @close-modal="toggleModalMintRedeem"
    />
    <div v-else>
      <div class="insurance__modal-mint-redeem-buttons">
        <ButtonComponent
          @click="toggleModalMintRedeem()"
          @keydown.enter="toggleModalMintRedeem()"
        >
          <BaseIcon
            name="ArrowExitMobile"
          />
        </ButtonComponent>
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
      <StepsRow
        class="insurance__modal-steps"
        :current-stage="currentStage"
      />
      <div class="insurance__modal-mint-redeem">
        <p class="insurance__modal-mint-redeem-mint-text">
          You {{ selectedAction === 'mint' ? "Mint" : "Redeem" }}
        </p>
        <div class="insurance__modal-input-group">
          <InputTokenInsurance
            :is-mint="selectedAction === 'mint'"
            :original-balance="originalBalance"
            :token-val="fromValue"
            @input-change="changeInput"
          />
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
            <p>{{ fromValueInUsd }}$</p>
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
          v-else-if="!tokenApproved"
          btn-styles="primary"
          btn-size="medium"
          class="insurance__modal-mint-button"
          @on-click="triggerApprove"
        >
          APPROVE
        </ButtonComponent>
        <ButtonComponent
          v-else
          btn-size="medium"
          btn-styles="primary"
          class="insurance__modal-mint-button"
          @on-click="confirmSwapAction"
        >
          {{ selectedAction === 'mint' ? 'MINT' : 'REDEEM' }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { mapActions, mapGetters, useStore } from 'vuex';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import ModalComponent from '@/components/Modal/Index.vue';
import InsuranceGasSettings from '@/modules/Insurance/InsuranceGasSettings.vue';
import InputTokenInsurance from '@/modules/Insurance/InsuranceTokenForm.vue';
import SwitchChainInsurance from '@/modules/Insurance/SwitchChainModal.vue';
import BigNumber from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { debounce } from 'lodash';
import { deviceType } from '@/utils/deviceType.ts';
import { buildInsuranceContract, buildOvnContract, chainContractsMap } from '@/utils/contractsMap.ts';
import StepsRow, { mintRedeemStep } from '@/components/StepsRow/Index.vue';
import { computed, defineComponent } from 'vue';
import { INSURANCE_AVAILABLE_NETWORKS } from '@/constants/networks/index.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';

export default defineComponent({
  name: 'MintRedeemModal',
  components: {
    BaseIcon,
    ModalComponent,
    InsuranceGasSettings,
    ButtonComponent,
    StepsRow,
    InputTokenInsurance,
    SwitchChainInsurance,
  },
  setup: () => {
    const store = useStore() as any;

    const {
      data: allTokensList,
      isLoading,
      isBalancesLoading,
    } = useTokensQuery(store.state);

    return {
      allTokensList,
      isAllDataLoaded: computed(() => !isLoading.value),
      isAllDataTrigger: computed(() => !isLoading.value),
      isBalancesLoading,
    };
  },
  data() {
    return {
      showModal: false,
      ovnDecimals: 18,
      selectedAction: 'mint',
      currentStage: mintRedeemStep.START,
      tokenApproved: false,
      fromValue: '',
      toValue: '',
      gas: '',
      gasAmountInMatic: '',
      gasAmountInUsd: '',
      estimatedGas: '',
      redemptionRequestSent: false,
      ovnPrice: '',
    };
  },
  computed: {
    ...mapGetters('network', ['networkName']),
    ...mapGetters('insuranceData', ['insuranceRedemptionData']),
    ...mapGetters('accountData', ['account', 'originalBalance']),
    ...mapGetters('web3', ['contracts', 'evmSigner']),
    ...mapGetters('gasPrice', ['gasPrice', 'gasPriceStation']),

    insuranceIsMobileMintRedeem() {
      return this.$store.state.insuranceTokenData.isMobileMintRedeem.value;
    },
    device() {
      return deviceType();
    },
    fromValueInUsd() {
      if (!this.ovnPrice || !this.fromValue) return '0';
      return new BigNumber(this.fromValue).times(this.ovnPrice).toFixed(2);
    },
    redemptionDisabled() {
      if (this.selectedAction === 'redeem' && this.insuranceRedemptionData.hours > 0) {
        return true;
      }
      return false;
    },
    pendingRedemption() {
      if (this.insuranceRedemptionData.request === 'CAN_WITHDRAW') return false;
      if (this.selectedAction === 'redeem'
        && this.insuranceRedemptionData.hours > 0 && this.insuranceRedemptionData.hours < 72) {
        return true;
      }
      return false;
    },
    requestRequired() {
      if (this.insuranceRedemptionData.request === 'NEED_WAIT') return false;
      if (this.insuranceRedemptionData.request === 'CAN_WITHDRAW') return false;
      if (this.selectedAction === 'redeem' && !this.redemptionRequestSent) return true;
      return false;
    },
    isAvailableChain() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.token_insurance) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      const currentNetworkFormatted = this.networkName.charAt(0)
        .toUpperCase() + this.networkName.slice(1);
      return availableNetworks.includes(currentNetworkFormatted);
    },
    contracts() {
      return {
        insurance: buildInsuranceContract(this.evmSigner, this.networkName),
        ovn: buildOvnContract(this.evmSigner, this.networkName),

      };
    },
  },
  watch: {
    fromValue() {
      if (!this.fromValue) this.currentStage = mintRedeemStep.START;
      this.checkApprove(this);
      this.checkOvnPrice();
    },
    account(val) {
      if (val) this.refreshClientData();
      // this.ovnDecimals = this.networkId === 10 ? 6 : 18;
    },
  },
  mounted() {
  },
  methods: {
    ...mapActions('account', ['refreshBalance']),
    ...mapActions('gasPrice', ['refreshGasPrice']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('insuranceData', ['refreshInsurance', 'refreshClientData']),
    ...mapActions('successModal', ['showSuccessModal']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    closeModal() {
      this.showModal = false;
    },
    toggleModalMintRedeem() {
      this.showModal = false;
      this.$store.commit('insuranceTokenData/setIsMobileMintRedeem', {
        value: false,
      });
    },
    checkOvnPrice() {
      if (this.allTokensList.length === 0 || this.ovnPrice) return;
      const item = this.allTokensList.find((_: any) => _.symbol === 'OVN');
      this.ovnPrice = item ? item.price : '1';
    },
    changeInput(val: string) {
      this.fromValue = val;
    },
    async estimateGas(sum: string) {
      const from = this.account;
      let result;

      try {
        const estimateOptions = { from };
        const params = {
          amount: sum,
        };
        const methodEstimate = this.contracts.insurance!.exchanger!.mint;

        const gasVal = await methodEstimate
          .estimateGas(params, estimateOptions)
          .catch((error: any) => {
            console.log(error, '--estimateGas');
          });

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
          : this.contracts.insurance!.token;

        const tx = await approveToken(
          ovnContract,
          this.contracts.insurance!.exchanger!.target as string,
          approveSum,
          this.evmSigner,
        );

        await tx.wait();

        this.tokenApproved = true;
        this.currentStage = mintRedeemStep.CONFIRMATION;

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
      const sum = new BigNumber(self.fromValue)
        .times(10 ** self.ovnDecimals)
        .toFixed(0);

      try {
        if (!self.fromValue || new BigNumber(self.fromValue).isNaN() || !self.account) {
          return;
        }

        const ovnContract = self.selectedAction === 'mint'
          ? self.contracts.ovn
          : self!.insurance!.token;

        const allowanceValue = await getAllowanceValue(
          ovnContract,
          self.account,
          self.insurance!.exchanger!.target,
        );

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
        const sum = new BigNumber(this.fromValue).times(10 ** this.ovnDecimals).toFixed(0);
        await this.checkApprove(this);

        const from = this.account;
        const self = this;

        try {
          await this.refreshGasPrice();

          const gasParams = {
            from,
          };

          const params = {
            amount: sum,
          };

          if (this.selectedAction === 'mint') {
            const tx = await this.contracts.insurance!.exchanger!.mint(params, gasParams);

            await tx.wait();

            self.refreshBalance();
            self.showSuccessModal({
              successTxHash: tx.hash,
              successAction: 'mintInsurance',
            });
          } else {
            const tx = await this.contracts.insurance!.exchanger!
              .redeem(params, gasParams);

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
      if (!this.gasPrice || !this.gasPriceStation) return;
      try {
        const sum = new BigNumber(this.fromValue).times(10 ** this.ovnDecimals).toFixed(0);
        const estimatedGasValue = await this.estimateGas(sum);
        if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
          this.gas = '';
          this.gasAmountInMatic = '';
          this.gasAmountInUsd = '';

          await this.buyAction();
        } else {
          this.estimatedGas = estimatedGasValue.toString();

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
      if (!INSURANCE_AVAILABLE_NETWORKS.includes(this.networkName)) return;

      const estimateResult = await this.estimateRedemptionRequest() as any;

      if (estimateResult?.haveError) {
        this.showErrorModalWithMsg({
          errorType: 'redemptionRequest',
          errorMsg: estimateResult,
        });
      } else {
        this.redemptionRequestSent = true;

        const requestParams = { from: this.account };

        try {
          if (this.contracts.insurance) {
            const tx = await this.contracts.insurance!.exchanger!.requestWithdraw(requestParams);
            await tx.wait();
            this.refreshInsurance();
            this.redemptionRequestSent = true;
          }
        } catch (e) {
          this.redemptionRequestSent = false;
        }
      }
    },

    async estimateRedemptionRequest() {
      let result;

      try {
        const estimateOptions = {
          from: this.account,
        };

        const tx = await this.contracts!.insurance!.exchanger!
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
  },
});
</script>

<style lang="scss" scoped>
.insurance__modal-mint-redeem {
  width: 560px;
  padding: 20px;
  padding-bottom: 0;
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
    [data-theme="dark"] & {
      color: var(--color-18);
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
    [data-theme="dark"] & {
      color: var(--color-4);
    }
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
    color: var(--color-4);
  }
}

.insurance__modal-steps {
  margin-bottom: 20px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }
}

@media (max-width: 640px) {
  .insurance__modal-mint-redeem {
    padding: 0;
    width: auto;
  }
  .insurance__modal-mint-redeem,
  .insurance__modal-steps {
    [data-theme="dark"] & {
      background-color: var(--color-17);
    }
  }
  .insurance__modal-mint-redeem-buttons {
    gap: 70px;
    margin-bottom: 24px;
    button {
      background: none;
      box-shadow: none;
      border: none;
      padding: 0;
      [data-theme="dark"] & {
        background: none;
        box-shadow: none;
      }
    }
    p {
      font-size: 16px;
    }
    svg {
      [data-theme="dark"] & {
        fill: var(--color-4);
      }
    }
    .insurance__modal-mint-redeem-button-selected {
      background: none;
      p {
        color: var(--color-1);
        text-decoration: underline;
        [data-theme="dark"] & {
          color: var(--color-4);
        }
      }
    }
  }

  .insurance__modal-mint-redeem-mint-text {
    margin-top: 30px;
    margin-bottom: 24px;
  }
  .insurance__modal-steps{
    font-size: 12px;
  }

  .insurance__modal-mint-redeem-mint-text {
    text-align: left;
  }

  .insurance__modal-info {
    gap: 5px;
    flex-direction: column;
  }
  .insurance__modal-info-mint,
  .insurance__modal-info-fee {
    justify-content: space-between;
    display: flex;
    flex-direction: row;
  }
  .insurance__modal-info p:last-child {
    font-size: 14px;
    color: var(--color-2);
  }

}
</style>
