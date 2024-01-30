import BigNumber from 'bignumber.js';

/* eslint-disable no-unused-vars */
const state = {

  totalSupply: {},
  totalInsuranceSupply: {},
};

const getters = {

  totalSupply(state: any) {
    return state.totalSupply;
  },

  totalInsuranceSupply(state: any) {
    return state.totalInsuranceSupply;
  },
};

const actions = {

  async refreshSupply({
    commit, dispatch, getters, rootState,
  }: any) {
    const { networkId } = rootState.network;
    const resultSupply: any = {};
    const { web3 } = rootState;

    console.log(rootState, 'rootState');

    const { etsList } = rootState.etsAction;

    for (let i = 0; i < etsList.length; i += 1) {
      const ets = etsList[i];
      let etsSupply = null;

      if (ets.chain === networkId) {
        try {
          // eslint-disable-next-line no-await-in-loop
          etsSupply = await web3.contracts[ets.tokenContract].methods.totalSupply().call();
          etsSupply = new BigNumber(etsSupply).div(10 ** ets.etsTokenDecimals);
        } catch (e) {
          try {
            etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
          } catch (ex) {
            //
          }
        }
      } else {
        try {
          etsSupply = rootState.marketData.etsStrategyData[ets.name].tvl;
        } catch (ex) {
          //
        }
      }

      resultSupply[ets.name] = etsSupply;
    }

    commit('setTotalSupply', resultSupply);
  },

  async refreshInsuranceSupply({
    commit, dispatch, getters, rootState,
  }: any) {
    // console.log('Supply: refreshInsuranceSupply');

    const { networkId } = rootState.network;

    const resultSupply: any = {};
    const { web3 } = rootState;

    const insuranceList = [
      /* {
                chainName: 'polygon',
                chainId: 137,
            }, */
      {
        chainName: 'optimism',
        chainId: 10,
      },
    ];

    for (let i = 0; i < insuranceList.length; i += 1) {
      const insurance = insuranceList[i];
      let supply;

      if (insurance.chainId === networkId) {
        try {
          // eslint-disable-next-line no-await-in-loop
          supply = await web3.contracts.insurance[`${insurance.chainName}_m2m`].methods.totalNetAssets().call();
          supply = new BigNumber(supply).div(10 ** 6);
        } catch (e) {
          supply = rootState.insuranceData.insuranceStrategyData[insurance.chainName].lastTvl;
        }
      } else {
        try {
          supply = rootState.insuranceData.insuranceStrategyData[insurance.chainName].lastTvl;
        } catch (e) {
          // console.log("Error: ", e)
        }
      }

      resultSupply[insurance.chainName] = supply;
    }

    commit('setTotalInsuranceSupply', resultSupply);
  },
};

const mutations = {

  setTotalSupply(state: any, value: any) {
    state.totalSupply = value;
  },

  setTotalInsuranceSupply(state: any, value: any) {
    state.totalInsuranceSupply = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
