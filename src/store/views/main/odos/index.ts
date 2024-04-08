/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
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
// import { awaitDelay } from '@/utils/const.ts';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { ethers } from 'ethers';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import { fixedByPrice } from '@/utils/numbers.ts';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import { BLAST_TOKENS } from '@/store/views/main/odos/mocks.ts';
import _ from 'lodash';

// const KEY = 'REFERRAL_CODE';

const ODOS_DURATION_CONFIRM_REQUEST = 60;

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
    'linea'
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
  lastPutIntoPoolEvent: null,
  lastReturnedToUserEvent: null,

  successData: {
    inputTokens: [] as any[],
    outputTokens: [] as any[],
  } as any,
  showSuccessZapin: false,
  zksyncFeeHistory: {} as any,

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
  swapResponseConfirmGetter(state: typeof stateData) {
    return state.swapResponseConfirmInfo;
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

  isAllDataLoaded(state: typeof stateData) {
    return !state.isChainsLoading && !state.isTokensLoading && !state.isBalancesLoading;
  },
  isShowDecreaseAllowance(state: typeof stateData) {
    return (
      state.isShowDecreaseAllowanceButton
    );
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
      commit, state, dispatch, rootState
    }: any,
    {
      isShow,
      inputTokens,
      outputTokens,
      hash,
      putIntoPoolEvent,
      returnedToUserEvent,
      pool
    }: any
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
      }
    });
    commit('changeState', { field: 'showSuccessZapin', val: isShow });
  },
  async loadChains({
    commit, state,
  }: any) {
    if (state.isChainsLoading) return;

    commit('changeState', { field: 'isChainsLoading', val: true });

    const data: any = await odosApiService
      .loadChains()
      .catch((e) => {
        console.log('Error load chains', e);
        commit('changeState', { field: 'isChainsLoading', val: false });
      });

    commit('changeState', { field: 'chains', val: data.chains });
    commit('changeState', { field: 'isChainsLoading', val: false });
  },
  async loadTokens({
    commit, state,
  }: any) {
    if (state.isTokensLoading) return;

    commit('changeState', { field: 'isTokensLoading', val: true });

    const odosTokens: any = await odosApiService
      .loadTokens()
      .catch((e) => {
        console.log('Error load tokens', e);
        commit('changeState', { field: 'isTokensLoading', val: false });
      });

    await commit('changeState', {
      field: 'tokensMap',
      val: {
        chainTokenMap: {
          ...odosTokens.chainTokenMap,
          ...BLAST_TOKENS
        },
      }
    });

    commit('changeState', { field: 'isTokensLoading', val: false });
  },

  async initData(
    {
      commit,
      dispatch,
      state,
      getters
    }: any,
    data: {
      tokenSeparationScheme: any,
      listOfBuyTokensAddresses: any,
    }
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

    console.log(tokensWithPrices, '---tokensWithPrices');
    commit('changeState', {
      field: 'tokens',
      val: tokensWithPrices
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
      val: tokensWithPrices
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
    commit, state, dispatch
  }: any) {
    commit('changeState', {
      field: 'updateBalancesIntervalId',
      val: setInterval(() => {
        dispatch('loadBalances');
      }, 30000)
    });
  },

  async loadBalances({
    commit, dispatch, state, getters, rootState
  }: any, providerInstance: any) {
    const provider = providerInstance || rootState.web3.evmProvider;

    if (!rootState.accountData.account || !provider) {
      commit('changeState', { field: 'isBalancesLoading', val: false });
      return;
    }

    if (state.isBalancesLoading) return;
    if (getters.allTokensList.length === 0) return;

    commit('changeState', { field: 'isBalancesLoading', val: true });

    try {
      const multicaller = MulticallWrapper.wrap(provider);
      const requests = getters.allTokensList
        .map((_: any) => new ethers.Contract(
          _.address,
          ERC20_ABI,
          multicaller,
        ).balanceOf(rootState.accountData.account).catch(() => '0'));

      if (!MulticallWrapper.isMulticallProvider(provider)) return;

      const balancesData = await Promise.all(requests);

      const handleNativeBal = async () => (await rootState.web3.evmProvider
        .getBalance(rootState.accountData.account))
        .toString();

      const newBalances = await Promise.all(
        getters.allTokensList.map(async (token: any, key: number) => {
          let balance = balancesData[key] ? balancesData[key].toString() : '0';

          if (token.address === ZERO_ADDRESS) balance = await handleNativeBal();

          const balanceFormatted = new BigNumber(balance).div(10 ** token.decimals);
          const fixedBy = balanceFormatted.gt(0) ? fixedByPrice(balanceFormatted.toNumber()) : 2;
          const tokenPrice = token.price ?? '0';

          return {
            ...token,
            balanceData: {
              name: token.symbol,
              balance: balanceFormatted.toFixed(fixedBy),
              balanceInUsd: new BigNumber(balanceFormatted).times(tokenPrice).toString(),
              originalBalance: balance,
              decimal: token.decimals,
            }
          };
        })
      );

      // console.log(newBalances, 'newBalances');
      const bus = useEventBus('odos-tokens-loaded');
      bus.emit(true);

      await commit('changeBalances', newBalances);

      commit('changeState', { field: 'isBalancesLoading', val: false });
      commit('changeState', { field: 'firstRenderDone', val: true });
    } catch (e) {
      console.error('Error when load balance', e);
      commit('changeState', { field: 'isBalancesLoading', val: false });
      commit('changeState', { field: 'firstRenderDone', val: true });
    }
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
          )
        });
        commit('changeState', {
          field: 'executorContract',
          val: buildEvmContract(
            data.erc20Abi.abi,
            rootState.web3.evmSigner,
            data.executorAddress,
          )
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
    commit
  }: any) {
    commit('changeState', { field: 'tokens', val: [] });
  },

  quoteRequest({
    commit
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
      }
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
      }
    });
  },
  async addedZkSyncGasHistoryData({
    commit, state, dispatch, rootState,
  }: any, transactionData: any) {
    commit('changeState', {
      field: 'zksyncFeeHistory',
      val: {
        startWeiBalance: null,
        finalWeiBalance: null,
        estimateFeeInEther: null,
        ethPrice: 0,
      }
    });

    try {
      // get balance from eth token
      const weiBalance = await rootState.web3.evmProvider.getBalance(rootState.accountData.account);
      const balance = new BigNumber(weiBalance).div(10 ** 18).toString();
      commit('changeState', {
        field: 'zksyncFeeHistory',
        val: {
          startWeiBalance: balance,
          finalWeiBalance: null,
          estimateFeeInEther: null,
          ethPrice: 0,
        }
      });
    } catch (e) {
      console.error('OdosSwap Error get balance from eth token', e);
    }

    await rootState.web3.evmProvider.estimateGas(transactionData, (error: any, gasLimit: any) => {
      if (error) {
        console.error('OdosSwap Error estimating gas:', error);
      } else {
        console.log('OdosSwap estimating gasLimit:', gasLimit);
        const feeInWei = gasLimit * 262500000;
        console.log('OdosSwap estimating feeInWei:', feeInWei);
        const feeInEther = new BigNumber(feeInWei).div(10 ** 18).toString();
        commit('changeState', {
          field: 'zksyncFeeHistory',
          val: {
            ...state.zksyncFeeHistory,
            estimateFeeInEther: feeInEther,
          }
        });
      }
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
    }
  ) {
    if (!state.routerContract || !state.executorContract) return;

    dispatch('startSwapConfirmTimer');

    const transactionData = {
      ...data.txData.transaction,
      from: rootState.accountData.account,
    };

    if (rootState.network.networkName === 'zksync') {
      await dispatch('addedZkSyncGasHistoryData', transactionData);
    }

    dispatch('waitingModal/showWaitingModal', 'Swapping in process', { root: true });

    // console.log(rootState.web3, '---rootState.web3');
    // console.log(transactionData, '---transactionData');

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

    if (rootState.network.networkName === 'zksync' && state.zksyncFeeHistory) {
      try {
        console.log('state.account after tx: ', rootState.accountData.account);
        const weiBalance = await rootState.web3.evmProvider
          .getBalance(rootState.accountData.account);
        const balance = new BigNumber(weiBalance).div(10 ** 18).toString();
        state.zksyncFeeHistory.finalWeiBalance = balance;
      } catch (e) {
        console.log({
          message: 'Error get balance from eth token  after tx',
          swapSession: state.swapSessionId,
          data: e,
        });
      }
    }

    const inputTokens = [...data.selectedInputTokens];
    const outputTokens = [...data.selectedOutputTokens];

    // event
    const bus = useEventBus('odos-transaction-finished');
    bus.emit(true);

    dispatch('successModal/showSuccessModal', {
      successTxHash: dataTx.hash,
      from: inputTokens.map((_) => ({
        symbol: _.selectedToken.symbol,
        value: new BigNumber(_.value).toFixed(5)
      })),
      to: outputTokens.map((_) => ({
        symbol: _.selectedToken.symbol,
        value: new BigNumber(_.sum).toFixed(5)
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
  changeBalances(state: any, tokensBalances: any[]) {
    const balancesArr = state.tokens.map((_: any) => _.id);
    tokensBalances.forEach((tok: any) => {
      const index = balancesArr.indexOf(tok.id);
      if (index === -1 || !state.tokens[index]) return;

      state.tokens[index].balanceData = tok.balanceData;
    });
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
