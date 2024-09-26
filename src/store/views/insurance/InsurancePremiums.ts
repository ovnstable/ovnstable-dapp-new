import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const state = {
  insurancePremiums: {},
};

const actions = {
  async fetchInsurancePremiums(
    { commit }: any,
  ) {
    try {
      const OvernightApiInstance = new OvernightApi();
      const data = await OvernightApiInstance.loadStrategies();
      commit('setInsurancePremiums', data);
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
