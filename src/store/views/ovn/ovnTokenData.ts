import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import ExternalApi from '@/services/ApiService/ExternalApi.ts';

const state = {
  ovnTokenData: {},
};

const actions = {
  async fetchOVNTokenData({ commit }: any) {
    try {
      const overnightApiInstance = new OvernightApi();
      const externalApiInstance = new ExternalApi();
      const priceOvnMcChange = await externalApiInstance.loadPrice();
      const ovnTVL = (await overnightApiInstance.loadTVL());
      const combinedData = {
        ovnTVL,
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
