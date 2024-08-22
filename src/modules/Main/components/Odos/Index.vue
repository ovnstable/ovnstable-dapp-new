<template>
  <div class="swap-form">
    <div v-if="!isAvailableOnNetwork">
      <NetworkNotAvailable :network-name="networkName" />
    </div>

    <div
      v-else
      :class="
        !isAllDataLoaded ? 'swap-container swap-container-full' : 'swap-container'
      "
    >
      <div
        v-if="!isAllDataLoaded"
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
              key="1"
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
                <div
                  v-if="isShowDecreaseAllowance && token.selectedToken"
                  class="decrease-allowance"
                  @click="disapproveToken(token)"
                  @keypress="disapproveToken(token)"
                >
                  Decrease Allowance
                </div>
                <!-- <p>{{ this.inputTokens.length }}</p>
                <p>{{ this.inputTokens[0] }}</p> -->
                <!-- <p>{{ token }}</p> -->
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
            class="swap-form__body-arrow"
            @click="changeSwap"
            @keypress="changeSwap"
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
              key="2"
              name="staggered-fade"
              tag="div"
              :class="{ 'swap-form__body-block__inputs': true, 'block-inputs--scroll': outputTokens?.length > 3 }"
              :css="false"
              @before-enter="beforeEnterList"
              @enter="onEnterList"
              @on-leave="onLeaveList"
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

        <div class="swap-form__btns">
          <ButtonComponent
            v-if="!account"
            btn-size="large"
            full
            @on-click="connectWallet"
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
              btn-size="large"
              full
              :loading="firstSwipeClickOnApprove"
              @on-click="approveTrigger(firstInputInQueueForToApprove)"
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
              btn-size="large"
              full
              :loading="isLoadingSwap"
              @on-click="swapTrigger"
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

    <div v-if="!deviceSize.isMobile">
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
    <div v-else>
      <SelectTokensModalMobile
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
  </div>
</template>
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-continue -->
<script lang="ts">
import {
  mapActions, mapGetters, mapState, useStore,
} from 'vuex';
import { useEventBus } from '@vueuse/core';
import { ethers } from 'ethers';
import TokenForm from '@/modules/Main/components/Odos/TokenForm.vue';
import Spinner from '@/components/Spinner/Index.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import NetworkNotAvailable from '@/modules/Main/components/Odos/network-not-available.vue';
import SelectTokensModal from '@/components/TokensModal/Index.vue';
import SelectTokensModalMobile from '@/modules/Main/components/MobileModals/TokenSelect.vue';
import SwapSlippageSettings from '@/components/SwapSlippage/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';
import { fixedByPrice } from '@/utils/numbers.ts';
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
import { computed, defineComponent, inject } from 'vue';
import { useTokensQuery, useRefreshBalances } from '@/hooks/fetch/useTokensQuery.ts';
import TokenService, { type ITokenService } from '@/services/TokenService/TokenService.ts';

export default defineComponent({
  name: 'SwapForm',
  components: {
    ButtonComponent,
    Spinner,
    NetworkNotAvailable,
    SelectTokensModal,
    SwapSlippageSettings,
    TokenForm,
    BaseIcon,
    SelectTokensModalMobile,
  },
  props: {
    viewType: {
      type: String,
      required: true,
    },
  },
  setup: () => {
    const { state } = useStore() as any;

    const tokenService = inject('tokenService') as ITokenService;

    const {
      data: allTokensList,
      isLoading,
      isBalancesLoading,
    } = useTokensQuery(tokenService, state);

    return {
      allTokensList,
      isAllDataLoaded: computed(() => !isLoading.value),
      isBalancesLoading,
      refreshBalances: useRefreshBalances(),
    };
  },
  data() {
    return {
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      maxInputTokens: 4,
      maxOutputTokens: 4,

      // input or output choosing
      selectModalTypeInput: true,
      isShowSelectTokensModal: false,
      swapMethod: 'BUY', // BUY (secondTokens) / SELL (secondTokens)

      isSwapLoading: false,
      isSumulateSwapLoading: false,
      isSumulateIntervalStarted: false,
      slippagePercent: 0.05,
      firstSwipeClickOnApprove: false,
    };
  },
  computed: {
    ...mapState('odosData', [
      'routerContract',
      'swapSessionId',
      'odosReferalCode',
      'isShowDecreaseAllowance',
    ]),
    ...mapGetters('odosData', [
      'isAvailableOnNetwork',
    ]),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('network', ['networkId', 'networkName']),

    deviceSize() {
      return deviceType();
    },
    getSlippagePercent() {
      return this.slippagePercent;
    },

    isInputTokensRemovable() {
      if (this.inputTokens.length > 1) {
        return true;
      }
      if (this.inputTokens.length === 1) {
        const token = this.inputTokens[0];
        return !(
          token.value === null
          && token.usdValue === null
          && token.contractValue === null
          && token.selectedToken === null
        );
      }
      return false;
    },

    isOutputTokensRemovable() {
      if (this.outputTokens.length > 1) {
        return true;
      }
      if (this.outputTokens.length === 1) {
        const token = this.outputTokens[0];
        return !(
          token.value === null
          && token.usdValue === null
          && token.contractValue === null
          && token.selectedToken === null
        );
      }
      return false;
    },

    isInputTokensAddAvailable() {
      return (
        (this.inputTokens.length + 1) < this.maxInputTokens
        && this.inputTokensWithoutSelectedTokensCount === 0
      );
    },

    isOutputTokensAddAvailable() {
      return (
        (this.outputTokens.length + 1) < this.maxOutputTokens
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
  watch: {
    allTokensList() {
      this.clearForm();
    },
    // withour router, swaps do not gonna work
    async networkId(val) {
      await this.loadRouterContract(val);
      this.clearForm();
    },
    async account() {
      await this.loadRouterContract(this.networkId);
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
    hideSwapButton(val) {
      if (val) {
        this.clearQuotaInfo();
      }
    },
  },
  async mounted() {
    this.$store.commit('odosData/changeState', {
      field: 'tokenSeparationScheme',
      val: 'OVERNIGHT_SWAP',
    });

    this.clearForm();
    await this.init();
    if (this.$route.query.action === 'swap-out') this.changeSwap();
  },
  methods: {
    ...mapActions(
      'odosData',
      [
        'getActualGasPrice',
        'loadRouterContract',
        'initWalletTransaction',
      ],
    ),
    ...mapActions('errorModal', ['showErrorModalWithMsg']),
    ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),
    ...mapActions('walletAction', ['connectWallet']),

    onLeaveList,
    beforeEnterList,
    onEnterList,
    async reloadList() {
      try {
        this.clearForm();
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
      await this.loadRouterContract(this.networkId);
      const bus = useEventBus('odos-transaction-finished');
      bus.on(() => {
        this.finishTransaction();
      });

      useEventBus('odos-tokens-loaded');
    },
    addDefaultOvnToken() {
      const symbol = this.$route.query.symbol ? this.$route.query.symbol : null;
      const ovnSelectedToken: any = getDefaultSecondtoken(
        'OVERNIGHT_SWAP',
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
      const index = tokens.findIndex(
        (item: any) => item.id === id
        || (item.selectedToken ? item.selectedToken.id === id : false),
      );

      if (index !== -1) {
        if (tokens.length === 1) {
          tokens[index] = getNewInputToken();
        } else {
          if (tokens[index].selectedToken) {
            tokens[index].selectedToken.selected = false;
          }
          tokens.splice(index, 1);
        }
      }
      this.updateQuotaInfo();
    },

    changeSwap() {
      const arrowElement = this.$el.querySelector('.swap-form__body-arrow');

      if (arrowElement) {
        arrowElement.classList.remove('rotate-animation');
        // eslint-disable-next-line no-void
        void arrowElement.offsetWidth;
        arrowElement.classList.add('rotate-animation');
      }
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
      this.$emit('update-path-view', {
        path: null,
        input: this.selectedInputTokens,
        output: this.selectedOutputTokens,
      });

      this.clearForm();
      this.refreshBalances();
    },

    clearForm() {
      this.clearAllSelectedTokens();
      this.addDefaultOvnToken();
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
      if (this.isSwapLoading) return;

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

      this.odosSwapRequest(requestData)
        .then(async (data: any) => {
          const assembleData = {
            userAddr: ethers.getAddress(
              this.account.toLowerCase(),
            ),
            pathId: data.pathId,
            simulate: true,
          };

          console.log('SIMULATE');
          this.odosAssembleRequest(assembleData)
            .then(async (responseAssembleData: any) => {
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

              this.isSwapLoading = false;
            })
            .catch((e) => {
              console.log({
                message: 'Odos assemble request failed swap form',
                swapSession: this.swapSessionId,
                data: e,
              });
              this.closeWaitingModal();
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
    },
    async simulateSwap() {
      if (this.isSumulateSwapLoading) return;

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

      const tokenContract = TokenService
        .loadTokenContract(selectedToken.address, this.$store.state.web3.evmSigner);
      clearApproveToken(
        tokenContract,
        this.routerContract.target,
        this.account,
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

      const tokenContract = TokenService
        .loadTokenContract(selectedToken.address, this.$store.state.web3.evmSigner);
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

      const tokenContract = TokenService
        .loadTokenContract(selectedToken.address, this.$store.state.web3.evmSigner);
      const approveValue = new BigNumber(10)
        .pow(selectedToken.decimals)
        .times(10 ** 18)
        .toFixed(0);

      const tx = await approveToken(
        tokenContract,
        this.routerContract.target,
        approveValue,
        this.account,
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
        if (!ignoreNullable && !token.value) continue;

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
        if (!ignoreNullable && !token.value) continue;

        outputTokens.push({
          tokenAddress: selectedToken.address,
          proportion: String(token.value),
        });
      }
      return outputTokens;
    },

    lockProportion(isLock: any, token: any) {
      if (this.outputTokensWithSelectedTokensCount <= 1 && !isLock) return;

      token.locked = isLock;
      this.recalculateOutputTokensSum();
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

    updateQuotaInfo() {
      this.simulateSwap();
    },

    initTabName(path: any, queryParams: any) {
      this.$router.push({
        path,
        query: queryParams || {},
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes rotateArrow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.rotate-animation {
  animation: rotateArrow 0.2s linear forwards;
}
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
  color: var(--color-3);

  [data-theme="dark"] & {
    color: var(--color-18);
  }

  &:hover {
    color: var(--color-6);
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

  @media (max-width: 640px) {
    margin-top: 50px;
    border-top: 2px solid var(--color-1);
    border-radius: 30px;
    margin-bottom: 200px;
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
@media (max-width: 640px) {
  .swap-form {
    width: 100%;
    border: none;
    padding: 0;
  }
  .swap-form__body-block__inputs {
    flex-direction: column;
  }
}
</style>
