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
                    v-for="token in (inputTokens as any)"
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
                      :is-token-removable="isOutputTokensRemovable"
                      :is-input-token="false"
                      :disabled="true"
                      :balances-loading="isBalancesLoading"
                      :token-loading="odosDataLoading"
                      hide-balance
                      @select-token="selectOutputToken"
                      @remove-token="removeOutputToken"
                    />
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
              :selected-output-tokens="selectedOutputTokens"
              :odos-data="odosData"
              :agree-with-fees="agreeWithFees"
              @change-agree="changeAgreeFees"
            />

            <SwapSlippageSettings
              @change-slippage="handleCurrentSlippageChanged"
            />
          </div>
          <ZapinV3
            :zap-pool="zapPool"
            :zap-contract="zapContract"
            :tokens-data="outputTokens"
            :ticks-init="[zapPool?.ticks?.tickLower, zapPool?.ticks?.tickUpper]"
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
            :disabled="!agreeWithFees"
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
import { ethers } from 'ethers';
import {
  mapActions, mapGetters, mapState, mapMutations,
} from 'vuex';
import {
  getNewOutputToken,
  getTokenByAddress,
  WHITE_LIST_ODOS,
} from '@/store/helpers/index.ts';
import {
  getV3Rebalance,
} from '@/store/views/main/zapin/helpers.ts';
import odosApiService from '@/services/odos-api-service.ts';

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
import { markRaw } from 'vue';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import { loadAbi, srcStringBuilder } from '@/store/views/main/zapin/index.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { mergedTokens } from '@/services/TokenService/utils/index.ts';
import { useRefreshBalances } from '@/hooks/fetch/useRefreshBalances.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import FeesBlock, { MIN_IMPACT } from '@/components/FeesBlock/Index.vue';
import {
  countPercentDiff,
  getZapinOutputTokens, mapExcludeLiquidityPlatform, removeToken, sourceLiquidityBlacklist,
} from '@/components/ZapForm/helpers.ts';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import { parseLogs } from './helpers.ts';

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
      type: Object,
      required: false,
      default: null,
    },
  },
  setup: () => {
    const {
      isBalancesLoading,
    } = useTokensQuery();

    return {
      isBalancesLoading,
      refreshBalances: useRefreshBalances(),
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
    };
  },
  computed: {
    ...mapState('odosData', [
      'odosReferalCode',
    ]),
    ...mapGetters('web3', ['evmSigner']),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('network', ['networkId']),
    ...mapGetters('accountData', ['account']),

    zapAllTokens() {
      return mergedTokens(this.allTokensList as any[], this.balanceList as any[]);
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
    isOutputTokensRemovable() {
      return false;
    },

    outputTokensWithSelectedTokensCount() {
      return this.outputTokens.filter((item: any) => item.selectedToken).length;
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
    ...mapActions('odosData', [
      'triggerSuccessZapin',
    ]),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),

    ...mapMutations('waitingModal', ['setStagesMap']),

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
      const tokenA = getTokenByAddress(this.zapPool.token0Add, this.zapAllTokens);
      const tokenB = getTokenByAddress(this.zapPool.token1Add, this.zapAllTokens);

      const abiGauge = srcStringBuilder('V3GaugeRebalance')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiGaugeContractFileV3 = await loadAbi(abiGauge);

      const abiV3Zap = srcStringBuilder('V3Zap')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Zap = await loadAbi(abiV3Zap);

      const abiV3Nft = srcStringBuilder('V3Nft')(this.zapPool.chainName, this.zapPool.platform[0]);
      const abiContractV3Nft = await loadAbi(abiV3Nft);

      this.gaugeContract = buildEvmContract(
        abiGaugeContractFileV3.abi,
        this.evmSigner,
        this.gaugeAddress,
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

      if (!this.isAvailableOnNetwork) this.mintAction();
      if (!this.zapPool.isStaked) {
        this.positionStaked = this.zapPool.isStaked;
        this.currentStage = rebalanceStep.APPROVE;
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
    removeOutputToken(id: string) {
      removeToken(this.outputTokens, id);
      this.resetOutputs();
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
    async unstakeTrigger() {
      console.log(this.poolTokenContract, 'unstakeTrigger');
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

        const data = {
          from: this.account,
          to: this.poolTokenContract.target,
          tokenId: this.newTokenId,
          _data: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };

        let tx;

        if (this.zapPool.chainName === 'base') tx = await this.gaugeContract.deposit(this.newTokenId);
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
      if (!this.zapPool) return;
      if (this.isSwapLoading) return;

      if (this.outputTokensWithSelectedTokensCount < 1) {
        return;
      }

      this.isSwapLoading = true;

      const actualGas = await odosApiService.getActualGasPrice(this.networkId);
      const userInputTokens = this.inputTokens;
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

      let proportions: any = {
        inputTokens: [],
        outputTokens: [],
      };

      const resp = await getV3Rebalance(
        this.zapPool.tokenId?.toString(),
        this.zapPool.address,
        this.v3Range.ticks,
        this.selectedOutputTokens.map((_) => ({
          tokenAddress: _?.selectedToken?.address,
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        this.zapContract,
      );

      if (!resp) return;

      proportions = {
        inputTokens: resp[0].map((_: any, key: number) => ({
          tokenAddress: _,
          amount: resp[1][key]?.toString(),
        })).filter((_: any) => new BN(_.amount).gt(0)),
        outputTokens: resp[2].map((_: any, key: number) => ({
          tokenAddress: _,
          proportion: new BN(resp[3][key]?.toString()).div(10 ** 6).toFixed(2),
        })),
      };

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

      // min amount of tokens, after swap, to escape big swap loss
      let amountMins: string[] = [];

      if (proportions.inputTokens?.length === 0) {
        await this.initZapInTransaction(
          null,
          proportions.inputTokens,
          proportions.outputTokens,
          proportions,
          amountMins,
        );

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
          const finalOutput = getZapinOutputTokens(
            data,
            this.selectedOutputTokens,
            resp,
          );
          amountMins = this.selectedOutputTokens.map((_) => {
            const tokenFound = data.outTokens.map((_: string) => _.toLowerCase())
              .includes(_.selectedToken.address?.toLowerCase());

            return tokenFound ? _.originalBalance : '0';
          });

          const totalUsd = finalOutput
            .reduce((acc, curr) => acc
              .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0)).toFixed();

          this.outputTokens = finalOutput;
          this.odosData = {
            ...data,
            netOutValue: totalUsd,
          };
          this.odosDataLoading = false;

          proportions = {
            ...proportions,
            amountToken0Out: finalOutput[0]?.tokenOut,
            amountToken1Out: finalOutput[1]?.tokenOut,
          };

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
                amountMins,
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
    async checkNftApprove() {
      if (!this.poolTokenContract) return;
      this.isSwapLoading = true;

      const isApproved = await this.poolTokenContract
        .getApproved(this.zapPool?.tokenId);

      if (isApproved?.toLowerCase() === this.zapContract?.target?.toLowerCase()) {
        this.isNftApproved = true;
        // this.currentStage = rebalanceStep.REBALANCE;
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
      if (!this.zapContract) {
        console.error(
          'Init zap transactions failed, chronos contract not found. responseData: ',
          responseData,
        );
        return;
      }

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

      console.log(amountMins, '___amountMins');
      const txData = {
        inputs: requestInput,
        outputs: requestOutput.map((_, key) => ({
          ..._,
          amountMin: new BN(amountMins[key] ?? 0)
            .times(1 - this.getSlippagePercent() / 100)
            .toFixed(0),
        })),
        data: responseData ? responseData.transaction.data : '0x',
      };

      const gaugeData = {
        pair: this.zapPool.address,
        tickRange: this.v3Range.ticks,
        amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
      };

      // this.showWaitingModal('Staking in process');

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
        const tx = await this.zapContract
          .rebalance(txData, gaugeData, this.zapPool?.tokenId, params);

        const logsData = await tx.wait();

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
        this.currentStage = rebalanceStep.APPROVEGAUGE;
        this.positionStaked = true;
        this.approveNftPosition(true);
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
    // async recalculateProportion() {
    //   if (!this.v3Range) return;
    //   const resp = await getV3Rebalance(
    //     this.zapPool.tokenId?.toString(),
    //     this.zapPool.address,
    //     this.v3Range.ticks,
    //     this.selectedOutputTokens.map((_) => ({
    //       tokenAddress: _?.selectedToken?.address,
    //       price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
    //     })),
    //     this.zapContract,
    //   );

    //   if (!resp) return;

    //   console.log(resp, '__resp');
    //   resp[5]?.forEach((_: BigInt, key: number) => {
    //     const { price } = this.selectedOutputTokens[key].selectedToken;
    //     const val = new BN(_?.toString() ?? 0)
    //       .div(10 ** 18)
    //       .div(price);

    //     this.selectedOutputTokens[key].value = val.toFixed();
    //     this.selectedOutputTokens[key].sum = val.toFixed(5);
    //   });
    // },
    async recalculateProportion() {
      let resp = null as any;
      this.odosDataLoading = true;

      const emptyVals = this.inputTokens.map((_) => {
        if (new BN(_?.value).eq(0) || !_?.value) return null;

        return _;
      });

      if (emptyVals.every((_) => !_)) {
        this.odosDataLoading = false;
        return;
      }

      resp = await getV3Rebalance(
        this.zapPool.tokenId?.toString(),
        this.zapPool.address,
        this.v3Range.ticks,
        this.selectedOutputTokens.map((_) => ({
          tokenAddress: _?.selectedToken?.address,
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        this.zapContract,
      );

      console.log(resp, '___resp2');

      const inputTokens = resp[0].map((_: any, key: number) => ({
        tokenAddress: _,
        amount: resp[1][key]?.toString(),
      })).filter((_: any) => new BN(_.amount).gt(0));

      if (inputTokens.length === 0) {
        this.odosDataLoading = false;
        return;
      }

      const outputTokens = resp[2].map((_: any, key: number) => ({
        tokenAddress: _,
        proportion: new BN(resp[3][key]?.toString()).div(10 ** 6).toFixed(2),
      }));

      console.log(inputTokens, '__this.inputTokens');
      console.log(outputTokens, '__this.inputTokens');
      const whiteList = WHITE_LIST_ODOS[this.networkId as keyof typeof WHITE_LIST_ODOS];

      const requestData = {
        chainId: this.networkId,
        inputTokens,
        outputTokens,
        userAddr: ethers.getAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent(),
        sourceBlacklist: this.getSourceLiquidityBlackList(),
        sourceWhitelist: whiteList ?? [],
        simulate: true,
        pathViz: true,
      };

      const data: any = await this.odosSwapRequest(requestData);

      if (!data) {
        this.odosDataLoading = false;
        return;
      }
      const finalOutput = getZapinOutputTokens(
        data,
        this.selectedOutputTokens,
        resp,
      );

      if (!resp) return;

      this.inputTokens = this.inputTokens.map((_) => ({
        ..._,
        usdValue: new BN(
          _.sum,
        ).times(_.selectedToken.price).toFixed(6, BN.ROUND_DOWN),
      }));

      const totalInputUsd = this.inputTokens
        .reduce((acc: BN, curr:any) => acc.plus(curr.usdValue), new BN(0)).toFixed();
      const totalOutputUsd = finalOutput
        .reduce((acc, curr) => acc
          .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0))
        .toFixed();

      this.outputTokens = finalOutput;
      this.odosData = {
        ...data,
        percentDiff: countPercentDiff(totalInputUsd, totalOutputUsd),
        netOutValue: totalOutputUsd,
      };
      this.odosDataLoading = false;
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
