import BigNumber from 'bignumber.js';
import type { TFilterPoolsParams } from '@/types/common/pools';

// eslint-disable-next-line no-shadow
export enum POOL_TYPES {
  ALL,
  VOLATILE,
  STABLE,
  V2,
  V3,
  TOKENPLUS,
  OVN,
}

const stateData = {
  allPools: [],
  isPoolsLoading: true,

  topPool: null,

  typeOfPool: POOL_TYPES.ALL,

  isZapModalShow: false,
  currentZapPool: null,

  lastParsedBurnedTokenIdEvent: '',
  lastParsedClaimedRewardsEvent: '',

  // New filter
  filterParams: {
    token1: 'USD+' as string,
    token2: '' as string,
    chain: [] as string[],
    minTvl: '0' as string,
    protocol: [] as string[],
    page: 0 as number,
    limit: 0 as number,
    sort: '' as string,
  } as Partial<TFilterPoolsParams>,
};

const getters = {
  isZapModalShow(state: typeof stateData) {
    return state.isZapModalShow;
  },
  getAllPools(state: typeof stateData) {
    return state.allPools;
  },
  allPoolsMap(state: typeof stateData) {
    return state.allPools
      .reduce((acc, pool: any) => ({ ...acc, [pool.address]: pool }), {});
  },
};

const actions = {
  setIsZapModalShow({ commit }: any, isShow: boolean) {
    commit('changeState', {
      field: 'isZapModalShow',
      val: isShow,
    });
  },

  openZapIn({ commit }: any, pool: any) {
    commit('changeState', {
      field: 'currentZapPool',
      val: pool,
    });
    commit('changeState', {
      field: 'isZapModalShow',
      val: true,
    });
    if (pool?.tokenId) {
      commit('changeState', {
        field: 'lastParsedBurnedTokenIdEvent',
        val: new BigNumber(pool?.tokenId).toString(10),
      });
    }
    if (pool?.rewards) {
      commit('changeState', {
        field: 'lastParsedClaimedRewardsEvent',
        val: pool?.rewards?.tokensInfo,
      });
    }
  },
  setFilterParams({ commit }: any, params: Partial<TFilterPoolsParams>) {
    commit('setFilterParams', params);
  },
};

const mutations = {
  changeState(state: any, data: {
    field: keyof typeof stateData,
    val: any
  }) {
    state[data.field] = data.val;
  },
  setFilterParams(state: any, params: Partial<TFilterPoolsParams>) {
    state.filterParams = params;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
