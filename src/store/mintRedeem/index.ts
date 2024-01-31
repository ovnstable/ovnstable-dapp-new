/* eslint-disable no-unused-vars */
import { getFilteredPoolTokens } from '@/store/helpers/index.ts';
import { MINTREDEEM_SCHEME } from '@/store/mintRedeem/mocks.ts';

type TTokensList = Record<number, any[][]>

const stateData = {
  tokensListByNetwork: {} as TTokensList,
  errorType: null,
  errorMsg: null,
};

const getters = {
  tokensListGetter(state: typeof stateData) {
    return state.tokensListByNetwork;
  },
};

const actions = {
  initTokens(
    {
      commit, state, dispatch, rootState,
    }: any,
  ) {
    const networkId = rootState.network.networkId as keyof typeof MINTREDEEM_SCHEME;

    if (!MINTREDEEM_SCHEME[networkId]) return;

    // todo: init lists for every networkId on first render
    // currently its init on networkId change
    const list = MINTREDEEM_SCHEME[networkId].map((_) => getFilteredPoolTokens(
      networkId,
      true,
      [_.token0, _.token1],
      true,
      rootState.odosData,
    ));

    commit('changeState', {
      [networkId]: list,
    });
  },
};

const mutations = {
  changeState(state: typeof stateData, payload: TTokensList) {
    state.tokensListByNetwork = payload;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
