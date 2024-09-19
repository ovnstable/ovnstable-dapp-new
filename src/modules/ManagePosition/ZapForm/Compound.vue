<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <div
      v-if="zapPool.chain !== networkId"
      class="swap-container"
    >
      <div class="swap-body">
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
              <div class="zapin-block__swap-wrapper">
                <div class="out-swap-container pt-5">
                  <div class="input-swap-container">
                    <div class="swap-form__body-block">
                      <div class="swap-form__body-block__title">
                        <h3>
                          You claim
                        </h3>
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
                            :is-token-removable="false"
                            :is-input-token="false"
                            :disabled="true"
                            :balances-loading="isAnyLoading"
                          />
                        </div>
                      </TransitionGroup>
                    </div>
                  </div>
                </div>
                <div>
                <div class="out-swap-container pt-5 new-position-tokens">
                  <h2>
                    New position
                  </h2>
                  <div
                    v-for="token in newPositionTokens"
                    :key="token.id"
                    class="input-component-container"
                  >
                    <TokenForm
                      :token-info="token"
                      :is-token-removable="false"
                      :is-input-token="false"
                      :disabled="true"
                      :balances-loading="isBalancesLoading"
                      :token-loading="odosDataLoading"
                      hide-balance
                      @remove-token="removeOutputToken"
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
            <FeesBlock
              v-if="odosData"
              :slippage-percent="slippagePercent"
              :get-odos-fee="0"
              :multi-swap-odos-fee-percent="0"
              :selected-input-tokens="inputTokens"
              :selected-output-tokens="newPositionTokens"
              :odos-data="odosData"
              :agree-with-fees="agreeWithFees"
              :current-position-tokens="initPositionTokens"
              :is-loading="odosDataLoading"
              @change-agree="changeAgreeFees"
            />

            <SwapSlippageSettings
              @change-slippage="handleCurrentSlippageChanged"
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
            v-if="isDisabled"
            btn-size="large"
            btn-styles="primary"
            full
            disabled
          >
            NOT ENOUGH REWARDS TO COMPOUND
          </ButtonComponent>
          <ButtonComponent
          v-if="isHasRewards"
          btn-size="large"
          btn-styles="primary"
          full
          :loading="isSwapLoading"
          :disabled="!agreeWithFees"
          @click="claimTrigger"
          @keypress="claimTrigger"
          >
          CLAIM
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
            v-else-if="positionStaked"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            :disabled="!agreeWithFees"
            @click="unstakeTrigger"
            @keypress="unstakeTrigger"
          >
            UNSTAKE
          </ButtonComponent>
          <ButtonComponent
            v-else-if="!isNftApproved || (!gaugeNftApproved && positionStaked)"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            @click="approveNftPosition(false)"
            @keypress="approveNftPosition(false)"
          >
            APPROVE
          </ButtonComponent>
          <ButtonComponent
            v-else-if="!positionStaked"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            :disabled="!agreeWithFees"
            @click="increaseTrigger"
            @keypress="increaseTrigger"
          >
            INCREASE
          </ButtonComponent>
          <ButtonComponent
            v-else
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            @click="stakeTrigger"
            @keypress="stakeTrigger"
          >
            STAKE
          </ButtonComponent>
        </div>
      </div>
      <ZapInStepsRow
        v-if="zapPool.chain === networkId"
        class="zapin__modal-steps"
        :current-stage="currentStage"
      />
    </div>
</div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts">
import { useEventBus } from '@vueuse/core';
import {
  computed, markRaw,
} from 'vue';
import { ethers } from 'ethers';
import {
  mapActions, mapGetters, mapMutations,
} from 'vuex';
import {
  getNewOutputToken,
  getTokenByAddress,
} from '@/store/helpers/index.ts';
import odosApiService from '@/services/odos-api-service.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import TokenForm from '@/components/TokenForm/Index.vue';
import BN from 'bignumber.js';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import { CompoundStep, MANAGE_FUNC } from '@/store/modals/waiting-modal.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import { isEmpty } from 'lodash';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import FeesBlock, { MIN_IMPACT } from '@/components/FeesBlock/Index.vue';
import { parseErrorLog } from '@/utils/errors.ts';
import ZapInStepsRow from '@/components/StepsRow/ZapinRow/CompoundRow.vue';
import {
  initReqData, initZapData, initZapinContracts, parseLogs,
} from '@/services/Web3Service/utils/index.ts';
import ZapinService, { ZAPIN_FUNCTIONS, ZAPIN_TYPE } from '@/services/Web3Service/Zapin-service.ts';
import type { TPositionRewardTokenInfo } from '@/types/positions';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

export default {
  name: 'CompoundForm',
  components: {
    BaseIcon,
    FeesBlock,
    ButtonComponent,
    SwapSlippageSettings,
    TokenForm,
    ChangeNetwork,
    Spinner,
    ZapInStepsRow,
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
    gaugeAddress: {
      type: String,
      required: true,
      default: '',
    },
    // eslint-disable-next-line vue/no-unused-properties
    activeTab: {
      type: Number,
      required: true,
      default: 3,
    },
  },
  setup: () => {
    const {
      isBalancesLoading, isLoading: isAnyLoading,
    } = useTokensQuery();

    return {
      isBalancesLoading,
      isAnyLoading: computed(() => isAnyLoading.value),
      refreshBalances: useRefreshBalances(),
    };
  },
  data: () => ({
    approvingPending: false,
    agreeWithFees: true,
    inputTokens: [] as any[],
    outputTokens: [] as any[],
    newPositionTokens: [] as any[],
    initPositionTokens: [] as any[],
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
    // multiSwapOdosFeePercent: 0.01,

    tokensQuotaCounterId: null as any,
    tokensQuotaCheckerSec: 0,
    poolTokens: [] as any[],

    currentStage: CompoundStep.CLAIM,
    // Mobile section switch
    zapMobileSection,
    currentSection: zapMobileSection.TOKEN_FORM,

    gaugeNftApproved: false,
    positionStaked: true,
    isNftApproved: false,
    newTokenId: 0,
    isHasRewards: true as boolean,
  }),
  computed: {
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
    zapAllTokens() {
      const selectedAdd = this.inputTokens
        .map((_) => _.selectedToken?.address?.toLowerCase() ?? null)
        .filter(Boolean);

      return mergedTokens(this.allTokensList as any[], this.balanceList as any[], selectedAdd);
    },

    isEmptyForm() {
      if (this.inputTokens.filter((item: any) => item.selectedToken).length === 0) return true;
      if (this.outputTokens.filter((item: any) => item.selectedToken).length === 0) return true;
      return false;
    },
    selectedInputTokens() {
      return this.inputTokens.filter((item: any) => item.selectedToken);
    },
    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },
    isDisableButton() {
      return (this.isEmptyForm
        || !this.isAvailableOnNetwork
        || !this.isAnyTokensBalanceIsInsufficient
        || !this.isAmountEntered
      );
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
    isDisabled() {
      if (new BN(this.zapPool.rewards.usdValue) < new BN(0.01)) return true;
      return false;
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
    currentStage(stage: CompoundStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
      if (this.currentStage !== CompoundStep.CLAIM) {
        this.$store.commit('zapinData/changeState', { field: 'selectedTokens', val: this.inputTokens });
      }
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
    this.currentStage = CompoundStep.CLAIM;
    if (this.zapPool.chain !== this.networkId) this.currentStage = CompoundStep.CLAIM;

    // for modal
    this.setIsZapModalShow(true);
    this.setStagesMap(MANAGE_FUNC.COMPOUND);
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

    async initContracts() {
      const contractsData = await initZapinContracts(
        this.zapPool,
        this.zapAllTokens,
        this.evmSigner,
        this.gaugeAddress,
      );

      this.gaugeContract = contractsData.gaugeContract;
      this.zapContract = contractsData.zapContract;
      this.poolTokenContract = contractsData.poolTokenContract;
      this.poolTokens = contractsData.poolTokens;

      // if (!this.isAvailableOnNetwork) this.mintAction();
      if (!this.zapPool.isStaked) {
        this.positionStaked = this.zapPool.isStaked;
        this.currentStage = CompoundStep.APPROVEGAUGE;
      }
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
      const poolSelectedToken = getTokenByAddress(this.zapPool?.token0Add, this.zapAllTokens);
      const ovnSelectSelectedToken = getTokenByAddress(this.zapPool?.token1Add, this.zapAllTokens);

      if (!poolSelectedToken || !ovnSelectSelectedToken) return;
      poolSelectedToken.selected = true;
      ovnSelectSelectedToken.selected = true;

      const tokenA = this.addSelectedTokenToOutputList(poolSelectedToken, true, 50);
      const tokenB = this.addSelectedTokenToOutputList(ovnSelectSelectedToken, true, 50);

      this.outputTokens = [tokenA, tokenB].map((token) => ({
        ...token,
        value: 0,
        sum: 0,
      }));

      this.outputTokens = [tokenA, tokenB];
      this.initPositionTokens = [tokenA, tokenB];
      this.newPositionTokens = [tokenA, tokenB];
      this.inputTokens = this.zapPool.rewards.tokensInfo
        .map((token: TPositionRewardTokenInfo) => ({
          ...this.addSelectedTokenToOutputList(token.selectedToken, true, 50),
          sum: token.value,
          value: token.value,
          usdValue: token.usdValue,
          contractValue: new BN(token.value).times(10 ** 18).toFixed(),
        }));

      if (this.initPositionTokens?.length > 0) {
        const symbName = this.zapPool?.name?.split('/');
        this.initPositionTokens.forEach((_, key) => {
          this.initPositionTokens[key].value = this.zapPool?.position?.tokens[key][symbName[key]];
          this.initPositionTokens[key].sum = this.zapPool?.position?.tokens[key][symbName[key]];
        });
      }

      this.updateQuotaInfo();

      const approveValue = new BN(10)
        .pow(this.firstInputInQueueForToApprove?.selectedToken.decimals)
        .times(10 ** 18)
        .toFixed(0);

      this.updateTokenState(
        this.checkApproveForToken(this.firstInputInQueueForToApprove, approveValue),
      );
    },
    removeOutputToken(id: string) {
      this.removeToken(this.outputTokens, id);
      this.resetOutputs();
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
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('staking');

        const data = {
          from: this.account,
          to: this.poolTokenContract.target,
          tokenId: this.zapPool.tokenId,
          _data: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };

        let tx;

        if (this.zapPool.chainName === 'base') tx = await this.gaugeContract.deposit(this.zapPool.tokenId);
        // eslint-disable-next-line no-underscore-dangle
        else if (this.zapPool.chainName === 'arbitrum') tx = await this.gaugeContract.safeTransferFrom(data.from, data.to, data.tokenId, data._data, { from: this.account });

        await tx.wait();

        this.isSwapLoading = false;
        const inputTokens = [...this.inputTokens];
        const outputTokens = [...this.selectedOutputTokens];
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
        this.clearZapData();
        this.closeWaitingModal();
        this.$emit('close-form');
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
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

    commitEventToStore(field: string, value: any) {
      this.$store.commit('odosData/changeState', {
        field,
        val: value,
      });
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

      const ticks = [
        new BN(this.zapPool.ticks.tickLower).toFixed(),
        new BN(this.zapPool.ticks.tickUpper).toFixed(),
      ];

      const { txData, gaugeData } = initZapData(
        requestData,
        responseData,
        amountMins,
        this.getSlippagePercent(),
        this.zapPool.address,
        proportions,
        {
          ticks,
        },
      );

      const params = {
        from: this.account,
      // gasPrice: ethers.parseUnits('100', 'gwei'),
      // gasLimit: 1000000,
      };

      console.log(txData, 'swapdata');
      console.log(gaugeData, 'gaugeData');
      console.log((params), 'params');

      try {
        this.showWaitingModal('Increase');
        const logsData = await ZapinService
          .triggerZapin(
            this.zapContract,
            txData,
            gaugeData,
            params,
            ZAPIN_FUNCTIONS.INCREASE,
            this.zapPool.tokenId?.toString(),
          );

        console.log(logsData, '___receipt');
        if (!logsData) throw new Error('No Transaction');

        this.$store.commit('odosData/changeState', {
          field: 'lastParsedZapResponseData',
          val: markRaw(logsData),
        });

        parseLogs(logsData, this.commitEventToStore);

        for (const item of logsData.logs) {
          const eventName = item?.eventName;
          if (eventName === 'TokenId') {
          // eslint-disable-next-line prefer-destructuring
            this.newTokenId = item.args[0];
            this.commitEventToStore('lastParsedTokenIdEvent', new BN(item.args[0]).toString(10));
          }
        }

        this.isSwapLoading = false;
        this.approveNftPosition(true);
        this.currentStage = CompoundStep.APPROVEGAUGE;
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
    async recalculateProportion() {
      if (this.inputTokens?.length === 0) return;

      this.odosDataLoading = true;

      const ticks = [
        new BN(this.zapPool.ticks.tickLower).toFixed(),
        new BN(this.zapPool.ticks.tickUpper).toFixed(),
      ];

      try {
        const data = await ZapinService.recalculateProportionOdosV3(
          this.selectedInputTokens,
          this.selectedOutputTokens,
          this.zapPool,
          this.zapContract,
          ticks,
          this.networkId,
          this.getSlippagePercent(),
          this.odosSwapRequest,
          true,
          ZAPIN_TYPE.ZAPIN,
        );

        if (!data || (data && !data.odosData)) {
          this.odosDataLoading = false;
          return;
        }

        this.outputTokens = data.outputTokens;
        this.newPositionTokens = data.outputTokens.map((token: any, i) => ({
          ...token,
          sum: new BN(token.sum).plus(new BN(this.initPositionTokens[i].sum)).toFixed(),
        }));

        const totalFinalOutputUsd = this.newPositionTokens
          .reduce((acc: any, curr: any) => acc
            .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0)).toFixed();

        this.outputTokens = data?.outputTokens;
        this.odosData = {
          ...data.odosData,
          percentDiff: 0,
          netOutValue: totalFinalOutputUsd,
        };
        this.odosDataLoading = false;
      } catch (e) {
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
      }
    },
    getSlippagePercent() {
      return this.slippagePercent;
    },
    // eslint-disable-next-line vue/no-unused-properties
    async checkApproveForToken(token: any, checkedAllowanceValue: any) {
      // checkedAllowanceValue in wei
      const { selectedToken } = token;
      if (
        selectedToken.address === '0x0000000000000000000000000000000000000000'
      ) {
        selectedToken.approveData.approved = true;
        return token;
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
        return token;
      }

      if (!checkedAllowanceValue) {
        selectedToken.approveData.approved = true;
        return token;
      }
      selectedToken.approveData.approved = new BN(selectedToken.approveData.allowanceValue)
        .isGreaterThanOrEqualTo(checkedAllowanceValue);

      if (this.currentStage === CompoundStep.APPROVE && selectedToken.approveData.approved) {
        this.currentStage = CompoundStep.UNSTAKE;
      }

      return token;
    },
    updateTokenState(newToken: any) {
      const indexOf = this.inputTokens.map((_) => _.id).indexOf(newToken.id);
      this.inputTokens[indexOf] = newToken;
      this.updateQuotaInfo();
    },
    addSelectedTokenToOutputList(selectedToken: any, locked: any, startPercent: any) {
      return {
        ...getNewOutputToken(),
        locked,
        value: startPercent,
        selectedToken,
      };
    },
    clearAllSelectedTokens() {
      this.clearAllTokens();
    },
    clearAllTokens() {
      this.inputTokens = [];
      this.outputTokens = [];
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

    async unstakeTrigger() {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');

        let tx;

        if (this.zapPool.chainName === 'base') tx = await this.gaugeContract.withdraw(this.zapPool.tokenId);
        else if (this.zapPool.chainName === 'arbitrum') tx = await this.gaugeContract.withdraw(this.zapPool.tokenId, this.account);

        await tx.wait();
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.positionStaked = false;
        this.currentStage = CompoundStep.APPROVEZAPIN;
        this.approveNftPosition(false);
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },

    async approveNftPosition(approveToGauge: boolean) {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('Approve');
        const tx = approveToGauge
          ? await this.poolTokenContract.approve(this.gaugeContract?.target, this.zapPool?.tokenId)
          : await this.poolTokenContract.approve(this.zapContract?.target, this.zapPool?.tokenId);

        await tx.wait();

        if (approveToGauge) {
          this.gaugeNftApproved = true;
          this.currentStage = CompoundStep.STAKE;
          this.isSwapLoading = false;
          this.closeWaitingModal();
          this.stakeTrigger();
          return;
        }

        this.isNftApproved = true;
        this.currentStage = CompoundStep.INCREASE;
        this.isSwapLoading = false;
        this.closeWaitingModal();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal('Approve');
        this.isSwapLoading = false;
      }
    },
    async increaseTrigger() {
      if (this.isSwapLoading) return;
      if (this.inputTokens?.length === 0) return;

      this.odosDataLoading = true;
      this.currentStage = CompoundStep.INCREASE;

      const ticks = [
        new BN(this.zapPool.ticks.tickLower).toFixed(),
        new BN(this.zapPool.ticks.tickUpper).toFixed(),
      ];

      try {
        const data = await ZapinService.recalculateProportionOdosV3(
          this.selectedInputTokens,
          this.selectedOutputTokens,
          this.zapPool,
          this.zapContract,
          ticks,
          this.networkId,
          this.getSlippagePercent(),
          this.odosSwapRequest,
          false,
          ZAPIN_TYPE.ZAPIN,
        );

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

        this.odosAssembleRequest(assembleData)
          .then(async (responseAssembleData) => {
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
        this.isSwapLoading = false;
      }
    },
    async claimTrigger() {
      try {
        this.showWaitingModal('unstaking');
        this.isSwapLoading = true;
        await ZapinService.claimPosition(
          this.zapPool,
          this.gaugeContract,
          this.poolTokenContract,
          () => {},
        );

        this.isHasRewards = false;
        this.isSwapLoading = false;
        this.currentStage = CompoundStep.UNSTAKE;
        this.unstakeTrigger();
      } catch (e) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
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
      };

      if (!tx) {
        finishTx();
        return;
      }

      await tx.wait();
      finishTx();
      this.currentStage = CompoundStep.UNSTAKE;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss"
</style>
