import OVNApiService from '@/services/ovn-api-service.ts';

const state = {
  ovnTokenData: {},
};

const actions = {
  async fetchOVNTokenData({ commit }: any) {
    try {
      const priceOvnMcChange = await OVNApiService.loadPrice();
      // TODO find another api
      // const changeMarketCapOvn = null;
      // const ovnTVL = null;
      const combinedData = {
        // priceOvn,
        // ovnChangeDay,
        priceOvnMcChange,
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
