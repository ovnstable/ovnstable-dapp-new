<!-- eslint-disable no-restricted-syntax -->
<template>
  <div class="zapin-wrap">
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
          <BaseIcon
            name="ArrowLeft"
            @click="toggleMobileSection"
          />
          <div class="zapin-block__header">
            ZAP IN
          </div>
          <BaseIcon
            name="ArrowRight"
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
                      :class="{ 'swap-form__body-block__inputs': true, 'block-inputs--scroll': inputTokens?.length > 3 }"
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
                      :token-loading="odosDataLoading"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SwapSlippageSettings
              @change-slippage="handleCurrentSlippageChanged"
            />

            <FeesBlock
              v-if="ifMoreThanOneSelectedTokensAdded && odosData?.netOutValue"
              :slippage-percent="slippagePercent"
              :get-odos-fee="getOdosFee"
              :multi-swap-odos-fee-percent="multiSwapOdosFeePercent"
              :selected-input-tokens="selectedInputTokens"
              :selected-output-tokens="selectedOutputTokens"
              :odos-data="odosData"
              :agree-with-fees="agreeWithFees"
              :is-loading="odosDataLoading"
              @change-agree="changeAgreeFees"
            />
          </div>
          <div class="zapin-block__counts">
            <ZapinV3
              :zap-pool="zapPool"
              :zap-contract="zapContract"
              :tokens-data="outputTokens"
              :class="currentSection === zapMobileSection.SET_PRICE_RANGE && 'mobile-active'"
              @set-range="setRangeV3"
            />
            <SwapRouting
              v-if="odosData?.netOutValue"
              :swap-data="odosData"
              :merged-list="mergedTokenList"
              :input-tokens="selectedInputTokens"
              :output-tokens="selectedOutputTokens"
            />
          </div>
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
            :loading="isSwapLoading || !agreeWithFees"
            @click="depositGauge"
            @keypress="depositGauge"
          >
            STAKE LP
          </ButtonComponent>
          <ButtonComponent
            v-else
            btn-size="large"
            btn-styles="primary"
            full
            :disabled="!agreeWithFees"
            :loading="isSwapLoading || odosDataLoading"
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
<!-- eslint-disable no-continue -->
<script lang="ts">
import {
  computed, defineComponent, inject, markRaw,
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
} from '@/store/helpers/index.ts';
import { type IOvernightApi } from '@/services/ApiService/OvernightApi.ts';

import SwapRouting from '@/components/SwapRouting/Index.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TokenForm from '@/components/TokenForm/Index.vue';
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
import { isEmpty } from 'lodash';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import FeesBlock, { MIN_IMPACT } from '@/components/FeesBlock/Index.vue';
import { parseErrorLog } from '@/utils/errors.ts';
import ZapinService, { ZAPIN_FUNCTIONS, ZAPIN_TYPE } from '@/services/Web3Service/Zapin-service.ts';
import {
  getUpdatedTokenVal,
  initReqData,
  initZapData,
  initZapinContracts,
  parseLogs,
  removeToken,
} from '@/services/Web3Service/utils/index.ts';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

const MAX_INPUT_TOKENS = 3;

export default defineComponent({
  name: 'AutoZapForm',
  components: {
    PoolLabel,
    SwapRouting,
    BaseIcon,
    ZapinV3,
    FeesBlock,
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

    const overnightApiInstance = inject('overnightApi') as IOvernightApi;

    return {
      isAnyLoading: computed(() => isAnyLoading.value),
      refreshBalances: useRefreshBalances(),
      overnightApiInstance,
    };
  },
  data: () => ({
    approvingPending: false,
    agreeWithFees: true,
    newTokenId: 0,
    inputTokens: [] as any[],
    outputTokens: [] as any[],
    v3Range: null as any,
    isShowSelectTokensModal: false,
    gaugeContract: null as any,
    zapContract: null as any,
    poolTokenContract: null as any,
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
      return new BN(this.odosData.netOutValue)
        .times(this.multiSwapOdosFeePercent)
        .div(100)
        .toNumber();
    },
    zapAllTokens() {
      const selectedAdd = this.inputTokens
        .map((_) => _.selectedToken?.address?.toLowerCase() ?? null)
        .filter(Boolean);

      return mergedTokens(this.allTokensList as any[], this.balanceList as any[], selectedAdd);
    },
    mergedTokenList() {
      return mergedTokens(this.balanceList as any[], this.allTokensList as any[]);
    },
    isInputTokensRemovable() {
      return this.inputTokens.length > 1;
    },

    isOutputTokensRemovable() {
      return false;
    },
    isInputTokensAddAvailable() {
      return (
        this.inputTokens.length < MAX_INPUT_TOKENS
      );
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

      return tokens.every((_) => _.value && new BN(_?.value).gt(0));
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
    odosData(val) {
      if (new BN(val.percentDiff).absoluteValue().gt(MIN_IMPACT)) {
        this.agreeWithFees = false;
      } else {
        this.agreeWithFees = true;
      }
    },
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
    // on wallet connect
    async account(val) {
      if (val) this.clearAndInitForm();
      if (!val) this.outputTokens = [getNewOutputToken()];
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

    changeAgreeFees() {
      this.agreeWithFees = !this.agreeWithFees;
    },
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
      this.updateTokenState(getUpdatedTokenVal(tokenData, this.checkApproveForToken));
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
      const contractsData = await initZapinContracts(
        this.zapPool,
        this.mergedTokenList,
        this.evmSigner,
        this.zapPool.gauge,
      );

      console.log(contractsData, '____contractsData');

      this.gaugeContract = contractsData.gaugeContract;
      this.zapContract = contractsData.zapContract;
      this.poolTokenContract = contractsData.poolTokenContract;
      this.poolTokens = contractsData.poolTokens;

      console.log(this.zapContract);
    },

    firstInit() {
      this.clearAndInitForm();
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
    addNewInputToken() {
      this.inputTokens.push(getNewInputToken());
    },
    removeInputToken(id: string) {
      removeToken(this.inputTokens, id);
    },
    async odosSwapRequest(requestData: any) {
      return this.overnightApiInstance
        .quoteRequest(requestData)
        .then((data: any) => data)
        .catch((e: any) => {
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

    clearAndInitForm() {
      this.clearAllSelectedTokens();
      this.addDefaultPoolToken();
    },
    async stakeTrigger() {
      if (this.isSwapLoading) return;
      if (!this.v3Range || this.selectedInputTokens?.length === 0) return;
      this.odosDataLoading = true;

      const recalculateProportionParams = {
        selectedInputTokens: this.selectedInputTokens.filter((_) => (!!new BN(_.value).gt(0))),
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

      try {
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
            data.amountMins,
          );
        }

        this.outputTokens = data?.outputTokens;
        this.odosData = data?.odosData;
        this.odosDataLoading = false;
        this.isSwapLoading = true;

        const assembleData = {
          userAddr: ethers.getAddress(
            this.zapContract.target?.toLowerCase(),
          ),
          pathId: data.odosData?.pathId,
          simulate: true,
        };

        this.overnightApiInstance
          .assembleRequest(assembleData)
          .then(async (responseAssembleData: any) => {
            await this.initZapInTransaction(
              responseAssembleData,
              data.inputTokens,
              data.outputTokensForZap,
              data.amountOut,
              data.amountMins,
            );
          });
      } catch (e) {
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
        this.isSwapLoading = true;
      }
    },

    commitEventToStore(field: string, value: any) {
      this.$store.commit('odosData/changeState', {
        field,
        val: value,
      });
    },
    async toApproveAndDepositSteps(data: any) {
      parseLogs(data.logs, this.commitEventToStore);

      console.log(data.logs, '___LOGS');
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data.logs) {
        const eventName = item?.eventName;
        if (eventName === 'TokenId') {
          // eslint-disable-next-line prefer-destructuring
          this.newTokenId = item.args[0];
          this.commitEventToStore('lastParsedTokenIdEvent', new BN(item.args[0]).toString(10));
        }
      }

      this.currentStage = zapInStep.APPROVE_GAUGE;
      this.isSwapLoading = true;

      this.$store.commit('odosData/changeState', {
        field: 'additionalSwapStepType',
        val: 'APPROVE',
      });

      this.approveNftGauge();
    },
    async approveNftGauge() {
      this.showWaitingModal('Approving NFT in process');
      this.isSwapLoading = true;

      try {
        const params = { from: this.account };
        const tx = await this.poolTokenContract
          .approve(this.gaugeContract?.target, this.newTokenId, params);

        await tx.wait();

        this.isSwapLoading = false;
        this.$store.commit('odosData/changeState', {
          field: 'additionalSwapStepType',
          val: 'DEPOSIT',
        });
        this.currentStage = zapInStep.DEPOSIT;
        this.closeWaitingModal();
        this.depositGauge();
      } catch (e) {
        console.error('Approve nft gauge failed', e);
        this.$store.commit('odosData/changeState', {
          field: 'lastNftTokenId',
          val: null,
        });
        this.closeWaitingModal();
      }
    },
    async depositGauge() {
      try {
        this.currentStage = zapInStep.STAKE_LP;
        this.showWaitingModal('Stake LP in process');
        this.isSwapLoading = true;

        console.log(
          this.zapPool.platform[0],
          this.gaugeContract,
          this.newTokenId?.toString(),
          this.account,
          this.poolTokenContract,
          '___TEST',
        );
        const tx = await ZapinService.stakeTrigger(
          this.zapPool.platform[0],
          this.gaugeContract,
          this.newTokenId?.toString(),
          this.account,
          this.poolTokenContract,
        );

        if (!tx) throw new Error('no stake transaction');

        this.isSwapLoading = false;
        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens: [...this.inputTokens],
            outputTokens: [...this.outputTokens],
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
      } catch (e) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({
          errorType: 'zap',
          errorMsg: parseErrorLog(e),
        });
      }
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any[],
      requestOutputTokens: any[],
      proportions: any,
      amountMins: string[],
    ) {
      const requestData = initReqData(
        requestInputTokens,
        requestOutputTokens,
        this.zapContract.target,
      );

      const { txData, gaugeData } = initZapData(
        requestData,
        responseData,
        amountMins,
        this.getSlippagePercent(),
        this.zapPool.address,
        proportions,
        this.v3Range,
      );

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
        const receipt = await ZapinService
          .triggerZapin(this.zapContract, txData, gaugeData, params, ZAPIN_FUNCTIONS.ZAPIN);

        console.log(receipt, '___receipt');
        if (!receipt) throw new Error('No Transaction');

        this.$store.commit('odosData/changeState', {
          field: 'lastZapResponseData',
          val: markRaw(receipt),
        });

        this.$store.commit('odosData/changeState', {
          field: 'lastParsedZapResponseData',
          val: markRaw(receipt),
        });

        if (this.gaugeContract.target === '0x0000000000000000000000000000000000000000') {
          this.triggerSuccessZapin(
            {
              isShow: true,
              inputTokens: this.inputTokens,
              outputTokens: this.outputTokens,
              hash: receipt.hash,
              pool: this.zapPool,
              modalType: MODAL_TYPE.ZAPIN,
            },
          );

          this.closeWaitingModal();
          return;
        }

        this.toApproveAndDepositSteps(this.lastZapResponseData);
      } catch (e: any) {
        this.closeWaitingModal();
        this.showErrorModalWithMsg({
          errorType: 'zap',
          errorMsg: parseErrorLog(e),
        });
        this.isSwapLoading = false;
      }
    },
    async recalculateProportion() {
      if (!this.isAmountEntered) return;
      if (!this.v3Range || this.selectedInputTokens?.length === 0) return;

      this.odosDataLoading = true;

      try {
        const recalculateProportionParams = {
          selectedInputTokens: this.selectedInputTokens.filter((_) => (!!new BN(_.value).gt(0))),
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
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
      }
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

      const tokenContract = TokenService.loadTokenContract(selectedToken.address, this.evmSigner);
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
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: parseErrorLog(e) });
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
    addSelectedTokenToList(data: any) {
      if (data.isInput) {
        this.addSelectedTokenToInputList(data.tokenData, false);
      } else {
        this.addSelectedTokenToOutputList(data.tokenData, true, 50);
      }
    },
    addSelectedTokenToInputList(selectedToken: any, isAddAllBalance: any) {
      // todo computed ovn input tokens and logic here
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
        this.tokensQuotaCounterId = -1;
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
