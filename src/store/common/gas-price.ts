/* eslint-disable no-unused-vars */
import { axios } from '@/utils/httpUtils.ts';
import BigNumber from 'bignumber.js';

const state = {

  show: false,

  gasPriceStation: {
    low: 10,
    standard: 20,
    fast: 30,
    ultra: 50,

    usdPrice: 0,
  },

  gasPriceType: 'standard',
  gasPrice: 0,
  gasPriceGwei: '0',
};

const getters = {

  show(state: any) {
    return state.show;
  },

  gasPriceStation(state: any) {
    return state.gasPriceStation;
  },

  gasPrice(state: any) {
    return state.gasPrice;
  },

  gasPriceGwei(state: any) {
    return state.gasPriceGwei;
  },

  gasPriceType(state: any) {
    return state.gasPriceType;
  },
};

const actions = {

  async showGasSettings({
    commit, dispatch,
  }: any) {
    dispatch('refreshGasPrice');
    commit('setShow', true);
  },

  async hideGasSettings({
    commit,
  }: any) {
    commit('setShow', false);
  },

  async refreshGasPrice({
    commit, dispatch, getters, rootState,
  }: any) {
    const { networkId } = rootState.network;
    let url = '';

    if (networkId === 137) {
      url = 'https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle';
    } else if (networkId === 56) {
      url = 'https://gbsc.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle';
    } else if ([10, 42161, 324, 8453, 59144].includes(networkId)) {
      let gasPriceWei;
      let gasPriceGwei;
      try {
        gasPriceWei = (await rootState.web3.evmProvider.getFeeData()).gasPrice?.toString();
        if (!gasPriceWei) return;

        console.log((await rootState.web3.evmProvider.getBalance(rootState.accountData.account)).toString(), 'RECEPT');

        if (networkId === 324) {
          console.log('Gas price on ZkSync: ', gasPriceWei);
          gasPriceWei = `${+gasPriceWei * 1.05}`; // added 5% to up
          console.log('Gas price on ZkSync + 5%: ', gasPriceWei);
        }

        gasPriceGwei = new BigNumber(gasPriceWei).div(10 ** 9).toString();
      } catch (e) {
        console.error(`Error getGasPrice from provider: ${e} => use hardcode value gasPrice`);
        gasPriceGwei = networkId === 10
          ? 0.001 : 0.1; // Support hardcode value only for Arbitrum and Optimism
        gasPriceWei = new BigNumber(gasPriceGwei).times(10 ** 9).toString();
      }

      const priceStationValues = {
        low: gasPriceGwei,
        standard: gasPriceGwei,
        fast: gasPriceGwei,
        ultra: gasPriceGwei,
        usdPrice: 0,
      };
      commit('setGasPriceStation', priceStationValues);
      commit('setGasPrice', gasPriceGwei);
      commit('setGasPriceGwei', gasPriceWei);
      return;
    }

    console.log(`GAS STATION: ${url}`);
    axios.get(url).then((value) => {
      const { result } = value.data;
      const price: any = {
        low: result.SafeGasPrice,
        standard: result.ProposeGasPrice,
        fast: result.FastGasPrice,
        ultra: result.FastGasPrice * 3,

        usdPrice: result.UsdPrice,
      };
      commit('setGasPriceStation', price);

      const element = price[getters.gasPriceType];
      console.log(element, '-GWEI0');
      commit('setGasPrice', element);
      commit('setGasPriceGwei', new BigNumber(element).times(10 ** 9).toString());
    }).catch((reason) => {
      console.debug(`Error get gas price: ${reason}`);
    });
  },
};

const mutations = {

  setShow(state: any, value: any) {
    state.show = value;
  },

  setGasPriceStation(state: any, value: any) {
    state.gasPriceStation = value;
  },

  setGasPriceType(state: any, value: any) {
    state.gasPriceType = value;
  },

  setGasPrice(state: any, value: any) {
    state.gasPrice = value;
  },

  setGasPriceGwei(state: any, value: any) {
    state.gasPriceGwei = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
