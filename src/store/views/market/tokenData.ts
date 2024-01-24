import { TOKENS } from '@/utils/market-token-data.ts';
// import { fetchTokenData } from '@/services/market-service';

const state = {
  tokenData: {},
};

const actions = {
  async fetchTokenData({ commit }, marketId: any) {
    try {
      const staticData = TOKENS[marketId] || {};
      const combinedData = {
        ...staticData,
      };
      commit('setTokenData', combinedData);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};
const mutations = {
  setTokenData(state: any, value: any) {
    console.log('we are inside setTokenData');
    console.log(value);
    state.tokenData = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
