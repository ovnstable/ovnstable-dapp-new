/* eslint-disable no-unused-vars */
import { axios } from '@/utils/http-utils.ts';

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
        gasPriceWei = await rootState.web3.web3.eth.getGasPrice();

        if (networkId === 324) {
          console.log('Gas price on ZkSync: ', gasPriceWei);
          gasPriceWei = `${gasPriceWei * 1.05}`; // added 5% to up
          console.log('Gas price on ZkSync + 5%: ', gasPriceWei);
        }

        gasPriceGwei = rootState.web3.web3.utils.fromWei(gasPriceWei, 'gwei');
      } catch (e) {
        console.error(`Error getGasPrice from provider: ${e} => use hardcode value gasPrice`);
        gasPriceGwei = networkId === 10
          ? 0.001 : 0.1; // Support hardcode value only for Arbitrum and Optimism
        gasPriceWei = rootState.web3.web3.utils.toWei(`${gasPriceGwei}`, 'gwei');
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

      commit('setGasPrice', element);
      commit('setGasPriceGwei', rootState.web3.web3.utils.toWei(`${element}`, 'gwei'));
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
