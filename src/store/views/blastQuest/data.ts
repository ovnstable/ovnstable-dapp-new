import BlastQuestApiService from '@/services/blast-quest-api-service.ts';

const state = {
  jackpotData: {},
  loadedJackpotData: false,
  isLiked: null,
};

const getters = {
  jackpotData: (state: any) => {
    const data = state.jackpotData;
    if (data && Object.keys(data).length === 0 && data.constructor === Object) {
      return 0;
    }
    return data || 0;
  },
  jackpotDataLoaded(state: any) {
    return state.loadedJackpotData;
  },
  likedQuest(state: any) {
    return state.isLiked;
  },
};

const actions = {
  async fetchJackpotData({ commit }: any) {
    try {
      const jackpotData = await BlastQuestApiService.loadJackpot();
      commit('setJackpotData', jackpotData);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setJackpotData(state: any, value: any) {
    state.jackpotData = value;
  },
  setJackpotDataLoaded(state: any, value: any) {
    state.loadedJackpotData = value;
  },
  setIsLikedQuest(state: any, value: any) {
    state.isLiked = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
