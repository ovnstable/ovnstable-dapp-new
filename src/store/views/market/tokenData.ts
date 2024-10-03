import { TOKENS } from '@/store/views/market/mock.ts';
import { type Payout } from '@/modules/Market/types/index.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import type { IStrategyResponseOld } from '@/types/api/overnightApi';

const state = {
  tokenData: {},
};
function calculateTvl(strategies: IStrategyResponseOld[]) {
  const totalTvl = strategies.reduce((total: number, strategy: IStrategyResponseOld) => {
    const { netAssetValue } = strategy;
    return total + (Number(netAssetValue));
  }, 0);
  return new Intl.NumberFormat('en-EN', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalTvl);
}

function getLastPayout(payouts: Payout[]) {
  if (payouts.length === 0) {
    return { lastPayoutTime: 'No payouts', lastPayoutType: 'No payouts' };
  }

  const lastPayout = payouts[0];
  const dailyApy = lastPayout.annualizedYield;
  const payoutDate = new Date(lastPayout.payableDate);
  const now = new Date();

  const diffMinutes = Math.abs(now.getTime() - payoutDate.getTime()) / (1000 * 60);

  const hours = Math.floor(diffMinutes / 60).toString().padStart(2, '0');
  const minutes = Math.floor(diffMinutes % 60).toString().padStart(2, '0');
  const lastPayoutTime = `${hours} : ${minutes}`;

  const lastPayoutType = hours === '00' && minutes <= '02' ? 'hour ago' : 'hours ago';

  return { lastPayoutTime, lastPayoutType, dailyApy };
}

const actions = {
  async fetchTokenData({ commit }: any, { marketId, networkName }: any) {
    try {
      const overnightApiInstance = new OvernightApi();
      const staticData = TOKENS[marketId] || {};
      const strategies = await overnightApiInstance.loadStrategies();
      const tvl = calculateTvl(strategies);
      const payouts = await overnightApiInstance.loadPayouts(networkName);
      const { lastPayoutType, lastPayoutTime, dailyApy } = getLastPayout(payouts);
      const combinedData = {
        ...staticData,
        tvl,
        lastPayoutType,
        lastPayoutTime,
        dailyApy,
      };
      commit('setTokenData', { marketId, combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setTokenData(state: any, value: any) {
    state.tokenData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
