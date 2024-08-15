/* eslint-disable no-unused-vars */
const state = {};

const getters = {};

const actions = {

  async resetUserData({ dispatch }: any) {
    dispatch('accountData/resetBalance', null, { root: true });
    dispatch('accountData/resetUns', null, { root: true });
  },

  async updateUserData({ dispatch }: any) {
    console.log('REFRESHUSER');
    await dispatch('web3/initWeb3', null, { root: true });
    dispatch('accountData/refreshBalance', null, { root: true });
    // possibly remove, only for account change
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
