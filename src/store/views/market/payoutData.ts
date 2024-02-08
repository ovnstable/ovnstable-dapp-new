import MarketApiService from '@/services/market-api-service.ts';
import { TOKENS } from '@/store/views/market/mock.ts';
import { type Payout } from '@/modules/Market/types';

const state = {
  payoutData: {},
};

const actions = {
  async fetchPayoutData({ commit }: any, { marketId, networkName }: any) {
    try {
      const { tokenName, collateralToken } = TOKENS[marketId];
      const payouts: Payout[] = await MarketApiService.loadPayouts(networkName, `${marketId}+`);
      const combinedData = {
        tokenName,
        collateralToken,
        payouts,
      };
      console.log(combinedData);
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
