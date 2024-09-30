import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import BigNumber from 'bignumber.js';
import type { IClientBalanceChangeResponseOld } from '@/types/api/overnightApi';

const state = {
  porfolioBalanceData: {},
};

function availableChains(tokenName: string) {
  const tokenKey = `${tokenName.toLowerCase()?.slice(0, -1)}Plus`;
  if (!tokenKey) return [];
  const availableNetworks = Object.entries(chainContractsMap)
    .reduce((acc, [network, tokens]: any) => {
      if ((tokenKey in tokens) && tokens[tokenKey].tokenPlus) {
        acc.push(network.charAt(0).toLowerCase() + network.slice(1));
      }
      return acc;
    }, [] as string[]);

  return availableNetworks;
}
function getTokenPrices(apiResponse: any, contractsMap: any, chainToCheck: any) {
  const prices = {};
  const contracts = contractsMap[chainToCheck];

  Object.keys(contracts).forEach((token) => {
    if (token.endsWith('Plus')) {
      const contractInfo = contracts[token];
      if (apiResponse.tokenPrices[contractInfo.tokenPlus]) {
        (prices as any)[token] = apiResponse.tokenPrices[contractInfo.tokenPlus];
      }
    }
  });

  return prices;
}

const actions = {
  async fetchBalanceData(
    { commit }: any,
    { account, networkName }: {account: string, networkName: string},
  ) {
    try {
      if (!account || new BigNumber(account).eq(0)) return;
      const OvernightApiInstance = new OvernightApi();
      let dataUSDPlus = [] as IClientBalanceChangeResponseOld[];
      let dataETHPlus = [] as IClientBalanceChangeResponseOld[];
      let dataDAIPlus = [] as IClientBalanceChangeResponseOld[];
      let dataUSDTPlus = [] as IClientBalanceChangeResponseOld[];
      let dataUSDCPlus = [] as IClientBalanceChangeResponseOld[];
      const pricesResponse = await OvernightApiInstance.loadPrices(42161);
      const pricesResponseForUSDC = await OvernightApiInstance.loadPrices(8453);
      const pricesWithoutUSDC = getTokenPrices(pricesResponse, chainContractsMap, 'arbitrum');
      const pricesWithUSDC = getTokenPrices(pricesResponseForUSDC, chainContractsMap, 'base');
      const prices = { ...pricesWithoutUSDC, ...pricesWithUSDC };
      if (availableChains('usd+').includes(networkName)) {
        dataUSDPlus = await OvernightApiInstance.loadBalanceChange(networkName, 'usd+', account);
      }
      if (availableChains('eth+').includes(networkName)) {
        dataETHPlus = await OvernightApiInstance.loadBalanceChange(networkName, 'eth+', account);
      }
      if (availableChains('dai+').includes(networkName)) {
        dataDAIPlus = await OvernightApiInstance.loadBalanceChange(networkName, 'dai+', account);
      }
      if (availableChains('usdt+').includes(networkName)) {
        dataUSDTPlus = await OvernightApiInstance.loadBalanceChange(networkName, 'usdt+', account);
      }
      if (availableChains('usdc+').includes(networkName)) {
        dataUSDCPlus = await OvernightApiInstance.loadBalanceChange(networkName, 'usdc+', account);
      }
      const combinedData = {
        dataUSDPlus,
        dataETHPlus,
        dataDAIPlus,
        dataUSDTPlus,
        dataUSDCPlus,
        prices,
      };
      commit('setPorfolioBalanceData', { combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setPorfolioBalanceData(state: any, value: any) {
    state.porfolioBalanceData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
