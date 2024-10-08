/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets';

import Onboard from '@web3-onboard/core';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseWalletModule from '@web3-onboard/coinbase';

const SUPPORTED_NETWORKS = [137, 56, 10, 42161, 324, 8453, 59144, 81457];
const WALLETCONNECT_SUPPORTED_NETWORKS = [10, 42161, 8453, 56, 59144, 137, 81457];
const WC_PROJECT_ID = '8565d0b304b449e6fa65029a229c6738';

const state = {
  onboard: null,
  walletConnected: false,
};

const getters = {

  onboard(state: any) {
    return state.onboard;
  },

  walletConnected(state: any) {
    return state.walletConnected;
  },
};

const actions = {

  async initOnboard({
    commit, dispatch, rootState,
  }: any) {
    const logo = await dispatch('getLogo');
    const wallets = await dispatch('getMainWalletsConfig');
    const chains = await dispatch('getMainWalletsChains');

    const onboard = Onboard({
      // ... other Onboard options
      wallets,
      appMetadata: {
        name: 'Overnight Finance`',
        icon: logo, // svg string icon
        logo, // svg string logo
        description: 'Overnight Finance',
        agreement: {
          version: '1.0.0',
          termsUrl: 'https://docs.overnight.fi/advanced/terms-of-service',
          privacyUrl: 'https://docs.overnight.fi/advanced/privacy-policy',
        },
      },
      i18n: {
        en: {
          connect: {
            selectingWallet: {
              header: 'Available wallets',
              installWallet: 'You do not have any wallets installed that {app}',

              agreement: {
                agree: 'I assume the risk of the protocols integrated into the collateral of Overnight products, and  I have read and accept',
                terms: "Overnight's Terms of Service",
                and: 'and',
                privacy: 'Privacy Policy',
              },
            },
          },
        },
      },
      disableFontDownload: true,
      connect: {
        showSidebar: true,
        disableClose: false,
      },
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        },
      },
      notify: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        },
      } as any,
      chains,
    });

    const walletName = localStorage.getItem('walletName');
    console.log(walletName, 'walletName');
    let connectedWallets;

    if (walletName !== undefined && walletName && walletName !== 'undefined' && walletName !== 'null') {
      connectedWallets = await onboard
        .connectWallet({ autoSelect: { label: walletName, disableModals: true } });
    } else {
      connectedWallets = await onboard.connectWallet();
    }

    const wallet: any = connectedWallets[0];

    console.log(connectedWallets, 'connectedWallets');
    if (!wallet) {
      localStorage.removeItem('walletName');
      console.error('Wallet not connected when init onboard.');
      return;
    }

    console.debug('[Connect Wallet] initOnboard: ', wallet ? wallet.label : 'undefined');
    await commit('web3/setProvider', wallet.provider, { root: true });

    // Setting dapp network to the current wallet network
    if (SUPPORTED_NETWORKS.includes(Number(wallet.provider.networkVersion))) {
      await dispatch('setNetwork', wallet.provider.networkVersion);
    } else {
      await dispatch('network/setWalletNetwork', '10', { root: true });
    }

    if (rootState.web3.provider) {
      rootState.web3.provider.on('accountsChanged', async (accounts: any) => {
        dispatch('accountChanged', accounts);
      });

      rootState.web3.provider.on('chainChanged', async (newNetworkId: any) => {
        dispatch('chainChanged', newNetworkId);
      });
    }

    await dispatch('web3/initWeb3', null, { root: true }).then(async () => {
      const userAddress = wallet?.accounts[0]?.address;
      commit('setWalletConnected', true);

      if (wallet.label !== undefined && wallet.label && wallet.label !== 'undefined') {
        localStorage.setItem('walletName', wallet.label);
      }

      if (wallet.label === 'Unstoppable') {
        commit('accountData/setUns', wallet.instance.cacheOptions.getDefaultUsername(), { root: true });
      }

      dispatch('accountData/handleSwitchAccount', userAddress, { root: true });

      dispatch('checkAccount', userAddress);
    });

    commit('setOnboard', onboard);
  },

  async connectWallet({
    dispatch, getters, rootState,
  }: any) {
    if (!getters?.onboard) await dispatch('initOnboard');

    try {
      const netId = rootState.network.networkId;
      if (netId && getters.onboard) await getters.onboard.setChain({ chainId: netId });
    } catch (e) {
      await dispatch('initOnboard');
    }
  },

  async dappInitWalletConnect({
    dispatch, getters,
  }: any) {
    if (!getters.onboard) await dispatch('initOnboard');

    const walletName = localStorage.getItem('walletName');
    if (walletName !== undefined && walletName && walletName !== 'undefined') {
      await getters
        .onboard
        .connectWallet({ autoSelect: { label: walletName, disableModals: true } });
    }
  },

  async disconnectWallet({
    commit, dispatch, getters,
  }: any) {
    await commit('web3/setProvider', null, { root: true });

    if (getters.onboard) {
      try {
        const [primaryWallet] = getters.onboard.state.get().wallets;
        await getters.onboard.disconnectWallet({ label: primaryWallet.label });
        localStorage.removeItem('walletName');

        await dispatch('web3/initWeb3', null, { root: true }).then(() => {
          commit('setWalletConnected', false);
          dispatch('checkAccount');
        });
      } catch (e) {
        console.log('Disconnect wallet error', e);
      }
    }
  },

  async getMainWalletsChains() {
    return [

      {
        id: 42161, // = 42161
        // id: "0xA4B1",  // = 42161
        token: 'ETH',
        label: 'Arbitrum',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
      },
      {
        id: 10, // = 10
        // id: "0xA",  // = 10
        token: 'ETH',
        label: 'Optimism',
        rpcUrl: 'https://optimism.llamarpc.com',
      },
      {
        id: 324, // = 324
        // id: "0x144",  // = 324
        token: 'ETH',
        label: 'ZkSync',
        rpcUrl: 'https://mainnet.era.zksync.io',
      },
      // {
      //   id: 81457,
      //   token: 'ETH',
      //   label: 'Blast',
      //   rpcUrls: 'https://blast.gasswap.org',
      // },
      {
        id: 56, // = 56
        // id: "0x38",  // = 56
        token: 'BNB',
        label: 'BSC',
        rpcUrl: 'https://bsc-dataseed.binance.org',
      },
      {
        id: 137, // = 137
        // id: "0x89",  // = 137
        token: 'MATIC',
        label: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com/',
      },
      {
        id: 8453,
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://mainnet.base.org/',
      },
      {
        id: 59144,
        token: 'ETH',
        label: 'Linea',
        rpcUrl: 'https://linea.drpc.org',
      },
      // ... other chains
    ];
  },

  async getWalletsFilter() {
    return {
      [ProviderLabel.Detected]: 'desktop',
    };
  },

  async getMainWalletsConfig({ dispatch }: any) {
    const injected = injectedModule({
      filter: await dispatch('getWalletsFilter'),
      sort: (wallets) => {
        const metaMask = wallets.find(({ label }) => label === ProviderLabel.MetaMask);
        const coinbase = wallets.find(({ label }) => label === ProviderLabel.Coinbase);
        const rabby = wallets.find(({ label }) => label === ProviderLabel.Rabby);
        const detected = wallets.find(({ label }) => label === ProviderLabel.Detected);
        return (
          [
            metaMask,
            coinbase,
            rabby,
            detected,
          ]
          // remove undefined values
            .filter((wallet) => wallet)
        ) as any;
      },
      walletUnavailableMessage: (wallet) => `Oops ${wallet.label} is unavailable!`,

    });

    const walletConnect = walletConnectModule({
      version: 2,
      projectId: WC_PROJECT_ID, // ***New Param* Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
      // connectFirstChainId: true,
      requiredChains: [WALLETCONNECT_SUPPORTED_NETWORKS[0]], // get first chain
      optionalChains: SUPPORTED_NETWORKS, // chains optional to be supported by WC wallet 0xA4B1,
      dappUrl: 'https://app.overnight.fi',
    });

    const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });

    return [
      injected,
      walletConnect,
      coinbaseWalletSdk,
      // ... other wallets
    ].filter(
      (wallet: any) => wallet.label !== 'Argent' && wallet.label !== 'Phantom',
    );
  },

  async setNetwork({
    commit, dispatch, rootState,
  }: any, newNetworkId: any) {
    {
      newNetworkId = parseInt(newNetworkId);

      if (SUPPORTED_NETWORKS.includes(newNetworkId)) {
        dispatch('network/saveNetworkToLocalStore', newNetworkId.toString(), { root: true });
        dispatch('network/changeDappNetwork', newNetworkId.toString(), { root: true });

        if (rootState.network.networkId === newNetworkId) {
          commit('network/setSwitchToOtherNetwork', false, { root: true });
        }

        dispatch('dappDataAction/updateUserData', null, { root: true });
      } else {
        commit('network/setSwitchToOtherNetwork', true, { root: true });
      }
    }
  },

  async chainChanged({
    dispatch,
  }: any, newNetworkId: any) {
    try {
      dispatch('setNetwork', newNetworkId);
    } catch (e) {
      console.error('Error when on chainChanged');
    }
  },

  async accountChanged({
    dispatch, rootState,
  }: any, accounts: any) {
    try {
      dispatch('checkAccount', accounts[0]);
      dispatch('setNetwork', rootState.network.networkId);
    } catch (e) {
      console.error('Error when on accountsChanged');
    }
  },

  async checkAccount({
    commit, dispatch, getters, rootState,
  }: any, account: any) {
    if (getters.walletConnected && rootState.web3.provider) {
      if (!account) {
        try {
          const selectedAdd = rootState.web3.provider.selectedAddress;
          account = selectedAdd;
        } catch (e: any) {
          if (e && e.message && e.message.indexOf('disconnected') !== -1) {
            commit('setWalletConnected', false);
          }

          return;
        }
      }

      dispatch('accountData/handleSwitchAccount', account, { root: true });

      if (account) {
        dispatch('dappDataAction/updateUserData', null, { root: true });
      }
    } else {
      dispatch('accountData/handleSwitchAccount', null, { root: true });
      dispatch('insuranceData/refreshInsurance', null, { root: true });
    }
  },

  async getLogo() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">/n'
            + '<path fill-rule="evenodd" clip-rule="evenodd" d="M24.339 7.66102H9.28814V4H24.339C26.3608 4 27.9998 5.63889 28 7.66064H24.339L24.339 7.66102ZM24.339 8.88136V24.339L24.339 24.3394L24.339 28C26.3609 28 28 26.3609 28 24.339L28 9.28776H24.339L24.339 8.88136ZM23.1186 24.339V24.3394H22.7119V28H7.66102C5.63909 28 4 26.3609 4 24.339H7.66102H23.1186ZM7.66102 4V7.66102V22.7119H4V7.66102C4 5.63909 5.63909 4 7.66102 4Z" fill="url(#paint0_linear_8985_99599)"/>/n'
            + '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6827 11.3223C15.2961 11.3223 14.9827 11.6357 14.9827 12.0223V14.5764L12.4285 14.5764C12.0419 14.5764 11.7285 14.8898 11.7285 15.2764V16.3171C11.7285 16.7037 12.0419 17.0171 12.4285 17.0171H14.9827V19.5714C14.9827 19.958 15.2961 20.2714 15.6827 20.2714H16.7234C17.11 20.2714 17.4234 19.958 17.4234 19.5714V17.0171H19.9777C20.3643 17.0171 20.6777 16.7037 20.6777 16.3171V15.2764C20.6777 14.8898 20.3643 14.5764 19.9777 14.5764L17.4234 14.5764V12.0223C17.4234 11.6357 17.11 11.3223 16.7234 11.3223H15.6827Z" fill="url(#paint1_linear_8985_99599)"/>/n'
            + '<defs>/n'
            + '<linearGradient id="paint0_linear_8985_99599" x1="4" y1="4" x2="28.5149" y2="4.53805" gradientUnits="userSpaceOnUse">/n'
            + '<stop stop-color="#28A0F0"/>/n'
            + '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>/n'
            + '</linearGradient>/n'
            + '<linearGradient id="paint1_linear_8985_99599" x1="11.7285" y1="11.3223" x2="20.8697" y2="11.5229" gradientUnits="userSpaceOnUse">/n'
            + '<stop stop-color="#28A0F0"/>/n'
            + '<stop offset="1" stop-color="#0678C4" stop-opacity="0.9917"/>/n'
            + '</linearGradient>/n'
            + '</defs>/n'
            + '</svg>';
  },
};

const mutations = {
  setOnboard(state: any, value: any) {
    state.onboard = value;
  },

  setWalletConnected(state: any, walletConnected: boolean) {
    state.walletConnected = walletConnected;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
