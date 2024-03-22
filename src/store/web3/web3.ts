/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import { markRaw } from 'vue';

// const SUPPORTED_NETWORKS = [137, 31337, 56, 10, 42161, 324, 8453, 59144];

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
  evmProvider(state: any) {
    return state.evmProvider;
  },
  evmSigner(state: any) {
    return state.evmSigner;
  },
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

const _subscribeToProviderEvents = async (_client: any) => {
  if (typeof _client === 'undefined') {
    throw new Error('WalletConnect is not initialized');
  }

  _client.on('display_uri', async () => {
    console.log('EVENT', 'QR Code Modal open');
  });

  // Subscribe to session ping
  _client.on('session_ping', ({ id, topic }: { id: number; topic: string }) => {
    console.log('EVENT', 'session_ping');
    console.log(id, topic);
  });

  // Subscribe to session event
  _client.on('session_event', ({ event, chainId }: { event: any; chainId: string }) => {
    console.log('EVENT', 'session_event');
    console.log(event, chainId);
  });

  // Subscribe to session update
  _client.on(
    'session_update',
    () => {
      console.log('EVENT', 'session_updated');
    },
  );

  // Subscribe to session delete
  _client.on('session_delete', ({ id, topic }: { id: number; topic: string }) => {
    console.log('EVENT', 'session_deleted');
    console.log(id, topic);
  });
};

const actions = {
  initDefaultProvider({
    commit, dispatch, getters, rootState,
  }: any) {
    const { rpcUrl } = rootState.network;

    let evmProvider;
    if (window.ethereum == null) {
      console.log('MetaMask not installed; using read-only defaults');
      evmProvider = new ethers.JsonRpcProvider(rpcUrl, 'any');
    } else {
      evmProvider = new ethers.BrowserProvider(window.ethereum, 'any');
    }

    commit('setProvider', markRaw(evmProvider));
  },

  async initCustomProvider({
    commit, dispatch, getters, rootState,
  }: any, provider: any) {
    const evmProvider = new ethers.BrowserProvider(provider, 'any');
    const signer = await evmProvider.getSigner();
    const networkData = await evmProvider.getNetwork();
    dispatch('network/saveNetworkToLocalStore', networkData.chainId.toString(), { root: true });

    // _subscribeToProviderEvents(evmProvider);
    commit('setIsProviderDefault', false);
    commit('setProvider', provider);
    commit('setEvmProvider', {
      provider: markRaw(evmProvider),
      signer: markRaw(signer),
    });
    console.log(markRaw(signer), 'CONTRACTSINIT');
    dispatch('contractAction/initContracts', markRaw(signer), { root: true });
  },

  async initWeb3({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setLoadingWeb3', true);
    // await dispatch('initDefaultProvider');

    if (getters.provider) {
      try {
        await dispatch('initCustomProvider', getters.provider);
      } catch (e) {
        console.log(e, '---error provider init');
      }
    }

    dispatch('gasPrice/refreshGasPrice', null, { root: true });
    dispatch('insuranceData/refreshInsurance', null, { root: true });

    // const networkId = await getters.web3.eth.net.getId();
    // if (!getters.isProviderDefault) {
    //   let currentWalletNetworkId = await getters.web3.eth.net.getId();
    //   // eslint-disable-next-line radix
    //   currentWalletNetworkId = parseInt(currentWalletNetworkId);

    //   if (SUPPORTED_NETWORKS.includes(currentWalletNetworkId)) {
    //     commit('network/setSwitchToOtherNetwork', false, { root: true });

    //     if (currentWalletNetworkId !== rootState.network.networkId) {
    //       dispatch('network/changeDappNetwork',
    // currentWalletNetworkId.toString(), { root: true });
    //     }
    //   } else {
    //     commit('network/setSwitchToOtherNetwork', true, { root: true });
    //   }
    // }

    commit('setLoadingWeb3', false);
  },
};

const mutations = {
  setEvmProvider(state: any, providerData: any) {
    state.evmProvider = providerData.provider;
    state.evmSigner = providerData.signer;
  },
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
