/* eslint-disable no-unused-vars */
import UsdPlusImage from '@/assets/jsonImages/usdPlus.json';
import UsdtPlusImage from '@/assets/jsonImages/usdtPlus.json';
import wETHPlusImage from '@/assets/jsonImages/wEthPlus.json';
import WrappedUsdPlusImage from '@/assets/jsonImages/wUsdPlus.json';
import DaiPlusImage from '@/assets/jsonImages/daiPlus.json';
import EthPlusImage from '@/assets/jsonImages/ethPlus.json';
import OptimismInsurance from '@/assets/jsonImages/optimism_insurance.json';
import OvnImage from '@/assets/jsonImages/ovn.json';
import { chainContractsMap } from '@/utils/contractsMap.ts';

const state = {};

const getters = {};

const actions = {
  async addUsdPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.usdPlus.options.address,
      symbol: process.env.VUE_APP_USD_TOKEN_NAME,
      decimals: 6,
      image: UsdPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addDaiPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.daiPlus.options.address,
      symbol: process.env.VUE_APP_DAI_TOKEN_NAME,
      decimals: 18,
      image: DaiPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addUsdtPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const { address } = rootState.web3.contracts.usdtPlus.options;
    const option = {
      address,
      symbol: process.env.VUE_APP_USDT_TOKEN_NAME,
      decimals: address.toLowerCase() === chainContractsMap.bsc.usdtPlus ? 18 : 6,
      image: UsdtPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addEthPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.ethPlus.options.address,
      symbol: process.env.VUE_APP_ETH_TOKEN_NAME,
      decimals: 18,
      image: EthPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addwEthPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.wEthPlus.options.address,
      symbol: process.env.VUE_APP_WRAPPED_ETH_TOKEN_NAME,
      decimals: 18,
      image: wETHPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addwUsdPlusToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.wUsdPlus.options.address,
      symbol: process.env.VUE_APP_WRAPPED_USD_TOKEN_NAME,
      decimals: 6,
      image: WrappedUsdPlusImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addInsuranceToken({
    commit, dispatch, getters, rootState,
  }: any) {
    const option = {
      address: rootState.web3.contracts.insurance.optimism_token.options.address,
      symbol: 'OVN INS',
      decimals: 18,
      image: OptimismInsurance.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addEtsToken({
    commit, dispatch, getters, rootState,
  }: any, etsData: any) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const etsImage = require(`@/assets/${etsData.iconName}.json`);

    const option = {
      address: rootState.web3.contracts[etsData.tokenContract].options.address,
      symbol: etsData.nameToken,
      decimals: etsData.etsTokenDecimals,
      image: etsImage.image,
    };

    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: option,
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },

  async addOvnToken({
    commit, dispatch, getters, rootState,
  }: any) {
    await rootState.web3.provider
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: rootState.web3.contracts.govToken.options.address,
            symbol: process.env.VUE_APP_OVN_TOKEN_NAME,
            decimals: 18,
            image: OvnImage.image,
          },
        },
      })
      .then((success: any) => {
        if (!success) {
          throw new Error('Something went wrong.');
        }
      })
      .catch(console.error);
  },
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
