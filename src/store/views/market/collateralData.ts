import { TOKENS } from '@/store/views/market/mock.ts';
import { collateralMockResponse } from './mocks.ts';
// import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const state = {
  collateralData: {},
};

const actions = {
  async fetchCollateralData({ commit }: any, { marketId }: any) {
    try {
      // const overnightApiInstance = new OvernightApi();
      const { tokenName, collateralToken } = TOKENS[marketId];
      // Костыль вместо вызова устаревшего апи метода. TODO: remove
      const colleterals = collateralMockResponse;
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
