/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { poolApiService } from '@/services/pool-api-service.ts';
import {
  getSortedPools,
  getSortedSecondPools,
  initAggregators,
  initReversePools,
} from '@/store/views/main/pools/helpers.ts';
import { FEATURED_POOLS, poolTokensForZapMap, zapPlatformSupportList } from '@/store/views/main/pools/mocks.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';

const stateData = {
  sortedPoolList: [],
  sortedPoolSecondList: [],
  allPools: [],
  isPoolsLoading: true,

  topPool: null,

  // todo: remove after presale
  aerodromePool: null,
  velodromePool: null,

  typeOfPool: 'OVN', // ALL, OVN

  isZapModalShow: false,
  currentZapPool: null,
};

const getters = {
};

const actions = {
  setIsZapModalShow({ commit }: any, isShow: boolean) {
    commit('changeState', {
      field: 'isZapModalShow',
      val: isShow,
    });
  },
  openZapInWithInputOvn({ commit, state, dispatch }: any, pool: any) {
    dispatch('openZapIn', pool);
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
  },

  async loadPools({
    commit, state, dispatch, rootState,
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

    for (const networkConfig of networkConfigList) {
      await poolApiService
        .getAllPools(networkConfig.appApiUrl)
        .then((data: any) => {
          if (data) {
            const buildPools = data.map((pool: any) => {
              let tokenNames = pool.id.name.split('/');

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

                if (FEATURED_POOLS.includes(pool.id.address)) {
                  pool.feature = true;
                } else {
                  pool.feature = false;
                }

                return {
                  id: pool.id.name + pool.tvl + pool.platform,
                  name: newName,
                  token0Icon,
                  token1Icon,
                  token2Icon,
                  token3Icon,
                  chain: networkConfig.networkId,
                  chainName: networkConfig.networkName,
                  address: pool.id.address,
                  platform: pool.platform,
                  tvl: pool.tvl,
                  apr: pool.apr,
                  skimEnabled: pool.skimEnabled,
                  explorerUrl: networkConfig.explorerUrl,
                  feature: pool.feature,
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

              return null;
            });

            const filteredPools = buildPools.filter((_: any) => !!_);
            commit('changeState', {
              field: 'allPools',
              val: state.allPools?.concat(filteredPools),
            });
          }
        })
        .catch((e) => {
          console.log(`Error get pools data: ${e}`);
        });
    }

    if (state.allPools && state.allPools.length) {
      // init pool at aggregator
      for (let i = 0; i < state.allPools.length; i++) {
        const pool = state.allPools[i];
        initReversePools(pool, state.allPools);
      }

      // init top pool
      const featuredPools = state.allPools.filter(
        (pool: any) => pool.chain === rootState.network.networkId && pool.feature,
      );
      featuredPools.sort((a: any, b: any) => b.apr - a.apr);
      if (featuredPools.length > 0) {
        commit('changeState', {
          field: 'topPool',
          val: featuredPools[0],
        });
      } else {
        const topByApr = state.allPools.filter(
          (pool: any) => pool.chain === rootState.network.networkId
            && (pool.tvl > 100000 || pool.promoted),
        );
        topByApr.sort((a: any, b: any) => b.apr - a.apr);

        if (topByApr.length > 0) {
          commit('changeState', {
            field: 'topPool',
            val: topByApr[0],
          });
        } else {
          // any network
          const randomFeaturedPools = state.allPools.filter(
            (pool: any) => pool.feature,
          );
          randomFeaturedPools.sort((a: any, b: any) => b.apr - a.apr);
          if (randomFeaturedPools.length > 0) {
            commit('changeState', {
              field: 'topPool',
              val: randomFeaturedPools[
                Math.floor(Math.random() * randomFeaturedPools.length)
              ],
            });
          }
        }
      }

      // top pool from all pools
      if (!state.topPool) {
        commit('changeState', {
          field: 'topPool',
          val: state.allPools.sort((a: any, b: any) => b.apr - a.apr),
        });
      }

      commit('changeState', {
        field: 'velodromePool',
        val: state.allPools.find(
          (pool: any) => pool.address
            === '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome',
        ),
      });
      commit('changeState', {
        field: 'aerodromePool',
        val: state.allPools.find(
          (pool: any) => pool.address
            === '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome',
        ),
      });
    }

    if (state.typeOfPool === 'OVN') {
      commit('changeState', {
        field: 'sortedPoolList',
        val: getSortedPools(state.allPools, true),
      });
      commit('changeState', {
        field: 'sortedPoolSecondList',
        val: [],
      });
    } else {
      commit('changeState', {
        field: 'sortedPoolList',
        val: getSortedPools(state.allPools, false),
      });

      commit('changeState', {
        field: 'sortedPoolSecondList',
        val: getSortedSecondPools(state.allPools),
      });
    }

    commit('changeState', {
      field: 'isPoolsLoading',
      val: false,
    });
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
