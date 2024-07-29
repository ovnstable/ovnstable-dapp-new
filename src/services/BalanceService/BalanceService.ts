import BigNumber from 'bignumber.js';
import { fixedByPrice } from '@/utils/numbers.ts';
import { ethers } from 'ethers';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import type {
  TTokenBalanceData, TTokenBalanceMap, TTokenInfo,
} from '@/types/common/tokens';

// Todo rewrite abstractly for any contract method and move to blockchain service
const fetchTokenBalancesMulticall = async (
  provider: any,
  tokenList: string[],
  account: string,
): Promise<TTokenBalanceData> => {
  try {
    const multicaller = MulticallWrapper.wrap(provider);
    if (MulticallWrapper.isMulticallProvider(provider)) {
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

const handleNativeBal = async (provider: any, account: string) => (await provider
  .getBalance(account))
  .toString();

const formatBalanceInUsd = (fBalance: BigNumber, price: string) => new BigNumber(fBalance).times(price ?? '0').toFixed();

// Todo get provider from blockchain service, not state
class BalanceService {
  // Base method for loading balances
  public static async getAllTokenBalance(
    provider: any,
    allTokenList: TTokenInfo[],
    account: string,
  )
        : Promise<TTokenInfo[]> {
    try {
      const tokenList = allTokenList.map((token: TTokenInfo) => token.address);
      const balancesData = await fetchTokenBalancesMulticall(
        provider,
        tokenList,
        account,
      );

      const nativeTokenBalance = await handleNativeBal(provider, account);
      balancesData[ZERO_ADDRESS] = nativeTokenBalance.toString();

      const tokenBalanceMap = this.geTTokenBalanceData(allTokenList, balancesData);
      const tokenBalanceInfo = this.getTokenBalanceInfo(allTokenList, tokenBalanceMap);
      return tokenBalanceInfo;
    } catch (e) {
      console.error('Error loading balances', e);
    }
    return [];
  }

  // Returns formatted data. Todo remove

  public static geTTokenBalanceData(
    tokenList: TTokenInfo[],
    balanceData: TTokenBalanceData,
  ): TTokenBalanceMap {
    if (tokenList.length === 0 || !balanceData) return {};
    try {
      const tokenBalanceMap: TTokenBalanceMap = {};
      tokenList.forEach((token) => {
        const balance = balanceData[token.address]?.toString() ?? '0';
        const balanceFormatted = formatTokenDecimals(balance, token.decimals);
        tokenBalanceMap[token.address] = {
          name: token.symbol,
          balance: formatBlanceFixed(balanceFormatted),
          balanceInUsd: formatBalanceInUsd(balanceFormatted, token.price),
          originalBalance: balance,
          decimal: token.decimals,
        };
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
}

export default BalanceService;
