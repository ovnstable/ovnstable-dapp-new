<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <div
      v-if="zapPool.chain !== networkId"
      class="zapin-container"
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
      class="zapin-container"
    >
      <div class="zapin-block v3">
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
                        v-if="!isEmptyForm"
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
                          :balances-loading="isAnyLoading"
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
                    v-for="token in outputTokens"
                    :key="token.id"
                    class="input-component-container"
                  >
                    <TokenForm
                      :token-info="token"
                      :is-token-removable="isOutputTokensRemovable"
                      :is-input-token="false"
                      :disabled="true"
                      hide-balance
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
            :tokens-data="outputTokens"
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
            :loading="isSwapLoading"
            @click="toApproveAndDepositSteps(lastZapResponseData)"
            @keypress="toApproveAndDepositSteps(lastZapResponseData)"
          >
            APPROVE GAUGE
          </ButtonComponent>
          <ButtonComponent
            v-else-if="additionalSwapStepType === 'DEPOSIT'"
            btn-size="large"
            btn-styles="primary"
            full
            disabled
            :loading="isSwapLoading"
            @click="depositGauge(lastNftTokenId)"
            @keypress="depositGauge(lastNftTokenId)"
          >
            STAKE LP
          </ButtonComponent>
          <ButtonComponent
            v-else
            btn-size="large"
            btn-styles="primary"
            full
            disabled
            :loading="isSwapLoading"
            @click="stakeTrigger"
            @keypress="stakeTrigger"
          >
            {{ btnName }}
          </ButtonComponent>
        </div>
      </div>
    </div>

    <SelectTokensModal
      :is-show="isShowSelectTokensModal"
      :select-token-input="true"
      :tokens="zapAllTokens"
      :is-all-data-loaded="zapsLoaded"
      :selected-tokens="inputTokens"
      :balances-loading="isAnyLoading"
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
import {
  computed, defineComponent, markRaw,
} from 'vue';
import { ethers } from 'ethers';
import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import {
  updateTokenValue,
  maxAll,
  getNewOutputToken,
  getNewInputToken,
  WHITE_LIST_ODOS,
  getTokenBySymbol,
} from '@/store/helpers/index.ts';
import {
  getV3Proportion,
} from '@/store/views/main/zapin/helpers.ts';
import odosApiService from '@/services/odos-api-service.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { formatMoney } from '@/utils/numbers.ts';
import TokenForm from '@/modules/Main/components/Odos/TokenForm.vue';
import PoolLabel from '@/components/ZapModal/PoolLabel.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import ZapinV3 from '@/components/ZapForm/ZapinV3.vue';
import BN from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import { MANAGE_FUNC, zapInStep } from '@/store/modals/waiting-modal.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import { loadAbi, srcStringBuilder } from '@/store/views/main/zapin/index.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { isEmpty } from 'lodash';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { mapExcludeLiquidityPlatform, parseLogs, sourceLiquidityBlacklist } from './helpers.ts';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

const MAX_INPUT_TOKENS = 3;

export default defineComponent({
  name: 'AutoZapForm',
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
  },
  props: {
    zapPool: {
      type: Object,
      required: false,
      default: () => {},
    },
    balanceList: {
      type: Array,
      required: true,
      default: () => [],
    },
    allTokensList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  setup: () => {
    const {
      isLoading: isAnyLoading,
    } = useTokensQuery();

    return {
      isAnyLoading: computed(() => isAnyLoading.value),
      refreshBalances: useRefreshBalances(),
    };
  },
  data: () => ({
    approvingPending: false,
    inputTokens: [] as any[],
    outputTokens: [] as any[],
    maxInputTokens: MAX_INPUT_TOKENS,
    v3Range: null as any,
    isShowSelectTokensModal: false,
    gaugeContract: null as any,
    zapContract: null as any,
    poolTokenContract: null as any,
    zapPoolRoot: null as any,
    swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)

    isSwapLoading: false,
    slippagePercent: 0.5,
    multiSwapOdosFeePercent: 0.01,

    tokensQuotaCounterId: null as any,
    tokensQuotaCheckerSec: 0,
    poolTokens: [] as any[],

    currentStage: zapInStep.START,
    // Mobile section switch
    zapMobileSection,
    currentSection: zapMobileSection.TOKEN_FORM,
  }),
  computed: {
    ...mapState('odosData', [
      'additionalSwapStepType',
      'lastZapResponseData',
      'lastNftTokenId',
      'odosReferalCode',
    ]),

    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    zapsLoaded() {
      return !isEmpty(this.allTokensList)
        && !isEmpty(this.outputTokens)
        && this.zapPool
        && !isEmpty(this.zapContract);
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

      return mergedTokens(this.allTokensList as any[], this.balanceList as any[], selectedAdd);
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

    isEmptyForm() {
      if (this.inputTokens.filter((item: any) => item.selectedToken).length === 0) return true;
      if (this.outputTokens.filter((item: any) => item.selectedToken).length === 0) return true;
      return false;
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
      return (this.isEmptyForm
        || !this.isAvailableOnNetwork
        || !this.isAnyTokensBalanceIsInsufficient
        || !this.isAmountEntered
      );
    },

    btnName() {
      return 'STAKE';
    },

    disableButtonMessage() {
      if (this.isEmptyForm) {
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
  },
  watch: {
    networkId() {
      this.$nextTick(() => {
        this.firstInit();
      });
    },
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
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
  },
  async mounted() {
    this.currentStage = zapInStep.START;
    if (this.zapPool.chain !== this.networkId) this.currentStage = zapInStep.START;

    // for modal
    this.setIsZapModalShow(true);
    this.setStagesMap(MANAGE_FUNC.ZAPIN);
    await this.initContracts();

    this.firstInit();
  },
  methods: {
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('walletAction', ['connectWallet']),

    ...mapMutations('waitingModal', ['setStagesMap']),
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

    updateTokenValueMethod(tokenData: any) {
      let newToken = null;

      if (tokenData.isMaxBal) {
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

    async initContracts() {
      const tokens = this.zapPool.name.split('/');
      const tokenA = getTokenBySymbol(tokens[0], this.allTokensList);
      const tokenB = getTokenBySymbol(tokens[1], this.allTokensList);

      const abiGauge = srcStringBuilder('V3GaugeRebalance')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiGaugeContractFileV3 = await loadAbi(abiGauge);

      const abiV3Zap = srcStringBuilder('V3Zap')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Zap = await loadAbi(abiV3Zap);

      const abiV3Nft = srcStringBuilder('V3Nft')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Nft = await loadAbi(abiV3Nft);

      this.gaugeContract = buildEvmContract(
        abiGaugeContractFileV3.abi,
        this.evmSigner,
        this.zapPool.gauge,
      );

      this.zapContract = buildEvmContract(
        abiContractV3Zap.abi,
        this.evmSigner,
        abiContractV3Zap.address,
      );

      this.poolTokenContract = buildEvmContract(
        abiContractV3Nft.abi,
        this.evmSigner,
        abiContractV3Nft.address,
      );

      this.poolTokens = [tokenA, tokenB];
    },

    firstInit() {
      this.initEvent();
      this.clearAndInitForm();
    },

    async initEvent() {
      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });
    },
    addDefaultPoolToken() {
      if (this.poolTokens.length === 0) return;
      const tokenA = this.addSelectedTokenToOutputList(this.poolTokens[0], true, 50);
      const tokenB = this.addSelectedTokenToOutputList(this.poolTokens[1], true, 50);

      this.outputTokens = [tokenA, tokenB];
      this.addNewInputToken();

      this.$forceUpdate();
      this.recalculateProportion();
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
      this.refreshBalances();
    },

    clearAndInitForm() {
      this.clearAllSelectedTokens();
      this.addDefaultPoolToken();
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
      if (this.isSwapLoading) return;

      this.isSwapLoading = true;

      const actualGas = await odosApiService.getActualGasPrice(this.networkId);
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
        );

        this.isSwapLoading = false;
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
              );
            })
            .catch((e) => {
              console.error('Odos assemble request failed swap form', e);
              this.isSwapLoading = false;
            });
        })
        .catch((e) => {
          console.error('Odos swap request failed from zap', e);
          this.isSwapLoading = false;
        });
    },

    getSourceLiquidityBlackList() {
      let sourceBlacklist = [...sourceLiquidityBlacklist];
      // excluding platform for big liquidities zapins
      const excludeLiquidityByPlatform = mapExcludeLiquidityPlatform[
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
    async toApproveAndDepositSteps(data: any) {
      const nftId = '';

      console.log(parseLogs(data.logs, this.commitEventToStore), '___data');
      parseLogs(data.logs, this.commitEventToStore);
      this.currentStage = zapInStep.APPROVE_GAUGE;
      this.isSwapLoading = true;

      this.$store.commit('odosData/changeState', {
        field: 'additionalSwapStepType',
        val: 'APPROVE',
      });

      this.approveNftGauge(nftId);
    },
    async approveNftGauge(nftId: string) {
      this.showWaitingModal('Approving NFT in process');
      this.isSwapLoading = true;

      if (!this.lastNftTokenId || nftId) {
        try {
          const tokenId = nftId || await this.getLastNftId();

          this.$store.commit('odosData/changeState', {
            field: 'lastNftTokenId',
            val: tokenId,
          });

          const params = { from: this.account };
          const tx = await this.poolTokenContract
            .approve(this.gaugeContract?.target, tokenId, params);

          await tx.wait();

          this.isSwapLoading = false;
          this.$store.commit('odosData/changeState', {
            field: 'additionalSwapStepType',
            val: 'DEPOSIT',
          });
          this.currentStage = zapInStep.DEPOSIT;
          this.closeWaitingModal();
          this.depositGauge(
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
          this.lastNftTokenId,
        );
      }
    },
    async getLastNftId() {
      const tokens = await this.poolTokenContract.balanceOf(this.account);
      console.log(tokens, '___tokens');
      const tokenId = await this.poolTokenContract
        .tokenOfOwnerByIndex(this.account, Number(tokens) - 1);

      console.log(tokenId, '___tokenId');
      return tokenId;
    },
    async depositGauge(
      lastNftTokenId: any,
    ) {
      this.currentStage = zapInStep.STAKE_LP;
      this.showWaitingModal('Stake LP in process');

      console.log({
        acc: this.account,
        lastNftTokenId,
        gauge: this.gaugeContract,
        zaproot: this.zapPoolRoot,
        token: this.poolTokenContract,

      }, '___DATA1');

      this.isSwapLoading = true;
      const tx = await this.gaugeContract.deposit(Number(lastNftTokenId));
      await tx.wait();

      const inputTokens = [...this.selectedInputTokens];
      const outputTokens = [...this.selectedOutputTokens];
      this.isSwapLoading = false;
      console.log(inputTokens, 'SUCCESS1');
      console.log(outputTokens, 'SUCCESS2');
      this.triggerSuccessZapin(
        {
          isShow: true,
          inputTokens,
          outputTokens,
          hash: tx.hash,
          pool: this.zapPool,
          modalType: MODAL_TYPE.ZAPIN,
        },
      );

      this.closeWaitingModal();
      this.clearAndInitForm();
      this.$store.commit('odosData/changeState', {
        field: 'additionalSwapStepType',
        val: null,
      });
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any[],
      requestOutputTokens: any[],
      proportions: any,
    ) {
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

      const gaugeData = {
        pair: this.zapPool.address,
        tickRange: this.v3Range.ticks,
        amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
      };

      this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        // gasPrice: ethers.parseUnits('100', 'gwei'),
        // gasLimit: 1000000,
      };

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

        this.toApproveAndDepositSteps(this.lastZapResponseData);
      } catch (e: any) {
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
      const emptyVals = this.inputTokens.map((_) => {
        if (new BN(_?.value).eq(0) || !_?.value) return null;

        return _;
      });

      if (emptyVals.every((_) => !_)) return;

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

      const tokenContract = TokenService
        .loadTokenContract(selectedToken.address, this.$store.state.web3.evmSigner);
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
      this.currentStage = zapInStep.DEPOSIT;
    },

    async approveTrigger(token: any) {
      this.showWaitingModal('Approving in process');

      this.approvingPending = true;
      const { selectedToken } = token;

      const approveValue = new BN(10)
        .pow(selectedToken.decimals)
        .times(10 ** 18)
        .toFixed(0);

      await this.checkApproveForToken(token, (Number(approveValue) * 0.5).toFixed(0));
      if (selectedToken.approveData.approved) {
        this.closeWaitingModal();
        return;
      }

      const tokenContract = TokenService
        .loadTokenContract(selectedToken.address, this.$store.state.web3.evmSigner);

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

    addSelectedTokenToList(data: any) {
      if (data.isInput) {
        this.addSelectedTokenToInputList(data.tokenData, false);
        return;
      }

      this.addSelectedTokenToOutputList(data.tokenData, true, 50);
    },
    addSelectedTokenToInputList(selectedToken: any, isAddAllBalance: any) {
      // todo computed ovn input tokens and logic here
      const newInputToken = getNewInputToken();
      newInputToken.selectedToken = selectedToken;
      this.removeAllWithoutSelectedTokens(this.inputTokens);
      this.inputTokens.unshift(newInputToken);

      if (isAddAllBalance) {
        const newToken = updateTokenValue(
          newInputToken,
          newInputToken.selectedToken.balanceData.balance,
          this.checkApproveForToken,
        );

        this.updateTokenState(newToken);
      }

      // if (newInputToken.selectedToken.symbol === 'OVN') {
      //   this.initDefaultTopInputTokensByBalance(this.noneOvnTokens);
      // }

      this.checkApproveForToken(
        newInputToken,
        new BN(10 ** selectedToken.decimals).times(1000000).toFixed(0),
      );
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
    addSelectedTokenToOutputList(selectedToken: any, locked: any, startPercent: any) {
      return {
        ...getNewOutputToken(),
        locked,
        value: startPercent,
        selectedToken,
      };
    },
    removeSelectedTokenFromList(selectedToken: any) {
      this.removeInputToken(selectedToken.tokenData.id);
      if (this.inputTokens.length === 0) this.addNewInputToken();
    },
    clearAllSelectedTokens() {
      this.clearAllTokens();
    },
    clearAllTokens() {
      this.inputTokens = [];
      this.outputTokens = [];
    },
    showSelectTokensModals(isShow: boolean) {
      this.isShowSelectTokensModal = isShow;
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
});
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>
