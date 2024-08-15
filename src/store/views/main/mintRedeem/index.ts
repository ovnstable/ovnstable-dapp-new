/* eslint-disable no-unused-vars */
import { MINTREDEEM_SCHEME } from '@/store/views/main/mintRedeem/mocks.ts';
import type { TTokenInfo } from '@/types/common/tokens';

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
  // Legacy methods. TODO remove
  // Modified method
  async initTokenSchema({ commit }: any, props: { tokenList: TTokenInfo[], networkId: number }) {
    const { tokenList, networkId } = props;
    const networkMintRedeemScheme = MINTREDEEM_SCHEME[networkId as keyof typeof MINTREDEEM_SCHEME];

    if (!networkMintRedeemScheme || tokenList.length === 0) return;

    const tokenMap: {[key: string]: TTokenInfo} = tokenList.reduce((acc, token) => (
      { ...acc, [token.address]: token }
    ), {});

    // eslint-disable-next-line array-callback-return, consistent-return
    const mintRedeemList = networkMintRedeemScheme.map((pair: any) => {
      if (tokenMap[pair.token0] && tokenMap[pair.token1]) {
        return [tokenMap[pair.token0], tokenMap[pair.token1]];
      }
    }).filter(Boolean);

    commit('changeTokenList', {
      [networkId]: mintRedeemList,
    });
  },
};

const mutations = {
  changeTokenList(state: typeof stateData, payload: TTokensList) {
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
