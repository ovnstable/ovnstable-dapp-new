/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { poolApiService } from '@/services/pool-api-service.ts';
import {
  getSortedPools,
  getSortedSecondPools,
  initAggregators,
  initFeature,
  initReversePools,
} from '@/store/views/main/pools/helpers.ts';
import { poolTokensForZapMap, zapPlatformSupportList } from '@/store/views/main/pools/mocks.ts';
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
          console.log(data, networkConfig, '---datanetworkConfig');
          if (data) {
            const buildPools = data.map((pool: any) => {
              const tokenNames = pool.id.name.split('/');
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

                const name = networkConfig.networkName;
                let newName = pool.id.name.toUpperCase();

                if (name === 'arbitrum') {
                  newName = newName.replace('USDC', 'USDC.e');
                } else if (name === 'base') {
                  newName = newName.replace('USDC', 'USDBC');
                }

                let { platform } = pool;

                // cases when LP staking platform differ from actual
                if (
                  pool.id.address
                  === '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013'
                ) {
                  platform = 'Convex';
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
                  platform,
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

    console.log(getSortedPools(state.allPools, false), '---getSortedPools');
    commit('changeState', {
      field: 'allPools',
      val: initFeature(state.allPools),
    });

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

    const map = new Map();

    map.set('0x1561d9618db2dcfe954f5d51f4381fa99c8e5689', '1577'); // 5. Thena USDT+/USD+
    map.set('0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223', '1619'); // 7. Velodrome USD+/DAI+
    map.set('0xd95E98fc33670dC033424E7Aa0578D742D00f9C7', '1618'); // 8. Velodrome USD+/USDC
    map.set('0x37e7D30CC180A750C83D68ED0C2511dA10694d63', '1621'); // 9. Velodrome USD+/LUSD
    map.set('0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d', '1620'); // 10. Velodrome USD+/DOLA
    map.set('0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B', '1622'); // 11. Velodrome FRAX/USD+
    map.set('0xd1c33d0af58eb7403f7c01b21307713aa18b29d3', '1625'); // 12. DefiEdge USD+/USDC
    map.set('0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb', '1575'); // 12. Ramses USD+/DAI+

    for (let i = 0; i < state.allPools.length; i++) {
      const pool = state.allPools[i];
      const stableFishId = map.get(pool.address);

      if (stableFishId) {
        pool.stableFishUrl = `https://stable.fish/defi/${stableFishId}`;
      }
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
