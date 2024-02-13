import SliderApiService from '@/services/slider-api-service.ts';
import { sliderDescriptionForWrapped } from '@/store/views/main/mintRedeem/mocks.ts'

const state = {
  sliderData: {},
};

const actions = {
  async fetchSliderData({ commit }: any) {
    try {
      const nameApyData = await SliderApiService.loadApyName();
      const tvlData = await SliderApiService.loadTVL();

      const products = Object.keys(nameApyData).filter((key) => key.endsWith('PlusProduct'));
      const sliderData = products.map((productKey) => {
        if (nameApyData[productKey]) {
          const productType = nameApyData[productKey].productType.replace('_PLUS', '+');
          const apy = nameApyData[productKey].value;
          const lastPayout = nameApyData.lastPayoutDate;

          const lastPayoutDatetime = new Date(lastPayout);
          const now = new Date();
          const diff = now.getTime() - lastPayoutDatetime.getTime();
          const hoursAgo = diff / 3600000;
          const minutesAgo = (diff % 3600000) / 60000;

          let payoutAgoText = '';
          let payoutAgoTime = '';

          if (hoursAgo < 1) {
            payoutAgoTime = `${Math.floor(minutesAgo)}:00`;
            payoutAgoText = 'minute(s) ago';
          } else if (hoursAgo === 1) {
            payoutAgoTime = '1:00';
            payoutAgoText = 'hour ago';
          } else {
            payoutAgoTime = `${Math.floor(hoursAgo)}:${Math.floor(minutesAgo).toString().padStart(2, '0')}`;
            payoutAgoText = 'hours ago';
          }

          let totalTvl = 0;
          tvlData.forEach((chain: any) => {
            const valueObj = chain.values.find((v: any) => v.name === productType);
            if (valueObj) {
              totalTvl += valueObj.value;
            }
          });
          const description = sliderDescriptionForWrapped(productType);
          return {
            tokenName: productType,
            tokenWrappedName: `W${productType}`,
            apy: apy.toFixed(1),
            tvl: totalTvl.toFixed(2),
            payoutAgoTime,
            payoutAgoText,
            description,
          };
        }
        return null;
      }).filter(Boolean);
      commit('setSliderData', sliderData);
    } catch (error) {
      console.error('Failed to fetch slider data:', error);
    }
  },
};

const mutations = {
  setSliderData(state: any, value: any) {
    state.sliderData = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
