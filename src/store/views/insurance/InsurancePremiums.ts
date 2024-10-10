import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import type { IStrategyResponseOld } from '@/types/api/overnightApi';

const state = {
  insurancePremiums: {},
};

const actions = {
  async fetchInsurancePremiums(
    { commit }: any,
  ) {
    try {
      const OvernightApiInstance = new OvernightApi();
      const data = await OvernightApiInstance.loadStrategies('arbitrum', 'usd+');
      // Filtering inactive strategies (by their portfolio weight)
      const filteredStrategies = data
        .filter((strategy: IStrategyResponseOld) => Number(strategy.weight) > 0);
      commit('setInsurancePremiums', filteredStrategies);
    } catch (error) {
      console.error('Failed to fetch insurance premiums:', error);
    }
  },
};

const mutations = {
  setInsurancePremiums(state: any, value: any) {
    state.insurancePremiums = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
