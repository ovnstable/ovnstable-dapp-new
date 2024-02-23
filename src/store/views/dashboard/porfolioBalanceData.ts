import DashboardApiService from '@/services/dashboard-api-service.ts';
import OdosApiService from '@/services/odos-api-service.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';

const state = {
  porfolioBalanceData: {},
};

function availableChains(tokenName: string) {
  const tokenKey = `${tokenName.toLowerCase()?.slice(0, -1)}Plus`;
  if (!tokenKey) return [];
  const availableNetworks = Object.entries(chainContractsMap)
    .reduce((acc, [network, tokens]: any) => {
      if ((tokenKey in tokens) && tokens[tokenKey].tokenPlus) {
        acc.push(network.charAt(0).toLowerCase() + network.slice(1));
      }
      return acc;
    }, [] as string[]);

  return availableNetworks;
}

function getTokenPrices(apiResponse: any, contractsMap: any) {
  const prices = {};
  const contracts = contractsMap.arbitrum;

  Object.keys(contracts).forEach((token) => {
    if (token.endsWith('Plus')) {
      const contractInfo = contracts[token];
      if (apiResponse.tokenPrices[contractInfo.tokenPlus]) {
        (prices as any)[token] = apiResponse.tokenPrices[contractInfo.tokenPlus];
      }
    }
  });

  return prices;
}

const actions = {
  async fetchBalanceData({ commit }: any, { account, networkName }: any) {
    try {
      let dataUSDPlus = [];
      let dataETHPlus = [];
      let dataDAIPlus = [];
      let dataUSDTPlus = [];
      const pricesResponse = await OdosApiService.loadPrices(42161);
      const prices = getTokenPrices(pricesResponse, chainContractsMap);
      if (availableChains('usd+').includes(networkName)) {
        dataUSDPlus = await DashboardApiService.loadBalanceChange(networkName, 'usd+', account);
      }
      if (availableChains('eth+').includes(networkName)) {
        dataETHPlus = await DashboardApiService.loadBalanceChange(networkName, 'eth+', account, 'ETH');
      }
      if (availableChains('dai+').includes(networkName)) {
        dataDAIPlus = await DashboardApiService.loadBalanceChange(networkName, 'dai+', account, 'DAI');
      }
      if (availableChains('usdt+').includes(networkName)) {
        dataUSDTPlus = await DashboardApiService.loadBalanceChange(networkName, 'usdt+', account, 'USDT');
      }
      const combinedData = {
        dataUSDPlus,
        dataETHPlus,
        dataDAIPlus,
        dataUSDTPlus,
        prices,
      };
      commit('setPorfolioBalanceData', { combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setPorfolioBalanceData(state: any, value: any) {
    state.porfolioBalanceData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
