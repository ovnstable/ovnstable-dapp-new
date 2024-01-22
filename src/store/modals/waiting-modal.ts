/* eslint-disable no-unused-vars */
const stateData = {
  show: false,
  modalText: '',
};

const getters = {
  show(state: typeof stateData) {
    return state.show;
  },
  modalText(state: typeof stateData) {
    return state.modalText;
  },
};

const actions = {

  showWaitingModal({ commit, dispatch, getters }: any, text: string) {
    commit('setShow', true);
    commit('setModalText', text);
  },

  closeWaitingModal({ commit, dispatch, getters }: any) {
    commit('setShow', false);
    commit('setModalText', null);
  },

};

const mutations = {

  setShow(state: typeof stateData, show: any) {
    state.show = show;
  },

  setModalText(state: typeof stateData, modalText: string) {
    state.modalText = modalText;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
