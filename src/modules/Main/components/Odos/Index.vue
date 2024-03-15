<template>
  <div class="swap-form">
    <div v-if="!isAvailableOnNetwork">
      <NetworkNotAvailable :network-name="networkName" />
    </div>

    <div
      v-else
      :class="
        !firstRenderDone ? 'swap-container swap-container-full' : 'swap-container'
      "
    >
      <div
        v-if="!firstRenderDone"
        class="swap-form__loader"
      >
        <Spinner />
      </div>

      <template v-else>
        <div class="swap-form__body">
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
              :class="{ 'swap-form__body-block__inputs': true, 'block-inputs--scroll': inputTokens?.length > 3 }"
              :css="false"
              @before-enter="beforeEnterList"
              @enter="onEnterList"
              @onLeave="onLeaveList"
            >
              <div
                v-for="token in inputTokens"
                :key="token.id"
                :data-index="token.id"
                class="swap-form__body-block__inputs-item"
              >
                <div
                  v-if="isShowDecreaseAllowance && token.selectedToken"
                  @click="disapproveToken(token)"
                  @keypress="disapproveToken(token)"
                  class="decrease-allowance"
                >
                  Decrease Allowance
                </div>

                <TokenForm
                  :token-info="token"
                  :is-token-removable="isInputTokensRemovable"
                  :is-input-token="true"
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

          <div
            @click="changeSwap"
            @keypress="changeSwap"
            class="swap-form__body-arrow"
          >
            <BaseIcon
              name="ChangeSwapVector"
            />
          </div>

          <div class="swap-form__body-block">
            <h3>
              You receive
            </h3>
            <TransitionGroup
              name="staggered-fade"
              tag="div"
              :class="{ 'swap-form__body-block__inputs': true, 'block-inputs--scroll': outputTokens?.length > 3 }"
              :css="false"
              @before-enter="beforeEnterList"
              @enter="onEnterList"
              @onLeave="onLeaveList"
            >
              <div
                v-for="token in outputTokens"
                :key="token.id"
                :data-index="token.id"
                class="swap-form__body-block__inputs-item"
              >
                <TokenForm
                  :token-info="token"
                  :is-input-token="false"
                  :disabled="true"
                  :is-token-removable="isOutputTokensRemovable"
                  :balances-loading="isBalancesLoading"
                  @select-token="selectFormToken"
                  @remove-token="removeOutputToken"
                />
              </div>

              <div
                v-if="isOutputTokensAddAvailable"
                class="swap-form__body-block__inputs-add"
                @click="addNewOutputToken"
                @keypress="addNewOutputToken"
              >
                +
              </div>
            </TransitionGroup>
          </div>
        </div>

        <SwapSlippageSettings
          :selected-input-tokens="selectedInputTokens"
          :selected-output-tokens="selectedOutputTokens"
          @change-slippage="changeSlippage"
        />

        <!-- <div
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
        </div> -->
        <!-- <div
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
            Odos collects 0.01% fee for multi-input/multi-output swaps. Single
            input/output swaps collects 0% fee.
          </div>
        </div> -->

        <div class="swap-form__btns">
          <ButtonComponent
            v-if="!account"
            @on-click="connectWallet"
            btn-size="large"
            full
          >
            CONNECT WALLET
          </ButtonComponent>
          <template v-else>
            <ButtonComponent
              v-if="hideSwapButton"
              btn-size="large"
              disabled
              full
            >
              {{ disableButtonMessage }}
            </ButtonComponent>
            <ButtonComponent
              v-else-if="isAnyInputsNeedApprove"
              @on-click="approveTrigger(firstInputInQueueForToApprove)"
              btn-size="large"
              full
              :loading="firstSwipeClickOnApprove"
            >
              <span
                v-if="viewType === 'SWIPE' && !firstSwipeClickOnApprove"
              >
                SWIPE
              </span>
              <span v-else>
                APPROVE
                {{ firstInputInQueueForToApprove.selectedToken.symbol }}
              </span>
            </ButtonComponent>
            <ButtonComponent
              v-else
              @on-click="swapTrigger"
              btn-size="large"
              full
              :loading="isLoadingSwap"
            >
              <span v-if="viewType === 'SWIPE'">SWIPE LIQUIDITY</span><span v-else>SWAP</span>
            </ButtonComponent>
          </template>

          <div class="swap-form__powered">
            <h4>POWERED BY</h4>
            <BaseIcon
              class="swap-form__powered__icon"
              name="PoweredByOdos"
            />
          </div>
        </div>
      </template>
    </div>

    <SelectTokensModal
      :is-show="isShowSelectTokensModal"
      :select-token-input="selectModalTypeInput"
      :tokens="allTokensList"
      :user-account="account"
      :balances-loading="isBalancesLoading"
      :is-all-data-loaded="isAllDataLoaded"
      :selected-tokens="selectModalTypeInput ? inputTokens : outputTokens"
      @set-show="showSelectTokensModals"
      @add-token-to-list="addSelectedTokenToList"
      @remove-token-from-list="removeSelectedTokenFromList"
      @connect-wallet="connectWalletTrigger"
      @reload="reloadList"
    />

  </div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-continue -->
<script lang="ts">
import { mapActions, mapGetters, mapState } from 'vuex';
import { useEventBus } from '@vueuse/core';
import { ethers } from 'ethers';
import TokenForm from '@/modules/Main/components/Odos/TokenForm.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import NetworkNotAvailable from '@/modules/Main/components/Odos/network-not-available.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import SwapSlippageSettings from '@/modules/Main/components/Common/SwapSlippageSettings.vue';
import { formatMoney, fixedByPrice } from '@/utils/numbers.ts';
import { getRandomString } from '@/utils/strings.ts';
import { clearApproveToken, getAllowanceValue, approveToken } from '@/utils/contractApprove.ts';
import odosApiService from '@/services/odos-api-service.ts';
import { onLeaveList, onEnterList, beforeEnterList } from '@/utils/animations.ts';
import {
  getNewInputToken,
  getNewOutputToken,
  maxAll,
  updateTokenValue,
  getDefaultSecondtoken,
  WHITE_LIST_ODOS,
} from '@/store/helpers/index.ts';
import BigNumber from 'bignumber.js';

export default {
  name: 'SwapForm',
  components: {
    ButtonComponent,
    Spinner,
    NetworkNotAvailable,
    SelectTokensModal,
    SwapSlippageSettings,
    TokenForm,
    BaseIcon,
  },
  props: {
    viewType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      maxInputTokens: 3,
      maxOutputTokens: 3,

      // input or output choosing
      selectModalTypeInput: true,
      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)
      selectTokenType: 'OVERNIGHT', // OVERNIGHT / ALL

      isSwapLoading: false,
      isSumulateSwapLoading: false,
      isSumulateIntervalStarted: false,
      slippagePercent: 0.05,
      multiSwapOdosFeePercent: 0.01,

      tokensQuotaCounterId: null as any,
      tokensQuotaCheckerSec: 0,

      firstSwipeClickOnApprove: false,
    };
  },
  watch: {
    async isAllDataLoaded(newVal) {
      if (newVal) {
        await this.initData({
          tokenSeparationScheme: this.tokenSeparationScheme,
          listOfBuyTokensAddresses: this.listOfBuyTokensAddresses,
        });
      }
    },
    // on wallet connect
    async account(val) {
      if (val) {
        this.clearForm('000');
        this.init();
      }
      if (!val) this.outputTokens = [getNewOutputToken()];
    },
    // for first render
    async loadingWeb3(newVal) {
      if (newVal) this.clearForm('0');
    },
    async networkId(newVal) {
      if (newVal) {
        this.$store.commit('odosData/changeState', {
          field: 'isFirstBalanceLoaded',
          val: false,
        });
        this.$store.commit('odosData/changeState', {
          field: 'isBalancesLoading',
          val: true,
        });
        this.$store.commit('odosData/changeState', {
          field: 'quotaResponseInfo',
          val: null,
        });
        await this.initContractData();
        await this.initData({
          tokenSeparationScheme: this.tokenSeparationScheme,
          listOfBuyTokensAddresses: this.listOfBuyTokensAddresses,
        });
        this.clearForm('1');
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
    firstRenderDone(val) {
      if (val) this.clearForm('3');
    },
    hideSwapButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
  },
  async mounted() {
    this.$store.commit('odosData/changeState', {
      field: 'baseViewType',
      val: this.viewType,
    });
    this.$store.commit('odosData/changeState', {
      field: 'tokenSeparationScheme',
      val: 'OVERNIGHT_SWAP',
    });

    this.$store.commit('odosData/changeState', {
      field: 'isTokensLoadedAndFiltered',
      val: false,
    });

    if (this.inputTokens.length === 0 && this.outputTokens.length === 0) {
      console.log('MOUNTED');
      this.clearForm('4');
    }

    await this.init();

    this.$store.commit('odosData/changeState', {
      field: 'isTokensLoadedAndFiltered',
      val: true,
    });

    if (this.$route.query.action === 'swap-out') this.changeSwap();
  },
  computed: {
    ...mapState('odosData', [
      'isTokensLoadedAndFiltered',
      'tokensContractMap',
      'routerContract',
      'swapSessionId',
      'odosReferalCode',
      'quotaResponseInfo',
      'isShowDecreaseAllowance',
      'tokenSeparationScheme',
      'listOfBuyTokensAddresses',
      'isBalancesLoading',
      'firstRenderDone',
    ]),
    ...mapGetters('odosData', [
      'allTokensList',
      'isAvailableOnNetwork',
      'swapResponseConfirmGetter',
      'isAllLoaded',
      'isAllDataLoaded',
    ]),
    ...mapGetters('web3', ['loadingWeb3']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('network', ['getParams', 'networkId', 'networkName']),
    ...mapGetters('gasPrice', ['gasPrice', 'gasPriceGwei']),

    getSlippagePercent() {
      return this.slippagePercent;
    },

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
        if (token.value > 0) return true;
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
        'getActualGasPrice',
        'initWalletTransaction',
        'initData',
        'loadPricesInfo',
      ],
    ),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    formatMoney,
    onLeaveList,
    beforeEnterList,
    onEnterList,
    async reloadList() {
      try {
        await this.initData({
          tokenSeparationScheme: this.tokenSeparationScheme,
          listOfBuyTokensAddresses: this.listOfBuyTokensAddresses,
        });
        this.init();
      } catch (e) {
        console.log(e, 'reloadList');
      }
    },
    connectWalletTrigger() {
      this.connectWallet();
      this.showSelectTokensModals(false);
    },
    changeSlippage(val: number) {
      this.slippagePercent = val;
    },
    maxAllMethod() {
      this.inputTokens = maxAll(this.selectedInputTokens, this.checkApproveForToken);
      this.updateQuotaInfo();
    },
    updateTokenValueMethod(tokenData: any) {
      let currToken = null;

      if (tokenData.isMaxBal) {
        currToken = updateTokenValue(
          tokenData,
          tokenData.value,
          this.checkApproveForToken,
          tokenData.selectedToken.balanceData.originalBalance,
        );
      } else {
        currToken = updateTokenValue(
          tokenData,
          tokenData.value,
          this.checkApproveForToken,
        );
      }

      delete currToken.isMaxBal;
      const indexOf = this.inputTokens.map((_) => _.id).indexOf(currToken.id);
      this.inputTokens[indexOf] = currToken;
      this.updateQuotaInfo();
    },
    async init() {
      await this.loadChains();
      await this.loadTokens();
      await this.initContractData();

      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });

      const busTokens = useEventBus('odos-tokens-loaded');
      busTokens.on(() => {
        if (this.firstRenderDone) return;
        this.finishTransaction();
      });
    },
    addDefaultUsdToken() {
      const ovnSelectedToken: any = getDefaultSecondtoken(
        this.tokenSeparationScheme,
        this.allTokensList,
        null,
      );
      this.addSelectedTokenToOutputList(ovnSelectedToken);
    },
    addDefaultOvnToken() {
      const symbol = this.$route.query.symbol ? this.$route.query.symbol : null;
      const ovnSelectedToken: any = getDefaultSecondtoken(
        this.tokenSeparationScheme,
        this.allTokensList,
        symbol as string | null,
      );
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
      }
    },
    addNewOutputToken() {
      const newToken = getNewOutputToken();
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
        if (!tokenOut.selectedToken) continue;

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

        this.initTabName('/', params);
        return;
      }

      if (this.swapMethod === 'SELL') {
        console.log('SELF___');
        this.setSwapMethod('BUY');
        this.addTokensEmptyIsNeeded();
        this.resetOutputs();

        let params = null;
        if (symbol) {
          params = { action: 'swap-in', symbol };
        } else {
          params = { action: 'swap-in' };
        }

        this.initTabName('/', params);
        return;
      }

      console.error('Change swap method not found.', this.swapMethod);
    },

    finishTransaction() {
      console.log('finishTransaction');
      this.clearForm('5');
    },

    clearForm(val: string) {
      console.log(val, 'CLEAFORM');
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
    quoteRequest(requestData: any) {
      return odosApiService
        .quoteRequest(requestData)
        .then((data) => {
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
    async swapTrigger() {
      if (this.isSwapLoading) {
        console.log({
          message: 'Swap method not available, prev swap in process.',
          swapSession: this.swapSessionId,
        });
        return;
      }

      console.log('sWAPP2');
      if (
        this.inputTokensWithSelectedTokensCount < 1
        || this.outputTokensWithSelectedTokensCount < 1
      ) {
        return;
      }

      this.$store.commit('odosData/changeState', {
        field: 'swapSessionId',
        val: getRandomString(10),
      });

      this.isSwapLoading = true;

      const actualGas = await this.getActualGasPrice(this.networkId);
      const whiteList = WHITE_LIST_ODOS[this.networkId as keyof typeof WHITE_LIST_ODOS];

      const requestData = {
        chainId: this.networkId,
        inputTokens: this.getRequestInputTokens(),
        outputTokens: this.getRequestOutputTokens(),
        gasPrice: actualGas,
        userAddr: ethers.getAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent,
        sourceBlacklist: this.getSourceBlackList(this.networkId),
        sourceWhitelist: whiteList ?? [],
        simulate: true,
        pathViz: true,
        referralCode: this.odosReferalCode,
      };

      console.log(requestData, 'sWAPP2');
      console.log({
        message: 'Odos Swap quota request data',
        swapSession: this.swapSessionId,
        data: requestData,
        actualGas,
      });

      this.odosSwapRequest(requestData)
        .then(async (data: any) => {
          console.log({
            message: 'Odos Swap quota response data',
            swapSession: this.swapSessionId,
            data,
            actualGas,
          });

          const assembleData = {
            userAddr: ethers.getAddress(
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
          this.odosAssembleRequest(assembleData)
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

                this.showErrorModalWithMsg({
                  errorType: 'approve',
                  errorMsg: errMsg,
                });
                this.isSwapLoading = false;
                return;
              }

              await this.initWalletTransaction(
                {
                  txData: responseAssembleData,
                  selectedInputTokens: this.selectedInputTokens,
                  selectedOutputTokens: this.selectedOutputTokens,
                },
              );

              this.$emit('update-path-view', {
                path: null,
                input: this.selectedInputTokens,
                output: this.selectedOutputTokens,
              });
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
      this.$store.commit('odosData/changeState', {
        field: 'quotaResponseInfo',
        val: null,
      });
      this.$store.commit('odosData/changeState', {
        field: 'swapResponseInfo',
        val: null,
      });
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

      this.isSumulateSwapLoading = true;
      const actualGas = await this.getActualGasPrice(this.networkId);

      const input = this.getRequestInputTokens(false);
      const output = this.getRequestOutputTokens(false);
      if (!input.length || !output.length) {
        this.isSumulateSwapLoading = false;
        this.isSumulateIntervalStarted = false;
        return;
      }

      const whiteList = WHITE_LIST_ODOS[this.networkId as keyof typeof WHITE_LIST_ODOS];

      const requestData = {
        chainId: this.networkId,
        inputTokens: input,
        outputTokens: output,
        gasPrice: actualGas,
        userAddr: ethers.getAddress(this.account.toLowerCase()),
        slippageLimitPercent: this.getSlippagePercent,
        sourceBlacklist: this.getSourceBlackList(this.networkId),
        sourceWhitelist: whiteList ?? [],
        simulate: true,
        pathViz: true,
      };

      this.clearQuotaInfo();
      this.$emit('update-is-loading-data', true);

      this.quoteRequest(requestData)
        .then((data: any) => {
          this.updateSelectedOutputTokens(data);

          this.isSumulateSwapLoading = false;
          this.isSumulateIntervalStarted = false;

          this.$emit('update-path-view', {
            path: data.pathViz,
            input: this.selectedInputTokens,
            output: this.selectedOutputTokens,
          });
          this.$emit('update-is-loading-data', false);
        })
        .catch((e) => {
          console.error('Odos simulate swap request failed', e);
          this.isSumulateSwapLoading = false;
          this.isSumulateIntervalStarted = false;
          this.$emit('update-is-loading-data', false);
        });
    },
    // function get data.outTokens and data.outAmounts and find matches in selectedOutputTokens
    // and update selectedOutputTokens with new values
    updateSelectedOutputTokens(data: any) {
      console.log(data, 'updateSelectedOutputTokens');
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

      console.log(outTokensCount, 'selectedOutputTokensCount');
      console.log(selectedOutputTokensMap, 'selectedOutputTokensMap');
      for (let i = 0; i < outTokensCount; i++) {
        const tokenAddress = outTokens[i];
        const tokenAmount = outAmounts[i];
        const token: any = selectedOutputTokensMap[tokenAddress.toLowerCase()];
        if (token) {
          const { selectedToken } = token;
          const sum = new BigNumber(tokenAmount)
            .div(10 ** selectedToken.decimals);
          token.sum = sum.toFixed(fixedByPrice(sum.toNumber()) + 2);
        }

        this.outputTokens[i] = token;
      }
    },

    getSourceBlackList(networkId: any) {
      if (networkId === 324) {
        return ['Hashflow', 'Wombat', 'Maverick'];
      }
      return ['Hashflow', 'Wombat', 'WOOFi', 'WOOFi V2'];
    },

    async disapproveToken(token: any) {
      const { selectedToken } = token;
      if (!selectedToken || !selectedToken.approveData.approved || !this.routerContract) {
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];
      clearApproveToken(
        tokenContract,
        this.routerContract.target,
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
        this.routerContract.target,
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

      selectedToken.approveData.approved = new BigNumber(selectedToken.approveData.allowanceValue)
        .isGreaterThanOrEqualTo(checkedAllowanceValue);
    },

    async approveTrigger(token: any) {
      this.showWaitingModal('Approving in process');

      this.firstSwipeClickOnApprove = true;

      await this.checkApproveForToken(token, token.contractValue);
      const { selectedToken } = token;
      if (selectedToken.approveData.approved) {
        this.closeWaitingModal();
        return;
      }

      const tokenContract = this.tokensContractMap[selectedToken.address];
      const approveValue = new BigNumber(10)
        .pow(selectedToken.decimals)
        .times(100000)
        .toFixed(0);

      const tx = await approveToken(
        tokenContract,
        this.routerContract.target,
        approveValue,
        this.account,
        this.gasPriceGwei,
      )
        .catch((e) => {
          console.error('Error when approve token.', e);
          this.firstSwipeClickOnApprove = false;
          this.closeWaitingModal();
          this.showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
        });

      const finishTx = () => {
        this.checkApproveForToken(token, token.contractValue);
        this.closeWaitingModal();
        this.firstSwipeClickOnApprove = false;
      };

      if (!tx) {
        finishTx();
        return;
      }

      await tx.wait();
      finishTx();
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

    addSelectedTokenToList(data: any) {
      if (data.isInput) {
        this.addSelectedTokenToInputList(data.tokenData);
        this.removeOutputToken(data.tokenData.id);
        this.addTokensEmptyIsNeeded();
        return;
      }

      this.addSelectedTokenToOutputList(data.tokenData);
      this.removeInputToken(data.tokenData.id);
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

      this.checkApproveForToken(newInputToken, newInputToken.contractValue);
    },
    addSelectedTokenToOutputList(selectedToken: any) {
      const newOutputToken = getNewOutputToken();
      newOutputToken.selectedToken = selectedToken;
      this.outputTokens.push(newOutputToken);
      this.removeAllWithoutSelectedTokens(this.outputTokens);
      this.recalculateOutputTokensSum();
      this.resetOutputs();
    },
    removeSelectedTokenFromList(data: any) {
      if (data.isInput) {
        this.removeInputToken(data.tokenData.id);
        if (this.inputTokens.length === 0) {
          this.addNewInputToken();
        }
        return;
      }

      this.removeOutputToken(data.tokenData.id);
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
    selectFormToken(isInputToken: boolean) {
      this.selectModalTypeInput = isInputToken;
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
        maxAll(this.selectedInputTokens, this.checkApproveForToken);
        this.updateQuotaInfo();
        this.$emit('update-stablecoins-list', tokens);
      });
    },

    initTabName(path: any, queryParams: any) {
      this.$router.push({
        path,
        query: queryParams || {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.swap-form__body-block {
  overflow-x: auto;
  overflow-y: hidden;
}

.swap-form__body-block h3,
.swap-form__body-block__title h3 {
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.swap-form__body-block__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  left: 0;
  top: 0;
}

.swap-form__body-block__inputs {
  position: relative;
  display: flex;
  gap: 5px;
}

.block-inputs--scroll {
  width: calc(100% + 600px);
  overflow-x: scroll;
  overflow-y: hidden;
}

.swap-form__body-block__inputs-item {
  width: 100%;
  height: auto;
  transition: opacity .2s ease, transform .3s ease;
}

.swap-form__body-block__inputs-max {
  position: sticky;
  margin-right: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: color .1s ease;

  [data-theme="dark"] & {
    color: var(--color-18);
  }

  &:hover {
    color: var(--color-3);
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}
.swap-form__body-block__inputs-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-5);
  color: var(--color-1);
  font-size: 40px;
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color .2s ease;

  [data-theme="dark"] & {
    background-color: var(--color-7);
    color: var(--color-8);
  }

  &:hover {
    background-color: var(--color-6);
    [data-theme="dark"] & {
      background-color: var(--color-4);
      color: var(--color-17);
    }
  }
}
.swap-form, .swap-container {
  height: 100%;
  // width: calc(100% + 4px);
  border-radius: 0 0 30px 30px;
}

.swap-form__loader {
  height: 100%;
  min-height: 474px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swap-form {
  min-height: 530px;
  padding: 24px 20px;
  background-color: var(--color-4);
  border: 2px solid var(--color-1);
  border-top: 0;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border: 2px solid var(--color-2);
    border-top: none;
  }
}
.swap-form__body-block {
  h3 {
    font-weight: 600;
    font-size: 14px;
    color: var(--color-2);
    margin-bottom: 5px;
  }
}
.swap-form__powered {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-7);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.swap-form__powered__icon {
  margin-left: 8px;
}

.swap-form__body-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  background-color: var(--color-5);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  transition: background-color .2s ease;

  svg {
    fill: var(--color-2);
  }
  [data-theme="dark"] & {
    background-color: var(--color-7);
  }

  &:hover {
    background-color: var(--color-6);
  }
}

.swap-form__btns {
  margin-top: 20px;
  button {
    box-shadow: none;
    border: none;
    [data-theme="dark"] & {
      box-shadow: none;
      background-color: var(--color-7);
      color: var(--color-18);
    }
  }
}
</style>
