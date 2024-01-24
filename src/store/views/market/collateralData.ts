import MarketApiService from '@/services/market-api-service.ts';
import { TOKENS, type Collateral } from '@/utils/market-token-data.ts';

const state = {
  collateralData: {},
};

const actions = {
  async fetchCollateralData({ commit }: any, { marketId, networkName }: any) {
    try {
      const { tokenName, collateralToken } = TOKENS[marketId];
      const colleterals: Collateral[] = await MarketApiService.loadCollaterlPlusToken(networkName, `${marketId}+`);
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
    console.log(value.combinedData);
    state.collateralData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
