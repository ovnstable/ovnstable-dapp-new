/* eslint-disable import/prefer-default-export */
import {
  BLAST_TOKENS, LINEA_TOKENS, OP_TOKENS, SFRAX_TOKEN, ZKSYNC_TOKENS,
} from '@/constants/tokens/manualTokensMap.ts';
import { loadEmptyImg, loadOvernightTokenImage, loadTokenImage } from '@/utils/tokenLogo.ts';
import BigNumber from 'bignumber.js';
import { fixedByPrice } from '@/utils/numbers.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import type { TTokenBalanceData, TTokenInfo } from '@/types/common/tokens';
import type { TTokenData } from '@/types/api/overnightApi';

export const mergeTokenLists = (fetchedTokens: any) => {
  const tokensMap = {
    chainTokenMap: {
      ...fetchedTokens.chainTokenMap,
      ...BLAST_TOKENS,
      59144: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[59144]?.tokenMap,
          ...LINEA_TOKENS[59144].tokenMap,
        },
      },
      10: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[10]?.tokenMap,
          ...OP_TOKENS[10].tokenMap,
        },
      },
      8453: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[8453]?.tokenMap,
          ...SFRAX_TOKEN[8453].tokenMap,
        },
      },
      324: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[324]?.tokenMap,
          ...ZKSYNC_TOKENS[324].tokenMap,
        },
      },
    },
  };

  return tokensMap;
};

export const mergedTokens = (
  fullTokenList: TTokenInfo[],
  balanceTokenList: TTokenInfo[],
  selectedAdd?: string[],
) => {
  const merged = fullTokenList.filter((_) => {
    const tokenExist = balanceTokenList
      .find((bal) => bal?.address?.toLowerCase() === _?.address?.toLowerCase());
    if (tokenExist) return false;

    return true;
  }).concat(balanceTokenList);

  return merged.map((item: any) => ({
    ...item,
    selected: selectedAdd?.includes(item.address?.toLowerCase()) ? item?.selected : false,
  }));
};

// Helper functions
const formatTokenDecimals = (amount: string, decimals: number) => new BigNumber(amount)
  .div(10 ** decimals);

const formatFixed = (amount: BigNumber) => (amount.gt(0) ? fixedByPrice(amount.toNumber()) : 2);

const formatBlanceFixed = (fBalance: BigNumber) => {
  const fixedBy = formatFixed(fBalance);
  return fBalance.toFixed(fixedBy);
};

const formatBalanceInUsd = (fBalance: BigNumber, price: string) => new BigNumber(fBalance).times(price ?? '0').toFixed();
const formatTokenPrice = (
  tokenPrice: string | number,
) => new BigNumber(tokenPrice ?? 0).toFixed(20);

// Formatting tokens
const isOvernightToken = (token: any) => token.protocolId === 'overnight'
  || token.symbol === 'USD+'
  || token.symbol === 'USDC+'
  || token.symbol === 'DAI+'
  || token.symbol === 'USDT+';
  // But not OVN itself (??)
  // || token.symbol === 'OVN';

const getFormatTokenBalance = (token: TTokenInfo, balanceData: TTokenBalanceData) => {
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

export const getFormatTokenInfo = (
  address: string,
  token: any,
  tokenPricesMap: any = null,
  tokenBalanceMap: TTokenBalanceData | null = null,
) => {
  const logoUrl = isOvernightToken(token)
    ? loadOvernightTokenImage(token?.symbol) : loadTokenImage(token?.symbol);

  const tokenInfo = {
    id: token.assetId + address,
    address,
    decimals: token.decimals,
    assetType: token.assetType,
    name: token.name,
    symbol: token.symbol,
    logoUrl: logoUrl.toString(),
    selected: false,
    approveData: {
      allowanceValue: 0,
      approved: false,
    },
    price: tokenPricesMap ? formatTokenPrice(tokenPricesMap[address]) : '0',
    isPoolToken: token?.isPoolToken ?? false,
  };

  return ({
    ...tokenInfo,
    balanceData: tokenBalanceMap ? getFormatTokenBalance(tokenInfo, tokenBalanceMap) : {},
  });
};

export const formatTokenInfo = (
  tokenMap: any,
  tokenPricesMap: any = null,
  tokenBalanceMap: any = null,
) => {
  const tokenInfoList = Object.entries(tokenMap)
    .map(([key, value]) => getFormatTokenInfo(key, value, tokenPricesMap, tokenBalanceMap));

  return tokenInfoList;
};

export const formatTokenInfoPrices = (tokens: any[], tokenPricesMap: any[]) => tokens
  .map((data: any) => ({
    ...data,
    price: new BigNumber(tokenPricesMap[data.address] ?? 0).toFixed(20),
  }));

export const loadContractForToken = (tokenAddress: string, evmSigner: any) => buildEvmContract(
  ERC20_ABI,
  evmSigner,
  tokenAddress,
);

export const formatTokenInfoNew = (
  tokenMap: {[key: string]: TTokenData},
): TTokenInfo[] => {
  const tokenInfoList = Object.values(tokenMap).map((token: TTokenData) => (
    {
      id: token.id,
      address: token.address,
      decimals: token.decimals,
      assetType: 'unknown',
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      logoUrl: token?.image_url ? token.image_url : loadEmptyImg(),
      selected: false,
      approveData: {
        allowanceValue: 0,
        approved: false,
      },
      balanceData: {
        name: token.symbol,
        balance: '0',
        balanceInUsd: '0',
        originalBalance: '0',
        decimal: token.decimals,
      },
      price: token.price,
      isPoolToken: token?.isPoolToken ?? false,
    }
  ));
  
  return tokenInfoList;
};
