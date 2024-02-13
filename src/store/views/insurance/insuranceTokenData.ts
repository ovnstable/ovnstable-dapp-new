import InsuranceApiService from '@/services/insurance-api-service.ts';

const state = {
  insuranceTokenData: {},
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function generateInsuranceImageName(networkName: string) {
  const capitalizedNetworkName = capitalizeFirstLetter(networkName);
  return `Insurance_${capitalizedNetworkName}`;
}

const actions = {
  async fetchInsuranceTokenData({ commit }: any, { networkName }: any) {
    try {
      const data = await InsuranceApiService.loadInsuranceData(networkName);
      const insImage = generateInsuranceImageName(networkName);
      const combinedData = {
        insImage,
        data,
      };
      commit('setInsuranceTokenData', { combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setInsuranceTokenData(state: any, value: any) {
    state.insuranceTokenData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
