import MarketApiService from '@/services/market-api-service.ts';
import { TOKENS, type Strategy } from '@/utils/market-token-data.ts';

const state = {
  portfolioData: {},
};

const actions = {
  async fetchPortfolioData({ commit }: any, { marketId, networkName }: any) {
    try {
      const { tokenName, collateralToken } = TOKENS[marketId];
      const strategies: Strategy[] = await MarketApiService.loadStrategies(networkName, `${marketId}+`);
      const totalPlusToken: number = await MarketApiService.loadTotalPlusToken(networkName, `${marketId}+`);
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
    console.log('lets set portfolio data');
    console.log(value);
    state.portfolioData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
