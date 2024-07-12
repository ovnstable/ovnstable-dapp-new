export enum zapInStep {
  START,
  APPROVE_TOKENS,
  DEPOSIT,
  APPROVE_GAUGE,
  STAKE_LP,
}

export enum rebalanceStep {
  UNSTAKE,
  APPROVE,
  REBALANCE,
  APPROVEGAUGE,
  STAKE,
}

export const ZAPIN_MAP: Record<zapInStep, string> = {
  [zapInStep.START]: 'Start',
  [zapInStep.APPROVE_TOKENS]: 'Approve Tokens',
  [zapInStep.DEPOSIT]: 'Deposit',
  [zapInStep.APPROVE_GAUGE]: 'Approve Gauge',
  [zapInStep.STAKE_LP]: 'Stake LP',
};

export const REBALANCE_MAP: Record<rebalanceStep, string> = {
  [rebalanceStep.UNSTAKE]: 'Unstake',
  [rebalanceStep.APPROVE]: 'Approve NFT for zap',
  [rebalanceStep.REBALANCE]: 'Rebalance',
  [rebalanceStep.APPROVEGAUGE]: 'Approve NFT for gauge',
  [rebalanceStep.STAKE]: 'Stake',
};

/* eslint-disable no-unused-vars */
const stateData = {
  show: false,
  modalText: '',
  STAGES_MAP: ZAPIN_MAP as typeof ZAPIN_MAP | typeof REBALANCE_MAP,
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

  showWaitingModal({ commit }: any, text: string) {
    commit('setShow', true);
    commit('setModalText', text);
  },

  closeWaitingModal({ commit }: any) {
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

  setStagesMap(state: typeof stateData, isZapin: boolean) {
    if (isZapin) state.STAGES_MAP = ZAPIN_MAP;
    else state.STAGES_MAP = REBALANCE_MAP;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
