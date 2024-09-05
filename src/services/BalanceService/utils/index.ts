/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js';
import { OVN_TOKENS } from '@/utils/const.ts';
import type { TTokenBalanceData, TTokenInfo } from '@/types/common/tokens/index.ts';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { fixedByPrice } from '@/utils/numbers.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import { ethers } from 'ethers';

export const getTotalUserBalance = (
  tokenList: TTokenInfo[],
  isOnlyOvn: boolean = false,
) => tokenList
  .reduce((acc: BigNumber, token: TTokenInfo) => (
    (!isOnlyOvn || OVN_TOKENS.includes(token.symbol))
      ? acc.plus(BigNumber(token.balanceData!.balanceInUsd))
      : acc
  ), new BigNumber(0));

// Todo rewrite abstractly for any contract method and move to blockchain service
export const fetchTokenBalancesMulticall = async (
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
