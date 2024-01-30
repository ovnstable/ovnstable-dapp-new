/* eslint-disable no-unused-vars */
import Web3 from 'web3';
import { ethers } from 'ethers';

const SUPPORTED_NETWORKS = [137, 31337, 56, 10, 42161, 324, 8453, 59144];

const state = {
  contracts: null,
  web3: null,
  provider: null,
  evmProvider: null,
  evmSigner: null,

  loadingWeb3: true,
  isProviderDefault: true,
};

const getters = {
  provider(state: any) {
    return state.provider;
  },

  web3(state: any) {
    return state.web3;
  },

  contracts(state: any) {
    return state.contracts;
  },

  loadingWeb3(state: any) {
    return state.loadingWeb3;
  },

  isProviderDefault(state: any) {
    return state.isProviderDefault;
  },
};

const actions = {

  initDefaultProvider({
    commit, dispatch, getters, rootState,
  }: any) {
    const { rpcUrl } = rootState.network;

    const provider = new Web3.providers.HttpProvider(rpcUrl);
    const web3 = new Web3(provider);

    let evmProvider;
    if (window.ethereum == null) {
      console.log('MetaMask not installed; using read-only defaults');
      evmProvider = new ethers.JsonRpcProvider(rpcUrl);
    } else {
      evmProvider = new ethers.BrowserProvider(window.ethereum);
    }

    commit('setIsProviderDefault', true);
    commit('setProvider', provider);
    commit('setWeb3', web3);
  },

  async initCustomProvider({
    commit, dispatch, getters, rootState,
  }: any, provider: any) {
    const web3 = new Web3(provider);
    dispatch('network/saveNetworkToLocalStore', rootState.network.networkName, { root: true });

    commit('setIsProviderDefault', false);
    commit('setProvider', provider);
    commit('setWeb3', web3);
  },

  async initWeb3({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setLoadingWeb3', true);

    if (getters.provider === undefined || getters.provider === null || getters.isProviderDefault) {
      await dispatch('initDefaultProvider');
    } else {
      try {
        await dispatch('initCustomProvider', getters.provider);
      } catch (e) {
        await dispatch('initDefaultProvider');
      }
    }

    await dispatch('contractAction/initContracts', null, { root: true });

    dispatch('dappUIAction/updateDappPages', null, { root: true });
    dispatch('gasPrice/refreshGasPrice', null, { root: true });
    dispatch('insuranceData/refreshInsurance', null, { root: true });

    if (!getters.isProviderDefault) {
      let currentWalletNetworkId = await getters.web3.eth.net.getId();
      // eslint-disable-next-line radix
      currentWalletNetworkId = parseInt(currentWalletNetworkId);

      if (SUPPORTED_NETWORKS.includes(currentWalletNetworkId)) {
        commit('network/setSwitchToOtherNetwork', false, { root: true });

        if (currentWalletNetworkId !== rootState.network.networkId) {
          dispatch('network/changeDappNetwork', currentWalletNetworkId.toString(), { root: true });
        }
      } else {
        commit('network/setSwitchToOtherNetwork', true, { root: true });
      }
    }

    commit('setLoadingWeb3', false);
  },
};

const mutations = {
  setProvider(state: any, provider: any) {
    state.provider = provider;
  },

  setWeb3(state: any, web3: any) {
    state.web3 = web3;
  },

  setContracts(state: any, contracts: any) {
    state.contracts = contracts;
  },

  setLoadingWeb3(state: any, value: any) {
    state.loadingWeb3 = value;
  },

  setIsProviderDefault(state: any, value: any) {
    state.isProviderDefault = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
