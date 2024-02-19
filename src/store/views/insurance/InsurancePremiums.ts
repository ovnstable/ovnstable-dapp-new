import InsuranceApiService from '@/services/insurance-api-service.ts';

const state = {
  insurancePremiums: {},
};

const actions = {
  async fetchInsurancePremiums({ commit }: any, { networkName }: any) {
    try {
      const data = await InsuranceApiService.loadInsurancePremiusm(networkName);
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
