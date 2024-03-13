import InsuranceApiService from '@/services/insurance-api-service.ts';

const state = {
  insuranceTokenData: {},
  isMobileAboutOvn: false,
  isMobileMintRedeem: false,
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function generateInsuranceImageName(networkName: string) {
  const capitalizedNetworkName = capitalizeFirstLetter(networkName);
  return `Insurance${capitalizedNetworkName}`;
}

function getLastPayout(payouts: any) {
  if (payouts.length === 0) {
    return { lastPayoutTime: 'No payouts', lastPayoutType: 'No payouts' };
  }

  const lastPayout = payouts[0];
  const payoutDate = new Date(lastPayout.date);
  const now = new Date();

  const diffMinutes = Math.abs(now.getTime() - payoutDate.getTime()) / (1000 * 60);

  const hours = Math.floor(diffMinutes / 60).toString().padStart(2, '0');
  const minutes = Math.floor(diffMinutes % 60).toString().padStart(2, '0');
  const lastPayoutTime = `${hours} : ${minutes}`;

  const lastPayoutType = hours === '00' && minutes <= '02' ? 'hour ago' : 'hours ago';

  return { lastPayoutTime, lastPayoutType };
}

const actions = {
  async fetchInsuranceTokenData({ commit }: any, { networkName }: any) {
    try {
      const data = await InsuranceApiService.loadInsuranceData(networkName);
      const insurancePayouts = await InsuranceApiService.loadPayouts(networkName);
      const insImage = generateInsuranceImageName(networkName);
      const { lastPayoutType, lastPayoutTime } = getLastPayout(insurancePayouts);
      const combinedData = {
        insImage,
        lastPayoutType,
        lastPayoutTime,
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
  setIsMobileAboutOvn(state: any, value: any) {
    state.isMobileAboutOvn = value;
  },
  setIsMobileMintRedeem(state: any, value: any) {
    state.isMobileMintRedeem = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
