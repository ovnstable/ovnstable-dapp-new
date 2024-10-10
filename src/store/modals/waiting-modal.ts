export enum zapInStep {
  START,
  APPROVE_TOKENS,
  DEPOSIT,
  APPROVE_GAUGE,
  STAKE_LP,
}

export enum mergeStep {
  WITHDRAWNFT,
  APPROVENFT,
  MERGE,
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

export enum withdrawStep {
  WITHDRAW,
  APPROVE,
  ZAPOUT,
}

export enum IncreaseStep {
  START,
  APPROVE,
  UNSTAKE,
  APPROVEINCREASE,
  INCREASE,
  APPROVEGAUGE,
  STAKE,
}

export enum CompoundStep {
  APPROVE,
  CLAIM,
  UNSTAKE,
  APPROVEZAPIN,
  INCREASE,
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

export const WITHDRAW_MAP: Record<withdrawStep, string> = {
  [withdrawStep.WITHDRAW]: 'Unstake NFT',
  [withdrawStep.APPROVE]: 'Approve NFT for zapout',
  [withdrawStep.ZAPOUT]: 'Zapout',
};

export const INCREASE_MAP: Record<IncreaseStep, string> = {
  [IncreaseStep.START]: 'Start',
  [IncreaseStep.APPROVE]: 'Approve Tokens',
  [IncreaseStep.UNSTAKE]: 'Unstake',
  [IncreaseStep.APPROVEINCREASE]: 'Approve NFT for increase',
  [IncreaseStep.INCREASE]: 'Increase',
  [IncreaseStep.APPROVEGAUGE]: 'Approve NFT for gauge',
  [IncreaseStep.STAKE]: 'Stake',
};

export const COMPOUND_MAP: Record<CompoundStep, string> = {
  [CompoundStep.APPROVE]: 'Approve Tokens',
  [CompoundStep.CLAIM]: 'Claim',
  [CompoundStep.UNSTAKE]: 'Unstake',
  [CompoundStep.APPROVEZAPIN]: 'Approve NFT for compound',
  [CompoundStep.INCREASE]: 'Increase',
  [CompoundStep.APPROVEGAUGE]: 'Approve NFT for gauge',
  [CompoundStep.STAKE]: 'Stake',
};

export const MERGE_MAP: Record<zapInStep, string> = {
  [mergeStep.WITHDRAWNFT]: 'Withdraw NFTs',
  [mergeStep.APPROVENFT]: 'Approve NFTs',
  [mergeStep.MERGE]: 'Merge NFTs',
  [mergeStep.APPROVE_GAUGE]: 'Approve Gauge',
  [mergeStep.STAKE_LP]: 'Stake LP',
};

export enum MANAGE_FUNC {
  REBALANCE,
  ZAPIN,
  WITHDRAW,
  HARVEST,
  INCREASE,
  COMPOUND,
  MERGE,
}

/* eslint-disable no-unused-vars */
const stateData = {
  show: false,
  modalText: '',
  skipStake: false,
  STAGES_MAP: ZAPIN_MAP as typeof ZAPIN_MAP
  | typeof REBALANCE_MAP
  | typeof WITHDRAW_MAP
  | typeof INCREASE_MAP
  | typeof COMPOUND_MAP
  | typeof MERGE_MAP,
};

const getters = {
  STAGES_MAP_GET(state: typeof stateData) {
    return state.STAGES_MAP;
  },
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
  setSkipStake(state: typeof stateData, val: boolean) {
    state.skipStake = val;
  },
  setShow(state: typeof stateData, show: any) {
    state.show = show;
  },

  setModalText(state: typeof stateData, modalText: string) {
    state.modalText = modalText;
  },

  setStagesMap(state: typeof stateData, func: MANAGE_FUNC) {
    if (func === MANAGE_FUNC.ZAPIN) state.STAGES_MAP = ZAPIN_MAP;
    if (func === MANAGE_FUNC.WITHDRAW) state.STAGES_MAP = WITHDRAW_MAP;
    if (func === MANAGE_FUNC.REBALANCE) state.STAGES_MAP = REBALANCE_MAP;
    if (func === MANAGE_FUNC.INCREASE) state.STAGES_MAP = INCREASE_MAP;
    if (func === MANAGE_FUNC.COMPOUND) state.STAGES_MAP = COMPOUND_MAP;
    if (func === MANAGE_FUNC.MERGE) state.STAGES_MAP = MERGE_MAP;
    console.log(state.STAGES_MAP);
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
