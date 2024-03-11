import OVNApiService from '@/services/ovn-api-service.ts';
import { poolsForOVN } from '@/store/views/main/pools/mocks.ts';
import { chainContractsMap } from '@/utils/contractsMap.ts';

const state = {
  ovnTokenData: {},
};

async function getTVL(networkName: string, priceOfOvn: any) {
  const price = parseFloat(priceOfOvn.data.OVN[0].quote.USD.price);
  const contractsMapAny: any = chainContractsMap;
  const ovnAddress = contractsMapAny[networkName]?.ovn;

  const networkData = poolsForOVN[networkName];
  const apiEndpoint = networkData?.api;
  const poolAddresses = networkData?.pools.map((pool: { address: any; }) => pool.address);
  if (!poolAddresses || poolAddresses.length === 0 || poolAddresses[0] === undefined) {
    return 0;
  }
  const envVariableName = `VITE_APP_API_KEY_${networkName.toUpperCase()}`;
  const apiToken = import.meta.env[envVariableName];

  const tvlPromises = poolAddresses.map(async (address: any) => {
    const response: any = await OVNApiService
      .loadTVLOVN(apiEndpoint, address, ovnAddress, apiToken);
    const result = BigInt(response.result);
    return result;
  });

  const tvls = await Promise.all(tvlPromises);
  const totalTVL = tvls.reduce((acc, tvl) => acc + tvl, BigInt(0));
  const finalTVL = (Number(totalTVL) / 1e18) * price;
  const formattedTVL = finalTVL.toFixed(2);
  return formattedTVL;
}

const actions = {
  async fetchOVNTokenData({ commit }: any, { networkName }: any) {
    try {
      const priceOvnMcChange = await OVNApiService.loadPrice();
      const ovnTVL = await getTVL(networkName, priceOvnMcChange);
      const combinedData = {
        ovnTVL,
        priceOvnMcChange,
      };
      commit('setOvnTokenData', { combinedData });
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },
};

const mutations = {
  setOvnTokenData(state: any, value: any) {
    state.ovnTokenData = value.combinedData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
