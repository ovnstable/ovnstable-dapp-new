import type { ISuccessTokenInfo } from '@/types/common/tokens';

const stateData = {
  show: false,
  successTxHash: '',
  swapData: {
    from: [],
    to: [],
  },

  successAction: 'mint',
  etsData: null,
  zksyncFeeHistory: null,
};

const getters = {
  swapData(state: typeof stateData) {
    return state.swapData;
  },

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

export type TSwapSuccessData = {
    successTxHash: string,
    from: ISuccessTokenInfo[],
    to: ISuccessTokenInfo[],
    type: string;
    successAction?: any,
    etsData?: any,
    zksyncFeeHistory?: any,
}

const actions = {
  showSuccessModal({
    commit,
  }: any, successParams: TSwapSuccessData) {
    commit('setShow', true);
    commit('setSwapData', {
      from: successParams.from,
      to: successParams.to,
    });
    commit('setSuccessAction', successParams?.successAction);
    commit('setEtsData', successParams?.etsData);
    commit('setZksyncFeeHistory', successParams?.zksyncFeeHistory);
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

  setSwapData(state: typeof stateData, value: any) {
    state.swapData = value;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
