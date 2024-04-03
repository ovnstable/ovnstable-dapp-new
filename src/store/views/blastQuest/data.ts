import BlastQuestApiService from '@/services/blast-quest-api-service.ts';

const state = {
  jackpotData: {},
};

const getters = {
  jackpotData: (state: any) => {
    const data = state.jackpotData;
    if (data && Object.keys(data).length === 0 && data.constructor === Object) {
      return 0;
    }
    return data || 0;
  },
};

const actions = {
  async fetchJackpotData({ commit }: any) {
    try {
      const jackpotData = await BlastQuestApiService.loadJackpot();
      commit('setJackpotData', jackpotData?.amount);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setJackpotData(state: any, value: any) {
    state.jackpotData = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
