/* eslint-disable no-unused-vars */
const state = {};

const getters = {};

const actions = {

  async resetUserData({
    commit, dispatch, getters, rootState,
  }: any) {
    dispatch('accountData/resetBalance', null, { root: true });
    dispatch('accountData/resetUns', null, { root: true });
  },

  async updateUserData({
    commit, dispatch, getters, rootState,
  }: any) {
    console.log('REFRESHUSER');
    dispatch('accountData/refreshBalance', null, { root: true });
    dispatch('odosData/loadBalances', null, { root: true });
    // dispatch('supplyData/refreshInsuranceSupply', null, { root: true });
    // dispatch('swapData/refreshSwap', null, { root: true });
    // dispatch('marketData/refreshClientData', null, { root: true });
    // dispatch('insuranceData/refreshInsurance', null, { root: true });
  },

};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
