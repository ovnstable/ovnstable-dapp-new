import { TOKENS } from '@/store/views/market/mock.ts';
import { type Payout } from '@/modules/Market/types/index.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const state = {
  payoutData: {},
};

const actions = {
  async fetchPayoutData({ commit }: any, { marketId, networkName }: any) {
    try {
      const overnightApiInstance = new OvernightApi();
      const { tokenName, collateralToken } = TOKENS[marketId];
      const payouts: Payout[] = await overnightApiInstance.loadPayouts(networkName);
      const combinedData = {
        tokenName,
        collateralToken,
        payouts,
      };
      commit('setPayoutData', { marketId, combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setPayoutData(state: any, value: any) {
    state.payoutData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
