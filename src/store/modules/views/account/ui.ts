/* eslint-disable no-unused-vars */
const state = {

  showAccountProfile: false,

  loadingBalance: true,

  badge: false,

  tab: 2,

  isDarkTheme: false,
};

const getters = {

  showAccountProfile(state: any) {
    return state.showAccountProfile;
  },

  loadingBalance(state: any) {
    return state.loadingBalance;
  },

  badge(state: any) {
    return state.badge;
  },

  tab(state: any) {
    return state.tab;
  },
};

const actions = {

  async showAccountProfile({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setShowAccountProfile', true);
  },

  async showTxHistory({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setTab', 1);
    commit('setShowAccountProfile', true);
  },

  async hideAccountProfile({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setShowAccountProfile', false);
  },

  async showBadge({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setBadge', true);
  },

  async hideBadge({
    commit, dispatch, getters, rootState,
  }: any) {
    commit('setBadge', false);
  },
};

const mutations = {

  setShowAccountProfile(state: any, value: any) {
    state.showAccountProfile = value;
  },

  setLoadingBalance(state: any, value: any) {
    state.loadingBalance = value;
  },

  setBadge(state: any, value: any) {
    state.loadingBalance = value;
  },

  setTab(state: any, value: any) {
    state.tab = value;
  },

  setIsDarkTheme(state: any, value: any) {
    state.isDarkTheme = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
