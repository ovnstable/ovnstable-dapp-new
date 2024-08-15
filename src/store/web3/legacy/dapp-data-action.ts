/* eslint-disable no-unused-vars */
const state = {};

const getters = {};

const actions = {

  async resetUserData({ dispatch }: any) {
    dispatch('accountData/resetUns', null, { root: true });
  },

  async updateUserData({ dispatch }: any) {
    await dispatch('web3/initWeb3', null, { root: true });
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
