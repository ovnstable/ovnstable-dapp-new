/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { useEventBus } from '@vueuse/core';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import type { IPositionsInfo } from '@/types/positions';
import type { TPool } from '@/types/common/pools';

export const ODOS_REF_CODE = 7777777;

export enum MODAL_TYPE {
  ZAPIN,
  WITHDRAW,
  HARVEST,
  REBALANCE,
  COMPOUND,
  INCREASE,
  MERGE,
}
export interface ITriggerSuccessZapin {
  isShow: boolean,
  inputTokens: any[],
  outputTokens: any[],
  hash: string,
  putIntoPoolEvent: {},
  returnedToUserEvent: {},
  pool: TPool | IPositionsInfo,
  modalType: MODAL_TYPE,
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

    const overnightApiInstance = new OvernightApi();
    // eslint-disable-next-line consistent-return
    return overnightApiInstance
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
      commit, rootState,
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
    }: ITriggerSuccessZapin,
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
    const overnightApiInstance = new OvernightApi();
    return overnightApiInstance
      .quoteRequest(requestData)
      .then((data) => {
        commit('changeState', { field: 'quotaResponseInfo', val: data });
        return data;
      })
      .catch((e) => {
        console.log('Quota request error: ', e);
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

    const inputTokens = [...data.selectedInputTokens];
    const outputTokens = [...data.selectedOutputTokens];
    const bus = useEventBus('odos-transaction-finished');

    try {
      const transactionData = {
        ...data.txData.transaction,
        from: rootState.accountData.account,
      };
  
      dispatch('waitingModal/showWaitingModal', 'Swapping in process', { root: true });
  
      const dataTx = await rootState.web3.evmSigner.sendTransaction(transactionData)
      await dataTx.wait();
      dispatch('waitingModal/closeWaitingModal', null, { root: true });
  
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
  
      // event
      bus.emit(true);
    } catch(e: any) {
      const err = JSON.parse(JSON.stringify(e))
      // only for bsc chain, unique logic, all successfull tx throwing it
      if (err?.error?.code === -32000) {
        bus.emit(true);
        dispatch('successModal/showSuccessModal', {
          successTxHash: "",
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
      } else {
        throw new Error(e)
      }
    }
  },
  async getActualGasPrice({
    commit, state, dispatch, rootState,
  }: any, networkId: number | string) {
    const overnightApiInstance = new OvernightApi();
    const actualGasPriceObject: any = await overnightApiInstance.getActualGasPrice(
      networkId,
    );
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
