/* eslint-disable no-unused-vars */
import { getFilteredPoolTokens } from '@/store/helpers/index.ts';
import { MINTREDEEM_42161 } from './mocks.ts';

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
    const { networkId } = rootState.network;
    const tokens = rootState.odosData.tokensMap;

    console.log(MINTREDEEM_42161, '--MINTREDEEM_42161');
    console.log(rootState, 'tokens');
    if (networkId === 42161) {
      const list = MINTREDEEM_42161.map((_) => getFilteredPoolTokens(
        networkId,
        true,
        _,
        true,
        rootState.odosData,
      ));

      commit('changeState', {
        42161: list,
      });
      console.log(list, '----list');
    }
    console.log(networkId, 'initTokens');
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
