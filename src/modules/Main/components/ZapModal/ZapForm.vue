<template>
  <div>
    <div
      v-if="zapPool.chain !== networkId"
      class="swap-container"
    >
      <div class="swap-body">
        <div>
          <div class="mb-4 mt-1">
            <PoolLabel :pool="zapPool" />
          </div>
        </div>
        <!-- <ZapChangeNetwork :zap-pool="zapPool" /> -->
      </div>
    </div>
    <div
      v-else
      class="swap-container"
    >
      <div
        v-if="!isTokensLoadedAndFiltered"
        class="loader-container pb-15"
      >
        SPINNER
      </div>

      <div v-else>
        <div class="swap-body">
          <div>
            <div class="mb-4 mt-1">
              <PoolLabel :pool="zapPool" />
            </div>

            <div class="input-swap-container">
              <div
                v-for="token in (inputTokens as any)"
                :key="token.id"
                class="input-component-container"
              >
                <TokenForm
                  :token-info="token"
                  :remove-item-func="removeOutputToken"
                  :is-token-removable="isOutputTokensRemovable"
                  :select-token-func="selectInputToken"
                  :is-input-token="false"
                  :disabled="true"
                />
              </div>
              <div class="row">
                <div class="col-6">
                  <div
                    v-if="isInputTokensAddAvailable"
                    class="add-token-text"
                    @click="addNewInputToken"
                    @keypress="addNewInputToken"
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
              <div class="change-swap-container">
                <div class="change-swap-image">
                  change-swap-vector
                </div>
              </div>
            </div>

            <div class="out-swap-container pt-5">
              <div
                v-for="token in (outputTokens as any)"
                :key="token.id"
                class="input-component-container"
              >
                <TokenForm
                  :token-info="token"
                  :remove-item-func="removeOutputToken"
                  :is-token-removable="isOutputTokensRemovable"
                  :select-token-func="selectOutputToken"
                  :is-input-token="false"
                  :disabled="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="sumOfAllSelectedTokensInUsd">
          <div class="transaction-info-container">
            <div class="transaction-info-body">
              <div class="row">
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
                          (sumOfAllSelectedTokensInUsd
                            * multiSwapOdosFeePercent)
                            / 100,
                          3,
                        )
                      }})$
                    </span>
                  </div>
                </div>
              </div>

              <div class="row">
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
            </div>
          </div>
        </div>

        <div style="padding-top: 10px">
          <SwapSlippageSettings
            :currentSlippageChanged="handleCurrentSlippageChanged"
            :selected-input-tokens="selectedInputTokens"
            :selected-output-tokens="selectedOutputTokens"
          />
        </div>

        <div
          v-if="zapPool && zapPool.platform === 'Swapbased'"
          class="slippage-info-container"
        >
          <div class="slippage-info-title">
            <BaseIcon name="swapWarn" />
            By joining this pool, you are being notified that SwapBased takes a
            1% deposit fee.
          </div>
        </div>

        <div
          class="odos-fees-container mt-5"
          v-if="ifMoreThanOneSelectedTokensAdded"
        >
          <div>
            circle
          </div>
          <div>
            <div class="odos-fees-title">
              Odos collects 0.01% fee for multi-input/multi-output swaps.
            </div>
          </div>
        </div>

        <div class="swap-footer pt-5">
          <div
            v-if="!account"
            class="swap-button-container"
          >
            <div
              class="swap-button"
              @click="connectWallet"
              @keypress="connectWallet"
            >
              <div class="swap-button-title">
                <div>CONNECT WALLET</div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="swap-button-container"
          >
            <div
              v-if="isDisableButton"
              class="disable-button"
            >
              <div class="disable-button-title">
                <div>
                  {{ disableButtonMessage }}
                </div>
              </div>
            </div>
            <div
              v-else-if="isAnyInputsNeedApprove"
              class="swap-button"
              @click="approve(firstInputInQueueForToApprove)"
              @keypress="approve(firstInputInQueueForToApprove)"
            >
              <div class="swap-button-title">
                <div v-if="firstInputInQueueForToApprove">
                  APPROVE
                  {{ firstInputInQueueForToApprove.selectedToken?.symbol }}
                </div>
              </div>
            </div>
            <div
              v-else-if="additionalSwapStepType === 'APPROVE'"
              class="swap-button"
              @click="
                toApproveAndDepositSteps(lastZapResponseData, lastPoolInfoData)
              "
              @keypress="
                toApproveAndDepositSteps(lastZapResponseData, lastPoolInfoData)
              "
            >
              <div class="swap-button-title">
                <div>APPROVE GAUGE</div>
              </div>
            </div>
            <div
              v-else-if="additionalSwapStepType === 'DEPOSIT'"
              @click="
                depositGauge(
                  lastPutIntoPoolEvent,
                  lastReturnedToUserEvent,
                  lastPoolInfoData,
                  lastNftTokenId,
                )
              "
              @keypress="
                depositGauge(
                  lastPutIntoPoolEvent,
                  lastReturnedToUserEvent,
                  lastPoolInfoData,
                  lastNftTokenId,
                )
              "
              class="swap-button"
            >
              <div class="swap-button-title">
                <div>STAKE LP</div>
              </div>
            </div>
            <div
              v-else
              @click="stake()"
              @keypress="stake()"
              class="swap-button"
            >
              <div class="swap-button-title">
                <div
                  v-if="
                    currentZapPlatformContractType
                      && currentZapPlatformContractType.type
                        === 'LP_STAKE_DIFF_STEPS'
                  "
                >
                  DEPOSIT
                </div>
                <div v-else>STAKE</div>
              </div>
            </div>
          </div>

          <div class="label-container pt-3">
            <div
              v-if="selectedInputTokens.length > 0"
              class="row"
            >
              <div class="col-12">
                <!-- <ZapSteps
                  :selected-input-tokens="selectedInputTokens"
                  :click-on-stake="clickOnStake"
                  :additional-swap-step-type="additionalSwapStepType"
                  :current-zap-platform-contract-type="
                    currentZapPlatformContractType
                  "
                /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SelectTokensModal
      :is-show="isShowSelectTokensModal"
      :select-token-input="true"
      :tokens="allTokensList"
      :is-all-data-loaded="isAllDataLoaded"
      :is-ovn-swap="true"
      :selected-tokens="inputTokens"
      @set-show="showSelectTokensModals"
      @add-token-to-list="addSelectedTokenToList"
      @remove-token-from-list="removeSelectedTokenFromList"
    />

    <SuccessZapModal
      :is-show="showSuccessZapin"
      :success-data="successData"
      :set-show-func="triggerSuccessZapin"
    />
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { useEventBus } from '@vueuse/core';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import axios from 'axios';
import {
  updateTokenValue,
  maxAll,
  getDefaultSecondtoken,
  getSecondDefaultSecondtoken,
  getNewOutputToken,
  getNewInputToken
} from '@/store/helpers/index.ts';
import {
  getProportion,
  calculateProportionForPool,
  depositAllAtGauge,
  checkApproveForGauge
} from '@/store/views/main/zapin/helpers.ts';
import odosApiService from '@/services/odos-api-service.ts';


import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { formatMoney } from '@/utils/numbers.ts';
import TokenForm from '@/modules/Main/components/ZapModal/TokenForm.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import SelectTokensModal from '@/modules/Main/components/Common/TokensModal/Index.vue';
import SwapSlippageSettings from '@/modules/Main/components/Common/SwapSlippageSettings.vue';
import SuccessZapModal from './SuccessZapModal.vue';
import { poolsInfoMap } from '@/store/views/main/zapin/mocks.ts';
import { ethers } from 'ethers';
import { approveToken, clearApproveToken, getAllowanceValue } from '@/utils/contractApprove';
// import ZapSteps from '@/components/zap/ZapSteps.vue';
// import ZapChangeNetwork from '@/components/zap/ZapChangeNetwork.vue';

export default {
  name: 'ZapForm',
  components: {
    PoolLabel,
    BaseIcon,
    SuccessZapModal,
    SwapSlippageSettings,
    SelectTokensModal,
    TokenForm,
  },
  props: {
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },

    poolTokensForZapMap: {
      type: Object,
      required: true,
    },

    typeOfPool: {
      // OVN or ALL
      type: String,
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

      isSwapLoading: false,
      isSumulateSwapLoading: false,
      pathViz: null,
      slippagePercent: 0.05,
      multiSwapOdosFeePercent: 0.01,

      tokensQuotaCounterId: null as any,
      tokensQuotaCheckerSec: 0,

      clickOnStake: false,

      sourceLiquidityBlacklist: ['Hashflow', 'Wombat'], // "Overnight Exchange"
      mapExcludeLiquidityPlatform: {
        Chronos: ['Chronos Volatile'], // "Chronos Stable"
        // Pancake: ["PancakeSwap", "PancakeSwap V3"],
        // Beefy: ["Aerodrome Stable", "Aerodrome Volatile"],
        // Aerodrome: ["Aerodrome Volatile"],
        Velodrome: [
          'Velodrome Stable',
          'Velodrome Volatile',
          'Velodrome V2 Converter',
          'Velodrome V2 Stable',
          'Velodrome V2 Volatile',
        ],
        // Alienbase: ["Alien Base", "Alien Base Stable"],
        // Convex: ["Curve Crypto Registry", "Curve Factory", "Curve Registry"]
      } as any,
    };
  },
  mounted() {
    if (this.zapPool.chain !== this.networkId) {
      return;
    }

    this.firstInit();
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'tokensContractMap',
      'isShowDecreaseAllowance',
      'additionalSwapStepType',
      'lastZapResponseData',
      'lastPoolInfoData',
      'lastPutIntoPoolEvent',
      'lastReturnedToUserEvent',
      'lastNftTokenId',
      'showSuccessZapin',
      'successData',
      'swapResponseConfirmInfo'
    ]),

    ...mapState('zapIn', [
      'currentZapPlatformContractType',
      'zapContract',
      'gaugeContract',
      'poolTokenContract',

    ]),
    ...mapGetters('odosData', [
      'allTokensList',
      'isAllDataLoaded',
      'isAvailableOnNetwork',
      'odosReferalCode'
    ]),
    ...mapGetters('network', ['getParams', 'networkId']),
    ...mapGetters('theme', ['light']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('gasPrice', ['gasPriceGwei']),

    noneOvnTokens() {
      return this.allTokensList.filter((item: any) => item.symbol !== 'OVN');
    },

    ovnTokens() {
      return this.allTokensList.filter((item: any) => item.symbol === 'OVN');
    },

    isInputTokensRemovable() {
      return this.inputTokens.length > 1;
    },

    isOutputTokensRemovable() {
      return false; // this.outputTokens.length > 1;
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

    selectedInputTokens() {
      return this.inputTokens.filter((item: any) => item.selectedToken);
    },
    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },

    noneOvnInputTokens() {
      return this.inputTokens.filter(
        (item: any) => item.selectedToken && item.selectedToken.symbol !== 'OVN',
      );
    },

    noneOvnOutputTokens() {
      return this.outputTokens.filter(
        (item: any) => item.selectedToken && item.selectedToken.symbol !== 'OVN',
      );
    },

    selectedOvnInputTokens() {
      return this.selectedInputTokens.filter(
        (item: any) => item.selectedToken.symbol === 'OVN',
      );
    },
    selectedOvnOutputTokens() {
      return this.selectedOutputTokens.filter(
        (item: any) => item.selectedToken.symbol === 'OVN',
      );
    },
    selectedNoneOvnInputTokens() {
      return this.selectedInputTokens.filter(
        (item: any) => item.selectedToken.symbol !== 'OVN',
      );
    },
    selectedNoneOvnOutputTokens() {
      return this.selectedOutputTokens.filter(
        (item: any) => item.selectedToken.symbol !== 'OVN',
      );
    },
    totalNoneOvnUsdInputsUsdBalance() {
      let totalBalance = 0;
      for (let i = 0; i < this.selectedNoneOvnInputTokens.length; i++) {
        const token: any = this.selectedNoneOvnInputTokens[i];
        totalBalance += token.selectedToken.balanceData.balanceInUsd;
      }

      return totalBalance;
    },
    totalNoneOvnUsdInputsUsdValue() {
      let totalValue = 0;
      for (let i = 0; i < this.selectedNoneOvnInputTokens.length; i++) {
        const token: any = this.selectedNoneOvnInputTokens[i];
        totalValue += token.usdValue;
      }

      return totalValue;
    },
    totalOvnUsdInputsUsdValue() {
      let totalValue = 0;
      for (let i = 0; i < this.selectedOvnInputTokens.length; i++) {
        const token: any = this.selectedOvnInputTokens[i];
        totalValue += token.usdValue;
      }

      return totalValue;
    },

    isOvnValueOverflow() {
      return (
        this.typeOfPool === 'OVN'
        && this.totalOvnUsdInputsUsdValue > this.totalNoneOvnUsdInputsUsdValue
      );
    },

    isAnyInputsNeedApprove() {
      return this.allInputsWithNotApproved.length > 0;
    },
    allInputsWithNotApproved() {
      return this.selectedInputTokens.filter(
        (token: any) => !token.selectedToken.approveData.approved,
      );
    },
    firstInputInQueueForToApprove(): any {
      return this.isAnyInputsNeedApprove
        ? this.allInputsWithNotApproved[0]
        : null;
    },

    isDisableButton() {
      return (
        this.inputTokensWithSelectedTokensCount === 0
        || this.outputTokensWithSelectedTokensCount === 0
        || this.swapResponseConfirmInfo.waitingConformation
        || !this.isAvailableOnNetwork
        || !this.isAnyTokensBalanceIsInsufficient
        || !this.isAmountEntered
        || this.isOvnValueOverflow
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

      if (this.isOvnValueOverflow) {
        return 'OVN VALUE IS OVERFLOW';
      }

      if (this.swapResponseConfirmInfo.waitingConformation) {
        return (
          `Confirm in your wallet (${
            this.swapResponseConfirmInfo.duration
          } sec)`
        );
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
  watch: {
    sumOfAllSelectedTokensInUsd(val, oldVal) {
      this.recalculateOutputTokensSum();
    },

    isTokensLoadedAndFiltered(val, oldVal) {
      if (val) {
        this.clearForm();
      }
    },
    networkId(newVal, oldVal) {
      if (newVal) {
        // hide swap form and clear all(watch function) data,
        // after new token loaded collection
        this.isTokensLoadedAndFiltered = false;

        if (!this.isAvailableOnNetwork) {
          this.mintAction();
        }

        if (this.zapPool.chain === this.networkId) {
          this.firstInit();

          setTimeout(() => {
            this.loadZapContract();
          }, 300);
        }
      }
    },
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
      // this.updateButtonDisabledFunc(val);
    },

    isFirstBalanceLoaded(val) {
      if (val) {
        // if router with path /claim
        if (this.$route.path === '/presale/claim') {
          this.addOvnTokenToInput();
          this.initDefaultTopInputTokensByBalance(this.noneOvnTokens);
        }
      }
    },
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('odosData', [
      'triggerSuccessZapin', 
        'loadChains',
        'loadTokens',
        'initContractData',
        'loadBalances',
        'triggerSuccessZapin',
        'startSwapConfirmTimer'
      ]),
    ...mapActions('zapIn', ['loadZapContract']),
    ...mapActions('errorModal', ['showErrorModal', 'showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('track', ['trackClick']),

    ...mapMutations('odosData', ['changeState']),
    updateTokenValue,
    maxAll,
    formatMoney,

    maxAllMethod() {
      maxAll(this.selectedInputTokens, this.checkApproveForToken, this.updateQuotaInfo);
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    firstInit() {
      this.changeState({
        field: 'zapPoolRoot',
        val: this.zapPool,
      })
      this.changeState({
        field: 'allTokensListeparationScheme',
        val: 'POOL_SWAP'
      })
      this.changeState({
        field: 'typeOfPoolScheme',
        val: this.typeOfPool
      })

      // todo: move to backend
      const poolTokens = this.poolTokensForZapMap[this.zapPool.address];
      if (!poolTokens) {
        return;
      }

      this.$store.commit('odosData/changeState', {
          field: 'listOfBuyTokensAddresses',
          val: [poolTokens[0].address, poolTokens[1].address],
        });
      this.init();

      if (!this.isAvailableOnNetwork) {
        this.mintAction();
      }
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
    addOvnTokenToInput() {
      if (!this.ovnTokens || !this.ovnTokens.length) {
        return;
      }

      const ovnToken = this.ovnTokens[0];
      ovnToken.selected = true;
      this.addSelectedTokenToInputList(ovnToken, true);
    },
    addDefaultPoolToken() {
      const poolSelectedToken = getDefaultSecondtoken(this.$store.state.odosData);
      const ovnSelectSelectedToken = getSecondDefaultSecondtoken(this.$store.state.odosData);
      if (!poolSelectedToken || !ovnSelectSelectedToken) {
        this.addNewInputToken();
        this.addNewOutputToken();
        return;
      }

      poolSelectedToken.selected = true;
      ovnSelectSelectedToken.selected = true;

      if (this.swapMethod === 'BUY') {
        this.addSelectedTokenToOutputList(poolSelectedToken, true, 50);
        this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);
        this.addNewInputToken();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addSelectedTokenToInputList(poolSelectedToken, true);
        this.addSelectedTokenToInputList(ovnSelectSelectedToken, true);
        this.addNewOutputToken();
        return;
      }

      console.error(
        'Error when add default ovn token. Method not found: ',
        this.swapMethod,
      );
    },
    addNewOutputToken() {
      this.outputTokens.push(getNewOutputToken());
    },
    removeOutputToken(id: string | number) {
      this.removeToken(this.outputTokens, id);
      this.resetOutputs();
    },
    addNewInputToken() {
      this.inputTokens.push(getNewInputToken());
    },
    removeInputToken(id: string | number) {
      this.removeToken(this.inputTokens, id);
      this.recalculateOvnTokenByAnotherTotalBalances();
    },

    removeToken(tokens: any[], id: string | number) {
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
    },
    odosAssembleRequest(requestData: any) {
      return odosApiService
        .assembleRequest(requestData)
        .then((data) => data)
        .catch((e) => {
          console.log('Assemble request error: ', e);
        });
    },
    async odosSwapRequest(requestData: any) {
      return odosApiService
        .quoteRequest(requestData)
        .then((data) => {
          console.log('Response data for odos swap request: ', data);
          this.$store.commit('odosData/changeState', {
            field: 'swapResponseInfo',
            val: data,
          });
          return data;
        })
        .catch((e) => {
          console.log('Swap request error: ', e);
          this.closeWaitingModal();
          if (e && e.message && e.message.includes('path')) {
            this.showErrorModalWithMsg({ errorType: 'odos-path', errorMsg: e });
            return;
          }

          this.showErrorModalWithMsg({ errorType: 'odos', errorMsg: e });
        });
    },
    changeSwap() {
      if (this.swapMethod === 'BUY') {
        this.setSwapMethod('SELL');
        this.clearForm();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.setSwapMethod('BUY');
        this.clearForm();
        return;
      }

      console.error('Change swap method not found.', this.swapMethod);
    },

    handleCurrentSlippageChanged(newSlippage: number) {
      this.slippagePercent = newSlippage;
    },

    finishTransaction() {
      this.clearForm();
      this.closeWaitingModal();
    },

    clearForm() {
      this.clearAllSelectedTokens();

      if (this.swapMethod === 'BUY') {
        this.addDefaultPoolToken();
        return;
      }

      if (this.swapMethod === 'SELL') {
        this.addDefaultPoolToken();
        return;
      }

      console.error('Clear form, swap method not found.', this.swapMethod);
    },
    resetOutputs() {
      if (!this.selectedOutputTokens.length) {
        return;
      }

      if (this.selectedOutputTokens.length === 2) {
        for (let i = 0; i < this.selectedOutputTokens.length; i++) {
          const token: any = this.selectedOutputTokens[i];
          token.value = 50;
        }
        return;
      }

      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        token.value = 0;
      }

      // init first token value
      this.selectedOutputTokens[0].value = 100;
    },
    async stake() {
      try {
        this.trackClick({
          action: 'click_form_zap_in_stake',
          event_category: 'Button click',
          event_label: 'Button zap in stake click',
        });
      } catch (e) {
        console.error('Track error:', e);
      }

      if (!this.zapPool) {
        return;
      }

      this.lastPoolInfoData = poolsInfoMap[this.zapPool.address];
      if (!this.lastPoolInfoData) {
        return;
      }

      if (this.isSwapLoading) {
        return;
      }

      if (
        this.inputTokensWithSelectedTokensCount < 1
        || this.outputTokensWithSelectedTokensCount < 1
      ) {
        return;
      }

      this.clickOnStake = true;
      this.isSwapLoading = true;

      const actualGas = await odosApiService.getActualGasPrice(this.networkId);
      const outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
      const outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;

      const reserves = await getProportion(
        this.zapPool.address,
        this.zapPool,
      );
      const sumReserves = reserves.token0Amount * outputToken0Price
        + reserves.token1Amount * outputToken1Price;

      const userInputTokens = this.selectedInputTokens;
      const poolOutputTokens = this.selectedOutputTokens;
      const formulaInputTokens = [];
      let formulaOutputTokens = [];
      for (let i = 0; i < userInputTokens.length; i++) {
        const inputToken = userInputTokens[i];
        const userInputToken = inputToken.selectedToken;

        const isFindUserInputTokenInPoolTokens = poolOutputTokens.find(
          (poolToken) => poolToken.selectedToken.address === userInputToken.address,
        );

        console.log(
          isFindUserInputTokenInPoolTokens,
          'isFindUserInputTokenInPoolTokens',
        );
        if (isFindUserInputTokenInPoolTokens) {
          // if user token exist in pool pair, move to output for proportion formula
          formulaOutputTokens.push({
            decimals: userInputToken.decimals,
            address: userInputToken.address,
            contractValue: inputToken.contractValue,
            price: userInputToken.price,
          });
          continue;
        }

        // if user token don't exist in pool pair, move to input for proportion formula
        formulaInputTokens.push({
          decimals: userInputToken.decimals,
          address: userInputToken.address,
          contractValue: inputToken.contractValue,
          price: userInputToken.price,
        });
      }

      // sort output formula and fill amount by 0;
      const formulaResultOutputWithZero = [];
      for (let i = 0; i < poolOutputTokens.length; i++) {
        const outputToken = poolOutputTokens[i];
        const poolOutputToken = outputToken.selectedToken;
        const userInputTokenInFormulaOutputTokens = formulaOutputTokens.find(
          (formulaToken) => formulaToken.address === poolOutputToken.address,
        );
        if (userInputTokenInFormulaOutputTokens) {
          // if user token exist in pool pair, move to output for proportion formula
          formulaResultOutputWithZero.push(userInputTokenInFormulaOutputTokens);
          continue;
        }

        // fill amount with 0
        formulaResultOutputWithZero.push({
          decimals: poolOutputToken.decimals,
          address: poolOutputToken.address,
          contractValue: 0,
          price: poolOutputToken.price,
        });
      }

      // formulaOutputTokens sorted by pool pair and with zero for not exist in output formula.
      formulaOutputTokens = formulaResultOutputWithZero;

      const inputDecimals = formulaInputTokens.map((token: any) => token.decimals);
      const inputAddresses = formulaInputTokens.map((token: any) => token.address);
      const inputAmounts = formulaInputTokens.map((token: any) => token.contractValue);
      const inputPrices = formulaInputTokens.map((token: any) => token.price);

      // (!) List - formulaOutputTokens with 0 amount and sort like in pool pair.
      const outputDecimals = formulaOutputTokens.map((token: any) => token.decimals);
      const outputAddresses = formulaOutputTokens.map((token: any) => token.address);
      const outputAmounts = formulaOutputTokens.map(
        (token: any) => token.contractValue,
      );
      const outputPrices = formulaOutputTokens.map((token: any) => token.price);

      const proportions = calculateProportionForPool({
        inputTokensDecimals: [...inputDecimals],
        inputTokensAddresses: [...inputAddresses],
        inputTokensAmounts: [...inputAmounts],
        inputTokensPrices: [...inputPrices],
        outputTokensDecimals: [...outputDecimals],
        outputTokensAddresses: [...outputAddresses],
        outputTokensAmounts: [...outputAmounts],
        outputTokensPrices: [...outputPrices],
        proportion0: (reserves[0] * outputPrices[0]) / sumReserves,
      });

      proportions.outputTokens = proportions.outputTokens.filter(
        (item: any) => item.proportion > 0,
      );

      const request = {
        chainId: this.networkId,
        inputTokens: proportions.inputTokens,
        outputTokens: proportions.outputTokens,
        gasPrice: actualGas,
        userAddr: this.zapContract.options.address,
        slippageLimitPercent: this.getSlippagePercent(),
      };

      const requestData = {
        chainId: request.chainId,
        inputTokens: request.inputTokens,
        outputTokens: request.outputTokens,
        gasPrice: request.gasPrice,
        userAddr: ethers.getAddress(
          request.userAddr.toLowerCase(),
        ),
        slippageLimitPercent: request.slippageLimitPercent,
        sourceBlacklist: this.getSourceLiquidityBlackList(),
        sourceWhitelist: [],
        simulate: false,
        pathViz: false,
        disableRFQs: false,
        referralCode: this.odosReferalCode,
      };

      this.odosSwapRequest(requestData)
        .then(async (data: any) => {
          const assembleData = {
            userAddr: ethers.getAddress(
              request.userAddr.toLowerCase(),
            ),
            pathId: data.pathId,
            simulate: true,
          };

          this.odosAssembleRequest(assembleData)
            .then(async (responseAssembleData) => {
              await this.initZapInTransaction(
                responseAssembleData,
                proportions.inputTokens,
                proportions.outputTokens,
                proportions,
                this.lastPoolInfoData,
                this.zapPool,
                request.gasPrice,
              );

              this.isSwapLoading = false;
              this.clickOnStake = false;
            })
            .catch((e) => {
              console.error('Odos assemble request failed swap form', e);
              this.isSwapLoading = false;
              this.clickOnStake = false;
            });
        })
        .catch((e) => {
          console.error('Odos swap request failed from zap', e);
          this.isSwapLoading = false;
          this.clickOnStake = false;
        });
    },

    async getOdosRequest(request: any) {
      const swapParams = {
        chainId: request.chainId,
        inputTokens: request.inputTokens,
        outputTokens: request.outputTokens,
        gasPrice: request.gasPrice,
        userAddr: ethers.getAddress(
          request.userAddr.toLowerCase(),
        ),
        slippageLimitPercent: request.slippageLimitPercent,
        sourceBlacklist: this.getSourceLiquidityBlackList(),
        sourceWhitelist: [],
        simulate: false,
        pathViz: false,
        disableRFQs: false,
      };

      // @ts-ignore
      const url = 'https://api.overnight.fi/root/odos/sor/swap';
      let transaction: any;
      try {
        transaction = await axios.post(url, swapParams);
      } catch (e) {
        console.error(`[chronosZap] getSwapTransaction: ${e}`);
        return 0;
      }

      if (transaction.statusCode === 400) {
        console.error(`[chronosZap]  ${transaction.description}`);
        return 0;
      }

      if (transaction.data.transaction === undefined) {
        console.error('[chronosZap] transaction.tx is undefined');
        return 0;
      }

      return transaction.data.transaction;
    },

    getSourceLiquidityBlackList() {
      let sourceBlacklist = [...this.sourceLiquidityBlacklist];
      // excluding platform for big liquidities zapins
      const excludeLiquidityByPlatform = this.mapExcludeLiquidityPlatform[
        this.zapPool.platform
      ];
      if (excludeLiquidityByPlatform && excludeLiquidityByPlatform.length) {
        sourceBlacklist = [...sourceBlacklist, ...excludeLiquidityByPlatform];
      }

      return sourceBlacklist;
    },
    async toApproveAndDepositSteps(data: any, lastPoolInfoData: any) {
      let putIntoPoolEvent;
      let returnedToUserEvent;
      for (const key of Object.keys(data.events)) {
        const value = data.events[key];

        if (key === 'PutIntoPool') {
          putIntoPoolEvent = value;
          this.lastPutIntoPoolEvent = putIntoPoolEvent;
        }

        if (key === 'ReturnedToUser') {
          returnedToUserEvent = value;
          this.lastReturnedToUserEvent = returnedToUserEvent;
        }
      }

      this.stopSwapConfirmTimer();
      this.additionalSwapStepType = 'APPROVE';

      if (lastPoolInfoData.approveType === 'NFT') {
        this.approveNftGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
        );
        return;
      }

      this.approveGauge(
        putIntoPoolEvent,
        returnedToUserEvent,
        lastPoolInfoData,
      );
    },
    async approveNftGauge(
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      lastPoolInfoData: any,
    ) {
      this.showWaitingModal('Approving NFT in process');

      if (!this.lastNftTokenId) {
        try {
          const tokenId = await this.getLastNftId();
          this.lastNftTokenId = tokenId;
          const params = { from: this.account, gasPrice: this.gasPriceGwei };
          this.gaugeContract.methods
            .approve(this.poolTokenContract.options.address, tokenId)
            .send(params)
            .then((data) => {
              this.additionalSwapStepType = 'DEPOSIT';
              this.closeWaitingModal();
              this.depositGauge(
                putIntoPoolEvent,
                returnedToUserEvent,
                lastPoolInfoData,
                this.lastNftTokenId,
              );
            })
            .catch((e) => {
              console.error('Approve nft gauge failed', e);
              this.lastNftTokenId = null;
              this.closeWaitingModal();
            });
        } catch (e) {
          console.error('Approve nft gauge failed', e);
          this.lastNftTokenId = null;
          this.closeWaitingModal();
        }
      } else {
        this.additionalSwapStepType = 'DEPOSIT';
        this.depositGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
          this.lastNftTokenId,
        );
      }
    },
    getLastNftId() {
      return this.gaugeContract.methods
        .balanceOf(this.account)
        .call()
        .then((count: any) => this.gaugeContract.methods
          .tokenOfOwnerByIndex(this.account, count - 1)
          .call()
          .then((tokenId: any) => tokenId));
    },
    async approveGauge(
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      lastPoolInfoData: any,
    ) {
      const approveAmount = 10 ** 24;
      const isGaugeApproved = await checkApproveForGauge(
        this.poolTokenContract,
        this.gaugeContract.options.address,
        approveAmount,
      );
      if (!isGaugeApproved) {
        this.showWaitingModal('Approving gauge in process');
        approveGaugeForStake()
          .then(() => {
            this.additionalSwapStepType = 'DEPOSIT';
            this.closeWaitingModal();
            this.depositGauge(
              putIntoPoolEvent,
              returnedToUserEvent,
              lastPoolInfoData,
            );
          })
          .catch((e: any) => {
            console.error('Error when gauge approve: ', e);
            this.closeWaitingModal();
          });
      } else {
        this.additionalSwapStepType = 'DEPOSIT';
        this.depositGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
        );
      }
    },
    depositGauge(
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      lastPoolInfoData: any,
      lastNftTokenId: any,
    ) {
      this.showWaitingModal('Stake LP in process');

      depositAllAtGauge(this.account, lastPoolInfoData, lastNftTokenId)
        .then((data: any) => {
          this.closeWaitingModal();

          const inputTokens = [...this.selectedInputTokens];
          const outputTokens = [...this.selectedOutputTokens];
          this.triggerSuccessZapin(
            true,
            inputTokens,
            outputTokens,
            data.transactionHash,
            putIntoPoolEvent,
            returnedToUserEvent,
            this.zapPool,
          );

          // event
          const bus = useEventBus('zap-transaction-finished');
          bus.emit(true);
          this.additionalSwapStepType = null;
          this.clearZapData();

          this.loadBalances();
        })
        .catch((e) => {
          this.closeWaitingModal();
          this.additionalSwapStepType = 'DEPOSIT';
        });
    },
    clearZapData() {
      this.lastPutIntoPoolEvent = null;
      this.lastReturnedToUserEvent = null;
      this.lastZapResponseData = null;
    },
    finishSingleStepTransaction(data) {
      let putIntoPoolEvent;
      let returnedToUserEvent;
      for (const key of Object.keys(data.events)) {
        const value = data.events[key];

        if (key === 'PutIntoPool') {
          putIntoPoolEvent = value;
          this.lastPutIntoPoolEvent = putIntoPoolEvent;
        }

        if (key === 'ReturnedToUser') {
          returnedToUserEvent = value;
          this.lastReturnedToUserEvent = returnedToUserEvent;
        }
      }

      const inputTokens = [...this.selectedInputTokens];
      const outputTokens = [...this.selectedOutputTokens];
      this.triggerSuccessZapin(
        true,
        inputTokens,
        outputTokens,
        data.transactionHash,
        putIntoPoolEvent,
        returnedToUserEvent,
        this.zapPool,
      );

      // event
      const bus = useEventBus('zap-transaction-finished');
      bus.emit(true);

      this.clearZapData();
      this.loadBalances();
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any,
      requestOutputTokens: any,
      proportions: any,
      poolInfo: any,
      zapPool: any,
      gasPrice: any,
    ) {
      const gaugeAddress = poolInfo.gauge;
      if (!this.zapContract) {
        console.error(
          'Init zap transactions failed, chronos contract not found. responseData: ',
          responseData,
        );
        return;
      }

      this.startSwapConfirmTimer();

      const requestInput = [];
      for (let i = 0; i < requestInputTokens.length; i++) {
        requestInput.push({
          tokenAddress: requestInputTokens[i].tokenAddress,
          amountIn: requestInputTokens[i].amount,
        });
      }

      const requestOutput = [];
      for (let i = 0; i < requestOutputTokens.length; i++) {
        requestOutput.push({
          tokenAddress: requestOutputTokens[i].tokenAddress,
          receiver: this.zapContract.options.address,
        });
      }

      const txData = {
        inputs: requestInput,
        outputs: requestOutput,
        data: responseData.transaction.data,
      };

      let gaugeData;
      if (
        zapPool.platform === 'Arbidex'
        || zapPool.platform === 'Baseswap'
        || zapPool.platform === 'Alienbase'
      ) {
        gaugeData = {
          gauge: gaugeAddress,
          amountsOut: [
            proportions.amountToken0Out,
            proportions.amountToken1Out,
          ],
          poolId: poolInfo.poolId,
        };
      } else if (zapPool.platform === 'Defiedge') {
        gaugeData = {
          chef: this.lastPoolInfoData.chef,
          pid: this.lastPoolInfoData.poolId,
          gauge: gaugeAddress,
          amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
        };
      } else if (zapPool.platform === 'Pancake') {
        gaugeData = {
          amountsOut: [
            proportions.amountToken0Out,
            proportions.amountToken1Out,
          ],
          pair: gaugeAddress,
        };
      } else {
        gaugeData = {
          gauge: gaugeAddress,
          amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
        };
      }

      this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        gasPrice: this.gasPriceGwei,
      };

      this.zapContract.methods
        .zapIn(txData, gaugeData)
        .send(params)
        .then((data) => {
          this.lastZapResponseData = data;

          if (
            this.currentZapPlatformContractType.type
            === 'LP_WITH_STAKE_IN_ONE_STEP'
          ) {
            this.finishSingleStepTransaction(this.lastZapResponseData);
            return;
          }

          if (
            this.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS'
          ) {
            this.toApproveAndDepositSteps(this.lastZapResponseData, poolInfo);
            return;
          }

          console.error(
            'Error when end of transaction, method type not found. ',
            this.currentZapPlatformContractType,
          );
        })
        .catch((e) => {
          if (e && e.code === 4001) {
            if (e.message === 'User rejected the request.') {
              this.stopSwapConfirmTimer();
              this.clickOnStake = false;
            }
          }
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: e });
        });

      this.isSwapLoading = false;
    },
    clearQuotaInfo() {
      this.pathViz = null;
      this.quotaResponseInfo = null;
      this.swapResponseInfo = null;
    },
    quoteRequest(requestData: any) {
      return odosApiService
        .quoteRequest(requestData)
        .then((data) => {
          console.log('Response data for odos quota request: ', data);
          this.$store.commit('odosData/changeState', {
            field: 'quotaResponseInfo',
            val: data,
          });
          return data;
        })
        .catch((e) => {
          console.log('Quota request error: ', e);
        });
    },
    async recalculateProportion() {
      const reserves = await getProportion(
        this.zapPool.address,
        this.zapPool,
      );

      const outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
      const outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;

      const sumReserves = reserves.token0Amount * outputToken0Price
        + reserves.token1Amount * outputToken1Price;
      this.selectedOutputTokens[0].value = ((reserves[0] * outputToken0Price) / sumReserves) * 100;
      this.selectedOutputTokens[1].value = ((reserves[1] * outputToken1Price) / sumReserves) * 100;

      this.recalculateOutputTokensSum();
    },
    async simulateSwap() {
      if (this.isSumulateSwapLoading) {
        return;
      }

      if (
        this.inputTokensWithSelectedTokensCount < 1
        || this.outputTokensWithSelectedTokensCount < 1
      ) {
        return;
      }

      this.updateIsLoadingDataFunc(true);
      this.isSumulateSwapLoading = true;

      const actualGas = await this.getActualGasPrice(this.networkId);

      const input = this.getRequestInputTokens(false);
      const output = this.getRequestOutputTokens(false);
      if (!input.length || !output.length) {
        this.isSumulateSwapLoading = false;
        return;
      }

      const requestData = {
        chainId: this.networkId,
        // chainId: 1,
        inputTokens: input,
        outputTokens: output,
        gasPrice: actualGas,
        userAddr: ethers.getAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent(),
        sourceBlacklist: ['Hashflow', 'Wombat'],
        sourceWhitelist: [],
        simulate: true,
        pathViz: true,
      };

      this.clearQuotaInfo();

      this.quoteRequest(requestData)
        .then((data) => {
          this.isSumulateSwapLoading = false;
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
          this.updateIsLoadingDataFunc(false);
        });
    },

    getSlippagePercent() {
      return this.slippagePercent;
    },
    async checkApproveForToken(token: any, checkedAllowanceValue: any) {
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
        this.zapContract.options.address,
      );

      selectedToken.approveData.allowanceValue = allowanceValue;
      if (!selectedToken.approveData.allowanceValue) {
        selectedToken.approveData.approved = false;
        return;
      }

      if (!checkedAllowanceValue) {
        selectedToken.approveData.approved = true;
        return;
      }

      selectedToken
        .approveData.approved = selectedToken.approveData.allowanceValue >= checkedAllowanceValue;
    },

    async approve(token: any) {
      this.showWaitingModal('Approving in process');

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
        this.zapContract.options.address,
        approveValue,
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

    getRequestInputTokens(ignoreNullable: boolean) {
      const inputTokens = [];
      for (let i = 0; i < this.selectedInputTokens.length; i++) {
        const token: any = this.selectedInputTokens[i];
        const { selectedToken } = token;
        if (!ignoreNullable && !token.value) {
          continue;
        }

        if (token.value > 0) {
          inputTokens.push({
            tokenAddress: selectedToken.address,
            amount: token.contractValue,
          });
        }
      }
      return inputTokens;
    },
    getRequestOutputTokens(ignoreNullable: boolean) {
      const outputTokens = [];
      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        const { selectedToken } = token;
        if (!ignoreNullable && !token.value) {
          continue;
        }

        outputTokens.push({
          tokenAddress: selectedToken.address,
          proportion: token.value,
        });
      }
      return outputTokens;
    },

    lockProportion(isLock: boolean, token: any) {
      if (this.outputTokensWithSelectedTokensCount <= 1 && !isLock) {
        return;
      }

      token.locked = isLock;
    },
    updateSliderValue(token: any, value: any) {
      const oldTokenValue = token.value;

      token.value = value;

      // if(!this.isSlidersOutOfLimit()) {
      token.value = value;
      this.subtraction(token, 100 - value);
      this.recalculateOutputTokensSum();

      // this.updateQuotaInfo();

      // if (oldTokenValue > value) {
      //     this.subTokensProportions(token, 100 - value)
      // } else {
      //     this.addTokensProportions(token, 100 - value)
      // }
      // }
    },
    recalculateOutputTokensSum() {
      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        const tokenSum = (this.sumOfAllSelectedTokensInUsd * token.value) / 100;
        const sum = this.swapMethod === 'BUY'
          ? tokenSum / token.selectedToken.price
          : tokenSum * token.selectedToken.price;
        token.sum = this.formatMoney(sum, 4);
      }
    },
    subTokensProportions(currentToken, difference) {
      const tokens = this.getActiveTokens(currentToken);
      if (tokens.length === 0) {
        return;
      }

      const proportion = Math.floor(difference / tokens.length);
      const remains = difference % tokens.length;

      for (let i = 0; i < tokens.length; i++) {
        const token: any = tokens[i];
        const tokenValue = token.value - proportion;
        if (tokenValue <= 0) {
          token.value = 0;
          continue;
        }

        token.value = tokenValue;
      }

      const lastToken = tokens[0].value;
      const lastTokenValue = lastToken - remains;
      if (lastTokenValue <= 0) {
        lastToken.value = 0;
      } else {
        lastToken.value = lastTokenValue;
      }
    },
    addTokensProportions(currentToken: any, difference: any) {
      const tokens = this.getActiveTokens(currentToken);
      if (tokens.length === 0) {
        return;
      }

      const proportion = Math.floor(difference / tokens.length);
      const remains = difference % tokens.length;

      for (let i = 0; i < tokens.length; i++) {
        const token: any = tokens[i];
        const tokenValue = token.value + proportion;
        token.value = tokenValue;
      }

      const lastToken = tokens[0].value;
      const lastTokenValue = lastToken + remains;
      lastToken.value = lastTokenValue;
      // }
    },
    subtraction(toke: any, difference: any) {
      const tokens = this.getActiveTokens(token: any);
      if (tokens.length === 0) {
        return;
      }

      const proportion = Math.floor(difference / tokens.length);
      const remains = difference % tokens.length;

      this.calculateProportions(tokens, proportion);
    },
    calculateProportions(tokens: any, proportion: any) {
      tokens.value = proportion;
      for (let i = 0; i < proportion; i++) {
        for (let i = 0; i < tokens.length; i++) {
          const token: any = tokens[i];
          // token.value++
          token.value = proportion;
        }
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

    recalculateOvnTokenByAnotherTotalBalances() {
      if (!this.selectedOvnInputTokens || !this.selectedOvnInputTokens.length) {
        return;
      }

      if (!this.selectedNoneOvnInputTokens.length) {
        this.clearAllInputSelectedTokens();
        this.addNewInputToken();
        return;
      }

      this.recalcualteOvnInputValue();
    },
    recalcualteOvnInputValue() {
      setTimeout(() => {
        const ovnToken = this.selectedOvnInputTokens[0];
        const ovnUsdValue = ovnToken.usdValue;

        const totalBalance = this.totalNoneOvnUsdInputsUsdBalance;
        if (totalBalance >= ovnUsdValue) {
          return;
        }

        const diffInUsd = ovnUsdValue - totalBalance;
        const diff = diffInUsd / ovnToken.selectedToken.price;
        const newValue = ovnToken.value - diff;

        if (newValue <= 0) {
          this.updateTokenValue(ovnToken, 0, this.checkApproveForToken, this.updateQuotaInfo);
          return;
        }

        this.updateTokenValue(ovnToken, newValue, this.checkApproveForToken, this.updateQuotaInfo);
      }, 30);
    },

    initDefaultTopInputTokensByBalance(tokens) {
      if (!tokens || !tokens.length) {
        return;
      }

      if (!this.selectedOvnInputTokens || !this.selectedOvnInputTokens.length) {
        return;
      }

      const onvToken = this.selectedOvnInputTokens[0];
      this.clearAllInputSelectedTokens(onvToken);
      const ovnTokenBalance = onvToken.selectedToken.balanceData.balanceInUsd;

      // find top 5 tokens by balance and order desc
      let topTokens = tokens
        .sort((a, b) => b.balanceData.balance - a.balanceData.balance)
        .slice(0, 5);

      // find all with balance
      topTokens = topTokens.filter((token: any) => token.balanceData.balance > 0);

      let tokensByBalanceSum = 0;
      const tokensByBalanceResult = [];
      for (let i = 0; i < topTokens.length; i++) {
        const token: any = topTokens[i];
        if (!token.balanceData.balance) {
          continue;
        }

        tokensByBalanceSum += token.balanceData.balanceInUsd;
        tokensByBalanceResult.push(token: any);
        if (tokensByBalanceSum >= ovnTokenBalance) {
          break;
        }
      }

      for (let i = 0; i < tokensByBalanceResult.length; i++) {
        const token: any = tokensByBalanceResult[i];
        token.selected = true;
        this.addSelectedTokenToInputList(token, true);
      }

      this.recalcualteOvnInputValue();
    },

    addSelectedTokenToList(selectedToken: any, swapMethod: any, selectTokenType: any) {
      if (this.isInputToken(swapMethod, selectTokenType)) {
        this.addSelectedTokenToInputList(selectedToken, true);
        return;
      }

      this.addSelectedTokenToOutputList(selectedToken, true, 50);
    },
    addSelectedTokenToInputList(selectedToken: any, isAddAllBalance: any) {
      // todo computed ovn input tokens and logic here
      const newInputToken = getNewInputToken();
      newInputToken.selectedToken = selectedToken;
      this.inputTokens.push(newInputToken);
      this.removeAllWithoutSelectedTokens(this.inputTokens);

      if (isAddAllBalance) {
        setTimeout(() => {
          this.updateTokenValue(
            newInputToken,
            newInputToken.selectedToken.balanceData.balance,
          );
        }, 10);
      }

      if (newInputToken.selectedToken.symbol === 'OVN') {
        this.initDefaultTopInputTokensByBalance(this.noneOvnTokens);
      }

      this.checkApproveForToken(newInputToken, 10000000);
    },
    addSelectedTokenToOutputList(selectedToken: any, isLocked: any, startPercent: any) {
      const newOutputToken = getNewOutputToken();
      newOutputToken.locked = isLocked;
      newOutputToken.value = startPercent;
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
    clearAllInputSelectedTokens(exclude?: any) {
      for (let i = 0; i < this.inputTokens.length; i++) {
        if (this.inputTokens[i].selectedToken) {
          if (
            exclude
            && this.inputTokens[i].selectedToken.symbol
              === exclude.selectedToken.symbol
          ) {
            continue;
          }

          this.inputTokens[i].selectedToken.selected = false;
        }
      }

      if (exclude) {
        this.inputTokens = [exclude];
        return;
      }

      this.inputTokens = [];
    },
    clearAllOutputSelectedTokens() {
      for (let i = 0; i < this.outputTokens.length; i++) {
        if (this.outputTokens[i].selectedToken) {
          this.outputTokens[i].selectedToken.selected = false;
        }
      }

      this.outputTokens = [];
    },
    clearAllSelectedTokens() {
      this.clearAllInputSelectedTokens();
      this.clearAllOutputSelectedTokens();
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
      if (!additionalPercent) additionalPercent = 0;
      return this.getOutputsTokensPercentage() + additionalPercent > 100;
    },
    getActiveTokens(currentToken: any) {
      const sliders = [];
      // let count = 1
      for (let i = 0; i < this.outputTokens.length; i++) {
        const token: any = this.outputTokens[i];
        if (token.id === currentToken.id) continue;

        if (!token.locked) {
          // stockIndex.number = count
          // count++
          sliders.push(token);
        }
      }
      return sliders;
    },

    showSelectTokensModals(isShow: boolean) {
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
    selectOutputToken(token: any) {
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
      if (!this.tokensQuotaCounterId) {
        // first call
        this.tokensQuotaCounterId = -1;
        // update
        this.recalculateProportion();
        return;
      }

      this.tokensQuotaCheckerSec = 0;
      let intervalId = setInterval(async () => {
        this.tokensQuotaCheckerSec++;

        if (this.tokensQuotaCheckerSec >= 1) {
          if (this.tokensQuotaCounterId === intervalId) {
            this.tokensQuotaCheckerSec = 0;
            try {
              // update
              this.recalculateProportion();
            } catch (e) {
              // ignore
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
  },
};
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-button-title {
    font-size: 16px;
    line-height: 22px;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

@media only screen and (min-width: 1300px) {
  .add-token-text {
    font-size: 16px;
    line-height: 24px;
  }

  .swap-button-title {
    font-size: 18px;
    line-height: 22px;
  }
}

.swap-container {
  z-index: 48 !important;
}

.swap-settings {
  text-align: end;
  cursor: pointer;
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
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;

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

  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  display: table;
  margin: 0 auto;
}

.change-swap-image {
  text-align: center; /* center the child element's content horizontally */
  padding-top: 8px;
}

.swap-button {
  text-align: center;
  align-items: center;
  gap: 8px;

  width: 100%;
  height: 48px;

  padding-top: 15px;

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
  font-size: 18px;
  line-height: 22px;

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
  border-top: 1px solid #dee1e5;
  padding-top: 22px;
}

.transaction-info-body {
  padding-bottom: 20px;
}

.loader-container {
  padding-top: 50px;
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
