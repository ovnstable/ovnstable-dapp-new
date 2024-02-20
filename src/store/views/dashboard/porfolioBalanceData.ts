import DashboardApiService from '@/services/dashboard-api-service.ts';

const state = {
  porfolioBalanceData: {},
};

const actions = {
  async fetchBalanceData({ commit }: any, { account, networkName }: any) {
    try {
      const data = await DashboardApiService.loadBalanceChange(networkName, 'usd+', account);
      commit('setPorfolioBalanceData', data);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setPorfolioBalanceData(state: any, value: any) {
    state.porfolioBalanceData = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
