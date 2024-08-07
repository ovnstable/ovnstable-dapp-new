/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { poolApiService } from '@/services/pool-api-service.ts';
import {
  getSortedPools,
  initAggregators,
  initReversePools,
} from '@/store/views/main/pools/helpers.ts';
import {
  HOT_POOLS, NEW_POOLS, POOL_TAG, zapPlatformSupportList,
} from '@/store/views/main/pools/mocks.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import { isArray } from 'lodash';
import BigNumber from 'bignumber.js';
import { PromisePool } from '@supercharge/promise-pool';
import { poolTokensForZapMap } from '../zapin/mocks.ts';

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

    const getFormatPools = async (data: any, networkConfig: any): Promise<[]> => {
      if (data) {
        const poolsList = data.map((pool: any) => {
          let tokenNames = pool.id.name.split('/');
          let poolTag = null;

          if (pool?.id?.name === 'Convex USD+FRAXBP') {
            tokenNames = ['USD+', 'FRAX'];
            pool.id.name = 'USD+/FRAXBP';
          }

          const token0Icon = loadTokenImage(tokenNames[0]);
          const token1Icon = loadTokenImage(tokenNames[1]);
          const token2Icon = tokenNames[2] ? loadTokenImage(tokenNames[2]) : null;
          const token3Icon = tokenNames[3] ? loadTokenImage(tokenNames[3]) : null;

          if (
            pool
            && zapPlatformSupportList?.includes(pool.platform)
            && Object.keys(poolTokensForZapMap).some(
              (item) => item.toLowerCase() === pool.id.address.toLowerCase(),
            )
          ) {
            pool.zappable = true;
          }

          if (pool && pool?.tvl >= 0) {
            pool = initAggregators(pool);

            const newName = pool.id.name.toUpperCase();

            if (HOT_POOLS.includes(pool.id.address)) poolTag = POOL_TAG.HOT;
            if (NEW_POOLS.includes(pool.id.address)) poolTag = POOL_TAG.NEW;
            // if (LOW_TVL_PROMOTE.includes(pool.id.address)) poolTag = POOL_TAG.NEW;

            return {
              id: pool.id.name + pool.tvl + pool.platform,
              name: newName,
              token0Icon,
              token1Icon,
              token2Icon,
              token3Icon,
              poolVersion: pool.pool_version,
              chain: networkConfig.networkId,
              chainName: networkConfig.networkName,
              address: pool.id.address,
              platform: isArray(pool.platform) ? pool.platform : [pool.platform],
              tvl: pool.tvl,
              apr: pool.apr,
              poolTag,
              skimEnabled: pool.skimEnabled,
              explorerUrl: networkConfig.explorerUrl,
              zappable: pool.zappable,
              cardOpened: false,
              data: pool,
              aggregators: pool.aggregators,
              promoted: pool.promoted,
              poolNameForAgregator: pool.poolNameForAgregator,
              isOpened:
                !(pool.aggregators && pool.aggregators.length),
              stableFishUrl: null,
            };
          }

          return [];
        });

        return poolsList;
      }
      return [];
    };

    const { errors, results } = await PromisePool
      .for(networkConfigList)
      .process(async (networkConfig: any) => {
        const networkPools = await poolApiService.getAllPools(networkConfig.appApiUrl);
        return getFormatPools(networkPools, networkConfig);
      });

    if (errors.length > 0) {
      console.log(`Error get pools data: ${errors}`);
    } else {
      const poolsList = results.flat();

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
