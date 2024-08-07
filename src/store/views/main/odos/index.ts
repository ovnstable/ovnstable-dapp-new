/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import odosApiService from '@/services/odos-api-service.ts';
import { useEventBus } from '@vueuse/core';
import {
  getFilteredOvernightTokens,
  getFilteredPoolTokens,
  loadPriceTrigger,
} from '@/store/helpers/index.ts';
import BigNumber from 'bignumber.js';
import { getNetworkParams } from '@/store/web3/network.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import {
  BLAST_TOKENS, LINEA_TOKENS, OP_TOKENS, SFRAX_TOKEN, ZKSYNC_TOKENS,
} from '@/constants/tokens/manualTokensMap.ts';
import _ from 'lodash';
import BalanceService from '@/services/BalanceService/BalanceService.ts';
import TokenService from '@/services/TokenService/TokenService.ts';
import type { TTokenInfo } from '@/types/common/tokens';

const ODOS_DURATION_CONFIRM_REQUEST = 60;

export enum MODAL_TYPE {
  ZAPIN,
  WITHDRAW,
  HARVEST,
  REBALANCE,
  COMPOUND
}

export const stateData = {
  baseViewType: 'SWAP',
  isChainsLoading: false,
  isBalancesLoading: false,
  isFirstBalanceLoaded: false,
  isContractLoading: false,
  isTokenExternalDataLoading: false,

  firstRenderDone: false,
  isTokensLoading: false,
  isTokensLoadedAndFiltered: false,

  chains: null,
  tokensMap: {} as any,

  tokens: [] as any[],
  contractData: null,
  routerContract: null,
  executorContract: null,

  tokensContractMap: {} as any, // { 'contractAddress': {ABI} }
  tokenPricesMap: {} as any,

  availableNetworksList: [
    'polygon',
    'bsc',
    'optimism',
    'arbitrum',
    'zksync',
    'base',
    'linea',
  ],
  swapResponseInfo: null,
  quotaResponseInfo: null,
  swapResponseConfirmInfo: {
    duration: 0,
    counterId: null,
    waitingConformation: false,
  } as any,
  additionalSwapStepType: null, // 'APPROVE', 'DEPOSIT'

  isShowDecreaseAllowanceButton: true,

  updateBalancesIntervalId: null,
  lastPoolInfoData: null,
  lastNftTokenId: null,
  lastZapResponseData: null,

  // Too tied with other events
  lastPutIntoPoolEvent: {},
  lastReturnedToUserEvent: {},
  lastInputTokensEvent: {},

  // Adding new
  lastParsedPutIntoPoolEvent: {},
  lastParsedReturnedToUserEvent: {},
  lastParsedInputTokensEvent: {},
  lastParsedTokenIdEvent: '' as string,
  lastParsedBurnedTokenIdEvent: '' as string,
  lastParsedZapResponseData: {},

  successData: {
    inputTokens: [] as any[],
    outputTokens: [] as any[],
  } as any,
  showSuccessZapin: false,

  tokenSeparationScheme: null, // OVERNIGHT_SWAP, POOL_SWAP,
  typeOfPoolScheme: null, // OVN, ALL, null

  listOfBuyTokensAddresses: null, // for POOL_SWAP scheme
  odosReferalCode: 7777777, // test account or user acc
  odosZapReferalCode: 7777777, // test account

  swapSessionId: null,
};

const getters = {
  allTokensList(state: typeof stateData) {
    return state.tokens;
  },
  allTokensMap(state: typeof stateData) {
    return new Map(state.tokens.map((token) => [token.address, token]));
  },
  swapResponseConfirmGetter(state: typeof stateData) {
    return state.swapResponseConfirmInfo;
  },
  allTokensLoaded(state: typeof stateData) {
    return state.tokens?.length > 0;
  },
  isAllLoaded(state: typeof stateData, getters: any, rootState: any) {
    // form swap window show
    if (state.baseViewType === 'SWIPE') {
      return rootState?.account
        ? state.isTokensLoadedAndFiltered && state.isFirstBalanceLoaded
        : state.isTokensLoadedAndFiltered;
    }

    if (state.baseViewType === 'SWAP') {
      return state.isTokensLoadedAndFiltered;
    }

    return true;
  },

  isAllDataLoaded(state: typeof stateData, getters: any, rootState: any) {
    return !state.isChainsLoading && !state.isTokensLoading && !state.isBalancesLoading
    && state.isFirstBalanceLoaded;
  },
  isTokensLoaded(state: typeof stateData) {
    return !state.isChainsLoading && !state.isTokensLoading;
  },
  isAvailableOnNetwork(state: typeof stateData, getters: any, rootState: any) {
    return state.availableNetworksList.includes(rootState?.network?.networkName);
  },
  tokensSelectedCount(state: typeof stateData) {
    return state.tokens.filter((item: any) => item.selected).length;
  },
  stablecoinTokens(state: typeof stateData): any[] {
    return state.tokens.filter((item: any) => item.assetType === 'usd');
  },
  stablecoinWithoutSecondTokens(state: typeof stateData, getters: any) {
    return getters.stablecoinTokens.filter(
      (item: any) => !getters.stablecoinSecondTokens
        .map((itemInn: any) => itemInn.address)
        .includes(item.address),
    );
  },
};

const actions = {
  triggerSuccessZapin(
    {
      commit, state, dispatch, rootState,
    }: any,
    {
      isShow,
      inputTokens,
      outputTokens,
      hash,
      putIntoPoolEvent,
      returnedToUserEvent,
      pool,
      modalType,
    }: any,
  ) {
    commit('changeState', {
      field: 'successData',
      val: {
        inputTokens,
        outputTokens,
        hash,
        chain: rootState.network.networkId,
        putIntoPoolEvent,
        returnedToUserEvent,
        pool,
        modalType,
      },
    });
    commit('changeState', { field: 'showSuccessZapin', val: isShow });
  },
  async loadTokens({
    commit, state,
  }: any) {
    if (state.isTokensLoading) return;

    commit('changeState', { field: 'isTokensLoading', val: true });

    const tokensMap = await TokenService.getTokenInfo();

    commit('changeState', { field: 'tokensMap', val: tokensMap });
    commit('changeState', { field: 'isTokensLoading', val: false });
  },

  async initData(
    {
      commit,
      dispatch,
      state,
      getters,
    }: any,
    data: {
      tokenSeparationScheme: any,
      listOfBuyTokensAddresses: any,
    },
  ) {
    dispatch('clearInputData');

    if (!getters.isAvailableOnNetwork) {
      console.info(
        'Swap init not available on this network.',
      );
      await dispatch('initAccountData');
      return;
    }

    if (data?.tokenSeparationScheme === 'POOL_SWAP') {
      dispatch('initPoolSwap', data.listOfBuyTokensAddresses);
      return;
    }

    await dispatch('initOvernightSwap');
  },
  async initPoolSwap({
    commit, state, dispatch, rootState,
  }: any) {
    const { networkId } = getNetworkParams(rootState.network.networkName);
    const tokensList = getFilteredPoolTokens(
      networkId,
      false,
      [],
      true,
      state,
    );

    const tokensWithPrices = await loadPriceTrigger(tokensList, networkId);

    commit('changeState', {
      field: 'tokens',
      val: tokensWithPrices,
    });

    commit('changeState', { field: 'isTokensLoadedAndFiltered', val: true });
    await dispatch('initAccountData');
  },
  async initOvernightSwap({
    commit, state, dispatch, rootState,
  }: any) {
    const { networkId } = getNetworkParams(rootState.network.networkName);

    const tokensList = getFilteredOvernightTokens(
      state,
      networkId,
      false,
    );

    const tokensWithPrices = await loadPriceTrigger(tokensList, networkId);
    commit('changeState', {
      field: 'tokens',
      val: tokensWithPrices,
    });

    commit('changeState', { field: 'isTokensLoadedAndFiltered', val: true });
    await dispatch('initAccountData');
  },
  async initAccountData({
    commit, state, dispatch, rootState,
  }: any) {
    if (rootState.accountData.account) {
      await dispatch('loadContractsForTokens');
      await dispatch('loadBalances');

      commit('changeState', { field: 'isTokensLoadedAndFiltered', val: true });
    } else {
      commit('changeState', { field: 'firstRenderDone', val: true });
      commit('changeState', { field: 'isBalancesLoading', val: false });
    }
  },
  loadContractsForTokens({
    commit, state, getters, rootState,
  }: any) {
    const tokensList: any = {};
    for (let i = 0; i < getters.allTokensList.length; i++) {
      const token: any = getters.allTokensList[i];
      tokensList[token.address] = buildEvmContract(
        ERC20_ABI,
        rootState.web3.evmSigner,
        token.address,
      );
    }

    commit('changeState', { field: 'tokensContractMap', val: tokensList });
  },

  initUpdateBalancesInterval({
    commit, state, dispatch,
  }: any) {
    commit('changeState', {
      field: 'updateBalancesIntervalId',
      val: setInterval(() => {
        dispatch('loadBalancesMethod');
      }, 3000),
    });
  },

  // Wrapper for external calls
  async loadBalances({
    commit, dispatch, state, getters, rootState,
  }: any, providerInstance: any) {
    commit('changeState', { field: 'isBalancesLoading', val: true });
    dispatch('loadBalancesMethod');
  },

  // Internal method executed recurrently
  async loadBalancesMethod({
    commit, dispatch, state, getters, rootState,
  }: any, providerInstance: any) {
    const provider = providerInstance || rootState.web3.evmProvider;
    const allTokensList = [...getters.allTokensList];

    if (allTokensList.length === 0 || !rootState.accountData.account || !provider) {
      commit('changeState', { field: 'isBalancesLoading', val: false });
      return;
    }

    try {
      const newBalances: TTokenInfo[] = await BalanceService
        .getAllTokenBalance(provider, allTokensList, rootState.accountData.account);

      if (!_.isEqual(state.tokens, newBalances)) {
        await commit('changeBalances', newBalances);
        commit('changeState', { field: 'isFirstBalanceLoaded', val: true });
      }
    } catch (e) {
      console.error('Error when load balance', e);
    }
    commit('changeState', { field: 'isBalancesLoading', val: false });
    commit('changeState', { field: 'firstRenderDone', val: true });
  },

  async initContractData({
    commit, dispatch, getters, rootState,
  }: any) {
    if (!getters.isAvailableOnNetwork) {
      console.info(
        'Swap init not available on this network for loading contract.',
      );
      return;
    }

    const { networkId } = getNetworkParams(rootState.network.networkName);
    dispatch('loadContract', networkId);
  },
  async loadContract({
    commit, state, getters, rootState,
  }: any, chainId: string | number) {
    if (state.isContractLoading) {
      return;
    }
    commit('changeState', { field: 'isContractLoading', val: true });

    // eslint-disable-next-line consistent-return
    return odosApiService
      .loadContractData(chainId)
      .then((data: any) => {
        commit('changeState', { field: 'contractData', val: data });
        commit('changeState', {
          field: 'routerContract',
          val: buildEvmContract(
            data.routerAbi.abi,
            rootState.web3.evmSigner,
            data.routerAddress,
          ),
        });
        commit('changeState', {
          field: 'executorContract',
          val: buildEvmContract(
            data.erc20Abi.abi,
            rootState.web3.evmSigner,
            data.executorAddress,
          ),
        });
        commit('changeState', { field: 'isContractLoading', val: false });
      })
      .catch((e) => {
        console.log('Error load contract', e);
        commit('changeState', { field: 'isContractLoading', val: false });
        throw e;
      });
  },
  clearInputData({
    commit,
  }: any) {
    commit('changeState', { field: 'tokens', val: [] });
  },

  quoteRequest({
    commit,
  }: any, requestData: any) {
    return odosApiService
      .quoteRequest(requestData)
      .then((data) => {
        commit('changeState', { field: 'quotaResponseInfo', val: data });
        return data;
      })
      .catch((e) => {
        console.log('Quota request error: ', e);
      });
  },
  startSwapConfirmTimer({
    commit, state, dispatch, rootState,
  }: any) {
    commit('changeState', {
      field: 'swapResponseConfirmInfo',
      val: {
        duration: ODOS_DURATION_CONFIRM_REQUEST,
        waitingConformation: true,
        counterId: setInterval(() => {
          state.swapResponseConfirmInfo.duration--;
          if (state.swapResponseConfirmInfo.duration <= 0) {
            dispatch('stopSwapConfirmTimer');
          }
        }, 1000),
      },
    });
  },
  stopSwapConfirmTimer({
    commit, state, dispatch, rootState,
  }: any) {
    state.swapResponseConfirmInfo.waitingConformation = false;
    clearInterval(state.swapResponseConfirmInfo.counterId);
    dispatch('waitingModal/closeWaitingModal', null, { root: true });
    commit('changeState', {
      field: 'swapResponseConfirmInfo',
      val: {
        duration: ODOS_DURATION_CONFIRM_REQUEST,
        waitingConformation: false,
        counterId: setInterval(() => {
          state.swapResponseConfirmInfo.duration--;
          if (state.swapResponseConfirmInfo.duration <= 0) {
            dispatch('stopSwapConfirmTimer');
          }
        }, 1000),
      },
    });
  },
  async initWalletTransaction(
    {
      commit, state, dispatch, rootState,
    }: any,
    data: {
      txData: any,
      selectedInputTokens: any,
      selectedOutputTokens: any,
    },
  ) {
    if (!state.routerContract || !state.executorContract) return;

    dispatch('startSwapConfirmTimer');

    const transactionData = {
      ...data.txData.transaction,
      from: rootState.accountData.account,
    };

    dispatch('waitingModal/showWaitingModal', 'Swapping in process', { root: true });

    const dataTx = await rootState.web3.evmSigner
      .sendTransaction(transactionData)
      .catch((e: any) => {
        console.log(e);
        dispatch('errorModal/showErrorModalWithMsg', { errorType: 'estimateGas', errorMsg: e }, { root: true });
        dispatch('stopSwapConfirmTimer');
      });

    await dataTx.wait();

    console.log('Call result: ', dataTx);

    console.log({
      message: 'Odos response from transaction',
      swapSession: state.swapSessionId,
      data: dataTx,
    });
    dispatch('waitingModal/closeWaitingModal', null, { root: true });

    const inputTokens = [...data.selectedInputTokens];
    const outputTokens = [...data.selectedOutputTokens];

    // event
    const bus = useEventBus('odos-transaction-finished');
    bus.emit(true);

    dispatch('successModal/showSuccessModal', {
      successTxHash: dataTx.hash,
      type: 'SWAP',
      from: inputTokens.map((_) => ({
        ..._.selectedToken,
        value: new BigNumber(_.value).toFixed(5),
      })),
      to: outputTokens.map((_) => ({
        ..._.selectedToken,
        value: new BigNumber(_.sum).toFixed(5),
      })),
    }, { root: true });
    dispatch('stopSwapConfirmTimer');

    setTimeout(() => {
      dispatch('loadBalances');
    }, 2000);
  },
  async getActualGasPrice({
    commit, state, dispatch, rootState,
  }: any, networkId: number | string) {
    const actualGasPriceObject: any = await odosApiService.getActualGasPrice(
      networkId,
    );
    console.log({
      message: 'Actual price for gas.',
      swapSession: state.swapSessionId,
      data: actualGasPriceObject,
    });

    if (
      (rootState.network.networkName === 'polygon' || rootState.network.networkName === 'bsc')
      && actualGasPriceObject.prices
      && actualGasPriceObject.prices.length
    ) {
      return actualGasPriceObject.prices[0].fee;
    }

    const actualGas = actualGasPriceObject.baseFee;
    if (
      !actualGas
      && actualGasPriceObject.prices
      && actualGasPriceObject.prices.length
    ) {
      console.log({
        message: 'Actual price for gas when not found base fee.',
        swapSession: state.swapSessionId,
        data: actualGasPriceObject,
      });
      return actualGasPriceObject.prices[0].fee;
    }

    return actualGas;
  },
};

const mutations = {
  changeState(state: any, data: {
    field: keyof typeof stateData,
    val: any
  }) {
    state[data.field] = data.val;
  },
  changePrices(state: any, tokensBalances: any[]) {
    const balancesArr = state.tokens.map((_: any) => _.id);
    tokensBalances.forEach((tok: any) => {
      const index = balancesArr.indexOf(tok.id);
      if (index === -1 || !state.tokens[index]) return;

      state.tokens[index].price = tok.price;
    });
  },
  changeBalances(state: any, tokenBalanceInfo: TTokenInfo[]) {
    state.tokens = tokenBalanceInfo;
  },
  setFetchIntervalId(state: any, id: string) {
    state.fetchIntervalId = id;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
