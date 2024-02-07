import { TOKENS, type Strategy, type Payout } from '@/modules/Market/types';
import MarketApiService from '@/services/market-api-service.ts';

const state = {
  tokenData: {},
};
function calculateTvl(strategies: Strategy[]) {
  const totalTvl = strategies.reduce((total: number, strategy: Strategy) => {
    const { netAssetValue } = strategy;
    return total + (Number.isNaN(netAssetValue) ? 0 : netAssetValue);
  }, 0);
  return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalTvl);
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
      const staticData = TOKENS[marketId] || {};
      const strategies: Strategy[] = await MarketApiService.loadStrategies(networkName, `${marketId}+`);
      const tvl = calculateTvl(strategies);
      const payouts: Payout[] = await MarketApiService.loadPayouts(networkName, `${marketId}+`);
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
