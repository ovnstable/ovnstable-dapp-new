import BlastQuestApiService from '@/services/blast-quest-api-service.ts';

const state = {
  jackpotData: {},
  loadedJackpotData: false,
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
};

const actions = {
  async fetchJackpotData({ commit }: any) {
    try {
      // const userData = await BlastQuestApiService.getUserName('VasilijPokrovs1');
      // console.log('here is userData');
      // console.log(userData);
      // const lastTweet = await BlastQuestApiService.getLastTweetsOvernight(userData.user_id);
      // console.log('here is last tweet');
      // console.log(lastTweet.results[0].tweet_id);
      // const likes = await BlastQuestApiService.checkLikes(userData.user_id);
      // console.log('here are likes');
      // console.log(likes);
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
  setJackpotDataLoaded(state: any, value: any) {
    state.loadedJackpotData = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
