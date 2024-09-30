import { TOKENS } from '@/store/views/market/mock.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const state = {
  collateralData: {},
};

const actions = {
  async fetchCollateralData({ commit }: any, { marketId, networkName }: any) {
    try {
      const overnightApiInstance = new OvernightApi();
      const { tokenName, collateralToken } = TOKENS[marketId];
      const colleterals = await overnightApiInstance.loadCollaterlPlusToken(networkName, `${marketId}+`);
      const combinedData = {
        tokenName,
        collateralToken,
        colleterals,
      };
      commit('setCollateralData', { marketId, combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setCollateralData(state: any, value: any) {
    state.collateralData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
