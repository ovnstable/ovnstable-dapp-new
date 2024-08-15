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

  loadingOvnBalances: false,
  account: null,
  uns: null,
};

const getters = {
  isLoadingOvnBalances(state: any) {
    return state.loadingOvnBalances;
  },

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

  async resetBalance({ commit }: any) {
    console.log('AccountData: resetBalance');

    commit('setOriginalBalance', []);
    commit('setEtsBalance', {});
    commit('setEtsOriginalBalance', {});
    commit('setInsuranceBalance', {});
    commit('setActionAssetBalance', {});
  },

  async resetUns({ commit }: any) {
    console.log('AccountData: resetUns');

    commit('setUns', null);
  },
  // Legacy method left for compatibility
  async refreshBalance() {
    console.log('__refreshBalances');
  },
  handleSwitchAccount({
    commit, state, rootGetters,
  }: any, walletAddress: string) {
    // Posthog sideeffects
    const posthog = rootGetters['posthog/posthogService'];
    if (!state.account && walletAddress) {
    // First wallet connection
      posthog
        .identyfyByWalletTrigger({ address: walletAddress });
    } else if (state.account && walletAddress && (state.account !== walletAddress)) {
      posthog
        .linkWalletsTrigger({ address0: state.account, address1: walletAddress });
    }
    commit('setAccount', walletAddress);
  },
};

const mutations = {
  setLoadingBalance(state: any, value: any) {
    state.loadingOvnBalances = value;
  },

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
