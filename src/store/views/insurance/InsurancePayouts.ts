import InsuranceApiService from '@/services/insurance-api-service.ts';

const state = {
  insurancePayouts: {},
};

const actions = {
  async fetchInsurancePayouts({ commit }: any, { networkName }: any) {
    try {
      const insurancePayouts = await InsuranceApiService.loadPayouts(networkName);
      commit('setInsurancePayouts', insurancePayouts);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setInsurancePayouts(state: any, value: any) {
    state.insurancePayouts = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
