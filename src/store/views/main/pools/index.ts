/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import {
  getSortedPools,
  initReversePools,
} from '@/store/views/main/pools/helpers.ts';
import BigNumber from 'bignumber.js';
import PoolService from '@/services/PoolService/PoolsService.ts'

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
  sortedPoolList: [],
  allPools: [],
  isPoolsLoading: true,

  topPool: null,

  typeOfPool: POOL_TYPES.ALL,

  isZapModalShow: false,
  currentZapPool: null,

  lastParsedBurnedTokenIdEvent: '',
  lastParsedClaimedRewardsEvent: '',
};

const getters = {
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
    if (pool?.rewards?.usdValue) {
      commit('changeState', {
        field: 'lastParsedClaimedRewardsEvent',
        val: new BigNumber(pool?.rewards?.usdValue).toString(10),
      });
    }
  },

  async loadPools({
    commit, rootState,
  }: any) {
    commit('changeState', {
      field: 'isPoolsLoading',
      val: true,
    });

    commit('changeState', {
      field: 'allPools',
      val: [],
    });
    const networkConfigList = [...rootState.network.allNetworkConfigs];

    const poolsList = await PoolService.getPoolsInfo(networkConfigList);

    if (poolsList.length > 0) {
      commit('changeState', {
        field: 'allPools',
        val: poolsList,
      });

      // TODO: Create Map and call initReversePools once accessing by address
      poolsList.forEach((pool: any) => initReversePools(pool, poolsList));

      const sortedPools = getSortedPools(poolsList, false);

      commit('changeState', {
        field: 'sortedPoolList',
        val: sortedPools,
      });

      commit('changeState', {
        field: 'isPoolsLoading',
        val: false,
      });
    }
  },
};

const mutations = {
  changeState(state: any, data: {
    field: keyof typeof stateData,
    val: any
  }) {
    state[data.field] = data.val;
  },
};

export default {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
};
