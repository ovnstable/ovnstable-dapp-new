import InsuranceApiService from '@/services/insurance-api-service.ts';

const state = {
  insurancePayouts: {},
};

const actions = {
  async fetchInsurancePayouts({ commit }: any, { networkName }: any) {
    try {
      const insurancePayouts = await InsuranceApiService.loadPayouts(networkName);
      const startValue = 1;
      let accumulator = startValue;
      let accumulatorDay = startValue;
      let accumulatorWeek = startValue;
      let accumulatorMonth = startValue;
      let counter = insurancePayouts.length;

      insurancePayouts.reverse().forEach((payout: any) => {
        accumulator *= (1 + payout.dailyProfit);
        payout.comp = (accumulator * 100 / startValue - 100);
        payout.comp = parseFloat(payout.comp ? payout.comp : 0.00).toFixed(3);

        if (counter <= 7) {
          accumulatorWeek *= (1 + payout.dailyProfit);
        }

        if (counter <= 30) {
          accumulatorMonth *= (1 + payout.dailyProfit);
        }
        if (counter === 1) {
          accumulatorDay *= (1 + payout.dailyProfit);
        }
        counter--;
      });
      accumulatorDay = (accumulatorDay - 1) * 100;
      accumulatorWeek = (accumulatorWeek - 1) * 100;
      accumulatorMonth = (accumulatorMonth - 1) * 100;
      const payload = {
        payouts: insurancePayouts,
        accumulatorDay: accumulatorDay.toFixed(2),
        accumulatorWeek: accumulatorWeek.toFixed(2),
        accumulatorMonth: accumulatorMonth.toFixed(2),
      };
      commit('setInsurancePayouts', payload);
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
