import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

/* eslint-disable no-param-reassign */
const state = {
  insurancePayouts: {},
};

const actions = {
  async fetchInsurancePayouts(
    { commit }: any,
  ) {
    try {
      const OvernightApiInstance = new OvernightApi();
      const insurancePayouts = await OvernightApiInstance.loadInsurancePayouts();
      const startValue = 1;
      let accumulator = startValue;
      let accumulatorDay = startValue;
      let accumulatorWeek = startValue;
      let accumulatorMonth = startValue;
      let counter = insurancePayouts.length;

      insurancePayouts.reverse().forEach((payout: any) => {
        const { dailyProfit } = payout;
        if (payout.hash === '0xc0ba6d1d74f5fa3952b0d6521f05073f8bc4060429b89e75ed1e3be9c96a75f2') {
          payout.comp = (-100.00).toFixed(3);
          accumulator = 1;
          counter--;
          return;
        }
        accumulator *= 1 + dailyProfit;
        payout.comp = (accumulator * 100) / startValue - 100;
        payout.comp = parseFloat(payout.comp ? payout.comp : 0.0).toFixed(3);
        if (counter <= 7) {
          accumulatorWeek *= 1 + dailyProfit;
        }

        if (counter <= 30) {
          accumulatorMonth *= 1 + dailyProfit;
        }
        if (counter === 1) {
          accumulatorDay *= 1 + dailyProfit;
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
      console.error('Failed to fetch insurance payouts:', error);
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
