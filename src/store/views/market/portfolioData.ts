import { TOKENS } from '@/store/views/market/mock.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const state = {
  portfolioData: {},
};

const actions = {
  async fetchPortfolioData({ commit }: any, { marketId, networkName }: any) {
    try {
      const overnightApiInstance = new OvernightApi();
      const { tokenName, collateralToken } = TOKENS[marketId];
      const strategies = await overnightApiInstance.loadStrategies();
      const totalPlusToken = await overnightApiInstance.loadTotalPlusToken(networkName, `${marketId}+`);
      const combinedData = {
        totalPlusToken,
        tokenName,
        collateralToken,
        strategies,
      };
      commit('setPortfolioData', { marketId, combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setPortfolioData(state: any, value: any) {
    state.portfolioData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
