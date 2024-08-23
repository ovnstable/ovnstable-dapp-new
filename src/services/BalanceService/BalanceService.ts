import BigNumber from 'bignumber.js';
import { fixedByPrice } from '@/utils/numbers.ts';
import { ethers } from 'ethers';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import type {
  TTokenBalanceData, TTokenBalanceMap, TTokenInfo,
} from '@/types/common/tokens';
import { getTotalUserBalance } from './utils/index.ts';

// Todo rewrite abstractly for any contract method and move to blockchain service
const fetchTokenBalancesMulticall = async (
  provider: any,
  tokenList: string[],
  account: string,
): Promise<TTokenBalanceData> => {
  try {
    const multicaller = MulticallWrapper.wrap(provider);
    if (MulticallWrapper?.isMulticallProvider(provider)) {
      const tokenPriceMap: TTokenBalanceData = {};
      const requests = tokenList
        .map((address: string) => new ethers.Contract(
          address,
          ERC20_ABI,
          multicaller,
        ).balanceOf(account).catch(() => '0').then((balance: BigNumber) => {
          tokenPriceMap[address] = balance;
        }));

      await Promise.all(requests);
      return tokenPriceMap;
    }
  } catch (e) {
    console.error('Error when load balance', e);
  }
  return {};
};

// Helper functions
const formatTokenDecimals = (amount: string, decimals: number) => new BigNumber(amount)
  .div(10 ** decimals);

const formatFixed = (amount: BigNumber) => (amount.gt(0) ? fixedByPrice(amount.toNumber()) : 2);

const formatBlanceFixed = (fBalance: BigNumber) => {
  const fixedBy = formatFixed(fBalance);
  return fBalance.toFixed(fixedBy);
};

const getHandleNoPrice = (price: string) => (!price || Number(price) === 0 ? '1' : price);

const formatBalanceInUsd = (fBalance: BigNumber, price: string) => new BigNumber(fBalance)
  .times(getHandleNoPrice(price)).toFixed();

export const getFormatTokenBalance = (token: TTokenInfo, balanceData: TTokenBalanceData) => {
  const balance = balanceData[token.address]?.toString() ?? '0';
  const balanceFormatted = formatTokenDecimals(balance, token.decimals);
  return {
    name: token.symbol,
    balance: formatBlanceFixed(balanceFormatted),
    balanceInUsd: formatBalanceInUsd(balanceFormatted, token.price),
    originalBalance: balance,
    decimal: token.decimals,
  };
};

// Todo get provider from blockchain service, not state
class BalanceService {
  // eslint-disable-next-line class-methods-use-this
  public static async fetchBalnceByAddress(provider: any, account: string) {
    return new ethers.Contract(
      account,
      ERC20_ABI,
      provider,
    ).balanceOf(account).catch(() => '0').then((balance) => balance);
  }

  public static async fetchTokenBalances(
    provider: any,
    account: string,
    tokenList: string[] = [],
  ) {
    const balancesData = await fetchTokenBalancesMulticall(provider, tokenList, account);

    const nativeTokenBalance = await this.fetchBalnceByAddress(provider, account);
    balancesData[ZERO_ADDRESS] = nativeTokenBalance.toString();

    return balancesData;
  }

  // Base method for loading balances
  public static async getAllTokenBalance(
    provider: any,
    allTokenList: TTokenInfo[],
    account: string,
  )
        : Promise<TTokenInfo[]> {
    try {
      console.log('__BalanceServiceFetchBalances');
      const tokenList = allTokenList.map((token: TTokenInfo) => token.address);
      const balancesData = await fetchTokenBalancesMulticall(
        provider,
        tokenList,
        account,
      );

      const nativeTokenBalance = await this.fetchBalnceByAddress(provider, account);
      balancesData[ZERO_ADDRESS] = nativeTokenBalance.toString();

      const tokenBalanceMap = this.getTokenBalanceData(allTokenList, balancesData);
      const tokenBalanceInfo = this.getTokenBalanceInfo(allTokenList, tokenBalanceMap);
      return tokenBalanceInfo;
    } catch (e) {
      console.error('Error loading balances', e);
    }
    return [];
  }

  // Returns formatted data. Todo remove

  public static getTokenBalanceData(
    tokenList: TTokenInfo[],
    balanceData: TTokenBalanceData,
  ): TTokenBalanceMap {
    if (tokenList.length === 0 || !balanceData) return {};
    try {
      const tokenBalanceMap: TTokenBalanceMap = {};
      tokenList.forEach((token) => {
        tokenBalanceMap[token.address] = getFormatTokenBalance(token, balanceData);
      });
      return tokenBalanceMap;
    } catch (e) {
      console.error('Error formatting balance data', e);
    }
    return {};
  }

  public static getTokenBalanceInfo(
    tokenList: TTokenInfo[],
    tokenBalanceMap: TTokenBalanceMap,
  ): TTokenInfo[] {
    const tokenBalanceInfo: TTokenInfo[] = tokenList.map((token: TTokenInfo) => ({
      ...token,
      balanceData: tokenBalanceMap[token.address],
    }));
    return tokenBalanceInfo;
  }

  public static getTotalOvnBalance(tokenList: TTokenInfo[]) {
    return getTotalUserBalance(tokenList);
  }
}

export default BalanceService;
