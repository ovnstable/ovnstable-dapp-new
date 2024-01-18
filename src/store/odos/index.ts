/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import odosApiService from '@/services/odos-api-service.ts';
import { loadJSON } from '@/utils/http-utils.ts';
import { getWeiMarker } from '@/utils/web3.ts';
import { useEventBus } from '@vueuse/core';
import {
  getFilteredOvernightTokens,
  getFilteredPoolTokens,
  loadBalance,
  loadContractInstance
} from './helpers.ts';
import { getNetworkParams } from '../common/web3/network.ts';

const KEY = 'REFERRAL_CODE';

const ODOS_DURATION_CONFIRM_REQUEST = 60;

const loadPrices = async (chainId: number | string) => odosApiService
  .loadPrices(chainId)
  .then((data: any) => data.tokenPrices)
  .catch((e) => {
    console.error('Error load contract', e);
  });

export const stateData = {
  baseViewType: 'SWAP',
  isChainsLoading: false,
  isPricesLoading: false,
  isBalancesLoading: false,
  isFirstBalanceLoaded: false,
  isContractLoading: false,
  isTokenExternalDataLoading: false,

  isTokensLoading: false,
  isTokensLoadedAndFiltered: false,

  chains: null,
  tokensMap: {} as any,

  secondTokens: [] as any[],
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
  ],
  dataBeInited: false,

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

  isShowSuccessModal: false,
  isShowSuccessPoolModal: false,
  successData: {
    inputTokens: [] as any[],
    outputTokens: [] as any[],
  } as any,
  zksyncFeeHistory: {} as any,

  tokenSeparationScheme: null, // OVERNIGHT_SWAP, POOL_SWAP,
  typeOfPoolScheme: null, // OVN, ALL, null

  listOfBuyTokensAddresses: null, // for POOL_SWAP scheme
  odosReferalCode: 7777777,

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
    return !state.isChainsLoading && !state.isTokensLoading;
  },
  isShowDecreaseAllowance(state: typeof stateData, getters: any, rootState: any) {
    return (
      state.isShowDecreaseAllowanceButton
      && rootState?.account === '0x4473D652fb0b40b36d549545e5fF6A363c9cd686'
    ); // test front dev address
  },
  isAvailableOnNetwork(state: typeof stateData, getters: any, rootState: any) {
    return state.availableNetworksList.includes(rootState?.network?.networkName);
  },
  secondTokensSelectedCount(state: typeof stateData) {
    return state.secondTokens.filter((item: any) => item.selected).length;
  },
  tokensSelectedCount(state: typeof stateData) {
    return state.tokens.filter((item: any) => item.selected).length;
  },
  stablecoinSecondTokens(state: typeof stateData) {
    return state.secondTokens.filter((item: any) => item.assetType === 'usd');
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
  tokensToBalanceUpdate(state: typeof stateData, getters: any) {
    if (state.baseViewType === 'SWIPE') {
      return [...getters.stablecoinTokens, ...getters.stablecoinSecondTokens];
    }

    return [...state.secondTokens, ...state.tokens];
  },
};

const actions = {
  async loadChains({
    commit, state,
  }: any) {
    if (state.isChainsLoading) {
      return;
    }

    console.log('loadChains');
    commit('changeState', { field: 'isChainsLoading', val: true });

    odosApiService
      .loadChains()
      .then((data: any) => {
        commit('changeState', { field: 'chains', val: data.chains });
        commit('changeState', { field: 'isChainsLoading', val: false });
        console.log(state, 'loadChains');
      })
      .catch((e) => {
        console.log('Error load chains', e);
        commit('changeState', { field: 'isChainsLoading', val: false });
      });
  },
  async loadTokens({
    commit, state,
  }: any) {
    if (state.isTokensLoading) {
      return;
    }

    commit('changeState', { field: 'isTokensLoading', val: true });
    odosApiService
      .loadTokens()
      .then((data) => {
        commit('changeState', { field: 'tokensMap', val: data });
        commit('changeState', { field: 'isTokensLoading', val: false });
      })
      .catch((e) => {
        console.log('Error load tokens', e);
        commit('changeState', { field: 'isTokensLoading', val: false });
      });
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
    console.log(data, '----datainitData1');
    dispatch('clearInputData');

    console.log(data, '----datainitData');
    if (!data.tokenSeparationScheme) {
      console.error('Not found separation scheme, when init data.');
      commit('changeState', { field: 'isTokensLoadedAndFiltered', val: true });
      return;
    }

    if (!getters.isAvailableOnNetwork) {
      console.info(
        'Swap init not available on this network.',
      );
      commit('changeState', { field: 'isTokensLoadedAndFiltered', val: true });
      return;
    }

    if (data.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
      console.log('initOvernightSwap');
      dispatch('initOvernightSwap');
      return;
    }

    if (data.tokenSeparationScheme === 'POOL_SWAP') {
      dispatch('initPoolSwap', data.listOfBuyTokensAddresses);
      return;
    }

    console.error('TOKEN SEPARATION SCHEME NOT FOUND', data.tokenSeparationScheme);
  },
  async initPoolSwap({
    commit, state, dispatch, rootState,
  }: any, listOfBuyTokensAddresses: any) {
    if (!listOfBuyTokensAddresses || !listOfBuyTokensAddresses.length) {
      console.error(
        'List of buy token addresses must be included in initialisation POOL_SWAP scheme.',
      );
      return;
    }

    console.log('init pool swap data for network: ');
    const { networkId } = getNetworkParams(rootState.network.networkName);
    // state.tokens = await state.getFilteredPoolTokens(networkId, false, listOfBuyTokensAddresses);
    await commit('changeState', {
      field: 'tokens',
      val: await getFilteredPoolTokens(
        networkId,
        false,
        [],
        true,
        state,
      )
    });
    await commit('changeState', {
      field: 'secondTokens',
      val: await getFilteredPoolTokens(
        networkId,
        true,
        listOfBuyTokensAddresses,
        false,
        state,
      )
    });
    state.isTokensLoadedAndFiltered = true;

    dispatch('loadPricesInfo', networkId);
    dispatch('initAccountData');
  },
  async initOvernightSwap({
    commit, state, dispatch, rootState,
  }: any) {
    const { networkId } = getNetworkParams(rootState.network.networkName);
    console.log(await getFilteredOvernightTokens(state, networkId, false), '-test');
    await commit('changeState', { field: 'tokens', val: await getFilteredOvernightTokens(state, networkId, false) });
    await commit('changeState', { field: 'secondTokens', val: await getFilteredOvernightTokens(state, networkId, true) });
    state.isTokensLoadedAndFiltered = true;

    dispatch('loadPricesInfo', networkId);
    dispatch('initAccountData');
  },
  async initAccountData({
    commit, state, dispatch, rootState,
  }: any) {
    if (rootState.accountData.account) {
      const ERC20 = await loadJSON('/contracts/ERC20.json');
      dispatch('loadContractsForTokens', ERC20);
      dispatch('loadBalances');
    }
  },
  loadContractsForTokens({
    commit, state, getters, rootState,
  }: any, contractFile: any) {
    for (let i = 0; i < state.secondTokens.length; i++) {
      const secondtoken: any = state.secondTokens[i];
      state.tokensContractMap[secondtoken.address] = loadContractInstance(
        contractFile,
        rootState.web3.web3,
        secondtoken.address,
      );
    }

    for (let i = 0; i < state.tokens.length; i++) {
      const token: any = state.tokens[i];
      state.tokensContractMap[token.address] = loadContractInstance(
        contractFile,
        rootState.web3.web3,
        token.address,
      );
    }
  },
  // initUpdateBalancesInterval() {
  //   setTimeout(() => {
  //     state.updateBalancesIntervalId = setInterval(async () => {
  //       await state.loadBalances();
  //     }, 30000);
  //   }, 30000);
  // },

  async updateDirectBalances({
    commit, state, dispatch, rootState,
  }: any, addresses: string[]) {
    state.isBalancesLoading = true;
    try {
      let tokens = [...state.secondTokens, ...state.tokens];

      // filter unique tokens by address
      tokens = tokens.filter(
        (token: any, index, self) => index === self
          .findIndex((t: any) => t.address === token.address),
      );

      for (let i = 0; i < tokens.length; i++) {
        const token: any = tokens[i];
        if (addresses.includes(token.address)) {
          // eslint-disable-next-line no-await-in-loop
          token.balanceData = await loadBalance(
            rootState,
            {
              contract: state.tokensContractMap[token.address],
              token
            }
          );
        }
      }
    } catch (e) {
      console.error('Error when update direct balance', e);
    } finally {
      state.isBalancesLoading = false;
    }
  },

  async loadBalances({
    commit, state, getters, rootState, dispatch,
  }: any) {
    if (state.isBalancesLoading) {
      return;
    }

    state.isBalancesLoading = true;
    if (!rootState.accountData.account) {
      state.isBalancesLoading = false;
      return;
    }

    try {
      const tokens = getters.tokensToBalanceUpdate;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        // eslint-disable-next-line no-await-in-loop
        token.balanceData = await loadBalance(
          rootState,
          {
            contract: state.tokensContractMap[token.address],
            token
          }
        );
      }
    } catch (e) {
      console.error('Error when load balance', e);
    } finally {
      state.isBalancesLoading = false;
      if (!state.isFirstBalanceLoaded) {
        state.isFirstBalanceLoaded = true;
      }
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

    console.log(rootState, '-----rootState');
    const { networkId } = getNetworkParams(rootState.network.networkName);
    dispatch('loadContract', networkId);
    // .then(() => {
    //     console.log("Contracts loaded", state.routerContract, state.executorContract);
    // })
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
        console.log(data, '--data');
        commit('changeState', { field: 'contractData', val: data });
        commit('changeState', {
          field: 'routerContract',
          val: loadContractInstance(
            data.routerAbi,
            rootState.web3.web3,
            data.routerAddress,
          )
        });
        commit('changeState', {
          field: 'executorContract',
          val: loadContractInstance(
            data.erc20Abi,
            rootState.web3.web3,
            data.executorAddress,
          )
        });
        commit('changeState', { field: 'isContractLoading', val: false });
      })
      .catch((e) => {
        console.log('Error load contract', e);
        commit('changeState', { field: 'isContractLoading', val: false });
      });
  },
  loadPricesInfo({
    commit, state, dispatch, rootState,
  }: any, chainId: string | number) {
    if (state.isPricesLoading) {
      return;
    }

    commit('changeState', { field: 'isPricesLoading', val: true });

    loadPrices(chainId)
      .then((tokenPricesMap) => {
        const tokens = [...state.secondTokens, ...state.tokens];
        for (let i = 0; i < tokens.length; i++) {
          const token: any = tokens[i];
          token.price = tokenPricesMap[token.address];
          try {
            token.estimatePerOne = rootState.web3.web3.utils.fromWei(
              '1',
              getWeiMarker(token.decimals),
            );
          } catch (e) {
            console.error(
              'token.estimatePerOne error',
              token.estimatePerOne,
              e,
            );
          }
          // console.log("token.price", token.price);
        }

        commit('changeState', { field: 'isPricesLoading', val: false });
      })
      .catch((e) => {
        console.error('Error when load prices info', e);
        commit('changeState', { field: 'isPricesLoading', val: false });
      });
  },
  clearInputData({
    commit, state, dispatch, rootState,
  }: any) {
    commit('changeState', { field: 'tokens', val: [] });
    commit('changeState', { field: 'secondTokens', val: [] });
  },

  assembleRequest(requestData: any) {
    return odosApiService
      .assembleRequest(requestData)
      .then((data) => data)
      .catch((e) => {
        console.log('Assemble request error: ', e);
      });
  },
  swapRequest({
    commit, state, dispatch, rootState,
  }: any, requestData: any) {
    return odosApiService
      .quoteRequest(requestData)
      .then((data) => {
        console.log('Response data for odos swap request: ', data);
        commit('changeState', { field: 'swapResponseInfo', val: data });
        return data;
      })
      .catch((e) => {
        console.log('Swap request error: ', e);
        dispatch('waitingModal/closeWaitingModal');
        if (e && e.message && e.message.includes('path')) {
          dispatch('waitingModal/showErrorModalWithMsg', { errorType: 'odos-path', errorMsg: e });
          return;
        }

        dispatch('waitingModal/showErrorModalWithMsg', { errorType: 'odos', errorMsg: e });
      });
  },
  oldSwapRequest({
    commit, state, dispatch, rootState,
  }: any, requestData: any) {
    return odosApiService
      .swapRequest(requestData)
      .then((data) => {
        console.log('Response data for odos swap request: ', data);
        commit('changeState', { field: 'swapResponseInfo', val: data });
        return data;
      })
      .catch((e) => {
        console.log('Swap request error: ', e);
        dispatch('waitingModal/closeWaitingModal');
        dispatch('waitingModal/showErrorModalWithMsg', { errorType: 'odos', errorMsg: e });
      });
  },

  getTokenByAddress({
    commit, state, dispatch, rootState,
  }: any, address: string) {
    const tokens: any = [...state.secondTokens, ...state.tokens];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      console.log('Find tokens: ', token);
      if (token.address === address) {
        return token;
      }
    }

    return null;
  },

  quoteRequest({
    commit, state, dispatch, rootState,
  }: any, requestData: any) {
    return odosApiService
      .quoteRequest(requestData)
      .then((data) => {
        console.log('Response data for odos quota request: ', data);
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
    dispatch('waitingModal/closeWaitingModal');
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
      console.log('OdosSwap state.account: ', rootState.accountData.account);
      const weiBalance = await rootState.web3.web3.eth.getBalance(rootState.accountData.account);
      const balance = rootState.web3.web3.utils.fromWei(weiBalance);
      console.log(
        'OdosSwap Balance from eth token',
        balance,
        balance * 1854.91,
      );

      // 'gasPrice', 'gasPriceGwei', 'gasPriceStation'
      // console.log(
      //   'OdosSwap Get gasPrice ',
      //   rootState.accountData.gasPrice,
      //   state.gasPrice * 1854.91,
      // );
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

    await rootState.web3.web3.eth.estimateGas(transactionData, (error: any, gasLimit: any) => {
      if (error) {
        console.error('OdosSwap Error estimating gas:', error);
      } else {
        console.log('OdosSwap estimating gasLimit:', gasLimit);
        rootState.web3.web3.eth.getGasPrice().then((gasPrice: any) => {
          console.log('OdosSwap estimating gasPrice:', gasPrice);
          const feeInWei = gasLimit * 262500000;
          console.log('OdosSwap estimating feeInWei:', feeInWei);
          const feeInEther = rootState.web3.web3.utils.fromWei(
            feeInWei.toString(),
            'ether',
          );
          console.log(
            'OdosSwap Estimated transaction fee in Ether:',
            feeInEther,
            feeInEther * 1854.91,
          );
          commit('changeState', {
            field: 'zksyncFeeHistory',
            val: {
              ...state.zksyncFeeHistory,
              estimateFeeInEther: feeInEther,
            }
          });
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
    console.log({
      message: 'Odos init transaction data',
      swapSession: state.swapSessionId,
      data: data.txData,
    });

    if (!state.routerContract || !state.executorContract) {
      console.log({
        message:
            'Init wallet transactions failed, odos contracts not found. txData: ',
        swapSession: state.swapSessionId,
        data: data.txData,
      });
      return;
    }

    dispatch('startSwapConfirmTimer');

    const transactionData = {
      ...data.txData.transaction,
      from: rootState.accountData.account,
    };

    if (rootState.network.networkName === 'zksync') {
      await dispatch('addedZkSyncGasHistoryData', transactionData);
    }

    dispatch('waitingModal/showWaitingModal', 'Swapping in process');

    const txLogMessage = console.log({
      message: 'Odos send transaction',
      swapSession: state.swapSessionId,
      data: transactionData,
      log: ` | Current block: ${await rootState.web3.web3.eth.getBlockNumber()}`,
    });
    console.debug(txLogMessage);
    const result = rootState.web3.web3.eth
      .sendTransaction(transactionData)
      .then(async (dataTx: any) => {
        console.log('Call result: ', dataTx);

        console.log({
          message: 'Odos response from transaction',
          swapSession: state.swapSessionId,
          data: dataTx,
        });
        dispatch('waitingModal/closeWaitingModal');

        if (rootState.network.networkName === 'zksync' && state.zksyncFeeHistory) {
          try {
            // get balance from eth token
            console.log('state.account after tx: ', rootState.accountData.account);
            const weiBalance = await rootState.web3.web3.eth
              .getBalance(rootState.accountData.account);
            const balance = rootState.web3.web3.utils.fromWei(weiBalance);
            console.log(
              'Balance from eth token after tx',
              balance,
            );
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
        const addressesToUpdate = [...inputTokens, ...outputTokens].map(
          (item) => item.selectedToken.address,
        );

        dispatch(
          'showSuccessModal',
          true,
          inputTokens,
          outputTokens,
          data.txData.transactionHash,
          data.txData,
        );
        // event
        const bus = useEventBus('odos-transaction-finished');
        bus.emit(true);

        dispatch('stopSwapConfirmTimer');

        setTimeout(() => {
          dispatch('updateDirectBalances', addressesToUpdate);
        }, 2000);
      })
      .catch((e: any) => {
        console.log(e);
        dispatch('stopSwapConfirmTimer');
      });
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
  showSuccessModal(
    {
      commit, state, dispatch, rootState,
    }: any,
    data: {
      isShow: any,
      inputTokens: any,
      outputTokens: any,
      hash: any,
      txData: any,
    }
  ) {
    commit('changeState', {
      field: 'successData',
      val: {
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        hash: data.hash,
        chain: rootState.network.networkId,
        zksyncFeeHistory: state.zksyncFeeHistory,
        txData: data.txData,
      }
    });

    commit('changeState', { field: 'isShowSuccessModal', val: data.isShow });

    if (!data.isShow) {
      commit('changeState', { field: 'zksyncFeeHistory', val: null });
      commit('changeState', { field: 'successData', val: null });
    }
  },

  showSuccessPoolModal(
    {
      commit, state, dispatch, rootState,
    }: any,
    data: {
      isShow: any,
      inputTokens: any,
      outputTokens: any,
      hash: string,
      putIntoPoolEvent: any,
      returnedToUserEvent: any,
      pool: any,
    }
  ) {
    commit('changeState', {
      field: 'successData',
      val: {
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        hash: data.hash,
        chain: rootState.network.networkId,
        putIntoPoolEvent: data.putIntoPoolEvent,
        returnedToUserEvent: data.returnedToUserEvent,
        pool: data.pool,
      }
    });
    commit('changeState', { field: 'isShowSuccessPoolModal', val: data.isShow });
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
