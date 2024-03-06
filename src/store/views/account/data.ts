/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { USER_BALANCES_SCHEME } from '@/store/views/account/mocks.ts';
import BigNumber from 'bignumber.js';

const state = {
  accountNativeBalance: '0',
  originalBalance: [],
  actionAssetBalance: {},
  etsBalance: {},
  etsOriginalBalance: {},
  insuranceBalance: {},
  insuranceOriginalBalance: {},

  account: null,
  uns: null,
};

const getters = {

  accNativeBalance(state: any) {
    return state.accountNativeBalance;
  },

  originalBalance(state: any) {
    return state.originalBalance;
  },

  etsBalance(state: any) {
    return state.etsBalance;
  },

  etsOriginalBalance(state: any) {
    return state.etsOriginalBalance;
  },

  insuranceBalance(state: any) {
    return state.insuranceBalance;
  },

  insuranceOriginalBalance(state: any) {
    return state.insuranceOriginalBalance;
  },

  actionAssetBalance(state: any) {
    return state.actionAssetBalance;
  },

  account(state: any) {
    return state.account;
  },

  uns(state: any) {
    return state.uns;
  },

};

const actions = {

  async resetBalance({ commit, dispatch, getters }: any) {
    console.log('AccountData: resetBalance');

    commit('setOriginalBalance', []);
    commit('setEtsBalance', {});
    commit('setEtsOriginalBalance', {});
    commit('setInsuranceBalance', {});
    commit('setActionAssetBalance', {});
  },

  async resetUns({ commit, dispatch, getters }: any) {
    console.log('AccountData: resetUns');

    commit('setUns', null);
  },

  async refreshBalance({
    commit, dispatch, getters, rootState,
  }: any) {
    if (getters.account === null || getters.account === undefined) {
      return;
    }

    commit('accountUI/setLoadingBalance', true, { root: true });
    const { web3 } = rootState;

    const networkId = rootState.network.networkId as keyof typeof USER_BALANCES_SCHEME;
    const userBalance = (await rootState.web3.evmProvider
      .getBalance(getters.account))
      .toString();

    console.log(userBalance, networkId, '---userBalance');

    const balances = await Promise.all(USER_BALANCES_SCHEME[networkId].map(async (_) => {
      try {
        if (_.symbol === 'OVNINS') {
          const insContract = await web3.contracts.insurance[`${rootState.network.networkName}_token`];
          const result = await insContract.balanceOf(getters.account);

          return {
            symbol: _.symbol,
            balance: result.toString(),
          };
        }

        if (!web3.contracts[_.contractName]) {
          return {
            symbol: _.symbol,
            balance: '0',
          };
        }

        const result = await web3.contracts[_.contractName].balanceOf(getters.account);
        return {
          symbol: _.symbol,
          balance: result.toString(),
        };
      } catch (e) {
        console.log(e, '---_.symbol');
        return {
          symbol: _.symbol,
          balance: '0',
        };
      }
    }));

    console.log(balances, '---balances');

    // original meaning without decimals
    commit('setOriginalBalance', balances);
    commit('setAccBalance', userBalance);

    const resultEtsBalance: any = {};
    const resultEtsOriginalBalance: any = {};
    const { etsList } = rootState.etsAction;

    if (etsList) {
      for (let i = 0; i < etsList.length; i++) {
        const ets = etsList[i];
        let etsBalance;
        let etsOriginalBalance;

        if (ets.chain === networkId) {
          try {
            etsBalance = await web3.contracts[ets.tokenContract].balanceOf(getters.account);
            etsOriginalBalance = etsBalance;
            etsBalance = new BigNumber(etsBalance)
              .div(10 ** ets.etsTokenDecimals === 18 ? 18 : 6).toString();
          } catch (e) {
            etsBalance = getters.etsBalance[ets.name];
            etsOriginalBalance = getters.etsOriginalBalance[ets.name];
          }

          resultEtsBalance[ets.name] = etsBalance;
          resultEtsOriginalBalance[ets.name] = etsOriginalBalance;
        }
      }
    }

    commit('setEtsBalance', resultEtsBalance);
    commit('setEtsOriginalBalance', resultEtsOriginalBalance);

    const resultInsuranceBalance: any = {};
    const resultInsuranceOriginalBalance: any = {};
    const insuranceList = [
      {
        chainName: 'optimism',
        chainId: 10,
      },
      {
        chainName: 'arbitrum',
        chainId: 42161,
      },
    ];

    if (insuranceList) {
      for (let i = 0; i < insuranceList.length; i++) {
        const insurance = insuranceList[i];
        let insuranceBalance;
        let insuranceOriginalBalance;

        if (insurance.chainId === networkId) {
          try {
            insuranceBalance = await web3.contracts.insurance[
              `${insurance.chainName}_token`
            ].balanceOf(getters.account);
            insuranceOriginalBalance = insuranceBalance;
            insuranceBalance = new BigNumber(insuranceBalance)
              .div(10 ** 18).toString();
          } catch (e) {
            insuranceBalance = getters.insuranceBalance[insurance.chainName];
            insuranceOriginalBalance = getters.insuranceOriginalBalance[insurance.chainName];
          }

          resultInsuranceBalance[insurance.chainName] = insuranceBalance;
          resultInsuranceOriginalBalance[
            insurance.chainName
          ] = insuranceOriginalBalance;
        }
      }
    }

    commit('setInsuranceBalance', resultInsuranceBalance);
    commit('setInsuranceOriginalBalance', resultInsuranceOriginalBalance);

    const resultActionAssetBalance: any = {};

    if (etsList) {
      for (let i = 0; i < etsList.length; i++) {
        const ets = etsList[i];
        let actionAssetBalance;

        if (!resultActionAssetBalance[ets.actionAsset]) {
          try {
            actionAssetBalance = await web3.contracts[ets.actionAsset].balanceOf(getters.account);
            actionAssetBalance = new BigNumber(actionAssetBalance)
              .div(10 ** ets.actionTokenDecimals).toString();
          } catch (e) {
            return;
          }

          const assetProperty = `${ets.actionAsset}_${ets.actionTokenDecimals}`; // asset may be with different decimals.
          resultActionAssetBalance[assetProperty] = actionAssetBalance;
        }
      }
    }

    commit('setActionAssetBalance', resultActionAssetBalance);
    commit('accountUI/setLoadingBalance', false, { root: true });
  },
};

const mutations = {

  setAccBalance(state: any, value: any) {
    state.accountNativeBalance = value;
  },

  setOriginalBalance(state: any, value: any) {
    state.originalBalance = value;
  },

  setEtsBalance(state: any, value: any) {
    state.etsBalance = value;
  },

  setEtsOriginalBalance(state: any, value: any) {
    state.etsOriginalBalance = value;
  },

  setInsuranceBalance(state: any, value: any) {
    state.insuranceBalance = value;
  },

  setInsuranceOriginalBalance(state: any, value: any) {
    state.insuranceOriginalBalance = value;
  },

  setAccount(state: any, value: any) {
    state.account = value;
  },

  setUns(state: any, value: any) {
    state.uns = value;
  },

  setActionAssetBalance(state: any, value: any) {
    state.actionAssetBalance = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
