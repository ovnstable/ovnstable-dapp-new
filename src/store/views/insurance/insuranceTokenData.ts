import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import { tranformInsuranceStatsResponse } from '@/services/ApiService/utils/apiComatibility.ts';
import type { IInsPayoutResponseOld } from '@/types/api/overnightApi';

const state = {
  insuranceTokenData: {},
  isMobileAboutOvn: false,
  isMobileMintRedeem: false,
  isMobileOvnDashboard: false,
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function generateInsuranceImageName(networkName: string) {
  const capitalizedNetworkName = capitalizeFirstLetter(networkName);
  return `Insurance${capitalizedNetworkName}`;
}

function getLastPayout(payouts: IInsPayoutResponseOld[]) {
  if (payouts.length === 0) {
    return { lastPayoutTime: 'No payouts', lastPayoutType: 'No payouts' };
  }

  const lastPayout = payouts[0];
  const payoutDate = new Date(lastPayout.timestamp);
  const now = new Date();

  const diffMinutes = Math.abs(now.getTime() - payoutDate.getTime()) / (1000 * 60);

  const hours = Math.floor(diffMinutes / 60).toString().padStart(2, '0');
  const minutes = Math.floor(diffMinutes % 60).toString().padStart(2, '0');
  const lastPayoutTime = `${hours} : ${minutes}`;

  const lastPayoutType = hours === '00' && minutes <= '02' ? 'hour ago' : 'hours ago';

  return { lastPayoutTime, lastPayoutType };
}

const actions = {
  async fetchInsuranceTokenData(
    { commit }: any,
  ) {
    try {
      const OvernightApiInstance = new OvernightApi();
      const insuranceStatsResponse = await OvernightApiInstance.loadInsuranceData();
      const ovnPrice = (await OvernightApiInstance.loadPriceOfToken('42161', '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396')).price;
      const insuranceStats = tranformInsuranceStatsResponse(insuranceStatsResponse, ovnPrice);
      const insurancePayouts = await OvernightApiInstance.loadInsurancePayouts();
      const insImage = generateInsuranceImageName('arbitrum');
      const { lastPayoutType, lastPayoutTime } = getLastPayout(insurancePayouts);
      const combinedData = {
        insImage,
        lastPayoutType,
        lastPayoutTime,
        data: insuranceStats,
        ovnPrice,
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
  setIsMobileOvnDashboard(state: any, value: any) {
    state.isMobileOvnDashboard = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
