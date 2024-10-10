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
                  <h2>
                    Initial tokens
                  </h2>
                  <div
                    v-for="token in inputTokens"
                    :key="token.id"
                    class="input-component-container"
                  >
                    <TokenForm
                      :token-info="token"
                      :is-token-removable="false"
                      :is-input-token="false"
                      :disabled="true"
                      :balances-loading="isBalancesLoading"
                      hide-balance
                    />
                  </div>
                </div>
                <div class="out-swap-container pt-5">
                  <h2>
                    Tokens you get
                  </h2>
                  <div
                    v-for="token in (outputTokens as any)"
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
                      @select-token="selectOutputToken"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SwapSlippageSettings
              @change-slippage="handleCurrentSlippageChanged"
            />

            <FeesBlock
              v-if="odosData?.netOutValue"
              :slippage-percent="slippagePercent"
              :get-odos-fee="0"
              :multi-swap-odos-fee-percent="0"
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
              :ticks-init="[zapPool?.ticks?.tickLower, zapPool?.ticks?.tickUpper]"
              :class="currentSection === zapMobileSection.SET_PRICE_RANGE && 'mobile-active'"
              @set-range="setRangeV3"
            />
            <SwapRouting
                v-if="odosData?.netOutValue"
                :swap-data="odosData"
                :merged-list="allTokensList"
                :input-tokens="selectedInputTokens"
                :output-tokens="selectedOutputTokens"
                :routing-type="MODAL_TYPE.REBALANCE"
                :zap-pool="zapPool"
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
            Something wrong
          </ButtonComponent>
          <ButtonComponent
            v-if="positionStaked"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            :disabled="!agreeWithFees || isSwapLoading || !odosData.netOutValue"
            @click="unstakeTrigger"
            @keypress="unstakeTrigger"
          >
            Unstake
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
            @click="rebalanceTrigger"
            @keypress="rebalanceTrigger"
          >
            REBALANCE
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
        :skip-stake="skipStake"
        :current-stage="currentStage"
      />
    </div>
</div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<script lang="ts">
import { useEventBus } from '@vueuse/core';
import { ethers } from 'ethers';
import {
  mapActions, mapGetters, mapMutations,
} from 'vuex';
import {
  getNewOutputToken,
  getTokenByAddress,
} from '@/store/helpers/index.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/components/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ZapinV3 from '@/components/ZapForm/ZapinV3.vue';
import BN from 'bignumber.js';
import TokenForm from '@/components/TokenForm/Index.vue';
import { MANAGE_FUNC, rebalanceStep } from '@/store/modals/waiting-modal.ts';
import ZapInStepsRow from '@/components/StepsRow/ZapinRow/RebalanceRow.vue';
import { cloneDeep, isEmpty } from 'lodash';
import { inject, markRaw, type PropType } from 'vue';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import FeesBlock, { MIN_IMPACT } from '@/components/FeesBlock/Index.vue';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import {
  checkIsStaked,
  initReqData, initZapData, initZapinContracts, isStakeSkip, parseLogs,
} from '@/services/Web3Service/utils/index.ts';
import ZapinService, { ZAPIN_FUNCTIONS, ZAPIN_TYPE } from '@/services/Web3Service/Zapin-service.ts';
import SwapRouting from '@/components/SwapRouting/Index.vue';
import { awaitDelay } from '@/utils/const.ts';
import type { IPositionsInfo } from '@/types/positions';
import type { PLATFORMS } from '@/types/common/pools';
import type { IOvernightApi } from '@/services/ApiService/OvernightApi';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

export default {
  name: 'ZapFormManage',
  components: {
    BaseIcon,
    ZapinV3,
    ButtonComponent,
    FeesBlock,
    SwapSlippageSettings,
    TokenForm,
    ChangeNetwork,
    Spinner,
    ZapInStepsRow,
    SwapRouting,
  },
  props: {
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
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: false,
      default: null,
    },
  },
  setup: () => {
    const {
      isBalancesLoading,
    } = useTokensQuery();

    const overnightApiInstance = inject('overnightApi') as IOvernightApi;

    return {
      isBalancesLoading,
      refreshBalances: useRefreshBalances(),
      overnightApiInstance,
    };
  },
  data() {
    return {
      positionStaked: true,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      v3Range: null as any,
      newTokenId: 0,
      agreeWithFees: true,
      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
      selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL
      odosDataLoading: false,
      odosData: {
        percentDiff: 0,
        netOutValue: 0,
        priceImpact: 0,
      },

      currentStage: rebalanceStep.UNSTAKE,
      isNftApproved: false,
      gaugeNftApproved: false,
      isSwapLoading: false,
      slippagePercent: 1,
      poolTokens: [] as any[],
      gaugeContract: null as any,
      zapContract: null as any,
      poolTokenContract: null as any,

      tokensQuotaCounterId: null as any,
      tokensQuotaCheckerSec: 0,
      // Mobile section switch
      zapMobileSection,
      currentSection: zapMobileSection.TOKEN_FORM,
      MODAL_TYPE,
    };
  },
  computed: {
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    skipStake() {
      if (this.zapPool.platform[0] === "Uniswap") return true;
      return false
    },
    zapAllTokens() {
      return mergedTokens(this.balanceList as any[], this.allTokensList as any[]);
    },
    isDisabled() {
      // if (this.currentStage === rebalanceStep.UNSTAKE && !this.positionStaked) return true;
      return false;
    },
    zapsLoaded() {
      return !isEmpty(this.zapAllTokens)
        && !isEmpty(this.outputTokens)
        && this.zapPool
        && !isEmpty(this.zapContract);
    },
    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
    },

    selectedInputTokens() {
      return this.inputTokens.map((_) => ({
        ..._,
        usdValue: new BN(_?.sum).times(_?.selectedToken?.price).toFixed(4),
      }));
    },
    selectedOutputTokens() {
      return this.outputTokens.filter((item: any) => item.selectedToken);
    },

    isDisableButton() {
      return (this.outputTokensWithSelectedTokensCount === 0 || !this.isAvailableOnNetwork
      );
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
    currentStage(stage: rebalanceStep) {
      this.$store.commit('zapinData/changeState', { field: 'currentStage', val: stage });
    },
    // on wallet connect
    async account(val) {
      if (val) this.clearAndInitForm();
      if (!val) this.outputTokens = [getNewOutputToken()];
    },
    networkId(newVal) {
      if (newVal) {
        if (!this.isAvailableOnNetwork) {
          this.mintAction();
        }

        if (this.zapPool.chain === this.networkId) {
          this.firstInit();
          this.initContracts();
        }
      }
    },
    isDisableButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
    async poolNftContract(val) {
      if (!val) return;
      this.checkNftApprove();
    },
  },
  async mounted() {
    // for modal
    this.currentStage = rebalanceStep.UNSTAKE;
    this.$store.commit('zapinData/changeState', { field: 'currentStage', val: this.currentStage });
    this.setIsZapModalShow(true);
    this.setStagesMap(MANAGE_FUNC.REBALANCE);
    await this.initContracts();

    if (this.zapPool.chain !== this.networkId) return;

    this.firstInit();
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
    ...mapActions('poolsData', ['setIsZapModalShow']),
    ...mapActions('odosData', ['triggerSuccessZapin']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),

    ...mapMutations('waitingModal', ['setStagesMap', 'setSkipStake']),

    changeAgreeFees() {
      this.agreeWithFees = !this.agreeWithFees;
    },
    handleCurrentSlippageChanged(newSlippage: number) {
      this.slippagePercent = newSlippage;
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
    mintAction() {
      this.showMintView();
      this.showSwapModal();
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
      this.setSkipStake(isStakeSkip(this.gaugeContract, this.zapPool));
      console.log(checkIsStaked(this.zapPool), '__POOL');

      if (!this.isAvailableOnNetwork) this.mintAction();
      if (!checkIsStaked(this.zapPool)) {
        this.positionStaked = false;
        this.currentStage = rebalanceStep.APPROVE;
        this.checkNftApprove();
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

      this.outputTokens = [tokenA, tokenB];

      this.$forceUpdate();
      this.recalculateProportion();

      if (this.outputTokens?.length > 0) {
        const symbName = this.zapPool?.name?.split('/');
        this.outputTokens.forEach((_, key) => {
          this.outputTokens[key].value = this.zapPool?.position?.tokens[key][symbName[key]];
          this.outputTokens[key].sum = this.zapPool?.position?.tokens[key][symbName[key]];
        });

        this.inputTokens = cloneDeep(this.outputTokens);
      }
    },
    odosAssembleRequest(requestData: any) {
      return this.overnightApiInstance
        .assembleRequest(requestData)
        .then((data: any) => data)
        .catch((e: any) => {
          console.log('Assemble request error: ', e);
        });
    },
    async odosSwapRequest(requestData: any) {
      return this.overnightApiInstance
        .quoteRequest(requestData)
        .then((data: any) => {
          this.$store.commit('odosData/changeState', {
            field: 'swapResponseInfo',
            val: data,
          });
          return data;
        })
        .catch((e: any) => {
          this.closeWaitingModal();
          if (e && e.message && e.message.includes('path')) {
            this.showErrorModalWithMsg({ errorType: 'odos-path', errorMsg: e });
            return;
          }

          this.showErrorModalWithMsg({ errorType: 'odos', errorMsg: e });
        });
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
    async unstakeTrigger() {
      console.log(this.poolTokenContract, 'unstakeTrigger');
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('unstaking');
        await ZapinService.withdrawTrigger(
          this.zapPool,
          this.zapPool?.tokenId?.toString(),
          this.gaugeContract,
          this.account,
        );
        console.log('WITHDRAW');
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.positionStaked = false;
        this.currentStage = rebalanceStep.APPROVE;
        this.approveNftPosition(false);
      } catch (e) {
        console.log(e);
        this.closeWaitingModal();
        this.isSwapLoading = false;
      }
    },
    async stakeTrigger() {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('staking');

        const tx = await ZapinService.stakeTrigger(
          this.zapPool.platform[0] as PLATFORMS,
          this.gaugeContract,
          this.newTokenId,
          this.account,
          this.poolTokenContract,
        );

        if (!tx) throw new Error('no stake transaction');

        this.isSwapLoading = false;
        const inputTokens = [...this.inputTokens];
        const outputTokens = [...this.outputTokens];
        this.triggerSuccessZapin(
          {
            isShow: true,
            inputTokens,
            outputTokens,
            hash: tx.hash,
            pool: this.zapPool,
            modalType: MODAL_TYPE.REBALANCE,
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

    async rebalanceTrigger() {
      if (this.isSwapLoading) return;

      if (!this.v3Range || this.inputTokens?.length === 0) return;

      this.odosDataLoading = true;

      console.log('recalculateProportionParams__');

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
          simulateSwap: false,
          typeFunc: ZAPIN_TYPE.REBALANCE,
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
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: parseErrorLog(e) });
        this.odosDataLoading = false;
        this.isSwapLoading = true;
      }
    },

    async checkNftApprove() {
      if (!this.poolTokenContract) return;
      this.isSwapLoading = true;

      const isApproved = await this.poolTokenContract
        .getApproved(this.zapPool?.tokenId);

      console.log(isApproved, '___isApproved')
      if (isApproved?.toLowerCase() === this.zapContract?.target?.toLowerCase()) {
        this.isNftApproved = true;
        this.currentStage = rebalanceStep.REBALANCE;
      }

      this.isSwapLoading = false;
    },
    async approveNftPosition(approveToGauge: boolean) {
      this.isSwapLoading = true;

      try {
        this.showWaitingModal('Approve');
        const tx = approveToGauge
          ? await this.poolTokenContract.approve(this.gaugeContract?.target, this.newTokenId)
          : await this.poolTokenContract.approve(this.zapContract?.target, this.zapPool?.tokenId);

        await tx.wait();
        await awaitDelay(1000);

        console.log(approveToGauge, '__approveToGauge');
        if (approveToGauge) {
          this.gaugeNftApproved = true;
          this.currentStage = rebalanceStep.STAKE;
          this.stakeTrigger();
          return;
        }

        this.currentStage = rebalanceStep.REBALANCE;
        this.isNftApproved = true;
        this.isSwapLoading = false;
        this.closeWaitingModal();
      } catch (e) {
        console.log(e);
        this.closeWaitingModal('Approve');
        this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: parseErrorLog(e) });
        this.isSwapLoading = false;
      }
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

      const { txData, gaugeData } = initZapData(
        requestData,
        responseData,
        amountMins,
        this.getSlippagePercent(),
        this.zapPool.address,
        proportions,
        this.v3Range,
        this.selectedOutputTokens
      );

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
        this.showWaitingModal('Rebalance');
        const logsData = await ZapinService
          .triggerZapin(
            this.zapContract,
            txData,
            gaugeData,
            params,
            ZAPIN_FUNCTIONS.REBALANCE,
            this.zapPool.tokenId?.toString(),
          );

        console.log(logsData, '___receipt');
        if (!logsData) throw new Error('No Transaction');

        this.$store.commit('odosData/changeState', {
          field: 'lastParsedZapResponseData',
          val: markRaw(logsData),
        });
        
        this.initLogs(markRaw(logsData));

        if (isStakeSkip(this.gaugeContract, this.zapPool)) {
          this.triggerSuccessZapin(
            {
              isShow: true,
              inputTokens: this.inputTokens,
              outputTokens: this.outputTokens,
              hash: logsData.hash,
              pool: this.zapPool,
              modalType: MODAL_TYPE.ZAPIN,
            },
          );

          this.clearAndInitForm();
          this.$store.commit('odosData/changeState', {
            field: 'additionalSwapStepType',
            val: null,
          });
          this.currentStage = rebalanceStep.REBALANCE;
          this.closeWaitingModal();
          return;
        }

        this.isSwapLoading = false;
        this.currentStage = rebalanceStep.APPROVEGAUGE;
        this.positionStaked = true;
        this.approveNftPosition(true);
      } catch (e: any) {
        this.isSwapLoading = false;
        this.closeWaitingModal();
        this.showErrorModalWithMsg({ errorType: 'zap', errorMsg: e });
      }
    },
    initLogs(logsData: any) {
      parseLogs(logsData, this.commitEventToStore);

      for (const item of logsData.logs) {
        const eventName = item?.eventName;
        if (eventName === 'TokenId') {
          // eslint-disable-next-line prefer-destructuring
          this.newTokenId = item.args[0];
          this.commitEventToStore('lastParsedTokenIdEvent', new BN(item.args[0]).toString(10));
        }
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
      if (!this.v3Range || this.inputTokens?.length === 0) return;

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
          typeFunc: ZAPIN_TYPE.REBALANCE,
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

    addSelectedTokenToOutputList(selectedToken: any, locked: any, startPercent: any) {
      return {
        ...getNewOutputToken(),
        locked,
        value: startPercent,
        selectedToken,
      };
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
