/* eslint-disable no-unused-vars */
import { loadJSON } from '@/utils/http-utils.ts';

const ROOT_API = 'https://api.overnight.fi/root';

const state = {
  etsNetworkNames: [
    'optimism',
    'arbitrum',
    // 'zksync',
    'polygon',
    'bsc',
    // 'base',
    // 'linea'
  ],
  etsList: [],
};

const getters = {

  etsNetworkNames(state: any) {
    return state.etsNetworkNames;
  },

  etsNetworkUrl(state: any) {
    return state.etsNetworkUrl;
  },

  etsList(state: any) {
    return state.etsList;
  },
};

const actions = {
  async initEtsList({ commit }: any) {
    const list = [];

    const etsesFullData = await loadJSON(`${ROOT_API}/product/ets/all`);
    // let etsesFullData = await loadJSON(`http://localhost:9999/api/product/ets/all`);
    for (let i = 0; i < etsesFullData.length; i += 1) {
      const ets = etsesFullData[i].data;
      list.push(ets);
    }

    await commit('setEtsList', list);
  },
};

const mutations = {

  setEtsList(state: any, value: any) {
    state.etsList = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
