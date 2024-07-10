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
            v-if="isDisableButton"
            btn-size="large"
            full
            btn-styles="primary"
            disabled
          >
            {{ disableButtonMessage }}
          </ButtonComponent>
          <ButtonComponent
            v-else-if="!isNftApproved"
            btn-size="large"
            btn-styles="primary"
            full
            :loading="approvingPending"
            @click="approveNftPosition"
            @keypress="approveNftPosition"
          >
            APPROVE
          </ButtonComponent>
          <ButtonComponent
            v-else
            btn-size="large"
            btn-styles="primary"
            full
            :loading="isSwapLoading"
            @click="rebalanceTrigger"
            @keypress="rebalanceTrigger"
          >
            REBALANCE
          </ButtonComponent>
        </div>
      </div>
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
  getNewInputToken,
  getTokenByAddress,
  WHITE_LIST_ODOS,
} from '@/store/helpers/index.ts';
import {
  getV3Rebalance,
} from '@/store/views/main/zapin/helpers.ts';
import odosApiService from '@/services/odos-api-service.ts';

import Spinner from '@/components/Spinner/Index.vue';
import ChangeNetwork from '@/modules/Main/components/ZapModal/ZapForm/ChangeNetwork.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { formatMoney } from '@/utils/numbers.ts';
import PoolLabel from '@/modules/PoolsPositions/ZapModal/PoolLabel.vue';
import SwapSlippageSettings from '@/modules/Main/components/Common/SwapSlippageSettings.vue';
import ZapinV3 from '@/modules/Main/components/ZapModal/ZapForm/ZapinV3.vue';
import { poolsInfoMap, poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import BN from 'bignumber.js';
import TokenForm from '@/modules/PoolsPositions/ZapModal/TokenForm.vue';

enum zapMobileSection {
  'TOKEN_FORM',
  'SET_PRICE_RANGE'
}

export default {
  name: 'ZapForm',
  components: {
    PoolLabel,
    BaseIcon,
    ZapinV3,
    ButtonComponent,
    SwapSlippageSettings,
    TokenForm,
    ChangeNetwork,
    Spinner,
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
      v3Range: null as any,
      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
      selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

      isNftApproved: false,
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
      // Mobile section switch
      zapMobileSection,
      currentSection: zapMobileSection.TOKEN_FORM,
    };
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'lastPoolInfoData',
      'isBalancesLoading',
      'odosReferalCode',
    ]),
    ...mapState('zapinData', [
      'zapContract',
      'poolNftContract',
    ]),
    ...mapGetters('odosData', [
      'allTokensList',
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
    isOutputTokensRemovable() {
      return false;
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

    isDisableButton() {
      return (this.outputTokensWithSelectedTokensCount === 0 || !this.isAvailableOnNetwork
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
    poolNftContract(val) {
      if (!val) return;
      this.checkNftApprove();
    },
  },
  mounted() {
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
      'startSwapConfirmTimer',
      'stopSwapConfirmTimer',
    ]),
    ...mapActions('accountData', ['refreshBalance']),
    ...mapActions('zapinData', ['loadZapContract']),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    ...mapMutations('zapinData', ['changeState']),
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

      console.log(this.zapPool, 'POOLDATA');
      if (!this.isAvailableOnNetwork) this.mintAction();

      if (this.outputTokens?.length > 0) {
        const symbName = this.zapPool?.name?.split('/');
        this.outputTokens.forEach((_, key) => {
          this.outputTokens[key].value = this.zapPool?.position?.tokens[key][symbName[key]];
          this.outputTokens[key].sum = this.zapPool?.position?.tokens[key][symbName[key]];
        });
      }
    },

    async init() {
      // await this.loadChains();
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
    async rebalanceTrigger() {
      console.log(this.poolNftContract, '__this.poolTokenContract');
      if (!this.zapPool) return;
      this.$store.commit('odosData/changeState', {
        field: 'lastPoolInfoData',
        val: poolsInfoMap[this.zapPool.address],
      });

      if (!this.lastPoolInfoData) return;
      if (this.isSwapLoading) return;

      if (this.outputTokensWithSelectedTokensCount < 1) {
        return;
      }

      this.clickOnStake = true;
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

      const resp = await getV3Rebalance(
        this.zapPool.tokenId?.toString(),
        this.zapPool.address,
        this.v3Range.ticks,
        this.selectedOutputTokens.map((_) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: '0',
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        this.zapContract,
      );

      console.log(resp, '__resp1');

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
        amountToken0Out: resp[4][0]?.toString(),
        amountToken1Out: resp[4][1]?.toString(),
      };

      console.log(resp, '__resp2');
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

      console.log(request, '__request');

      if (proportions.inputTokens?.length === 0) {
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
    async checkNftApprove() {
      const isApproved = await this.poolNftContract
        .getApproved(this.zapPool?.tokenId);
      console.log(isApproved, '__this.__isApproved');

      if (isApproved?.toLowerCase() === this.zapContract?.target?.toLowerCase()) {
        this.isNftApproved = true;
      }
    },
    async approveNftPosition() {
      const tx = await this.poolNftContract
        .approve(this.zapContract?.target, this.zapPool?.tokenId);

      await tx.wait();

      console.log(tx, '__isApproved');
      this.isNftApproved = true;
    },
    async initZapInTransaction(
      responseData: any,
      requestInputTokens: any[],
      requestOutputTokens: any[],
      proportions: any,
      poolInfo: any,
      zapPool: any,
    ) {
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

      const gaugeData = {
        pair: this.zapPool.address,
        tickRange: this.v3Range.ticks,
        amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
      };

      // this.showWaitingModal('Staking in process');

      const params = {
        from: this.account,
        gasPrice: ethers.parseUnits('100', 'gwei'),
        gasLimit: 1000000,
      };

      console.log(zapPool, '----zapPool');
      console.log(this.zapContract, '-this.zapContract');

      console.log(txData, 'swapdata');
      console.log(gaugeData, 'gaugeData');
      console.log((params), 'params');

      try {
        const tx = await this.zapContract
          .rebalance(txData, gaugeData, this.zapPool?.tokenId, params);

        await tx.wait();

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
      console.log(this.selectedOutputTokens, '__this.selectedOutputTokens');

      this.isSwapLoading = true;
      const resp = await getV3Rebalance(
        this.zapPool.tokenId?.toString(),
        this.zapPool.address,
        this.v3Range.ticks,
        this.selectedOutputTokens.map((_) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: '0',
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        this.zapContract,
      );

      console.log(resp, '__resp');

      if (!resp) return;

      resp[5]?.forEach((_: BigInt, key: number) => {
        const { price } = this.selectedOutputTokens[key].selectedToken;
        const val = new BN(_?.toString() ?? 0)
          .div(10 ** 18)
          .div(price);

        this.selectedOutputTokens[key].value = val.toFixed();
        this.selectedOutputTokens[key].sum = val.toFixed(5);
      });

      this.isSwapLoading = false;
    },
    getSlippagePercent() {
      return this.slippagePercent;
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
