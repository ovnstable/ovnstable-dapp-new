/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import dayjs from 'dayjs';
import { axios } from '@/utils/httpUtils.ts';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const state = {
  insuranceStrategyData: {},
  insuranceClientData: {},
  insuranceApyData: {},
  insuranceTvlData: {},
  insuranceRedemptionData: {},

  usdPlusApyData: {},
};

const getters = {

  insuranceStrategyData(state: any) {
    return state.insuranceStrategyData;
  },

  insuranceClientData(state: any) {
    return state.insuranceClientData;
  },

  insuranceApyData(state: any) {
    return state.insuranceApyData;
  },

  insuranceTvlData(state: any) {
    return state.insuranceTvlData;
  },

  insuranceRedemptionData(state: any) {
    return state.insuranceRedemptionData;
  },

  usdPlusApyData(state: any) {
    return state.usdPlusApyData;
  },
};

const actions = {

  async refreshInsurance({
    commit, dispatch, getters, rootState,
  }: any) {
    const insuranceChainList = [
      // {
      //     chainName: 'polygon',
      //     chainId: 137
      // }
      {
        chainName: 'optimism',
        chainId: 10,
      },
    ];

    for (const insuranceChain of insuranceChainList) {
      dispatch('refreshStrategyData', { chain: insuranceChain });
    }

    for (const insuranceChain of insuranceChainList) {
      dispatch('refreshClientData', { chain: insuranceChain });
    }
    //
    // dispatch('refreshUsdPlusPayoutsData', "polygon");
    // dispatch('refreshUsdPlusPayoutsData', "bsc");
    // dispatch('refreshUsdPlusPayoutsData', "optimism");
    // dispatch('refreshUsdPlusPayoutsData', "arbitrum");
    // dispatch('refreshUsdPlusPayoutsData', "zksync");

    dispatch('accountData/refreshBalance', null, { root: true });
    // dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
  },

  async refreshStrategyData({
    commit, dispatch, getters, rootState,
  }: any, refreshParams: any) {
    let appApiUrl;

    switch (refreshParams.chain.chainId) {
      case 137:
        appApiUrl = rootState.network.polygonApi;
        break;
      case 10:
        appApiUrl = rootState.network.opApi;
        break;
      case 56:
        appApiUrl = rootState.network.bscApi;
        break;
      case 42161:
        appApiUrl = rootState.network.arApi;
        break;
      case 8453:
        appApiUrl = rootState.network.baseApi;
        break;
      case 59144:
        appApiUrl = rootState.network.lineaApi;
        break;
      case 324:
        appApiUrl = rootState.network.zkApi;
        break;
      default:
        appApiUrl = rootState.network.polygonApi;
        break;
    }

    const fetchOptions = {
      headers: {
        'Access-Control-Allow-Origin': appApiUrl,
      },
    };

    const strategyData = {
      tvlData: 0,
    };

    dispatch('addInsuranceStrategyData', { name: refreshParams.chain.chainName, data: strategyData });
  },

  async refreshClientData({
    commit, dispatch, getters, rootState,
  }: any, refreshParams: any) {
    let appApiUrl;

    switch (refreshParams.chain.chainId) {
      case 137:
        appApiUrl = rootState.network.polygonApi;
        break;
      case 10:
        appApiUrl = rootState.network.opApi;
        break;
      case 56:
        appApiUrl = rootState.network.bscApi;
        break;
      case 42161:
        appApiUrl = rootState.network.arApi;
        break;
      case 8453:
        appApiUrl = rootState.network.baseApi;
        break;
      case 59144:
        appApiUrl = rootState.network.lineaApi;
        break;
      case 324:
        appApiUrl = rootState.network.zkApi;
        break;
      default:
        appApiUrl = rootState.network.polygonApi;
        break;
    }

    if (!rootState.accountData.account) {
      return;
    }

    const profitDay = null;

    dispatch('addInsuranceClientData', { name: refreshParams.chain.chainName, data: profitDay });
    dispatch('refreshIsNeedRedemption');
  },

  async refreshUsdPlusPayoutsData({
    commit, dispatch, getters, rootState,
  }: any, network: any) {
    console.log('InsuranceData: refreshUsdPlusPayoutsData', network);

    let appApiUrl;

    switch (network) {
      case 'polygon':
        appApiUrl = rootState.network.polygonApi;
        break;
      case 'bsc':
        appApiUrl = rootState.network.bscApi;
        break;
      case 'optimism':
        appApiUrl = rootState.network.opApi;
        break;
      case 'arbitrum':
        appApiUrl = rootState.network.arApi;
        break;
      case 'zksync':
        appApiUrl = rootState.network.zkApi;
        break;
      default:
        appApiUrl = rootState.network.arApi;
    }

    const fetchOptions = {
      headers: {
        'Access-Control-Allow-Origin': appApiUrl,
      },
    };

    let resultDataList;

    axios.get(`${appApiUrl}/dapp/payouts`, fetchOptions)
      .then((value) => {
        const clientData = value.data;
        const widgetDataDict: any = {};

        [...clientData].reverse().forEach((item) => {
          widgetDataDict[dayjs(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.annualizedYield ? item.annualizedYield : 0.0).toFixed(2);
        });

        resultDataList = widgetDataDict;

        dispatch('addUsdPlusApyData', { name: network, data: resultDataList });
      });
  },

  async refreshIsNeedRedemption({
    commit, dispatch, getters, rootState,
  }: any) {
    const { web3 } = rootState;
    const { account } = rootState.accountData;

    if (account) {
      const insurance = {
        // chainName: 'polygon'
        chainName: 'optimism',
      };

      if (insurance.chainName !== rootState.network.networkName) {
        return;
      }

      const contract = web3.contracts.insurance[`${insurance.chainName}_exchanger`];
      if (!contract) {
        console.log('Insurance/redemptionCheck: contract not found');
        return;
      }

      let date = await contract.withdrawRequests(account);
      try {
        date = parseFloat(date);
      } catch (e) {
        date = null;
      }

      if (date !== null) {
        const redemptionData: any = {
          request: null,
          date: null,
          hours: 0,
        };

        if (date === 0) {
          redemptionData.request = 'NEED_REQUEST';
          redemptionData.date = null;
          redemptionData.hours = 0;
        } else if (date > 0) {
          date = new Date(date * 1000);
          const currentDate = new Date();

          if (currentDate.getTime() > date.getTime()) {
            const withdrawPeriod = await web3.contracts.insurance[`${insurance.chainName}_exchanger`].withdrawPeriod();
            const withdrawDate = new Date(date.getTime() + (withdrawPeriod * 1000));

            if (withdrawDate.getTime() > currentDate.getTime()) {
              const hours = dayjs.duration(dayjs(withdrawDate).diff(dayjs(currentDate))).asHours();
              redemptionData.request = 'CAN_WITHDRAW';
              redemptionData.date = date;
              redemptionData.hours = hours;
            } else {
              redemptionData.request = 'NEED_REQUEST';
              redemptionData.date = null;
              redemptionData.hours = 0;
            }
          } else {
            const hours = dayjs.duration(dayjs(date).diff(dayjs(currentDate))).asHours();
            redemptionData.request = 'NEED_WAIT';
            redemptionData.date = date;
            redemptionData.hours = hours;
          }
        }

        console.log(`REDEMPTION REQUEST: ${JSON.stringify(redemptionData)}`);

        commit('setInsuranceRedemptionData', redemptionData);
      }
    }
  },

  async addInsuranceStrategyData({
    commit, dispatch, getters, rootState,
  }: any, insuranceDataParams: any) {
    const insuranceData = getters.insuranceStrategyData;
    const { data } = insuranceDataParams;

    if (!data.tvl || data.tvl < 0.0001) {
      if (data.payouts && data.payouts.length > 0) {
        data.tvl = data.payouts[data.payouts.length - 1].tvl;
      }
    }

    insuranceData[insuranceDataParams.name] = data;

    commit('setInsuranceStrategyData', null);
    commit('setInsuranceStrategyData', insuranceData);
  },

  async addInsuranceClientData({
    commit, dispatch, getters, rootState,
  }: any, insuranceClientDataParams: any) {
    const { insuranceClientData } = getters;
    insuranceClientData[insuranceClientDataParams.name] = insuranceClientDataParams.data;

    commit('setInsuranceClientData', insuranceClientData);
  },

  async addInsuranceApyData({
    commit, dispatch, getters, rootState,
  }: any, insuranceApyDataParams: any) {
    const { insuranceApyData } = getters;
    insuranceApyData[insuranceApyDataParams.name] = insuranceApyDataParams.data;

    commit('setInsuranceApyData', insuranceApyData);
  },

  async addInsuranceTvlData({
    commit, dispatch, getters, rootState,
  }: any, insuranceTvlDataParams: any) {
    const { insuranceTvlData } = getters;
    insuranceTvlData[insuranceTvlDataParams.name] = insuranceTvlDataParams.data;

    commit('setInsuranceTvlData', insuranceTvlData);
  },

  async addUsdPlusApyData({
    commit, dispatch, getters, rootState,
  }: any, usdPlusApyDataParams: any) {
    const { usdPlusApyData } = getters;
    usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;

    commit('setUsdPlusApyData', usdPlusApyData);
  },
};

const mutations = {

  setInsuranceStrategyData(state: any, value: any) {
    state.insuranceStrategyData = value;
  },

  setInsuranceRedemptionData(state: any, value: any) {
    state.insuranceRedemptionData = value;
  },

  setInsuranceClientData(state: any, value: any) {
    state.insuranceClientData = value;
  },

  setInsuranceApyData(state: any, value: any) {
    state.insuranceApyData = value;
  },

  setInsuranceTvlData(state: any, value: any) {
    state.insuranceTvlData = value;
  },

  setUsdPlusApyData(state: any, value: any) {
    state.usdPlusApyData = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
