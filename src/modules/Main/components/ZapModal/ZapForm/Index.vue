<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <div
      v-if="zapPool.chain !== networkId"
      class="swap-container"
    >
      <div class="swap-body">
        <PoolLabel :pool="zapPool" />
        <ChangeNetwork :zap-pool="zapPool" />
      </div>
    </div>
    <div
      v-else-if="!zapsLoaded"
      class="loader-container"
    >
      <Spinner />
    </div>
    <div
      v-else
      class="swap-container"
    >
      <div :class="['zapin-block', { v3: zapPool?.poolVersion === 'v3' }, { v2: zapPool?.poolVersion === 'v2' }]">
        <div class="zapin-block__header-container">
          <BaseIcon name="ArrowLeft"
          @click="toggleMobileSection"
          />
          <div class="zapin-block__header">
            ZAP IN
          </div>
          <BaseIcon name="ArrowRight"
          @click="toggleMobileSection"
          />
        </div>
        <div class="zapin-block__row">
          <div
          class="zapin-block__content"
          :class="currentSection === zapMobileSection.TOKEN_FORM && 'mobile-active'"
          >
            <div class="zapin-block__wrapper">
              <h2 v-if="zapPool?.poolVersion === 'v3'">
                Pool you choose
              </h2>
              <PoolLabel
                :pool="zapPool"
                class="pool-info"
              />
              <div class="zapin-block__swap-wrapper">
                <div class="input-swap-container">
                  <div class="swap-form__body-block">
                    <div class="swap-form__body-block__title">
                      <h3>
                        You send
                      </h3>
                      <div
                        v-if="inputTokensWithSelectedTokensCount"
                        class="swap-form__body-block__inputs-max"
                        @click="maxAllMethod"
                        @keypress="maxAllMethod"
                      >
                        Max all
                      </div>
                    </div>
                    <TransitionGroup
                      name="staggered-fade"
                      tag="div"
                      :class="{ 'swap-form__body-block__inputs': true, 'block-inputs--scroll': outputTokens?.length > 3 }"
                      :css="false"
                      @before-enter="beforeEnterList"
                      @enter="onEnterList"
                      @on-leave="onLeaveList"
                    >
                      <div
                        v-for="token in inputTokens"
                        :key="token.id"
                        :data-index="token.id"
                        class="swap-form__body-block__inputs-item"
                      >
                        <TokenForm
                          :token-info="token"
                          :is-token-removable="isInputTokensRemovable"
                          :is-input-token="true"
                          :disabled="false"
                          :balances-loading="isBalancesLoading"
                          @select-token="selectFormToken"
                          @remove-token="removeInputToken"
                          @update-token="updateTokenValueMethod"
                        />
                      </div>
                      <div
                        v-if="isInputTokensAddAvailable"
                        class="swap-form__body-block__inputs-add"
                        @click="addNewInputToken"
                        @keypress="addNewInputToken"
                      >
                        +
                      </div>
                    </TransitionGroup>
                  </div>
                </div>
                <div class="swap-form__body-arrow-conatiner">
                  <div
                    class="swap-form__body-arrow"
                  >
                    <BaseIcon
                      name="ArrowDown"
                    />
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
                      :is-token-removable="isOutputTokensRemovable"
                      :is-input-token="false"
                      :disabled="true"
                      :balances-loading="isBalancesLoading"
                      @select-token="selectOutputToken"
                      @remove-token="removeOutputToken"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sumOfAllSelectedTokensInUsd && ifMoreThanOneSelectedTokensAdded"
                  class="transaction-info-container"
            >
                <div class="transaction-info-body">
                  <div
                    class="zap-row"
                  >
                    <div class="transaction-info-title">
                      Slippage
                    </div>
                    <div class="transaction-info">
                      {{ slippagePercent * 1 }}%
                      <span class="transaction-info-additional">
                        ({{ formatMoney(getSlippageAmount, 3) }})$
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="selectedInputTokens?.length > 1"
                    class="zap-row"
                  >
                    <div class="transaction-info-title">
                      Multi-swap Odos fee
                    </div>
                    <div class="transaction-info">
                      {{ multiSwapOdosFeePercent * 1 }}%
                      <span class="transaction-info-additional">
                        ({{ formatMoney(getOdosFee, 3) }})$
                      </span>
                    </div>
                  </div>

                  <div
                    class="zap-row"
                  >
                    <div class="transaction-info-title">
                      Single-swap Odos fee
                    </div>
                    <div class="transaction-info">
                      0.00% <span class="transaction-info-additional">(0)$</span>
                    </div>
                  </div>
                </div>
              </div>

            <div>
              <SwapSlippageSettings
                :selected-input-tokens="selectedInputTokens"
                :selected-output-tokens="selectedOutputTokens"
                :zap-pool-data="zapPool"
                @change-slippage="handleCurrentSlippageChanged"
              />
            </div>
          </div>
          <ZapinV3
            v-if="zapPool?.poolVersion === 'v3'"
            :zap-pool="zapPool"
            :zap-contract="zapContract"
            :class="currentSection === zapMobileSection.SET_PRICE_RANGE && 'mobile-active'"
            @set-range="setRangeV3"
          />
        </div>
      </div>
      <div class="swap-container__footer">
        <ButtonComponent
          v-if="!account"
          class="swap-button-container"
          btn-size="large"
          btn-styles="primary"
          full
          @click="connectWallet"
          @keypress="connectWallet"
        >
        CONNECT WALLET
        </ButtonComponent>
        <div
          v-else
          class="swap-button-container"
        >
          <ButtonComponent
            v-if="isDisableButton"
            btn-size="large"
            full
            btn-styles="primary"
            disabled
          >
            {{ disableButtonMessage }}
          </ButtonComponent>
          <ButtonComponent
            v-else-if="isAnyInputsNeedApprove"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="approvingPending"
            @click="approveTrigger(firstInputInQueueForToApprove)"
            @keypress="approveTrigger(firstInputInQueueForToApprove)"
          >
            APPROVE
            {{ firstInputInQueueForToApprove.selectedToken?.symbol }}
          </ButtonComponent>
          <ButtonComponent
            v-else-if="additionalSwapStepType === 'APPROVE'"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="approvingPending"
            @click="
              toApproveAndDepositSteps(lastZapResponseData, lastPoolInfoData)
            "
            @keypress="
              toApproveAndDepositSteps(lastZapResponseData, lastPoolInfoData)
            "
          >
            APPROVE GAUGE
          </ButtonComponent>
          <ButtonComponent
            v-else-if="additionalSwapStepType === 'DEPOSIT'"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
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
          >
            STAKE LP
          </ButtonComponent>
          <ButtonComponent
            v-else
            btn-size="large"
            btn-styles="primary"
            full
            @click="stakeTrigger"
            @keypress="stakeTrigger"
          >
            {{ btnName }}
          </ButtonComponent>
        </div>
        <ZapInStepsRow
          v-if="zapPool.chain === networkId && isTokensLoadedAndFiltered"
          class="zapin__modal-steps"
          :version="zapInType"
          :type="currentZapPlatformContractType"
          :current-stage="currentStage"
        />
      </div>
    </div>

    <SelectTokensModal
      :is-show="isShowSelectTokensModal"
      :select-token-input="true"
      :tokens="zapAllTokens"
      :is-all-data-loaded="isAllDataLoaded"
      :selected-tokens="inputTokens"
      :balances-loading="isBalancesLoading"
      :user-account="account"
      remove-native
      @set-show="showSelectTokensModals"
      @add-token-to-list="addSelectedTokenToList"
      @remove-token-from-list="removeSelectedTokenFromList"
    />
</div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { useEventBus } from '@vueuse/core';
import { markRaw } from 'vue';
import { ethers } from 'ethers';
import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import {
  updateTokenValue,
  maxAll,
  getNewOutputToken,
  getNewInputToken,
  getTokenByAddress,
  WHITE_LIST_ODOS,
} from '@/store/helpers/index.ts';
import {
  getProportion,
  calculateProportionForPool,
  depositAllAtGauge,
  checkApproveForGauge,
  approveGaugeForStake,
  getV3Proportion,
} from '@/store/views/main/zapin/helpers.ts';
import odosApiService from '@/services/odos-api-service.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/modules/Main/components/ZapModal/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { formatMoney } from '@/utils/numbers.ts';
import TokenForm from '@/modules/Main/components/ZapModal/TokenForm.vue';
import PoolLabel from '@/modules/Main/components/ZapModal/PoolLabel.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import SwapSlippageSettings from '@/modules/Main/components/Common/SwapSlippageSettings.vue';
import ZapInStepsRow from '@/components/StepsRow/ZapinRow/ZapinRow.vue';
import ZapinV3 from '@/modules/Main/components/ZapModal/ZapForm/ZapinV3.vue';
import { poolsInfoMap, poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import BN from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import { MANAGE_FUNC, zapInStep } from '@/store/modals/waiting-modal.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { parseLogs } from './helpers.ts';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

const MAX_INPUT_TOKENS = 3;

export default {
  name: 'ZapForm',
  components: {
    PoolLabel,
    BaseIcon,
    ZapinV3,
    ButtonComponent,
    SwapSlippageSettings,
    SelectTokensModal,
    TokenForm,
    ChangeNetwork,
    Spinner,
    ZapInStepsRow,
  },
  props: {
    zapPool: {
      type: Object,
      required: false,
      default: null,
    },
    typeOfPool: {
      // OVN or ALL
      type: String,
      required: false,
      default: 'ALL',
    },
  },
  data() {
    return {
      approvingPending: false,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      maxInputTokens: MAX_INPUT_TOKENS,
      v3Range: null as any,
      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
      selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

      isSwapLoading: false,
      slippagePercent: 0.5,
      multiSwapOdosFeePercent: 0.01,

      tokensQuotaCounterId: null as any,
      tokensQuotaCheckerSec: 0,

      clickOnStake: false,

      sourceLiquidityBlacklist: ['Hashflow', 'Wombat'], // "Overnight Exchange"
      mapExcludeLiquidityPlatform: {
        Chronos: ['Chronos Volatile'], // "Chronos Stable"
        // Pancake: ["PancakeSwap", "PancakeSwap V3"],
        // Beefy: ["Aerodrome Stable", "Aerodrome Volatile"],
        Aerodrome: ['Aerodrome Slipstream'],
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
      currentStage: zapInStep.START,
      // Mobile section switch
      zapMobileSection,
      currentSection: zapMobileSection.TOKEN_FORM,
    };
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'tokensContractMap',
      'additionalSwapStepType',
      'lastZapResponseData',
      'lastPoolInfoData',
      'lastPutIntoPoolEvent',
      'lastReturnedToUserEvent',
      'isBalancesLoading',
      'lastNftTokenId',
      'routerContract',
      'odosReferalCode',
    ]),

    ...mapState('zapinData', [
      'currentZapPlatformContractType',
      'zapContract',
      'gaugeContract',
      'poolTokenContract',
      'zapPoolRoot',
    ]),
    ...mapGetters('odosData', [
      'allTokensList',
      'isAllDataLoaded',
      'isAvailableOnNetwork',
    ]),

    ...mapGetters('zapinData', [
      'isZapLoaded',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    zapsLoaded() {
      return this.isTokensLoadedAndFiltered && this.zapPool && this.zapContract && this.isZapLoaded;
    },
    getOdosFee() {
      return new BN(this.sumOfAllSelectedTokensInUsd)
        .times(this.multiSwapOdosFeePercent)
        .div(100)
        .toNumber();
    },
    getSlippageAmount() {
      return new BN(this.sumOfAllSelectedTokensInUsd)
        .times(this.slippagePercent).div(100).toNumber();
    },
    zapAllTokens() {
      const selectedAdd = this.inputTokens
        .map((_) => _.selectedToken?.address?.toLowerCase() ?? null)
        .filter(Boolean);

      return this.allTokensList.map((item: any) => ({
        ...item,
        selected: selectedAdd.includes(item.address?.toLowerCase()) ? item?.selected : false,
      }));
    },
    isInputTokensRemovable() {
      return this.inputTokens.length > 1;
    },

    isOutputTokensRemovable() {
      return false;
    },
    isInputTokensAddAvailable() {
      return (
        this.inputTokens.length < this.maxInputTokens
        && this.inputTokensWithoutSelectedTokensCount === 0
      );
    },

    inputTokensWithoutSelectedTokensCount() {
      return this.inputTokens.filter((item: any) => !item.selectedToken).length;
    },

    inputTokensWithSelectedTokensCount() {
      return this.inputTokens.filter((item: any) => item.selectedToken).length;
    },

    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
    },

    ifMoreThanOneSelectedTokensAdded() {
      return this.selectedInputTokens.length > 0;
    },

    selectedInputTokens() {
      return this.inputTokens.filter((item: any) => item.selectedToken);
    },
    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },

    selectedOvnInputTokens() {
      return this.selectedInputTokens.filter(
        (item: any) => item.selectedToken.symbol === 'OVN',
      );
    },
    selectedNoneOvnInputTokens() {
      return this.selectedInputTokens.filter(
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
        || !this.isAvailableOnNetwork
        || !this.isAnyTokensBalanceIsInsufficient
        || !this.isAmountEntered
        || this.isOvnValueOverflow
      );
    },

    btnName() {
      if (this.currentZapPlatformContractType?.type === 'LP_STAKE_DIFF_STEPS') {
        return 'DEPOSIT';
      }

      return 'STAKE';
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
      let sum = '0';
      for (let i = 0; i < this.selectedInputTokens.length; i++) {
        const token: any = this.selectedInputTokens[i];
        const selectedTokenUsdValue = token.usdValue;
        sum = new BN(
          selectedTokenUsdValue,
        ).plus(sum).toFixed(6, BN.ROUND_DOWN);
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
    zapInType() {
      if (this.zapPool?.poolVersion === 'v3') return 'V3';

      return 'V2';
    },
  },
  watch: {
    currentStage(stage: zapInStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
      if (this.currentStage !== zapInStep.START) {
        this.$store.commit('zapinData/changeState', { field: 'selectedTokens', val: this.inputTokens });
      }
    },
    sumOfAllSelectedTokensInUsd() {
      this.recalculateOutputTokensSum();
    },
    // on wallet connect
    async account(val) {
      if (val) this.clearAndInitForm();
      if (!val) this.outputTokens = [getNewOutputToken()];
    },

    isTokensLoadedAndFiltered(val) {
      if (val) {
        this.clearAndInitForm();
      }
    },
    networkId(newVal) {
      if (newVal) {
        this.$store.commit('odosData/changeState', { field: 'isTokensLoadedAndFiltered', val: false });

        if (!this.isAvailableOnNetwork) {
          this.mintAction();
        }

        if (this.zapPool.chain === this.networkId) {
          this.firstInit();

          setTimeout(() => {
            this.loadZapContract();
          }, 500);
        }
      }
    },
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
      // this.updateButtonDisabledFunc(val);
    },
  },
  mounted() {
    if (this.zapPool.chain !== this.networkId) this.currentStage = zapInStep.START;

    this.setStagesMap(MANAGE_FUNC.ZAPIN);
    this.firstInit();
  },
  created() {
    if (this.zapPool.chain !== this.networkId) return;

    this.firstInit();

    setTimeout(() => {
      this.loadZapContract();
    }, 300);
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('odosData', [
      'loadTokens',
      'initContractData',
      'loadBalances',
      'triggerSuccessZapin',
      'startSwapConfirmTimer',
      'stopSwapConfirmTimer',
      'initAccountData',
    ]),
    ...mapActions('accountData', ['refreshBalance']),
    ...mapActions('zapinData', ['loadZapContract']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    ...mapMutations('waitingModal', ['setStagesMap']),
    ...mapMutations('zapinData', ['changeState']),
    onLeaveList,
    beforeEnterList,
    onEnterList,
    formatMoney,

    // Mobile section switcher
    toggleMobileSection() {
      // eslint-disable-next-line operator-assignment, no-bitwise
      this.currentSection = zapMobileSection.SET_PRICE_RANGE
        ^ zapMobileSection.TOKEN_FORM ^ this.currentSection;
    },
    setRangeV3(v3Data: any) {
      this.v3Range = v3Data;
      this.updateQuotaInfo();
    },
    updateTokenState(newToken: any) {
      const indexOf = this.inputTokens.map((_) => _.id).indexOf(newToken.id);
      this.inputTokens[indexOf] = newToken;
      this.updateQuotaInfo();
    },

    updateTokenValueMethod(tokenData: any, isMaxBal: boolean) {
      let newToken = null;

      if (isMaxBal) {
        // bug with max balance sometimes, possible todo
        // problem in getProportion formula
        newToken = updateTokenValue(
          tokenData,
          tokenData.value,
          this.checkApproveForToken,
          new BN(tokenData.selectedToken.balanceData.originalBalance)
            .minus(10)
            .toFixed(),
        );
      } else {
        newToken = updateTokenValue(
          tokenData,
          tokenData.value,
          this.checkApproveForToken,
        );
      }

      this.updateTokenState(newToken);
    },
    selectFormToken() {
      this.showSelectTokensModals(true);
    },
    maxAllMethod() {
      const arr = maxAll(
        this.inputTokens,
        this.checkApproveForToken,
        true,
      );
      arr.forEach((_) => this.updateTokenState(_));
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
    },

    firstInit() {
      this.changeState({
        field: 'zapPoolRoot',
        val: this.zapPool,
      });
      this.changeState({
        field: 'tokenSeparationScheme',
        val: 'POOL_SWAP',
      });
      this.changeState({
        field: 'typeOfPoolScheme',
        val: this.typeOfPool,
      });

      // todo: move to backend
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      if (!poolTokens) return;

      this.$store.commit('odosData/changeState', {
        field: 'listOfBuyTokensAddresses',
        val: [poolTokens[0].address, poolTokens[1].address],
      });

      this.init();
      this.clearAndInitForm();
      this.initAccountData();

      if (!this.isAvailableOnNetwork) this.mintAction();
    },

    async init() {
      await this.loadTokens();
      await this.initContractData();

      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
    },
    addDefaultPoolToken() {
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      const poolSelectedToken = getTokenByAddress(poolTokens[0].address, this.allTokensList);
      const ovnSelectSelectedToken = getTokenByAddress(poolTokens[1].address, this.allTokensList);

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
    removeOutputToken(id: string) {
      this.removeToken(this.outputTokens, id);
      this.resetOutputs();
    },
    addNewInputToken() {
      this.inputTokens.push(getNewInputToken());
    },
    removeInputToken(id: string) {
      this.removeToken(this.inputTokens, id);
      this.recalculateOvnTokenByAnotherTotalBalances();
    },

    removeToken(tokens: any[], id: string) {
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
          this.$store.commit('odosData/changeState', {
            field: 'swapResponseInfo',
            val: data,
          });
          return data;
        })
        .catch((e) => {
          this.closeWaitingModal();
          if (e && e.message && e.message.includes('path')) {
            this.showErrorModalWithMsg({ errorType: 'odos-path', errorMsg: e });
            return;
          }

          this.showErrorModalWithMsg({ errorType: 'odos', errorMsg: e });
        });
    },
    handleCurrentSlippageChanged(newSlippage: number) {
      this.slippagePercent = newSlippage;
    },

    finishTransaction() {
      this.clearAndInitForm();
      this.closeWaitingModal();
      this.refreshBalance();
    },

    clearAndInitForm() {
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
    async stakeTrigger() {
      console.log(this.poolTokenContract, '__this.poolTokenContract');
      // await this.poolTokenContract.deposit(Number(26997));
      if (this.zapInType === 'V2') this.currentStage = zapInStep.STAKE_LP;
      if (!this.zapPool) return;
      this.$store.commit('odosData/changeState', {
        field: 'lastPoolInfoData',
        val: poolsInfoMap[this.zapPool.address],
      });

      if (!this.lastPoolInfoData) return;
      if (this.isSwapLoading) return;

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

      let reserves = null;
      let sumReserves = '0';

      if (this.zapPool?.poolVersion === 'v2') {
        reserves = await getProportion(
          this.zapPool.address,
          this.zapPool,
          this.zapContract,
        );
        sumReserves = (
          new BN(reserves.token0Amount).times(outputToken0Price)
        )
          .plus(
            new BN(reserves.token1Amount).times(outputToken1Price),
          ).toFixed(0);
      }

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
      const outputAmounts = formulaOutputTokens.map((token: any) => token.contractValue);
      const outputPrices = formulaOutputTokens.map((token: any) => token.price);

      console.log(JSON.stringify({
        inputTokensDecimals: [...inputDecimals],
        inputTokensAddresses: [...inputAddresses],
        inputTokensAmounts: [...inputAmounts],
        inputTokensPrices: [...inputPrices],
        outputTokensDecimals: [...outputDecimals],
        outputTokensAddresses: [...outputAddresses],
        outputTokensAmounts: [...outputAmounts],
        outputTokensPrices: [...outputPrices],
      }), '__PARAMS');

      console.log(userInputTokens, '__userInputTokens');
      let proportions: any = {
        inputTokens: [],
        outputTokens: [],
        amountToken0Out: '0',
        amountToken1Out: '0',
      };

      if (this.zapPool?.poolVersion === 'v2') {
        proportions = calculateProportionForPool({
          inputTokensDecimals: [...inputDecimals],
          inputTokensAddresses: [...inputAddresses],
          inputTokensAmounts: [...inputAmounts],
          inputTokensPrices: [...inputPrices],
          outputTokensDecimals: [...outputDecimals],
          outputTokensAddresses: [...outputAddresses],
          outputTokensAmounts: [...outputAmounts],
          outputTokensPrices: [...outputPrices],
          proportion0: new BN(reserves[0])
            .times(outputPrices[0])
            .div(sumReserves)
            .toFixed(),
        });
      }

      if (this.zapPool?.poolVersion === 'v3') {
        const resp = await getV3Proportion(
          this.zapPool.address,
          this.v3Range.ticks,
          userInputTokens.map((_) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: _?.contractValue,
            price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
          })),
          this.zapContract,
        );

        if (!resp) return;

        proportions = {
          inputTokens: userInputTokens.map((_: any, key: number) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: resp[1][key]?.toString(),
          })).filter((_) => new BN(_.amount).gt(0)),
          outputTokens: resp[2].map((_: any, key: number) => ({
            tokenAddress: _,
            proportion: new BN(resp[3][key]?.toString()).div(10 ** 6),
          })),
          amountToken0Out: resp[4][0]?.toString(),
          amountToken1Out: resp[4][1]?.toString(),
        };

        console.log(resp, '__resp');
      }

      console.log(proportions, '__proportions');

      proportions.outputTokens = proportions.outputTokens.filter(
        (item: any) => new BN(item.proportion).gt(0),
      );

      const request = {
        chainId: this.networkId,
        inputTokens: proportions.inputTokens,
        outputTokens: proportions.outputTokens,
        gasPrice: actualGas as any,
        userAddr: this.zapContract.target,
        slippageLimitPercent: this.getSlippagePercent(),
      };

      if (proportions.inputTokens?.length === 0 && proportions.outputTokens?.length === 0) {
        await this.initZapInTransaction(
          null,
          proportions.inputTokens,
          proportions.outputTokens,
          proportions,
          this.lastPoolInfoData,
          this.zapPool,
        );

        this.isSwapLoading = false;
        this.clickOnStake = false;
        return;
      }

      const whiteList = WHITE_LIST_ODOS[request.chainId as keyof typeof WHITE_LIST_ODOS];
      const requestData = {
        chainId: request.chainId,
        inputTokens: request.inputTokens,
        outputTokens: request.outputTokens,
        gasPrice: request.gasPrice?.baseFee,
        userAddr: ethers.getAddress(
          request.userAddr.toLowerCase(),
        ),
        slippageLimitPercent: request.slippageLimitPercent,
        sourceBlacklist: this.getSourceLiquidityBlackList(),
        sourceWhitelist: whiteList ?? [],
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

    getSourceLiquidityBlackList() {
      let sourceBlacklist = [...this.sourceLiquidityBlacklist];
      // excluding platform for big liquidities zapins
      const excludeLiquidityByPlatform = this.mapExcludeLiquidityPlatform[
        this.zapPool.platform[0]
      ];
      if (excludeLiquidityByPlatform && excludeLiquidityByPlatform.length) {
        sourceBlacklist = [...sourceBlacklist, ...excludeLiquidityByPlatform];
      }

      return sourceBlacklist;
    },
    commitEventToStore(field: string, value: any) {
      this.$store.commit('odosData/changeState', {
        field,
        val: value,
      });
    },
    async toApproveAndDepositSteps(data: any, lastPoolInfoData: any) {
      let putIntoPoolEvent;
      let returnedToUserEvent;
      const nftId = '';

      console.log(data, '___data');
      parseLogs(data.logs, this.commitEventToStore);

      this.stopSwapConfirmTimer();
      this.currentStage = zapInStep.APPROVE_GAUGE;

      this.$store.commit('odosData/changeState', {
        field: 'additionalSwapStepType',
        val: 'APPROVE',
      });

      if (lastPoolInfoData.approveType === 'NFT') {
        this.approveNftGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
          nftId,
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
      nftId: string,
    ) {
      this.showWaitingModal('Approving NFT in process');

      if (!this.lastNftTokenId || nftId) {
        try {
          const tokenId = nftId || await this.getLastNftId();

          this.$store.commit('odosData/changeState', {
            field: 'lastNftTokenId',
            val: tokenId,
          });
          const poolAddress = this.zapPoolRoot.address;
          const poolInfo = poolsInfoMap[poolAddress];

          if (!poolInfo) throw new Error('No gauge to approve for NFT');

          const params = { from: this.account };
          const tx = await this.gaugeContract
            .approve(poolInfo?.gauge, tokenId, params);

          await tx.wait();

          this.$store.commit('odosData/changeState', {
            field: 'additionalSwapStepType',
            val: 'DEPOSIT',
          });
          this.currentStage = zapInStep.DEPOSIT;
          this.closeWaitingModal();
          this.depositGauge(
            putIntoPoolEvent,
            returnedToUserEvent,
            lastPoolInfoData,
            this.lastNftTokenId,
          );
        } catch (e) {
          console.error('Approve nft gauge failed', e);
          this.$store.commit('odosData/changeState', {
            field: 'lastNftTokenId',
            val: null,
          });
          this.closeWaitingModal();
        }
      } else {
        this.$store.commit('odosData/changeState', {
          field: 'additionalSwapStepType',
          val: 'DEPOSIT',
        });
        this.currentStage = zapInStep.DEPOSIT;
        this.depositGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
          this.lastNftTokenId,
        );
      }
    },
    getLastNftId() {
      console.log(this.gaugeContract, '__this.gaugeContract');
      return this.gaugeContract
        .balanceOf(this.account)
        .then((count: any) => this.gaugeContract
          .tokenOfOwnerByIndex(this.account, Number(count) - 1)
          .then((tokenId: any) => tokenId));
    },
    async approveGauge(
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      lastPoolInfoData: any,
    ) {
      this.currentStage = zapInStep.APPROVE_GAUGE;
      const approveAmount = new BN(10).pow(24).toFixed();
      const isGaugeApproved = await checkApproveForGauge(
        this.poolTokenContract,
        approveAmount,
        this.routerContract,
        this.account,
      );

      if (!isGaugeApproved) {
        this.showWaitingModal('Approving gauge in process');
        approveGaugeForStake(
          this.showWaitingModal,
          this.closeWaitingModal,
          this.showErrorModalWithMsg,
          this.gaugeContract,
          this.poolTokenContract,
          this.account,
          this.routerContract,
        )
          .then(() => {
            this.$store.commit('odosData/changeState', {
              field: 'additionalSwapStepType',
              val: 'DEPOSIT',
            });
            this.currentStage = zapInStep.DEPOSIT;
            this.closeWaitingModal();
            this.depositGauge(
              putIntoPoolEvent,
              returnedToUserEvent,
              lastPoolInfoData,
              this.lastNftTokenId,
            );
          })
          .catch((e: any) => {
            console.error('Error when gauge approve: ', e);
            this.closeWaitingModal();
          });
      } else {
        this.$store.commit('odosData/changeState', {
          field: 'additionalSwapStepType',
          val: 'DEPOSIT',
        });
        this.currentStage = zapInStep.DEPOSIT;
        this.depositGauge(
          putIntoPoolEvent,
          returnedToUserEvent,
          lastPoolInfoData,
          this.lastNftTokenId,
        );
      }
    },
    depositGauge(
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      lastPoolInfoData: any,
      lastNftTokenId: any,
    ) {
      this.currentStage = zapInStep.STAKE_LP;
      this.showWaitingModal('Stake LP in process');

      console.log({
        acc: this.account,
        lastPoolInfoData,
        lastNftTokenId,
        zap: this.currentZapPlatformContractType,
        gauge: this.gaugeContract,
        zaproot: this.zapPoolRoot,
        token: this.poolTokenContract,

      }, '___DATA1');
      depositAllAtGauge(
        this.account,
        lastPoolInfoData,
        lastNftTokenId,
        this.currentZapPlatformContractType,
        this.gaugeContract,
        this.zapPoolRoot,
        this.poolTokenContract,
      )
        .then((data: any) => {
          this.closeWaitingModal();

          const inputTokens = [...this.selectedInputTokens];
          const outputTokens = [...this.selectedOutputTokens];
          this.triggerSuccessZapin(
            {
              isShow: true,
              inputTokens,
              outputTokens,
              hash: data.hash,
              putIntoPoolEvent,
              returnedToUserEvent,
              pool: this.zapPool,
              modalType: MODAL_TYPE.ZAPIN,
            },
          );
          // event
          const bus = useEventBus('zap-transaction-finished');
          bus.emit(true);
          this.$store.commit('odosData/changeState', {
            field: 'additionalSwapStepType',
            val: null,
          });
          this.clearZapData();
          this.$emit('close-form');
          this.loadBalances();
        })
        .catch((e) => {
          console.log(e, '---e');
          this.closeWaitingModal();
          this.$store.commit('odosData/changeState', {
            field: 'additionalSwapStepType',
            val: 'DEPOSIT',
          });
        });
    },
    clearZapData() {
      this.inputTokens = [];
      this.outputTokens = [];
      this.$store.commit('odosData/changeState', {
        field: 'lastPutIntoPoolEvent',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'lastReturnedToUserEvent',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'lastZapResponseData',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'lastNftTokenId',
        val: null,
      });
    },
    finishSingleStepTransaction(data: any) {
      let putIntoPoolEvent;
      let returnedToUserEvent;

      parseLogs(data.logs, this.commitEventToStore);

      const inputTokens = [...this.selectedInputTokens];
      const outputTokens = [...this.selectedOutputTokens];
      this.triggerSuccessZapin(
        {
          isShow: true,
          inputTokens,
          outputTokens,
          hash: data.hash,
          putIntoPoolEvent,
          returnedToUserEvent,
          pool: this.zapPool,
          modalType: MODAL_TYPE.ZAPIN,
        },
      );

      // event
      const bus = useEventBus('zap-transaction-finished');
      bus.emit(true);

      this.clearZapData();
      this.loadBalances();
      this.closeWaitingModal();
      this.$emit('close-form');
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any[],
      requestOutputTokens: any[],
      proportions: any,
      poolInfo: any,
      zapPool: any,
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
          receiver: this.zapContract.target,
        });
      }

      const txData = {
        inputs: requestInput,
        outputs: requestOutput,
        data: responseData ? responseData.transaction.data : '0x',
      };

      let gaugeData: any;

      if (zapPool.platform[0] === 'Pancake' && this.zapPool.poolVersion === 'v2') {
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

      if (this.zapPool.poolVersion === 'v3') {
        gaugeData = {
          pair: this.zapPool.address,
          tickRange: this.v3Range.ticks,
          amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
        };
      }

      this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        // gasPrice: ethers.parseUnits('100', 'gwei'),
        // gasLimit: 1000000,
      };

      console.log(zapPool, '----zapPool');
      console.log(this.zapContract, '-this.zapContract');

      console.log(txData, 'swapdata');
      console.log(gaugeData, 'gaugeData');
      console.log((params), 'params');

      try {
        const tx = await this.zapContract.zapIn(txData, gaugeData, params);
        const receipt = await tx.wait();

        this.$store.commit('odosData/changeState', {
          field: 'lastZapResponseData',
          val: markRaw(receipt),
        });

        this.$store.commit('odosData/changeState', {
          field: 'lastParsedZapResponseData',
          val: markRaw(receipt),
        });

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

        this.isSwapLoading = false;
      } catch (e: any) {
        if (e && e.code === 4001) {
          if (e.message === 'User rejected the request.') {
            this.stopSwapConfirmTimer();
            this.clickOnStake = false;
          }
        }

        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: e });
      }
    },
    clearQuotaInfo() {
      this.$store.commit('odosData/changeState', {
        field: 'quotaResponseInfo',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'swapResponseInfo',
        val: null,
      });
    },
    async recalculateProportion() {
      let reserves = null;

      const outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
      const outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;

      const emptyVals = this.inputTokens.map((_) => {
        if (new BN(_?.value).eq(0) || !_?.value) return null;

        return _;
      });

      if (emptyVals.every((_) => !_)) return;

      if (this.zapPool?.poolVersion === 'v3') {
        const resp = await getV3Proportion(
          this.zapPool.address,
          this.v3Range.ticks,
          this.selectedInputTokens.map((_) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: _?.contractValue,
            price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
          })),
          this.zapContract,
        );

        if (!resp || resp[5]?.length === 0) return;

        resp[5]?.forEach((_: BigInt, key: number) => {
          const { price } = this.selectedOutputTokens[key].selectedToken;
          const val = new BN(_?.toString() ?? 0)
            .div(10 ** 18)
            .div(price);

          this.selectedOutputTokens[key].value = val.toFixed();
          this.selectedOutputTokens[key].sum = val.toFixed(5);
        });

        return;
      }

      if (this.zapPool?.poolVersion === 'v2') {
        reserves = await getProportion(
          this.zapPool.address,
          this.zapPool,
          this.zapContract,
        );
      }

      const sumReserves = (
        new BN(reserves.token0Amount).times(outputToken0Price)
      )
        .plus(
          new BN(reserves.token1Amount).times(outputToken1Price),
        ).toFixed();

      this.selectedOutputTokens[0]
        .value = new BN(Number(reserves[0]))
          .times(Number(outputToken0Price)).div(sumReserves).times(100)
          .toFixed();
      this.selectedOutputTokens[1]
        .value = new BN(Number(reserves[1]))
          .times(Number(outputToken1Price)).div(sumReserves).times(100)
          .toFixed();

      console.log(this.selectedOutputTokens, '__resp1');
      this.recalculateOutputTokensSum();
    },
    getSlippagePercent() {
      return this.slippagePercent;
    },
    async checkApproveForToken(token: any, checkedAllowanceValue: any) {
      this.currentStage = zapInStep.APPROVE_TOKENS;
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
        this.zapContract.target,
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
      selectedToken.approveData.approved = new BN(selectedToken.approveData.allowanceValue)
        .isGreaterThanOrEqualTo(checkedAllowanceValue);
      if (this.zapInType === 'V2' && selectedToken.approveData.approved) {
        this.currentStage = zapInStep.STAKE_LP;
      } else if (selectedToken.approveData.approved) {
        this.currentStage = zapInStep.DEPOSIT;
      }
    },

    async approveTrigger(token: any) {
      this.showWaitingModal('Approving in process');

      this.approvingPending = true;
      const { selectedToken } = token;

      const approveValue = new BN(10)
        .pow(selectedToken.decimals)
        .times(10 ** 18)
        .toFixed(0);

      console.log('TRIGGER__1');
      await this.checkApproveForToken(token, (Number(approveValue) * 0.5).toFixed(0));
      if (selectedToken.approveData.approved) {
        this.closeWaitingModal();
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];

      const tx = await approveToken(
        tokenContract,
        this.zapContract.target,
        approveValue,
        this.account,
      )
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
        });

      console.log('TRIGGER__2');
      const finishTx = () => {
        this.checkApproveForToken(token, token.contractValue);
        this.closeWaitingModal();
        this.approvingPending = false;
      };

      if (!tx) {
        finishTx();
        return;
      }

      await tx.wait();
      finishTx();
      this.currentStage = zapInStep.DEPOSIT;
    },
    recalculateOutputTokensSum() {
      for (let i = 0; i < this.selectedOutputTokens.length; i++) {
        const token: any = this.selectedOutputTokens[i];
        const tokenSum = new BN(
          this.sumOfAllSelectedTokensInUsd,
        ).times(token.value).div(100);
        const sum = this.swapMethod === 'BUY'
          ? new BN(tokenSum).div(token.selectedToken.price)
          : new BN(tokenSum).times(token.selectedToken.price);
        this.outputTokens[i] = {
          ...token,
          sum: this.formatMoney(sum.toNumber(), 4),
        };
      }
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
          const newToken = updateTokenValue(
            ovnToken,
            0,
            this.checkApproveForToken,
          );

          this.updateTokenState(newToken);
          return;
        }

        const newToken = updateTokenValue(
          ovnToken,
          newValue,
          this.checkApproveForToken,
        );

        this.updateTokenState(newToken);
      }, 30);
    },

    addSelectedTokenToList(data: any) {
      console.log(data, 'addSelectedTokenToList');
      if (data.isInput) {
        this.addSelectedTokenToInputList(data.tokenData, false);
        // this.addTokensEmptyIsNeeded();
        return;
      }

      this.addSelectedTokenToOutputList(data.tokenData, true, 50);
    },
    addSelectedTokenToInputList(selectedToken: any, isAddAllBalance: any) {
      // todo computed ovn input tokens and logic here
      const newInputToken = getNewInputToken();
      newInputToken.selectedToken = selectedToken;
      this.inputTokens.push(newInputToken);
      this.removeAllWithoutSelectedTokens(this.inputTokens);

      if (isAddAllBalance) {
        setTimeout(() => {
          const newToken = updateTokenValue(
            newInputToken,
            newInputToken.selectedToken.balanceData.balance,
            this.checkApproveForToken,
          );

          this.updateTokenState(newToken);
        }, 10);
      }

      // if (newInputToken.selectedToken.symbol === 'OVN') {
      //   this.initDefaultTopInputTokensByBalance(this.noneOvnTokens);
      // }

      this.checkApproveForToken(
        newInputToken,
        new BN(10 ** selectedToken.decimals).times(1000000).toFixed(0),
      );
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
    removeSelectedTokenFromList(selectedToken: any) {
      this.removeInputToken(selectedToken.tokenData.id);
      if (this.inputTokens.length === 0) this.addNewInputToken();
    },
    removeAllWithoutSelectedTokens(tokens: any) {
      const tokensToRemove = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].selectedToken) continue;
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
    showSelectTokensModals(isShow: boolean) {
      this.isShowSelectTokensModal = isShow;
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
      const intervalId = setInterval(async () => {
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

<style lang="scss" scoped>
@import "./styles.scss"
</style>
