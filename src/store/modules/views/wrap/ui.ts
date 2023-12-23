/* eslint-disable no-unused-vars */
const state = {

  showWrap: true,

  isWrapView: true,

  usdcApproved: false,
  usdPlusApproved: false,
  wUsdPlusApproved: false,
};

const getters = {

  showWrap(state: any) {
    return state.showWrap;
  },

  isWrapView(state: any) {
    return state.isWrapView;
  },

  usdcApproved(state: any) {
    return state.usdcApproved;
  },

  usdPlusApproved(state: any) {
    return state.usdPlusApproved;
  },

  wUsdPlusApproved(state: any) {
    return state.wUsdPlusApproved;
  },
};

const actions = {

  async showUnWrapView({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setIsWrapView', false);
  },

  async showWrapView({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setIsWrapView', true);
  },

  approveUsdc({ commit, dispatch, getters }: any) {
    commit('setUsdcApproved', true);
  },

  approveUsdPlus({ commit, dispatch, getters }: any) {
    commit('setUsdPlusApproved', true);
  },

  approveWUsdPlus({ commit, dispatch, getters }: any) {
    commit('setWUsdPlusApproved', true);
  },

  async hidePage({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setShowWrap', false);
  },

  async showPage({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setShowWrap', true);
  },
};

const mutations = {

  setShowWrap(state: any, showWrap: any) {
    state.showWrap = showWrap;
  },

  setIsWrapView(state: any, value: any) {
    state.isWrapView = value;
  },

  setUsdcApproved(state: any, usdcApproved: any) {
    state.usdcApproved = usdcApproved;
  },

  setUsdPlusApproved(state: any, usdPlusApproved: any) {
    state.usdPlusApproved = usdPlusApproved;
  },

  setWUsdPlusApproved(state: any, wUsdPlusApproved: any) {
    state.wUsdPlusApproved = wUsdPlusApproved;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
