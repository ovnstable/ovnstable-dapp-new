const stateData = {
  show: false,
  successTxHash: null,

  successAction: 'mint',
  etsData: null,
  zksyncFeeHistory: null,
};

const getters = {

  show(state: typeof stateData) {
    return state.show;
  },

  successTxHash(state: typeof stateData) {
    return state.successTxHash;
  },

  successAction(state: typeof stateData) {
    return state.successAction;
  },

  etsData(state: typeof stateData) {
    return state.etsData;
  },

  zksyncFeeHistory(state: typeof stateData) {
    return state.zksyncFeeHistory;
  },
};

const actions = {
  showSuccessModal({ commit }: any, successParams: any) {
    commit('setShow', true);
    commit('setSuccessTxHash', successParams.successTxHash);
    commit('setSuccessAction', successParams.successAction);
    commit('setEtsData', successParams.etsData);
    commit('setZksyncFeeHistory', successParams.zksyncFeeHistory);
  },

  closeSuccessModal({ commit }: any) {
    commit('setShow', false);
    commit('setSuccessTxHash', null);
    commit('setZksyncFeeHistory', null);
  },

};

const mutations = {

  setShow(state: typeof stateData, show: any) {
    state.show = show;
  },

  setSuccessTxHash(state: typeof stateData, value: any) {
    state.successTxHash = value;
  },

  setSuccessAction(state: typeof stateData, value: any) {
    state.successAction = value;
  },

  setEtsData(state: typeof stateData, value: any) {
    state.etsData = value;
  },

  setZksyncFeeHistory(state: typeof stateData, value: any) {
    state.zksyncFeeHistory = value;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
