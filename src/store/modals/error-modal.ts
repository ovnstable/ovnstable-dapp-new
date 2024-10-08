/* eslint-disable no-unused-vars */
const state = {
  show: false,
  errorType: null,
  errorMsg: null,
};

const getters = {
  show(state: any) {
    return state.show;
  },

  errorType(state: any) {
    return state.errorType;
  },

  errorMsg(state: any) {
    return state.errorMsg;
  },
};

const actions = {

  showErrorModal({ commit }: any, errorType: any) {
    commit('setErrorType', errorType);
    commit('setErrorMsg', null);
    commit('setShow', true);
  },

  showErrorModalWithMsg({ commit }: any, errorProperties: any) {
    console.log(errorProperties, 'showErrorModalWithMsg');
    commit('setErrorType', errorProperties.errorType);
    commit('setErrorMsg', errorProperties.errorMsg);
    commit('setShow', true);
  },

  closeErrorModal({ commit }: any) {
    commit('setErrorType', null);
    commit('setErrorMsg', null);
    commit('setShow', false);
  },

};

const mutations = {
  setShow(state: any, show: any) {
    state.show = show;
  },

  setErrorType(state: any, errorType: any) {
    state.errorType = errorType;
  },

  setErrorMsg(state: any, value: any) {
    state.errorMsg = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
