import DashboardApiService from '@/services/dashboard-api-service.ts';
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

const actions = {
  async fetchBalanceData({ commit }: any, { account, networkName }: any) {
    try {
      let dataUSDPlus = [];
      let dataETHPlus = [];
      let dataDAIPlus = [];
      let dataUSDTPlus = [];
      if (availableChains('usd+').includes(networkName)) {
        dataUSDPlus = await DashboardApiService.loadBalanceChange(networkName, 'usd+', account);
      }
      if (availableChains('eth+').includes(networkName)) {
        dataETHPlus = await DashboardApiService.loadBalanceChange(networkName, 'eth+', account);
      }
      if (availableChains('dai+').includes(networkName)) {
        dataDAIPlus = await DashboardApiService.loadBalanceChange(networkName, 'dai+', account);
      }
      if (availableChains('usdt+').includes(networkName)) {
        dataUSDTPlus = await DashboardApiService.loadBalanceChange(networkName, 'usdt+', account);
      }
      const combinedData = {
        dataUSDPlus,
        dataETHPlus,
        dataDAIPlus,
        dataUSDTPlus,
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
