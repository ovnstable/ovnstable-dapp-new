/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { USER_BALANCES_SCHEME } from '@/store/views/account/mocks.ts';

const state = {

  balance: {},
  originalBalance: {},
  actionAssetBalance: {},
  etsBalance: {},
  etsOriginalBalance: {},
  insuranceBalance: {},
  insuranceOriginalBalance: {},

  account: null,
  uns: null,
};

const getters = {

  balance(state: any) {
    return state.balance;
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

    commit('setBalance', {});
    commit('setOriginalBalance', {});
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
    const balances = await Promise.all(USER_BALANCES_SCHEME[networkId].map(async (_) => {
      if (!web3.contracts[_.contractName]) return;
      const result = await web3.contracts[_.contractName].methods
        .balanceOf(getters.account)
        .call();
      return {
        symbol: _.symbol,
        balance: result,
      };
    }));

    // original meaning without decimals
    commit('setOriginalBalance', balances);

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
            etsBalance = await web3.contracts[ets.tokenContract].methods
              .balanceOf(getters.account)
              .call();
            etsOriginalBalance = etsBalance;
            etsBalance = web3.web3.utils.fromWei(
              etsBalance,
              ets.etsTokenDecimals === 18 ? 'ether' : 'mwei',
            );
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
            ].methods
              .balanceOf(getters.account)
              .call();
            insuranceOriginalBalance = insuranceBalance;
            insuranceBalance = web3.web3.utils.fromWei(
              insuranceBalance,
              'ether',
            );
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
            actionAssetBalance = await web3.contracts[ets.actionAsset].methods
              .balanceOf(getters.account)
              .call();

            switch (ets.actionTokenDecimals) {
              case 6:
                actionAssetBalance = web3.web3.utils.fromWei(
                  actionAssetBalance,
                  'mwei',
                );
                break;
              case 8:
                actionAssetBalance = parseFloat(
                  web3.web3.utils.fromWei(actionAssetBalance, 'mwei'),
                ) / 100.0;
                break;
              case 18:
                actionAssetBalance = web3.web3.utils.fromWei(
                  actionAssetBalance,
                  'ether',
                );
                break;
              default:
                break;
            }
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

  setBalance(state: any, value: any) {
    state.balance = value;
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
