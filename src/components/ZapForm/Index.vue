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
                      :is-token-removable="false"
                      :is-input-token="false"
                      :disabled="true"
                      :balances-loading="isAnyLoading"
                      :token-loading="odosDataLoading"
                    />
                  </div>
                </div>
              </div>
            </div>

            <FeesBlock
              v-if="sumOfAllSelectedTokensInUsd && ifMoreThanOneSelectedTokensAdded && odosData"
              :slippage-percent="slippagePercent"
              :get-odos-fee="getOdosFee"
              :multi-swap-odos-fee-percent="multiSwapOdosFeePercent"
              :selected-input-tokens="selectedInputTokens"
              :selected-output-tokens="selectedOutputTokens"
              :odos-data="odosData"
              :agree-with-fees="agreeWithFees"
              :pool-version="zapPool?.poolVersion"
              :is-loading="odosDataLoading"
              @change-agree="changeAgreeFees"
            />

            <SwapSlippageSettings
              @change-slippage="handleCurrentSlippageChanged"
            />
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
            :disabled="!agreeWithFees"
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
            :disabled="odosDataLoading || !agreeWithFees || isSwapLoading"
            @click="stakeTrigger"
            @keypress="stakeTrigger"
          >
            {{ btnName }}
          </ButtonComponent>
        </div>
        <ZapInStepsRow
          v-if="zapPool.chain === networkId"
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
  getTokenByAddress,
  WHITE_LIST_ODOS,
} from '@/store/helpers/index.ts';
import odosApiService from '@/services/odos-api-service.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TokenForm from '@/components/TokenForm/Index.vue';
import PoolLabel from '@/components/ZapModal/PoolLabel.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import ZapInStepsRow from '@/components/StepsRow/ZapinRow/ZapinRow.vue';
import ZapinV3 from '@/components/ZapForm/ZapinV3.vue';
import { poolsInfoMap, poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import BN from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import { MANAGE_FUNC, zapInStep } from '@/store/modals/waiting-modal.ts';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import FeesBlock, { MIN_IMPACT } from '@/components/FeesBlock/Index.vue';
import { useTokensQuery, useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import { isEmpty } from 'lodash';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import {
  getSourceLiquidityBlackList,
  getUpdatedTokenVal, initReqData,
  parseLogs,
  removeToken,
} from '@/services/Web3Service/utils/index.ts';
import ZapinService, { ZAPIN_TYPE } from '@/services/Web3Service/Zapin-service.ts';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

const MAX_INPUT_TOKENS = 3;

export default defineComponent({
  name: 'ZapForm',
  components: {
    PoolLabel,
    BaseIcon,
    ZapinV3,
    ButtonComponent,
    SwapSlippageSettings,
    FeesBlock,
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
  setup: () => {
    const {
      data: balanceList,
      isLoading: isAnyLoading,
    } = useTokensQuery();

    const {
      data: allTokensList,
    } = useTokensQueryNew();

    return {
      allTokensList,
      balanceList,
      isAnyLoading: computed(() => isAnyLoading.value),
      refreshBalances: useRefreshBalances(),
    };
  },
  data: () => ({
    approvingPending: false,
    agreeWithFees: true,
    inputTokens: [] as any[],
    outputTokens: [] as any[],
    maxInputTokens: MAX_INPUT_TOKENS,
    v3Range: null as any,
    isShowSelectTokensModal: false,
    odosDataLoading: false,
    odosData: {
      percentDiff: 0,
      netOutValue: 0,
      priceImpact: 0,
    },

    isSwapLoading: false,
    slippagePercent: 0.5,
    multiSwapOdosFeePercent: 0.01,

    tokensQuotaCounterId: null as any,
    tokensQuotaCheckerSec: 0,

    clickOnStake: false,
    currentStage: zapInStep.START,
    // Mobile section switch
    zapMobileSection,
    currentSection: zapMobileSection.TOKEN_FORM,
  }),
  computed: {
    ...mapState('odosData', [
      'additionalSwapStepType',
      'lastZapResponseData',
      'lastPoolInfoData',
      'lastPutIntoPoolEvent',
      'lastReturnedToUserEvent',
      'lastNftTokenId',
      'routerContract',
      'odosReferalCode',
    ]),

    ...mapState('zapinData', [
      'currentZapPlatformContractType',
      'zapContract',
      'gaugeContract',
      'gaugeContractV3',
      'poolTokenContract',
      'zapPoolRoot',
    ]),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),

    ...mapGetters('zapinData', [
      'isZapLoaded',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    zapsLoaded() {
      return !isEmpty(this.allTokensList)
        && !isEmpty(this.outputTokens)
        && this.zapPool
        && !isEmpty(this.zapContract)
        && this.isZapLoaded;
    },
    getOdosFee() {
      return new BN(this.sumOfAllSelectedTokensInUsd)
        .times(this.multiSwapOdosFeePercent)
        .div(100)
        .toNumber();
    },
    zapAllTokens() {
      const selectedAdd = this.inputTokens
        .map((_) => _.selectedToken?.address?.toLowerCase() ?? null)
        .filter(Boolean);

      return mergedTokens(this.allTokensList, this.balanceList as any[], selectedAdd);
    },
    isInputTokensRemovable() {
      return this.inputTokens.length > 1;
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
      return this.inputTokens.filter((item: any) => item.selectedToken && item?.contractValue);
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
      if (this.currentZapPlatformContractType?.type === 'LP_STAKE_DIFF_STEPS') {
        return 'DEPOSIT';
      }

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
    zapInType() {
      if (this.zapPool?.poolVersion === 'v3') return 'V3';

      return 'V2';
    },
  },
  watch: {
    odosData(val) {
      if (new BN(val.percentDiff).absoluteValue().gt(MIN_IMPACT)) {
        this.agreeWithFees = false;
      } else {
        this.agreeWithFees = true;
      }
    },
    networkId(val) {
      this.loadRouterContract(val);
      this.$nextTick(() => {
        this.firstInit();
      });
    },
    balanceList() {
      if (!isEmpty(this.outputTokens)) return;

      this.firstInit();
    },
    currentStage(stage: zapInStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
      if (this.currentStage !== zapInStep.START) {
        this.$store.commit('zapinData/changeState', { field: 'selectedTokens', val: this.inputTokens });
      }
    },
    // on wallet connect
    async account(val) {
      await this.loadRouterContract(this.networkId);
      if (val) this.clearAndInitForm();
      if (!val) this.outputTokens = [getNewOutputToken()];
    },
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
  },
  mounted() {
    // const errD = '0x72ad0fbd0000000000000000000000004621b7
    // a9c75199271f773ebd9a499dbd165c31910000000000000000
    // 00000000000000000000000000000000706ce2270b740f7800
    // 00000000000000000000000000000000000000000000006fba52fafde6a74c';
    // const interfaceT = new Interface(abizap.abi as any);
    // const decoded = interfaceT.decodeErrorResult('BelowAmountMin', errD);
    this.currentStage = zapInStep.START;
    if (this.zapPool.chain !== this.networkId) this.currentStage = zapInStep.START;

    this.loadRouterContract(this.networkId);
    // for modal
    this.setStagesMap(MANAGE_FUNC.ZAPIN);
    this.initContracts();

    this.firstInit();
  },
  methods: {
    ...mapActions('odosData', [
      'triggerSuccessZapin',
      'loadRouterContract',
    ]),
    ...mapActions('zapinData', ['loadZapContract']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    ...mapMutations('waitingModal', ['setStagesMap']),
    ...mapMutations('zapinData', ['changeState']),
    onLeaveList,
    beforeEnterList,
    onEnterList,
    // Mobile section switcher
    changeAgreeFees() {
      this.agreeWithFees = !this.agreeWithFees;
    },
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
      this.updateTokenState(
        getUpdatedTokenVal(tokenData, this.checkApproveForToken),
      );
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

    initContracts() {
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

      const poolTokens = poolTokensForZapMap[this.zapPool.address];

      if (!poolTokens) return;

      this.$store.commit('odosData/changeState', {
        field: 'listOfBuyTokensAddresses',
        val: [poolTokens[0].address, poolTokens[1].address],
      });
      this.loadZapContract();
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
      const poolTokens = poolTokensForZapMap[this.zapPool.address];
      const poolSelectedToken = getTokenByAddress(poolTokens[0].address, this.balanceList);
      const ovnSelectSelectedToken = getTokenByAddress(poolTokens[1].address, this.balanceList);

      if (!poolSelectedToken || !ovnSelectSelectedToken) return;
      poolSelectedToken.selected = true;
      ovnSelectSelectedToken.selected = true;

      const tokenA = this.addSelectedTokenToOutputList(poolSelectedToken, true, 50);
      const tokenB = this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);

      this.outputTokens = [tokenA, tokenB];
      this.addNewInputToken();

      this.$forceUpdate();
      this.recalculateProportion();
    },
    addNewInputToken() {
      this.inputTokens.push(getNewInputToken());
    },
    removeInputToken(id: string) {
      removeToken(this.inputTokens, id);
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
    async stakeTriggerV3() {
      if (!this.v3Range || this.selectedInputTokens?.length === 0) return;
      this.odosDataLoading = true;

      try {
        const recalculateProportionParams = {
          selectedInputTokens: this.selectedInputTokens,
          selectedOutputTokens: this.selectedOutputTokens,
          zapPool: this.zapPool,
          zapContract: this.zapContract,
          v3RangeTicks: this.v3Range.ticks,
          networkId: this.networkId,
          slippageLimitPercent: this.getSlippagePercent(),
          odosSwapRequest: this.odosSwapRequest,
          simulateSwap: false,
          typeFunc: ZAPIN_TYPE.ZAPIN,
          showErrorModalWithMsg: this.showErrorModalWithMsg,
        };

        const data = await ZapinService.recalculateProportionOdosV3(recalculateProportionParams);

        if (!data || (data && !data.odosData)) {
          this.odosDataLoading = false;
          this.isSwapLoading = false;
          return;
        }

        if (data.inputTokens?.length === 0 && data.outputTokens?.length === 0) {
          this.initZapInTransaction(
            null,
            data.inputTokens,
            data.outputTokensForZap,
            data.amountOut,
            this.lastPoolInfoData,
            this.zapPool,
            data.amountMins,
          );
        }

        this.outputTokens = data?.outputTokens;
        this.odosData = data?.odosData;
        this.odosDataLoading = false;

        const assembleData = {
          userAddr: ethers.getAddress(
            this.zapContract.target?.toLowerCase(),
          ),
          pathId: data.odosData?.pathId,
          simulate: true,
        };

        odosApiService
          .assembleRequest(assembleData)
          .then(async (responseAssembleData) => {
            await this.initZapInTransaction(
              responseAssembleData,
              data.inputTokens,
              data.outputTokensForZap,
              data.amountOut,
              this.lastPoolInfoData,
              this.zapPool,
              data.amountMins,
            );
          });
      } catch (e) {
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
        this.isSwapLoading = false;
      }
    },
    async stakeTriggerV2() {
      const actualGas = await odosApiService.getActualGasPrice(this.networkId);

      const userInputTokens = this.selectedInputTokens;
      const poolOutputTokens = this.selectedOutputTokens;

      const proportions = await ZapinService.getV2Proportions(
        userInputTokens,
        poolOutputTokens,
        this.zapPool,
        this.zapContract,
      );

      const request = {
        chainId: this.networkId,
        inputTokens: proportions.inputTokens,
        outputTokens: proportions.outputTokens,
        gasPrice: actualGas as any,
        userAddr: this.zapContract.target,
        slippageLimitPercent: this.getSlippagePercent(),
      };

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
        sourceBlacklist: getSourceLiquidityBlackList(this.zapPool),
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

          odosApiService.assembleRequest(assembleData)
            .then(async (responseAssembleData) => {
              await this.initZapInTransaction(
                responseAssembleData,
                proportions.inputTokens,
                proportions.outputTokens,
                proportions,
                this.lastPoolInfoData,
                this.zapPool,
                [],
              );

              this.isSwapLoading = false;
              this.clickOnStake = false;
            })
            .catch(() => {
              this.isSwapLoading = false;
              this.clickOnStake = false;
            });
        })
        .catch(() => {
          this.isSwapLoading = false;
          this.clickOnStake = false;
        });
    },
    async stakeTrigger() {
      this.$store.commit('odosData/changeState', {
        field: 'lastPoolInfoData',
        val: poolsInfoMap[this.zapPool.address],
      });

      if (!this.zapPool) return;
      if (!this.lastPoolInfoData) return;
      if (this.isSwapLoading) return;

      this.currentStage = zapInStep.DEPOSIT;
      this.clickOnStake = true;
      this.isSwapLoading = true;

      if (this.zapInType === 'V2') this.stakeTriggerV2();
      if (this.zapInType === 'V3') this.stakeTriggerV3();
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

      parseLogs(data.logs, this.commitEventToStore);
      this.currentStage = zapInStep.APPROVE_GAUGE;

      for (const item of data.logs) {
        const eventName = item?.eventName;
        if (eventName === 'TokenId') {
          // eslint-disable-next-line prefer-destructuring
          this.commitEventToStore('lastParsedTokenIdEvent', new BN(item.args[0]).toString(10));
        }
      }

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
      const isGaugeApproved = await ZapinService.checkApproveForGauge(
        this.poolTokenContract,
        approveAmount,
        this.routerContract,
        this.account,
      );

      if (!isGaugeApproved) {
        this.showWaitingModal('Approving gauge in process');
        ZapinService.approveGaugeForStake(
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

      ZapinService.depositAllAtGauge(
        this.account,
        lastPoolInfoData,
        lastNftTokenId,
        this.currentZapPlatformContractType,
        this.gaugeContract,
        this.zapPoolRoot,
        this.poolTokenContract,
        this.gaugeContractV3,
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
      amountMins: string[],
    ) {
      console.log(proportions, '__proportions');
      const gaugeAddress = poolInfo.gauge;
      const requestData = initReqData(
        requestInputTokens,
        requestOutputTokens,
        this.zapContract.target,
      );

      let txData = {
        inputs: requestData.inputT,
        outputs: requestData.outputT,
        data: responseData ? responseData.transaction.data : '0x',
      };

      let gaugeData: any = {
        gauge: gaugeAddress,
        amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
      };

      if (zapPool.platform === 'Pancake' && this.zapPool.poolVersion === 'v2') {
        gaugeData = {
          amountsOut: [
            proportions.amountToken0Out,
            proportions.amountToken1Out,
          ],
          pair: gaugeAddress,
        };
      }

      if (this.zapPool.poolVersion === 'v3') {
        gaugeData = {
          pair: this.zapPool.address,
          tickRange: this.v3Range.ticks,
          amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
        };
        txData = {
          ...txData,
          outputs: requestData.outputT.map((_, key) => ({
            ..._,
            amountMin: new BN(amountMins[key])
              .times(1 - this.getSlippagePercent() / 100)
              .toFixed(0),
          })),
        };
      }

      this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        // gasPrice: ethers.parseUnits('100', 'gwei'),
        // gasLimit: 1000000,
      };

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

        this.isSwapLoading = false;
      } catch (e: any) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: parseErrorLog(e) });
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
    async recalculateProportionV2() {
      let reserves = null;

      const outputToken0Price = this.selectedOutputTokens[0].selectedToken.price;
      const outputToken1Price = this.selectedOutputTokens[1].selectedToken.price;

      const emptyVals = this.inputTokens.map((_) => {
        if (new BN(_?.value).eq(0) || !_?.value) return null;

        return _;
      });

      if (emptyVals.every((_) => !_)) return;

      reserves = await ZapinService.getV2Reserves(
        this.zapPool.address,
        this.zapPool,
        this.zapContract,
      );

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

      this.outputTokens = ZapinService.recalculateOutputTokensSum(
        this.selectedOutputTokens,
        this.selectedInputTokens,
      );

      const proportions = await ZapinService.getV2Proportions(
        this.selectedInputTokens,
        this.selectedOutputTokens,
        this.zapPool,
        this.zapContract,
      );

      const whiteList = WHITE_LIST_ODOS[this.networkId as keyof typeof WHITE_LIST_ODOS];

      const request = {
        chainId: this.networkId,
        inputTokens: proportions.inputTokens,
        outputTokens: proportions.outputTokens,
        userAddr: this.zapContract.target,
        slippageLimitPercent: this.getSlippagePercent(),
      };

      const requestData = {
        chainId: request.chainId,
        inputTokens: request.inputTokens,
        outputTokens: request.outputTokens,
        userAddr: ethers.getAddress(
          request.userAddr.toLowerCase(),
        ),
        slippageLimitPercent: this.getSlippagePercent(),
        sourceBlacklist: getSourceLiquidityBlackList(this.zapPool),
        sourceWhitelist: whiteList ?? [],
        simulate: true,
        pathViz: true,
      };

      this.odosSwapRequest(requestData)
        .then((data: any) => {
          this.odosData = data;
          this.odosDataLoading = false;
        })
        .catch((e) => {
          console.error(e);
          this.odosDataLoading = false;
        });
    },
    async recalculateProportionV3() {
      if (!this.v3Range || this.selectedInputTokens?.length === 0) return;

      this.odosDataLoading = true;

      try {
        const recalculateProportionParams = {
          selectedInputTokens: this.selectedInputTokens,
          selectedOutputTokens: this.selectedOutputTokens,
          zapPool: this.zapPool,
          zapContract: this.zapContract,
          v3RangeTicks: this.v3Range.ticks,
          networkId: this.networkId,
          slippageLimitPercent: this.getSlippagePercent(),
          odosSwapRequest: this.odosSwapRequest,
          simulateSwap: true,
          typeFunc: ZAPIN_TYPE.ZAPIN,
          showErrorModalWithMsg: this.showErrorModalWithMsg,
        };

        const data = await ZapinService.recalculateProportionOdosV3(recalculateProportionParams);

        if (!data || (data && !data.odosData)) {
          this.odosDataLoading = false;
          return;
        }

        this.outputTokens = data?.outputTokens;
        this.odosData = data.odosData;
        this.odosDataLoading = false;
      } catch (e) {
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
      }
    },
    async recalculateProportion() {
      if (this.zapPool?.poolVersion === 'v2') await this.recalculateProportionV2();
      if (this.zapPool?.poolVersion === 'v3') await this.recalculateProportionV3();
    },
    getSlippagePercent(): number {
      return this.slippagePercent;
    },
    async checkApproveForToken(token: any, checkedAllowanceValue: any) {
      this.currentStage = zapInStep.APPROVE_TOKENS;
      // checkedAllowanceValue in wei
      const { selectedToken } = token;

      console.log(token, '__TOKEN');
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
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: parseErrorLog(e) });
        });

      console.log('TRIGGER__2');
      const finishTx = () => {
        this.checkApproveForToken(token, token.contractValue);
        this.closeWaitingModal();
        this.approvingPending = false;
        this.currentStage = zapInStep.DEPOSIT;
      };

      if (!tx) {
        finishTx();
        return;
      }

      await tx.wait();
      finishTx();
    },
    addSelectedTokenToList(data: any) {
      if (data.isInput) {
        this.addSelectedTokenToInputList(data.tokenData, false);
        return;
      }

      this.addSelectedTokenToOutputList(data.tokenData, true, 50);
    },
    addSelectedTokenToInputList(selectedToken: any, isAddAllBalance: any) {
      const newInputToken = {
        ...getNewInputToken(),
        selectedToken,
      };
      this.removeAllWithoutSelectedTokens(this.inputTokens);
      this.inputTokens.push(newInputToken);

      if (isAddAllBalance) {
        const newToken = updateTokenValue(
          newInputToken,
          newInputToken.selectedToken.balanceData.balance,
          this.checkApproveForToken,
        );

        this.updateTokenState(newToken);
      }

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
        removeToken(tokens, tokensToRemove[i].id);
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
