import { ethers } from 'ethers';

/* eslint-disable no-unused-vars */
const POLYGON_PARAMS = {
  appApiUrl: 'https://api.overnight.fi/root',
  networkName: 'polygon',
  networkId: 137,
  rpcUrl: 'https://polygon-rpc.com/',
  explorerUrl: 'https://polygonscan.com/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'MATIC',
  bridgeLink: 'https://router.via.exchange/polygon/USD+/bsc/USD+',
  networkColor: '#7B3FE4',
  isDeprecated: true,
};

const BSC_PARAMS = {
  appApiUrl: 'https://bsc.overnight.fi/api',
  networkName: 'bsc',
  networkId: 56,
  rpcUrl: 'https://bsc-dataseed.binance.org',
  explorerUrl: 'https://bscscan.com/',
  assetName: 'USDC',
  assetDecimals: 18,
  nativeAssetName: 'BNB',
  bridgeLink: 'https://router.via.exchange/bsc/USD+/optimism/USD+',
  networkColor: '#F3BA2F',
  isDeprecated: false,
};

const OPTIMISM_PARAMS = {
  appApiUrl: 'https://op.overnight.fi/api',
  networkName: 'optimism',
  networkId: 10,
  rpcUrl: 'https://optimism.llamarpc.com',
  explorerUrl: 'https://optimistic.etherscan.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/optimism/USD+/bsc/USD+',
  networkColor: '#FF0420',
  isDeprecated: false,
};

const ARBITRUM_PARAMS = {
  appApiUrl: 'https://arbitrum.overnight.fi/api',
  networkName: 'arbitrum',
  networkId: 42161,
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  explorerUrl: 'https://arbiscan.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/arbitrum/USD+/bsc/USD+',
  networkColor: '#29A0F0',
  isDeprecated: false,
};

const ZKSYNC_PARAMS = {
  appApiUrl: 'https://zksync.overnight.fi/api',
  networkName: 'zksync',
  networkId: 324,
  rpcUrl: 'https://mainnet.era.zksync.io', // 'https://zksync2-testnet.zksync.dev', //https://mainnet.era.zksync.io',
  explorerUrl: 'https://explorer.zksync.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/zksync/USD+/bsc/USD+',
  networkColor: '#8B8DFC',
  isDeprecated: false,
};

const BASE_PARAMS = {
  appApiUrl: 'https://base.overnight.fi/api',
  networkName: 'base',
  networkId: 8453,
  rpcUrl: 'https://base.drpc.org',
  explorerUrl: 'https://basescan.org/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://bridge.base.org/',
  networkColor: '#0052ff',
  isDeprecated: false,
};

const LINEA_PARAMS = {
  appApiUrl: 'https://linea.overnight.fi/api',
  networkName: 'linea',
  networkId: 59144,
  rpcUrl: 'https://linea.drpc.org',
  explorerUrl: 'https://lineascan.build/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://bridge.linea.build/',
  networkColor: '#5fdfff',
  isDeprecated: false,
};

const BLAST_PARAMS = {
  appApiUrl: 'https://blast.overnight.fi/api',
  networkName: 'blast',
  networkId: 81457,
  rpcUrl: 'https://blast.gasswap.org',
  explorerUrl: 'https://blastscan.io/',
  assetName: 'USDB',
  assetDecimals: 18,
  nativeAssetName: 'ETH',
  bridgeLink: '',
  networkColor: '#fff561',
  isDeprecated: false,
};

const dbNetworkName = localStorage.getItem('selectedNetwork');

export function getNetworkParams(networkName: string | number | null) {
  switch (networkName) {
    case 'blast':
    case '81457':
    case 81457:
      return BLAST_PARAMS;
    case 'polygon':
    case 'polygon_dev':
    case '137':
    case 137:
    case '31337':
    case 31337:
      return POLYGON_PARAMS;
    case 'bsc':
    case '56':
    case 56:
      return BSC_PARAMS;
    case 'op':
    case 'optimism':
    case '10':
    case 10:
      return OPTIMISM_PARAMS;
    case 'ar':
    case 'arbitrum':
    case '42161':
    case 42161:
      return ARBITRUM_PARAMS;
    case 'zk':
    case 'zksync':
    case '324':
    case 324:
      return ZKSYNC_PARAMS;
    case 'base':
    case 'bs':
    case '8453':
    case 8453:
      return BASE_PARAMS;
    case 'linea':
    case 'ln':
    case '59144':
    case 59144:
      return LINEA_PARAMS;
    default:
      return OPTIMISM_PARAMS; // BASE_PARAMS;
  }
}

const state = {
  appApiUrl: getNetworkParams(dbNetworkName).appApiUrl,
  apiUrl: 'https://api.overnight.fi',
  networkName: getNetworkParams(dbNetworkName).networkName,
  networkId: getNetworkParams(dbNetworkName).networkId,
  rpcUrl: getNetworkParams(dbNetworkName).rpcUrl,
  explorerUrl: getNetworkParams(dbNetworkName).explorerUrl,
  assetName: getNetworkParams(dbNetworkName).assetName,
  assetDecimals: getNetworkParams(dbNetworkName).assetDecimals,
  nativeAssetName: getNetworkParams(dbNetworkName).nativeAssetName,
  bridgeLink: getNetworkParams(dbNetworkName).bridgeLink,
  networkColor: getNetworkParams(dbNetworkName).networkColor,
  isDeprecated: getNetworkParams(dbNetworkName).isDeprecated,

  polygonApi: POLYGON_PARAMS.appApiUrl,
  bscApi: BSC_PARAMS.appApiUrl,
  opApi: OPTIMISM_PARAMS.appApiUrl,
  arApi: ARBITRUM_PARAMS.appApiUrl,
  zkApi: ZKSYNC_PARAMS.appApiUrl,
  baseApi: BASE_PARAMS.appApiUrl,
  lineaApi: LINEA_PARAMS.appApiUrl,

  polygonConfig: POLYGON_PARAMS,
  bscConfig: BSC_PARAMS,
  opConfig: OPTIMISM_PARAMS,
  arConfig: ARBITRUM_PARAMS,
  zkConfig: ZKSYNC_PARAMS,
  baseConfig: BASE_PARAMS,
  lineaConfig: LINEA_PARAMS,
  allNetworkConfigs: [
    OPTIMISM_PARAMS,
    ARBITRUM_PARAMS,
    ZKSYNC_PARAMS,
    BASE_PARAMS,
    LINEA_PARAMS,
    BSC_PARAMS,
    POLYGON_PARAMS,
    BLAST_PARAMS,
  ],

  switchToOtherNetwork: false,
  marketNetwork: 'arbitrum',
  marketExplorerURL: 'https://arbiscan.io/',
  insuranceNetwork: 'arbitrum',
  dashboardNetwork: 'arbitrum',
  accountModalNetwork: 'arbitrum',
  ovnNetwork: 'base',
  insuranceExplorerURL: 'https://optimistic.etherscan.io/',
  dashboardExplorerURL: 'https://arbiscan.io/',
  ovnExplorerURL: 'https://basescan.org/',
  showDeprecated: false,
};

const getters = {
  isShowDeprecated(state: any) {
    return state.showDeprecated;
  },

  appApiUrl(state: any) {
    return state.appApiUrl;
  },

  apiUrl(state: any) {
    return state.apiUrl;
  },

  networkName(state: any) {
    return state.networkName;
  },

  networkId(state: any) {
    return state.networkId;
  },

  rpcUrl(state: any) {
    return state.rpcUrl;
  },

  explorerUrl(state: any) {
    return state.explorerUrl;
  },

  assetName(state: any) {
    return state.assetName;
  },

  nativeAssetName(state: any) {
    return state.nativeAssetName;
  },

  networkColor(state: any) {
    return state.networkColor;
  },

  isDeprecated(state: any) {
    return state.isDeprecated;
  },

  bridgeLink(state: any) {
    return state.bridgeLink;
  },

  assetDecimals(state: any) {
    return state.assetDecimals;
  },

  polygonApi(state: any) {
    return state.polygonApi;
  },

  bscApi(state: any) {
    return state.bscApi;
  },

  baseApi(state: any) {
    return state.baseApi;
  },

  lineaApi(state: any) {
    return state.lineaApi;
  },

  opApi(state: any) {
    return state.opApi;
  },

  arApi(state: any) {
    return state.arApi;
  },

  switchToOtherNetwork(state: any) {
    return state.switchToOtherNetwork;
  },

  polygonConfig(state: any) {
    return state.polygonConfig;
  },

  bscConfig(state: any) {
    return state.bscConfig;
  },

  baseConfig(state: any) {
    return state.baseConfig;
  },

  lineaConfig(state: any) {
    return state.lineaConfig;
  },

  opConfig(state: any) {
    return state.opConfig;
  },

  arConfig(state: any) {
    return state.arConfig;
  },

  zkConfig(state: any) {
    return state.zkConfig;
  },

  allNetworkConfigs(state: any) {
    return state.allNetworkConfigs;
  },

  getParams: () => (networkName: any) => getNetworkParams(networkName),
};

const actions = {
  showDeprecated({ commit, state }: any) {
    commit('setShowDepracated', !state.showDeprecated);
  },
  changeDappNetwork({
    commit, dispatch,
  }: any, networkName: any) {
    commit('setAppApiUrl', getNetworkParams(networkName).appApiUrl);
    commit('setNetworkName', getNetworkParams(networkName).networkName);
    commit('setNetworkId', getNetworkParams(networkName).networkId);
    commit('setRpcUrl', getNetworkParams(networkName).rpcUrl);
    commit('setExplorerUrl', getNetworkParams(networkName).explorerUrl);
    commit('setAssetName', getNetworkParams(networkName).assetName);
    commit('setAssetDecimals', getNetworkParams(networkName).assetDecimals);
    commit('setNativeAssetName', getNetworkParams(networkName).nativeAssetName);
    commit('setBridgeLink', getNetworkParams(networkName).bridgeLink);
    commit('setNetworkColor', getNetworkParams(networkName).networkColor);
    commit('setIsDeprecated', getNetworkParams(networkName).isDeprecated);

    dispatch('web3/initWeb3', null, { root: true });
  },

  // TODO refactore it to array
  saveNetworkToLocalStore(network: any) {
    const networkId = `${network}`;
    switch (networkId) {
      case 'blast':
      case '81457':
        localStorage.setItem('selectedNetwork', 'blast');
        break;
      case 'polygon':
      case '137':
        localStorage.setItem('selectedNetwork', 'polygon');
        break;
      case 'bsc':
      case '56':
        localStorage.setItem('selectedNetwork', 'bsc');
        break;
      case 'op':
      case 'optimism':
      case '10':
        localStorage.setItem('selectedNetwork', 'op');
        break;
      case 'ar':
      case 'arbitrum':
      case '42161':
        localStorage.setItem('selectedNetwork', 'ar');
        break;
      case 'zk':
      case 'zksync':
      case '324':
        localStorage.setItem('selectedNetwork', 'zk');
        break;
      case 'bs':
      case 'base':
      case '8453':
        localStorage.setItem('selectedNetwork', 'base');
        break;
      case 'ln':
      case 'linea':
      case '59144':
        localStorage.setItem('selectedNetwork', 'linea');
        break;
      default:
        localStorage.setItem('selectedNetwork', 'op');
        break;
    }
  },

  async setWalletNetwork({
    commit, dispatch, rootState,
  }: any, network: any) {
    if (rootState.web3.provider) {
      dispatch('saveNetworkToLocalStore', network);

      try {
        await rootState.web3.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.toQuantity(network) }],
        });

        commit('walletAction/setWalletConnected', true, { root: true });
      } catch (switchError) {
        try {
          const networkId = `${network}`;
          let params;

          switch (networkId) {
            case 'polygon':
            case 'polygon_dev':
            case '137':
              params = {
                chainId: ethers.toQuantity('137'),
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  symbol: 'MATIC',
                  name: 'MATIC',
                  decimals: 18,
                },
              };
              break;
            // blast
            case 'blast':
            case '81457':
              params = {
                chainId: ethers.toQuantity('81457'),
                rpcUrls: ['https://blast.gasswap.org'],
                blockExplorerUrls: ['https://blastscan.io/'],
                chainName: 'Blast',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            case 'bsc':
            case '56':
              params = {
                chainId: ethers.toQuantity('56'),
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/'],
                chainName: 'Smart Chain',
                nativeCurrency: {
                  symbol: 'BNB',
                  name: 'BNB',
                  decimals: 18,
                },
              };
              break;
            case 'op':
            case 'optimism':
            case '10':
              params = {
                chainId: ethers.toQuantity('10'),
                rpcUrls: ['https://optimism.llamarpc.com'],
                blockExplorerUrls: ['https://optimistic.etherscan.io/'],
                chainName: 'Optimism',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            case 'ar':
            case 'arbitrum':
            case '42161':
              params = {
                chainId: ethers.toQuantity('42161'),
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
                chainName: 'Arbitrum',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            case 'zk':
            case 'zksync':
            case '324':
              params = {
                chainId: ethers.toQuantity('324'),
                // rpcUrls: ['https://zksync2-testnet.zksync.dev'],
                rpcUrls: ['https://mainnet.era.zksync.io'],
                blockExplorerUrls: ['https://explorer.zksync.io'],
                chainName: 'ZkSync',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            case 'bs':
            case 'base':
            case '8453':
              params = {
                chainId: ethers.toQuantity('8453'),
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
                chainName: 'Base',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            case 'ln':
            case 'linea':
            case '59144':
              params = {
                chainId: ethers.toQuantity('5914'),
                rpcUrls: ['https://linea.drpc.org'],
                blockExplorerUrls: ['https://lineascan.build'],
                chainName: 'Linea',
                nativeCurrency: {
                  symbol: 'ETH',
                  name: 'ETH',
                  decimals: 18,
                },
              };
              break;
            default:
              break;
          }

          await rootState.web3.provider.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });

          commit('walletAction/setWalletConnected', true, { root: true });
        } catch (addError) {
          console.error(addError);
        }
      }
    } else {
      await dispatch('changeDappNetwork', network);
      await dispatch('walletAction/checkAccount', null, { root: true });
    }
  },

  async addTokenToWallet({ rootState }: any, {
    address, symbol, decimals, image,
  }: any) {
    const option = {
      address,
      symbol,
      decimals,
      image,
    };
    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  changeMarketNetwork({ commit }: any, network: any) {
    commit('setMarketExplorerURL', getNetworkParams(network).explorerUrl);
    commit('setMarketNetwork', network);
  },

  changeInsuranceNetwork({ commit }: any, network: any) {
    commit('setInsuranceExplorerURL', getNetworkParams(network).explorerUrl);
    commit('setInsuranceNetwork', network);
  },

  changeOvnNetwork({ commit }: any, network: any) {
    commit('setOvnExplorerURL', getNetworkParams(network).explorerUrl);
    commit('setOvnNetwork', network);
  },

  changeDashboardNetwork({ commit }: any, network: any) {
    commit('setDashboardExplorerURL', getNetworkParams(network).explorerUrl);
    commit('setDashboardNetwork', network);
  },
  changeAccountModalNetwork({ commit }: any, network: any) {
    commit('setAccountModalNetwork', network);
  },
};

const mutations = {
  setShowDepracated(state: any, value: any) {
    state.showDeprecated = value;
  },

  setAppApiUrl(state: any, value: any) {
    state.appApiUrl = value;
  },

  setNetworkName(state: any, value: any) {
    state.networkName = value;
  },

  setNetworkId(state: any, value: any) {
    state.networkId = value;
  },

  setRpcUrl(state: any, value: any) {
    state.rpcUrl = value;
  },

  setExplorerUrl(state: any, value: any) {
    state.explorerUrl = value;
  },

  setAssetName(state: any, value: any) {
    state.assetName = value;
  },

  setNativeAssetName(state: any, value: any) {
    state.nativeAssetName = value;
  },

  setNetworkColor(state: any, value: any) {
    state.networkColor = value;
  },

  setIsDeprecated(state: any, value: any) {
    state.isDeprecated = value;
  },

  setBridgeLink(state: any, value: any) {
    state.bridgeLink = value;
  },

  setAssetDecimals(state: any, value: any) {
    state.assetDecimals = value;
  },

  setSwitchToOtherNetwork(state: any, value: any) {
    state.switchToOtherNetwork = value;
  },

  setChainChanged(state: any, value: any) {
    state.chainChanged = value;
  },

  setMarketNetwork(state: any, value: any) {
    state.marketNetwork = value;
  },

  setMarketExplorerURL(state: any, value: any) {
    state.marketExplorerURL = value;
  },

  setInsuranceNetwork(state: any, value: any) {
    state.insuranceNetwork = value;
  },

  setInsuranceExplorerURL(state: any, value: any) {
    state.insuranceExplorerURL = value;
  },

  setDashboardNetwork(state: any, value: any) {
    state.dashboardNetwork = value;
  },
  setAccountModalNetwork(state: any, value: any) {
    state.accountModalNetwork = value;
  },

  setDashboardExplorerURL(state: any, value: any) {
    state.dashboardExplorerURL = value;
  },

  setOvnNetwork(state: any, value: any) {
    state.ovnNetwork = value;
  },

  setOvnExplorerURL(state: any, value: any) {
    state.ovnExplorerURL = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
