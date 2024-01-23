import { TOKENS } from '@/utils/market-token-data.ts';
import type { Commit } from 'vuex';
// import { fetchMarketData } from '@/services/market-service';

export default {
  state: {
    tokenData: {},
  },
  mutations: {
    setTokenData(state:any, data:any) {
      state.tokenData = data;
    },
  },
  actions: {
    async fetchTokenData({ commit }: { commit: Commit }, marketId: string) {
      try {
        // const dynamicData = await fetchMarketData(marketId);
        const staticData = TOKENS[marketId] || {};

        const combinedData = {
          ...staticData,
        //   ...dynamicData,
        };

        commit('setTokenData', combinedData);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      }
    },
  },
};
