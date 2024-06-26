import { useEventBus } from '@vueuse/core';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { fixedByPrice } from '@/utils/numbers.ts';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';

// Types
type TTokenInfo = {
  id: string,
  address: string,
  decimals: number,
  assetType: string,
  name: string,
  symbol: string,
  logoUrl: string,
  selected: false,
  price: string,
}

type TBalanceInfo = {
  name: string,
  balance: string,
  balanceInUsd: string,
  originalBalance: string,
  decimal: number,
}

// Helper functions
const formatTokenDecimals = (amount: string, decimals: number) => new BigNumber(amount)
  .div(10 ** decimals);

const formatFixed = (amount: BigNumber) => (amount.gt(0) ? fixedByPrice(amount.toNumber()) : 2);

const getBlanceFixed = (fBalance: BigNumber) => {
  const fixedBy = formatFixed(fBalance);
  return fBalance.toFixed(fixedBy);
};

const handleNativeBal = async (rootState: any) => (await rootState.web3.evmProvider
  .getBalance(rootState.accountData.account))
  .toString();

const getBalanceInUsd = (fBalance: BigNumber, price: string) => new BigNumber(fBalance).times(price ?? '0').toFixed();

const fetchAllTokenBalances = async (
  provider: any,
  tokenList: TTokenInfo[],
  account: string,
): Promise<BigNumber[]> => {
  try {
    const multicaller = MulticallWrapper.wrap(provider);
    if (MulticallWrapper.isMulticallProvider(provider)) {
      const tokenPriceMap: {[key: string]:  TBalanceInfo} = {};
      const requests = tokenList
        .map((token: TTokenInfo) => new ethers.Contract(
          token.address,
          ERC20_ABI,
          multicaller,
        ).balanceOf(account).catch(() => '0'));

      const balancesData: BigNumber[] = await Promise.all(requests);
      return balancesData;
    }
  } catch (e) {
    console.error('Error when load balance', e);
  }
  return [];
};

const state = {};

const getters = {};

const actions = {
  async loadBalances({
    commit, state, getters, rootState,
  }: any, providerInstance: any) {
    const provider = providerInstance || rootState.web3.evmProvider;

    if (!rootState.accountData.account || !provider) {
      commit('changeState', { field: 'isBalancesLoading', val: false });
      return;
    }

    if (state.isBalancesLoading) return;
    if (getters.allTokensList.length === 0) return;

    commit('changeState', { field: 'isBalancesLoading', val: true });

    try {
      const balancesData = await fetchAllTokenBalances(provider, getters.allTokensList, rootState.accountData.account);
      const nativeTokenBalance = await handleNativeBal(rootState);

      const newBalances = await Promise.all(
        getters.allTokensList.map(async (token: any, key: number) => {
          let balance = balancesData[key].toString() ?? '0';
          const balanceFormatted = formatTokenDecimals(balance, token.decimals);

          return {
            ...token,
            balanceData: {
              name: token.symbol,
              balance: getBlanceFixed(balanceFormatted),
              balanceInUsd: getBalanceInUsd(balanceFormatted, token.price),
              originalBalance: balance,
              decimal: token.decimals,
            },
          };
        }),
      );

      // console.log(newBalances, 'newBalances');
      const bus = useEventBus('odos-tokens-loaded');
      bus.emit(true);

      await commit('changeBalances', newBalances);
    } catch (e) {
      console.error('Error when load balance', e);
    }
    commit('changeState', { field: 'isBalancesLoading', val: false });
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
