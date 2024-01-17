<template>
  <div class="swap-form-wrap">
    <div v-if="!isAvailableOnNetwork">
      <NetworkNotAvailable :network-name="networkName" />
    </div>

    <div
      v-else
      :class="
        !isAllLoaded ? 'swap-container swap-container-full' : 'swap-container'
      "
    >
      <div
        v-if="!isAllLoaded"
        class="loader-container"
      >
        <Spinner />
      </div>

      <div v-else>
        <div class="swap-body">
          <div>
            <div class="input-swap-container">
              <div class="swap-title pb-lg-2 mt-2">
                <div>
                  <span v-if="swapMethod === 'SELL'">
                    <span v-if="viewType === 'SWIPE'">Swipe</span><span v-else>Swap</span> from Overnight
                  </span>
                  <span v-else>
                    <span v-if="viewType === 'SWIPE'">Swipe</span><span v-else>Swap</span> from
                  </span>
                </div>
              </div>
              <div
                v-for="token in inputTokens"
                :key="token.id"
                class="input-component-container"
              >
                <div
                  v-if="isShowDecreaseAllowance && token.selectedToken"
                  @click="disapproveToken(token)"
                  @keypress="disapproveToken(token)"
                  class="decrease-allowance"
                >
                  Decrease Allowance
                </div>

                <InputToken
                  :token-info="token"
                  :remove-item-func="removeInputToken"
                  :is-token-removable="isInputTokensRemovable"
                  :select-token-func="selectInputToken"
                  :update-token-value-func="updateTokenValueMethod"
                />
              </div>
              <div class="row">
                <div class="col-6">
                  <div
                    v-if="isInputTokensAddAvailable"
                    @click="addNewInputToken"
                    @keypress="addNewInputToken"
                    class="add-token-text"
                  >
                    + Select token
                  </div>
                </div>
                <div
                  v-if="inputTokensWithSelectedTokensCount"
                  class="col-6"
                >
                  <div
                    @click="maxAllMethod"
                    @keypress="maxAllMethod"
                    class="add-token-text max-all"
                  >
                    Max all
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-5">
              <div
                @click="changeSwap()"
                @keypress="changeSwap"
                class="change-swap-container"
              >
                <div class="change-swap-image rotate">
                  <BaseIcon
                    name="ChangeSwapVector"
                  />
                </div>
              </div>
            </div>

            <div class="out-swap-container">
              <div class="swap-title pb-2">
                <span v-if="swapMethod === 'BUY'">
                  <span v-if="viewType === 'SWIPE'">Swipe</span><span v-else>Swap</span> to Overnight
                </span>
                <span v-else>
                  <span v-if="viewType === 'SWIPE'">Swipe</span><span v-else>Swap</span> to
                </span>
              </div>
              <div
                v-for="token in outputTokens"
                :key="token.id"
                class="input-component-container"
              >
                <OutputToken
                  :token-info="token"
                  :swap-method="swapMethod"
                  :remove-item-func="removeOutputToken"
                  :is-token-removable="isOutputTokensRemovable"
                  :is-token-without-slider="isTokenWithoutSlider"
                  :is-token-without-line-slider="
                    getLastUnlockedToken && getLastUnlockedToken.id === token.id
                  "
                  :lock-proportion-func="lockProportion"
                  :update-slider-value-func="updateSliderValue"
                  :select-token-func="selectOutputToken"
                  :is-tokens-prices-loading="isSumulateSwapLoading"
                  :free-output-tokens-percentage="freeOutputTokensPercentage"
                />
              </div>

              <div class="row">
                <div class="col-6">
                  <div
                    v-if="isOutputTokensAddAvailable"
                    @click="addNewOutputToken"
                    @keypress="addNewOutputToken"
                    class="add-token-text"
                  >
                    + Select token
                  </div>
                </div>
                <div
                  v-if="outputTokensWithSelectedTokensCount >= 2"
                  class="col-6"
                >
                  <div
                    @click="resetOutputs"
                    @keypress="resetOutputs"
                    class="add-token-text max-all"
                  >
                    Reset output %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SwapSlippageSettings
          :currentSlippageChanged="handleCurrentSlippageChanged"
          :selected-input-tokens="selectedInputTokens"
          :selected-output-tokens="selectedOutputTokens"
        />

        <div
          v-if="networkName === 'zksync'"
          class="slippage-info-container"
        >
          <div class="slippage-info-title">
            <BaseIcon
              name="WarnInfoIcon"
              style="margin-right: 2px"
            />
            20-80% of the displayed gas fee on zkSync will be refunded
            automatically.
          </div>
        </div>
        <div
          class="odos-fees-container mt-5"
          v-if="ifMoreThanOneSelectedTokensAdded"
        >
          <div>
            <BaseIcon
              class="alert-icon mr-2"
              name="AlertCircleOutline"
            />
          </div>
          <div>
            <div class="odos-fees-title">
              Odos collects 0.01% fee for multi-input/multi-output swaps. Single
              input/output swaps collects 0% fee.
            </div>
          </div>
        </div>

        <div class="swap-footer pt-5">
          <div
            v-if="!account"
            class="swap-button-container"
          >
            <ButtonComponent
              @click="connectWallet"
              class="swap-button"
            >
              <div class="swap-button-title">
                <div>CONNECT WALLET</div>
              </div>
            </ButtonComponent>
          </div>
          <div
            v-else
            class="swap-button-container"
          >
            <div
              elevated
              large
              v-if="hideSwapButton"
              class="disable-button"
            >
              <div class="disable-button-title">
                <div>
                  {{ disableButtonMessage }}
                </div>
              </div>
            </div>
            <ButtonComponent
              v-else-if="isAnyInputsNeedApprove"
              @click="approve(firstInputInQueueForToApprove)"
              class="swap-button"
            >
              <div class="swap-button-title">
                <div>
                  <span
                    v-if="viewType === 'SWIPE' && !firstSwipeClickOnApprove"
                  >
                    SWIPE
                  </span>
                  <span v-else>
                    APPROVE
                    {{ firstInputInQueueForToApprove.selectedToken.symbol }}
                  </span>
                </div>
              </div>
            </ButtonComponent>
            <ButtonComponent
              v-else
              @click="swap()"
              class="swap-button"
              :loading="isLoadingSwap"
            >
              <span v-if="viewType === 'SWIPE'">SWIPE LIQUIDITY</span><span v-else>SWAP</span>
            </ButtonComponent>
          </div>

          <div class="label-container pt-3">
            <div class="row">
              <div
                class="col-6 pr-1"
                style="padding-top: 15px"
              >
                <div class="powered-text">Powered by</div>
              </div>
              <div class="col-6 pl-0">
                <div class="powered-image">
                  <img
                    alt="odos"
                    :src="getImageUrl('assets/images/common/odosLogo.png')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="quotaResponseInfo">
      <div class="transaction-info-container">
        <div class="transaction-info-body">
          <div class="row py-2">
            <div class="col-6 py-0">
              <div class="transaction-info-title">Slippage</div>
            </div>
            <div class="col-6 py-0">
              <div class="transaction-info">
                {{ slippagePercent * 1 }}%
                <span class="transaction-info-additional">
                  ({{
                    formatMoney(
                      (sumOfAllSelectedTokensInUsd * slippagePercent) / 100,
                      3,
                    )
                  }})$
                </span>
              </div>
            </div>
          </div>

          <div
            class="row py-2"
            v-if="ifMoreThanOneSelectedTokensAdded"
          >
            <div class="col-6 py-0 with-tooltip">
              <div class="transaction-info-title">Multi-swap Odos fee</div>
              <div>
                <!-- <Tooltip
                  text="This fee is charged by Odos for using multi-input/multi-output"
                /> -->
              </div>
            </div>
            <div class="col-6 py-0">
              <div class="transaction-info">
                {{ multiSwapOdosFeePercent * 1 }}%
                <span class="transaction-info-additional">
                  ({{
                    formatMoney(
                      (sumOfAllSelectedTokensInUsd * multiSwapOdosFeePercent)
                        / 100,
                      3,
                    )
                  }})$
                </span>
              </div>
            </div>
          </div>

          <div class="row py-2">
            <div class="col-6 py-0 with-tooltip">
              <div class="transaction-info-title">Single-swap Odos fee</div>
              <div>
                <!-- <Tooltip text="Single-input/output swaps are free" /> -->
              </div>
            </div>
            <div class="col-6 py-0">
              <div class="transaction-info">
                0.00% <span class="transaction-info-additional">(0)$</span>
              </div>
            </div>
          </div>

          <div class="row py-2">
            <div class="col-6 py-0">
              <div class="transaction-info-title">Minimum received</div>
            </div>
            <div class="col-6 py-0">
              <div class="transaction-info">
                {{ formatMoney(sumOfAllSelectedTokensInUsd, 3) }}$
              </div>
            </div>
          </div>
        </div>
        <div class="transaction-info-footer">
          <div class="row py-2">
            <div class="col-6 py-0">
              <div class="transaction-info-title">Recipient</div>
            </div>
            <div class="col-6 py-0">
              <div class="transaction-info-address">
                {{
                  account.substring(0, 5)
                    + "..."
                    + account.substring(account.length - 4)
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SelectTokensModal
      :is-show="isShowSelectTokensModal"
      :set-show-func="showSelectTokensModals"
      :swap-method="swapMethod"
      :select-token-type="selectTokenType"
      :add-selected-token-to-list-func="addSelectedTokenToList"
      :remove-selected-token-from-list-func="removeSelectedTokenFromList"
      :second-tokens="secondTokens"
      :tokens="allTokensList"
      :is-all-data-loaded="isAllDataLoaded"
      :is-ovn-swap="true"
      :selected-token-count="
        selectTokenType === 'OVERNIGHT'
          ? secondTokensSelectedCount
          : tokensSelectedCount
      "
      :max-token-count="
        selectTokenType === 'OVERNIGHT' ? secondTokens.length : 6
      "
    />

    <!-- <SuccessOdosModal
      :is-show="isShowSuccessModal"
      :set-show-func="showSuccessModal"
      :success-data="successData"
      :view-type="viewType"
    /> -->

    <WaitingModal v-if="showWaitModal" />
    <ErrorModal v-if="showErrorModalGet" />
  </div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-continue -->
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { useEventBus } from '@vueuse/core';
import InputToken from '@/modules/main/components/odos/InputToken.vue';
import WaitingModal from '@/components/CustomModals/action/WaitingModal.vue';
import ErrorModal from '@/components/CustomModals/action/ErrorModal.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { getWeiMarker } from '@/utils/web3.ts';
import { formatMoney } from '@/utils/numbers.ts';
import { getRandomString } from '@/utils/strings.ts';
import {
  getNewInputToken, getNewOutputToken, maxAll, updateTokenValue,
} from '@/store/odos/helpers.ts';
import { clearApproveToken, getAllowanceValue, approveToken } from '@/helpers/contract-approve.ts';
import odosApiService from '@/services/odos-api-service.ts';
import { getImageUrl } from '@/utils/const.ts';
import NetworkNotAvailable from '@/modules/main/components/odos/network-not-available.vue';
import SwapSlippageSettings from '@/modules/main/components/odos/SwapSlippageSettings.vue';
import OutputToken from '@/modules/main/components/odos/OutputToken.vue';
import SelectTokensModal from '@/modules/main/components/odos/TokensModal/Index.vue';

export default defineComponent({
  name: 'SwapForm',
  components: {
    ButtonComponent,
    Spinner,
    NetworkNotAvailable,
    ErrorModal,
    WaitingModal,
    SwapSlippageSettings,
    SelectTokensModal,
    InputToken,
    OutputToken,
    BaseIcon,
  },
  props: {
    viewType: {
      type: String,
      required: true,
    },
    updatePathViewFunc: {
      type: Function,
      required: true,
    },
    updateButtonDisabledFunc: {
      type: Function,
      required: true,
    },
    updateIsLoadingDataFunc: {
      type: Function,
      required: true,
    },
    handleFormResetFunc: {
      type: Function,
      required: true,
    },
    updateStablecoinsListFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      maxInputTokens: 6,
      maxOutputTokens: 6,

      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
      selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

      isShowSettingsModal: false,
      isSwapLoading: false,
      isSumulateSwapLoading: false,
      isSumulateIntervalStarted: false,
      pathViz: null,
      slippagePercent: 0.05,
      multiSwapOdosFeePercent: 0.01,

      tokensQuotaCounterId: null as any,
      tokensQuotaCheckerSec: 0,

      firstSwipeClickOnApprove: false,
      ifMoreThanOneTokensAdded: false,
    };
  },
  watch: {
    async isAllDataLoaded(newVal) {
      if (newVal && !this.dataBeInited) {
        await this.initData({
          tokenSeparationScheme: this.tokenSeparationScheme,
          listOfBuyTokensAddresses: this.listOfBuyTokensAddresses,
        });
        this.$store.commit('odosData/changeState', {
          field: 'dataBeInited',
          val: true,
        });
      }
    },

    account(newVal) {
      if (newVal) {
        this.initAccountData();
      }
    },
    async networkId(newVal) {
      if (newVal) {
        this.isFirstBalanceLoaded = false;
        this.isBalancesLoading = false;
        this.quotaResponseInfo = null;
        await this.initContractData();
        await this.initData({
          tokenSeparationScheme: this.tokenSeparationScheme,
          listOfBuyTokensAddresses: this.listOfBuyTokensAddresses,
        });
        this.loadPricesInfo(newVal);
      }
    },
    outputTokensWithSelectedTokensCount(val, oldVal) {
      // lock first
      if (val === 1) {
        const token: any = this.selectedOutputTokens[0];
        if (!token.locked) {
          this.lockProportion(true, token);
        }
        this.recalculateOutputTokensSum();
        return;
      }

      if (val === 2 && oldVal === 1) {
        const token: any = this.selectedOutputTokens[0];
        if (token.locked) {
          this.lockProportion(false, token);
        }
        this.recalculateOutputTokensSum();
      }
    },
    sumOfAllSelectedTokensInUsd() {
      this.recalculateOutputTokensSum();
    },

    isTokensLoadedAndFiltered(val) {
      if (val) {
        this.clearForm();
      }
    },
    // networkId(newVal) {
    //   if (newVal) {
    //     // hide swap form and clear all(watch function) data,
    //     // after new token loaded collection
    //     this.isTokensLoadedAndFiltered = false;

    //     if (!this.isAvailableOnNetwork) {
    //       this.mintAction();
    //     }
    //   }
    // },
    hideSwapButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
      this.updateButtonDisabledFunc(val);
    },

    isFirstBalanceLoaded(val) {
      if (val) {
        this.initTopInputTokensByBalance(this.stablecoinWithoutSecondTokens);
      }
    },
  },
  mounted() {
    this.$store.commit('odosData/changeState', {
      field: 'baseViewType',
      val: this.viewType,
    });
    this.$store.commit('odosData/changeState', {
      field: 'tokenSeparationScheme',
      val: 'OVERNIGHT_SWAP',
    });
    this.init();

    if (!this.isAvailableOnNetwork) {
      this.mintAction();
      return;
    }

    if (this.$route.query.action === 'swap-out') {
      this.changeSwap();
    }
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'tokensContractMap',
      'routerContract',
      'swapSessionId',
      'odosReferalCode',
      'secondTokens',
      'quotaResponseInfo',
      'isShowDecreaseAllowance',
      'tokenSeparationScheme',
      'listOfBuyTokensAddresses',
      'dataBeInited',
      'isFirstBalanceLoaded',
      'isBalancesLoading',
    ]),
    ...mapGetters('odosData', [
      'allTokensList',
      'isAvailableOnNetwork',
      'swapResponseConfirmGetter',
      'isAllLoaded',
      'stablecoinWithoutSecondTokens',
      'secondTokensSelectedCount',
      'tokensSelectedCount',
      'isAllDataLoaded',
    ]),
    ...mapGetters('waitingModal', {
      showWaitModal: 'show',
    }),
    ...mapGetters('errorModal', {
      showErrorModalGet: 'show',
    }),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('web3', ['web3']),
    ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
    ...mapGetters('theme', ['light']),
    ...mapGetters('gasPrice', [
      'show',
      'gasPrice',
      'gasPriceGwei',
      'gasPriceStation',
    ]),

    isInputTokensRemovable() {
      return this.inputTokens.length > 1;
    },

    isOutputTokensRemovable() {
      return this.outputTokens.length > 1;
    },

    isTokenWithoutSlider() {
      return this.outputTokens.length <= 1;
    },

    isInputTokensAddAvailable() {
      return (
        this.inputTokens.length < this.maxInputTokens
        && this.inputTokensWithoutSelectedTokensCount === 0
      );
    },

    isOutputTokensAddAvailable() {
      return (
        this.outputTokens.length < this.maxOutputTokens
        && this.outputTokensWithoutSelectedTokensCount === 0
      );
    },

    inputTokensWithoutSelectedTokensCount() {
      return this.inputTokens.filter((item: any) => !item.selectedToken).length;
    },

    outputTokensWithoutSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => !item.selectedToken).length;
    },

    inputTokensWithSelectedTokensCount() {
      return this.inputTokens.filter((item: any) => item.selectedToken).length;
    },

    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
    },

    ifMoreThanOneSelectedTokensAdded() {
      return this.inputTokens.length > 1 || this.outputTokens.length > 1;
    },

    outputUnlockedTokens() {
      return this.outputTokens.filter((item: any) => !item.locked);
    },

    outputUnlockedTokensCount() {
      return this.outputUnlockedTokens.length;
    },

    getLastUnlockedToken() {
      if (this.outputUnlockedTokensCount === 1) {
        return this.outputUnlockedTokens[0];
      }

      return null;
    },

    freeOutputTokensPercentage() {
      let sumLockedTokens = 0;
      let result = 100;

      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        if (token.locked) {
          sumLockedTokens += token.value;
        }
      }

      result = 100 - sumLockedTokens;

      return result;
    },

    selectedInputTokens() {
      // todo: add check balance
      return this.inputTokens.filter((item: any) => item.selectedToken);
    },
    selectedOutputTokens() {
      // todo: add check proportion values
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },

    isAnyInputsNeedApprove() {
      return this.inputsNeedApproveCount > 0;
    },
    inputsNeedApproveCount() {
      return this.allInputsWithNotApproved.length;
    },
    allInputsWithNotApproved() {
      return this.selectedInputTokens.filter(
        (token: any) => !token.selectedToken.approveData.approved && token.value > 0,
      );
    },
    firstInputInQueueForToApprove() {
      return this.isAnyInputsNeedApprove
        ? this.allInputsWithNotApproved[0]
        : null;
    },

    isLoadingSwap() {
      return this.isSwapLoading || this.isSumulateSwapLoading;
    },

    hideSwapButton() {
      return (
        this.inputTokensWithSelectedTokensCount === 0
        || this.outputTokensWithSelectedTokensCount === 0
        || this.swapResponseConfirmGetter.waitingConformation
        || !this.isAvailableOnNetwork
        || !this.isAnyTokensBalanceIsInsufficient
        || !this.isAmountEntered
        || this.isSwapLoading
      );
    },

    disableButtonMessage() {
      if (
        this.inputTokensWithSelectedTokensCount === 0
        || this.outputTokensWithSelectedTokensCount === 0
      ) {
        if (this.isAvailableOnNetwork) {
          return 'SELECT TOKENS';
        }

        return 'SWITCH CHAIN';
      }

      if (!this.isAmountEntered) {
        return 'ENTER AMOUNT';
      }

      if (!this.isAnyTokensBalanceIsInsufficient) {
        return 'BALANCE IS INSUFFICIENT';
      }

      if (this.swapResponseConfirmGetter.waitingConformation) {
        return (
          `Confirm in your wallet (${
            this.swapResponseConfirmGetter.duration
          } sec)`
        );
      }

      if (this.isSwapLoading) {
        return 'SWAP LOADING';
      }

      return null;
    },

    isAmountEntered() {
      const tokens = this.selectedInputTokens;
      for (let i = 0; i < tokens.length; i++) {
        const token: any = tokens[i];
        if (token.value > 0) {
          return true;
        }
      }

      return false;
    },

    sumOfAllSelectedTokensInUsd() {
      let sum = 0;
      for (let i = 0; i < this.selectedInputTokens.length; i++) {
        const token: any = this.selectedInputTokens[i];
        const selectedTokenUsdValue = token.usdValue;
        sum += selectedTokenUsdValue;
      }

      return sum;
    },

    isAnyTokensBalanceIsInsufficient() {
      const tokens = this.selectedInputTokens;
      for (let i = 0; i < tokens.length; i++) {
        const token: any = tokens[i];
        if (token.value * 1 > token.selectedToken.balanceData.balance * 1) {
          return false; // any with value > balance
        }
      }

      return true;
    },
  },

  methods: {
    ...mapActions(
      'odosData',
      [
        'loadChains',
        'loadTokens',
        'initContractData',
        'getDefaultSecondtoken',
        'getActualGasPrice',
        'initWalletTransaction',
        'initData',
        'initAccountData',
        'loadPricesInfo',
      ],
    ),
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('errorModal', ['showErrorModal', 'showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    formatMoney,
    getImageUrl,
    maxAllMethod() {
      maxAll(this.selectedInputTokens, this.web3.utils.toWei);
    },
    updateTokenValueMethod(token:any, val: any) {
      updateTokenValue(token, val, this.web3.utils.toWei);
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    init() {
      this.loadChains();
      this.loadTokens();
      this.initContractData();

      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
    },
    addDefaultOvnToken() {
      const symbol = this.$route.query.symbol ? this.$route.query.symbol : null;
      const ovnSelectedToken: any = this.getDefaultSecondtoken(symbol);
      if (!ovnSelectedToken) {
        this.addNewInputToken();
        this.addNewOutputToken();
        return;
      }

      ovnSelectedToken.selected = true;

      if (this.swapMethod === 'BUY') {
        this.addSelectedTokenToOutputList(ovnSelectedToken);
        this.addNewInputToken();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addSelectedTokenToInputList(ovnSelectedToken);
        this.addNewOutputToken();
        return;
      }

      console.error(
        'Error when add default ovn token. Method not found: ',
        this.swapMethod,
      );
    },
    addNewOutputToken() {
      const newToken: any = getNewOutputToken();
      this.outputTokens.push(newToken);
    },
    removeOutputToken(id: any) {
      this.removeToken(this.outputTokens, id);
      this.resetOutputs();
    },
    addNewInputToken() {
      this.inputTokens.push(getNewInputToken());
    },
    removeInputToken(id: any) {
      this.removeToken(this.inputTokens, id);
    },
    removeToken(tokens: any, id: any) {
      // removing by token.id or token.selectedToken.id
      const index = tokens.findIndex(
        (item: any) => item.id === id
          || (item.selectedToken ? item.selectedToken.id === id : false),
      );

      if (index !== -1) {
        if (tokens[index].selectedToken) {
          tokens[index].selectedToken.selected = false;
        }

        tokens.splice(index, 1);
      }
      this.updateQuotaInfo();
    },

    changeSwap() {
      // Transform Input Tokens into Output format by adding temporary variable "tempOutputArray"
      const tempOutputArray = [];
      for (let i = 0; i < this.inputTokens.length; i++) {
        const tokenIn: any = this.inputTokens[i];
        if (!tokenIn.selectedToken) {
          continue;
        }

        const transformInputToOutputToken: any = getNewOutputToken();
        transformInputToOutputToken.id = tokenIn.id;
        transformInputToOutputToken.selectedToken = tokenIn.selectedToken;
        tempOutputArray.push(transformInputToOutputToken);
      }

      // Transform Output Tokens into Input format by adding temporary variable "tempInputArray"
      const tempInputArray: any[] = [];
      for (let i = 0; i < this.outputTokens.length; i++) {
        const tokenOut: any = this.outputTokens[i];
        if (!tokenOut.selectedToken) {
          continue;
        }

        const transformOutputToInputToken = getNewInputToken();
        transformOutputToInputToken.id = tokenOut.id;
        transformOutputToInputToken.selectedToken = tokenOut.selectedToken;
        tempInputArray.push(transformOutputToInputToken);
      }

      this.inputTokens = tempInputArray;
      this.outputTokens = tempOutputArray;

      const symbol = this.$route.query.symbol ? this.$route.query.symbol : null;

      if (this.swapMethod === 'BUY') {
        this.setSwapMethod('SELL');
        this.addTokensEmptyIsNeeded();
        this.resetOutputs();

        let params = null;
        if (symbol) {
          params = { action: 'swap-out', symbol };
        } else {
          params = { action: 'swap-out' };
        }

        this.initTabName('/swap', params);
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.setSwapMethod('BUY');
        this.addTokensEmptyIsNeeded();
        this.resetOutputs();

        let params = null;
        if (symbol) {
          params = { action: 'swap-in', symbol };
        } else {
          params = { action: 'swap-in' };
        }

        this.initTabName('/swap', params);
        return;
      }

      console.error('Change swap method not found.', this.swapMethod);
    },

    handleCurrentSlippageChanged(newSlippage: any) {
      this.slippagePercent = newSlippage.value;
    },

    finishTransaction() {
      this.clearForm();
      this.handleFormResetFunc(true);
    },

    clearForm() {
      this.clearAllSelectedTokens();

      if (this.swapMethod === 'BUY') {
        this.addDefaultOvnToken();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addDefaultOvnToken();
        return;
      }

      console.error('Clear form, swap method not found.', this.swapMethod);
    },

    resetOutputs() {
      if (!this.selectedOutputTokens.length) {
        return;
      }

      const totalValue = 100;
      const totalTokens = this.selectedOutputTokens.length;
      const proportion = Math.floor(totalValue / totalTokens);
      const remains = totalValue % totalTokens;

      for (let i = 0; i < totalTokens; i++) {
        this.selectedOutputTokens[i].value = proportion;
      }

      for (let i = 0; i < remains; i++) {
        this.selectedOutputTokens[i].value += 1;
      }
    },
    async swap() {
      if (this.isSwapLoading) {
        console.log({
          message: 'Swap method not available, prev swap in process.',
          swapSession: this.swapSessionId,
        });
        return;
      }

      if (
        this.inputTokensWithSelectedTokensCount < 1
        || this.outputTokensWithSelectedTokensCount < 1
      ) {
        return;
      }

      this.swapSessionId = getRandomString(10);
      this.isSwapLoading = true;

      const actualGas = await this.getActualGasPrice(this.networkId);
      const requestData = {
        chainId: this.networkId,
        inputTokens: this.getRequestInputTokens(),
        outputTokens: this.getRequestOutputTokens(),
        gasPrice: actualGas,
        userAddr: this.web3.utils.toChecksumAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent(),
        sourceBlacklist: this.getSourceBlackList(this.networkId),
        sourceWhitelist: [],
        simulate: true,
        pathViz: true,
        // disableRFQs: false
        referralCode: this.odosReferalCode,
      };

      console.log({
        message: 'Odos Swap quota request data',
        swapSession: this.swapSessionId,
        data: requestData,
        actualGas,
      });

      odosApiService.swapRequest(requestData)
        .then(async (data: any) => {
          console.log({
            message: 'Odos Swap quota response data',
            swapSession: this.swapSessionId,
            data,
            actualGas,
          });

          const assembleData = {
            userAddr: this.web3.utils.toChecksumAddress(
              this.account.toLowerCase(),
            ),
            pathId: data.pathId,
            simulate: true,
          };

          console.log({
            message: 'Odos Assemble request data',
            swapSession: this.swapSessionId,
            data: assembleData,
            actualGas,
          });
          odosApiService.assembleRequest(assembleData)
            .then(async (responseAssembleData: any) => {
              console.log({
                message: 'Odos Assemble response data',
                swapSession: this.swapSessionId,
                data: responseAssembleData,
                actualGas,
              });

              if (
                responseAssembleData.simulation
                && !responseAssembleData.simulation.isSuccess
              ) {
                this.closeWaitingModal();
                const errMsg = responseAssembleData.simulation.simulationError
                  && responseAssembleData.simulation.simulationError.errorMessage
                  ? responseAssembleData.simulation.simulationError
                    .errorMessage
                  : 'Transaction simulation is failed';
                console.log({
                  message: 'Error before send swap transaction',
                  swapSession: this.swapSessionId,
                  data: errMsg,
                  actualGas,
                });

                if (errMsg && errMsg.toLowerCase().includes('slippage')) {
                  this.showErrorModalWithMsg({
                    errorType: 'slippage',
                    errorMsg: errMsg,
                  });
                } else {
                  console.log(errMsg, 'errMsg');
                }

                this.isSwapLoading = false;
                return;
              }

              await this.initWalletTransaction(
                responseAssembleData,
                this.selectedInputTokens,
                this.selectedOutputTokens,
              );
              this.isSwapLoading = false;
            })
            .catch((e) => {
              console.log({
                message: 'Odos assemble request failed swap form',
                swapSession: this.swapSessionId,
                data: e,
              });
              this.isSwapLoading = false;
            });
        })
        .catch((e) => {
          console.log({
            message: 'Odos swap request failed swap form',
            swapSession: this.swapSessionId,
            data: e,
          });
          this.isSwapLoading = false;
        });
    },
    clearQuotaInfo() {
      this.pathViz = null;
      this.$store.commit('odosData/changeState', {
        field: 'quotaResponseInfo',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'swapResponseInfo',
        val: null,
      });
      // this.updatePathViewFunc(this.pathViz, [], []);
    },
    async simulateSwap() {
      console.log('simulateSwap');
      if (this.isSumulateSwapLoading) {
        return;
      }

      if (
        this.inputTokensWithSelectedTokensCount < 1
        || this.outputTokensWithSelectedTokensCount < 1
      ) {
        return;
      }

      this.isSumulateSwapLoading = true;
      const actualGas = await this.getActualGasPrice(this.networkId);

      const input = this.getRequestInputTokens(false);
      const output = this.getRequestOutputTokens(false);
      if (!input.length || !output.length) {
        this.isSumulateSwapLoading = false;
        this.isSumulateIntervalStarted = false;
        return;
      }

      const requestData = {
        chainId: this.networkId,
        inputTokens: input,
        outputTokens: output,
        gasPrice: actualGas,
        userAddr: this.web3.utils.toChecksumAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent(),
        sourceBlacklist: this.getSourceBlackList(this.networkId),
        sourceWhitelist: [],
        simulate: true,
        pathViz: true,
      };

      this.clearQuotaInfo();

      odosApiService.quoteRequest(requestData)
        .then((data: any) => {
          this.updateSelectedOutputTokens(data);

          this.isSumulateSwapLoading = false;
          this.isSumulateIntervalStarted = false;
          this.updateIsLoadingDataFunc(false);

          this.updatePathViewFunc(
            data.pathViz,
            this.selectedInputTokens,
            this.selectedOutputTokens,
          );
          this.pathViz = data.pathViz;
        })
        .catch((e) => {
          console.error('Odos simulate swap request failed', e);
          this.isSumulateSwapLoading = false;
          this.isSumulateIntervalStarted = false;
          this.updateIsLoadingDataFunc(false);
        });
    },
    // function get data.outTokens and data.outAmounts and find matches in selectedOutputTokens
    // and update selectedOutputTokens with new values
    updateSelectedOutputTokens(data: any) {
      if (!data || !data.outTokens || !data.outAmounts) {
        return;
      }

      const { outTokens } = data;
      const { outAmounts } = data;
      const { selectedOutputTokens } = this;
      const selectedOutputTokensCount = selectedOutputTokens.length;
      const outTokensCount = outTokens.length;
      const outAmountsCount = outAmounts.length;

      if (
        selectedOutputTokensCount < 1
        || outTokensCount < 1
        || outAmountsCount < 1
      ) {
        return;
      }

      const selectedOutputTokensMap: any = {};
      for (let i = 0; i < selectedOutputTokensCount; i++) {
        const token: any = selectedOutputTokens[i];
        selectedOutputTokensMap[
          token.selectedToken.address.toLowerCase()
        ] = token;
      }

      for (let i = 0; i < outTokensCount; i++) {
        const tokenAddress = outTokens[i];
        const tokenAmount = outAmounts[i];
        const token: any = selectedOutputTokensMap[tokenAddress.toLowerCase()];
        if (token) {
          const { selectedToken } = token;
          const amount = this.web3.utils.fromWei(
            tokenAmount,
            getWeiMarker(selectedToken.decimals),
          );
          token.sum = amount;
        }
      }
    },

    getSlippagePercent() {
      return this.slippagePercent;
    },

    getSourceBlackList(networkId: any) {
      if (networkId === 324) {
        return ['Hashflow', 'Wombat', 'Maverick'];
      }
      return ['Hashflow', 'Wombat'];
    },

    async disapproveToken(token: any) {
      const { selectedToken } = token;
      if (!selectedToken || !selectedToken.approveData.approved) {
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];
      clearApproveToken(
        tokenContract,
        this.routerContract.options.address,
        this.account,
        this.gasPriceGwei,
      )
        .then(() => {
          this.checkApproveForToken(token);
          this.$store.commit('odosData/changeState', {
            field: 'isShowDecreaseAllowanceButton',
            val: false,
          });
        })
        .catch((e) => {
          this.$store.commit('odosData/changeState', {
            field: 'isShowDecreaseAllowanceButton',
            val: true,
          });
          console.error('Clear approve failed. ', e);
        });
    },
    async checkApproveForToken(token: any, checkedAllowanceValue?: any) {
      // checkedAllowanceValue in wei
      const { selectedToken } = token;
      if (
        selectedToken.address === '0x0000000000000000000000000000000000000000'
      ) {
        selectedToken.approveData.approved = true;
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];
      const allowanceValue = await getAllowanceValue(
        tokenContract,
        this.account,
        this.routerContract.options.address,
      );

      selectedToken.approveData.allowanceValue = allowanceValue * 1;
      if (!selectedToken.approveData.allowanceValue) {
        selectedToken.approveData.approved = false;
        return;
      }

      if (!checkedAllowanceValue) {
        selectedToken.approveData.approved = true;
        return;
      }

      selectedToken.approveData.approved = selectedToken
        .approveData.allowanceValue >= checkedAllowanceValue;
    },

    async approve(token: any) {
      this.showWaitingModal('Approving in process');

      this.firstSwipeClickOnApprove = true;

      await this.checkApproveForToken(token, token.contractValue);
      const { selectedToken } = token;
      if (selectedToken.approveData.approved) {
        this.closeWaitingModal();
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];
      const approveValue = this.web3.utils.toWei(
        '10000000',
        token.selectedToken.weiMarker,
      );

      approveToken(
        tokenContract,
        this.routerContract.options.address,
        approveValue,
        this.account,
        this.gasPriceGwei,
      )
        .then(() => {
          this.checkApproveForToken(token, token.contractValue);
          this.closeWaitingModal();
        })
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
        });
    },

    getRequestInputTokens(ignoreNullable?: any) {
      const inputTokens = [];
      for (let i = 0; i < this.selectedInputTokens.length; i++) {
        const token: any = this.selectedInputTokens[i];
        const { selectedToken } = token;
        if (!ignoreNullable && !token.value) {
          console.log('token value is 0: ', token);
          continue;
        }

        if (token.value > 0) {
          inputTokens.push({
            tokenAddress: selectedToken.address,
            amount: String(token.contractValue),
          });
        }
      }
      return inputTokens;
    },
    getRequestOutputTokens(ignoreNullable?: any) {
      const outputTokens = [];
      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        const { selectedToken } = token;
        if (!ignoreNullable && !token.value) {
          console.log('output token value is 0: ', token);
          continue;
        }

        outputTokens.push({
          tokenAddress: selectedToken.address,
          proportion: String(token.value),
        });
      }
      return outputTokens;
    },

    lockProportion(isLock: any, token: any) {
      if (this.outputTokensWithSelectedTokensCount <= 1 && !isLock) {
        console.log("It's the first token, unlock is disabled");
        return;
      }

      token.locked = isLock;
      this.recalculateOutputTokensSum();
    },
    updateSliderValue(token: any, value: any) {
      token.value = value;

      this.subtraction(token, this.freeOutputTokensPercentage - value);
      this.recalculateOutputTokensSum();

      this.updateQuotaInfo();

      if (token.value === 0 || !token.value) {
        this.updateQuotaInfo();
      }
    },
    recalculateOutputTokensSum() {
      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        let sum = (this.sumOfAllSelectedTokensInUsd * token.value) / 100;
        sum = this.swapMethod === 'BUY'
          ? sum * token.selectedToken.price
          : sum / token.selectedToken.price;
        // token.sum = this.formatMoney(sum, 4)
      }
    },

    subtraction(token: any, difference: any) {
      const tokens = this.getActiveTokens(token);

      if (tokens.length === 0) {
        return;
      }

      const proportion = Math.floor(difference / tokens.length);
      const remains = difference % tokens.length;

      this.calculateProportions(tokens, proportion);

      // Distribute the remains among the tokens
      for (let i = 0; i < remains; i++) {
        tokens[i].value += 1;
      }
    },

    calculateProportions(tokens: any, proportion: any) {
      for (let i = 0; i < tokens.length; i++) {
        tokens[i].value = proportion;
      }

      this.recalculateOutputTokensSum();
    },

    getOutputsTokensPercentage() {
      let tokensPercentage = 0;
      for (const token of this.outputTokens) {
        tokensPercentage += token.value;
      }

      return tokensPercentage;
    },

    addSelectedTokenToList(selectedToken: any, swapMethod: any, selectTokenType: any) {
      if (this.isInputToken(swapMethod, selectTokenType)) {
        this.addSelectedTokenToInputList(selectedToken);
        this.removeOutputToken(selectedToken.id);
        this.addTokensEmptyIsNeeded();
        return;
      }

      this.addSelectedTokenToOutputList(selectedToken);
      this.removeInputToken(selectedToken.id);
      this.addTokensEmptyIsNeeded();
    },
    addTokensEmptyIsNeeded() {
      this.addInputTokenEmptyIsNeeded();
      this.addOutputTokenEmptyIsNeeded();
    },
    addInputTokenEmptyIsNeeded() {
      if (this.inputTokens.length === 0) {
        this.addNewInputToken();
      }
    },
    addOutputTokenEmptyIsNeeded() {
      if (this.outputTokens.length === 0) {
        this.addNewOutputToken();
      }
    },
    addSelectedTokenToInputList(selectedToken: any) {
      const newInputToken = getNewInputToken();
      newInputToken.selectedToken = selectedToken;
      this.inputTokens.push(newInputToken);
      this.removeAllWithoutSelectedTokens(this.inputTokens);

      this.checkApproveForToken(newInputToken);
    },
    addSelectedTokenToOutputList(selectedToken: any) {
      const newOutputToken = getNewOutputToken();
      newOutputToken.selectedToken = selectedToken;
      this.outputTokens.push(newOutputToken);
      this.removeAllWithoutSelectedTokens(this.outputTokens);
      this.recalculateOutputTokensSum();
      this.resetOutputs();
    },
    removeSelectedTokenFromList(selectedToken: any, swapMethod: any, selectTokenType: any) {
      if (this.isInputToken(swapMethod, selectTokenType)) {
        this.removeInputToken(selectedToken.id);
        if (this.inputTokens.length === 0) {
          this.addNewInputToken();
        }
        return;
      }

      this.removeOutputToken(selectedToken.id);
      if (this.outputTokens.length === 0) {
        this.addNewOutputToken();
      }
    },
    removeAllWithoutSelectedTokens(tokens: any) {
      const tokensToRemove = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].selectedToken) {
          continue;
        }

        tokensToRemove.push(tokens[i]);
      }

      for (let i = 0; i < tokensToRemove.length; i++) {
        this.removeToken(tokens, tokensToRemove[i].id);
      }
    },
    clearAllSelectedTokens() {
      for (let i = 0; i < this.inputTokens.length; i++) {
        if (this.inputTokens[i].selectedToken) {
          this.inputTokens[i].selectedToken.selected = false;
        }
      }

      for (let i = 0; i < this.outputTokens.length; i++) {
        if (this.outputTokens[i].selectedToken) {
          this.outputTokens[i].selectedToken.selected = false;
        }
      }

      this.clearAllTokens();
    },
    clearAllTokens() {
      this.inputTokens = [];
      this.outputTokens = [];
    },
    isInputToken(swapMethod: any, selectTokenType: any) {
      if (swapMethod === 'BUY' && selectTokenType === 'ALL') {
        return true;
      }

      if (swapMethod === 'SELL' && selectTokenType === 'OVERNIGHT') {
        return true;
      }

      if (swapMethod === 'BUY' && selectTokenType === 'OVERNIGHT') {
        return false;
      }

      if (swapMethod === 'SELL' && selectTokenType === 'ALL') {
        return false;
      }

      console.error(
        'Token type not detected by method and selected type.',
        swapMethod,
        selectTokenType,
      );
      throw Error;
    },
    isOutputToken(swapMethod: any, selectTokenType: any) {
      return !this.isInputToken(swapMethod, selectTokenType);
    },
    isSlidersOutOfLimit(additionalPercent: any) {
      if (!additionalPercent) {
        additionalPercent = 0;
      }
      return this.getOutputsTokensPercentage() + additionalPercent > 100;
    },
    getActiveTokens(currentToken: any) {
      // let count = 1
      const sliders = [];
      for (let i = 0; i < this.outputTokens.length; i++) {
        const token: any = this.outputTokens[i];
        if (token.id === currentToken.id || token.locked) {
          continue;
        }

        sliders.push(token);
      }
      console.log('Sliders array in getActiveTokens: ', sliders);
      return sliders;
    },

    showSelectTokensModals(isShow: any) {
      this.isShowSelectTokensModal = isShow;
    },
    selectInputToken() {
      if (this.swapMethod === 'BUY') {
        this.openModalWithSelectTokenAndBySwapMethod('ALL');
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.openModalWithSelectTokenAndBySwapMethod('OVERNIGHT');
        return;
      }

      console.error(
        'Swap method type not found when select input tokens. ',
        this.swapMethod,
      );
    },
    selectOutputToken() {
      if (this.swapMethod === 'BUY') {
        this.openModalWithSelectTokenAndBySwapMethod('OVERNIGHT');
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.openModalWithSelectTokenAndBySwapMethod('ALL');
        return;
      }

      console.error(
        'Swap method type not found when select output tokens. ',
        this.swapMethod,
      );
    },
    openModalWithSelectTokenAndBySwapMethod(tokenType: any) {
      this.setSelectTokenType(tokenType);
      this.showSelectTokensModals(true);
    },
    setSwapMethod(method: any) {
      this.swapMethod = method;
    },
    setSelectTokenType(type: any) {
      this.selectTokenType = type;
    },

    updateQuotaInfo() {
      console.log('updateQuotaInfo');
      if (!this.tokensQuotaCounterId) {
        // first call
        this.tokensQuotaCounterId = -1;
        // update
        this.simulateSwap();
        return;
      }

      this.tokensQuotaCheckerSec = 0;
      const intervalId = setInterval(async () => {
        this.isSumulateIntervalStarted = true;
        this.tokensQuotaCheckerSec++;

        if (this.tokensQuotaCheckerSec >= 3) {
          console.log('INTERVAL STARTED > 3');
          if (this.tokensQuotaCounterId === intervalId) {
            this.tokensQuotaCheckerSec = 0;
            try {
              // update
              this.simulateSwap();
            } catch (e) {
              console.error(e);
              clearInterval(intervalId);
            } finally {
              clearInterval(intervalId);
            }
          } else {
            clearInterval(intervalId);
          }
        }
      }, 1000);

      this.tokensQuotaCounterId = intervalId;
    },

    initTopInputTokensByBalance(tokens: any[]) {
      if (this.viewType !== 'SWIPE' || !tokens || tokens.length === 0) {
        return;
      }

      // find top 6 tokens by balance and order desc
      let topTokens = tokens
        .sort((a, b) => b.balanceData.balance - a.balanceData.balance)
        .slice(0, 6);

      // find all with balance
      topTokens = topTokens.filter((token: any) => token.balanceData.balance > 0);

      for (let i = 0; i < topTokens.length; i++) {
        const token: any = topTokens[i];
        token.selected = true;
        this.addSelectedTokenToInputList(token);
      }

      setTimeout(() => {
        maxAll(this.selectedInputTokens, this.web3.utils.toWei);
        this.updateStablecoinsListFunc(tokens);
      });
    },

    initTabName(path: any, queryParams: any) {
      this.$router.push({
        path,
        query: queryParams || {},
      });
    },
  },
});
</script>

<style scoped>
.powered-image img {
  height: 36px;
  background-color: #000;
  border-radius: 8px;
}
.swap-form-wrap,
.loader-container {
  height: 100%;
  width: calc(100% + 3px);
}

.swap-container-full {
  height: 100%;
}

.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.swap-container {
  height: 100%;
  background: var(--ov-bg);
  border-radius: 0 0 30px 30px;
  border: 2px solid black;
  border-top: 0;
}

@media only screen and (max-width: 960px) {
  .swap-container {
    padding: 10px 20px;
    gap: 8px;
    background: var(--swap-main-banner-background);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
  }

  .add-token-text {
    font-size: 14px;
    line-height: 24px;
  }

  .swap-title {
    font-size: 18px;
    line-height: 28px;
  }

  .swap-button-title {
    font-size: 16px;
    line-height: 22px;
  }

  .disable-button-title {
    font-size: 16px;
    line-height: 22px;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .swap-container {
    padding: 40px 30px;
    gap: 8px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-title {
    font-size: 18px;
    line-height: 28px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }

  .disable-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .swap-container {
    padding: 40px 30px;
    gap: 8px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }

  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-title {
    font-size: 18px;
    line-height: 28px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }

  .disable-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

@media only screen and (min-width: 1300px) {
  .swap-container {
    padding: 30px 20px;
    gap: 8px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }

  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-title {
    font-size: 18px;
    line-height: 28px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }

  .disable-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

div {
}

.swap-header {
}

.swap-settings {
  text-align: end;
  cursor: pointer;
}

.swap-body {
}

.swap-footer {
}

.add-token-text {
  font-style: normal;
  font-weight: 400;

  color: #1c95e7;
  cursor: pointer;
}

.add-token-text-disabled {
  cursor: default !important;
  color: #707a8b;
}

.swap-title {
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: 400;

  color: var(--main-gray-text);
}

.input-component-container {
  margin-bottom: 4px;
}

.max-all {
  text-align: end;
}
.change-swap-container {
  width: 44px;
  height: 44px;

  background: var(--swap-arrow-bg);
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  display: table;
  margin: 0 auto;
  margin-bottom: 10px;
}

.change-swap-image {
  text-align: center; /* center the child element's content horizontally */
  padding-top: 8px;
}

.powered-text {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: #adb3bd;

  text-align: end;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  align-items: center;
  gap: 8px;
  color: #fff;

  width: 100%;
  height: 48px;

  padding: 15px 0;

  /* Blue gradient */

  background: linear-gradient(
    91.26deg,
    #28a0f0 0%,
    rgba(6, 120, 196, 0.9917) 100%
  );
  border-radius: 2px;

  cursor: pointer;
}

.swap-button-title {
  font-style: normal;
  font-weight: 400;

  color: #ffffff;
}

.disable-button {
  justify-content: center;
  align-items: center;
  padding: 8px 12px;

  height: 48px;

  background: var(--action-btn-bg);
  border-radius: 2px;
}

.disable-button-title {
  text-align: center;
  align-items: center;
  gap: 8px;

  width: 100%;

  padding-top: 7px;

  font-style: normal;
  font-weight: 400;

  color: var(--progress-text);
}

.decrease-allowance {
  font-size: 14px;
  font-weight: 400;
  height: auto;
  color: var(--main-gray-text);
  letter-spacing: 0.1px;
  line-height: 22px;
  cursor: pointer;
}

.transaction-info-container {
  padding: 20px;
  max-width: 600px;
}

.transaction-info-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: #707a8b;
}

.transaction-info {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: end;

  color: var(--main-gray-text);
}

.transaction-info-additional {
  font-style: normal;
  font-weight: 200;
  font-size: 16px;
  line-height: 24px;

  color: var(--main-gray-text);
}

.transaction-info-address {
  text-decoration: underline;
  font-weight: bold;
  text-align: end;
  color: var(--main-gray-text);
}

.transaction-info-footer {
  border-top: 1px solid var(--dividers);
  padding-top: 22px;
}

.transaction-info-body {
  padding-bottom: 20px;
}

.loader-container {
  min-height: 80px;
}

.rotate {
  transform-origin: center;
  transition: transform 0.7s ease;
}

.rotate:hover {
  transform: rotate(180deg);
}

.dont-work-on-network {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: #cf3f92;
}

.dont-work-on-network-container {
  text-align: center;
}

.slippage-info-container {
  background: rgba(254, 127, 45, 0.1);
  padding: 8px;
  width: 100%;
  margin-top: 10px;
  text-align: center;
}

.slippage-info-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(254, 127, 45, 1);
}

.odos-fees-container {
  display: flex;
  flex-direction: row;
}

.odos-fees-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: end;

  color: var(--secondary-gray-text);
}

.with-tooltip {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
