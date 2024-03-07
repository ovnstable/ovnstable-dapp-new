import OVNApiService from '@/services/ovn-api-service';

const state = {
  ovnTokenData: {},
};

const actions = {
  async fetchOVNTokenData({ commit }: any) {
    try {
      console.log('we are in api services');
      const priceOvn = await OVNApiService.loadHistoricalData();
      const ovnChangeDay = null;
      const marketCapOvn = null;
      const changeMarketCapOvn = null;
      const ovnTVL = null;
      const combinedData = {
        priceOvn,
        ovnChangeDay,
        marketCapOvn,
        changeMarketCapOvn,
        ovnTVL,
      };
      commit('setOvnTokenData', { combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setOvnTokenData(state: any, value: any) {
    state.ovnTokenData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
