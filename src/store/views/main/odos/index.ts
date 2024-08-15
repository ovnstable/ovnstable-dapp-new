/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import odosApiService from '@/services/odos-api-service.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { useEventBus } from '@vueuse/core';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

const ODOS_DURATION_CONFIRM_REQUEST = 60;

export enum MODAL_TYPE {
  ZAPIN,
  WITHDRAW,
  HARVEST,
  REBALANCE,
  COMPOUND
}

export const stateData = {
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
  routerContract: null,
};

const getters = {
  swapResponseConfirmGetter(state: typeof stateData) {
    return state.swapResponseConfirmInfo;
  },
  isAvailableOnNetwork(state: typeof stateData, getters: any, rootState: any) {
    return state.availableNetworksList.includes(rootState?.network?.networkName);
  },
};

const actions = {
  async loadRouterContract({
    commit, state, rootState,
  }: any, chainId: string | number) {
    if (state.isContractLoading) return;
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
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
