/* eslint-disable no-restricted-syntax */
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import { fixedByPrice, formatMoney } from '@/utils/numbers.ts';
import { updateTokenValue } from '@/store/helpers/index.ts';

const EVENT_SIG = ['uint256[]', 'address[]'];

enum ZAP_EVENTS {
    'PutIntoPool',
    'ReturnedToUser',
    'InputTokens',
}

const decodeEventData = (eventSignature: string[], eventData: string) => new ethers.AbiCoder()
  .decode(eventSignature, eventData);

const decodeTokenEvent = (data: string) => {
  const decodedData = decodeEventData(EVENT_SIG, data);
  return {
    amounts: decodedData[0],
    addresses: decodedData[1],
  };
};

const getStoreFieldName = (eventName: string) => `lastParsed${eventName}Event`;

export const parseLogs = (
  logs: any,
  commitEventToStore: (storeField: string, data: any) => void,
): void => {
  for (const item of logs) {
    const eventName = item?.eventName;
    if (Object.values(ZAP_EVENTS).includes(eventName)) {
      const storeField = getStoreFieldName(eventName);
      const decodedData = decodeTokenEvent(item?.data);
      commitEventToStore(storeField, decodedData);
    }
  }
};

export const createScaledArray = (start: number, end: number, decimals = 4, maxItems = 10) => {
  const result = [];
  const step = (end - start) / (maxItems - 1); // Calculate the step size

  for (let i = 0; i < maxItems; i++) {
    // Push the current value rounded to four decimal places
    result.push([parseFloat((start + step * i).toFixed(decimals)), 0]);
  }

  return result;
};

export default decodeTokenEvent;

export const mapExcludeLiquidityPlatform = {
  Chronos: ['Chronos Volatile'], // "Chronos Stable"
  // Pancake: ["PancakeSwap", "PancakeSwap V3"],
  // Beefy: ["Aerodrome Stable", "Aerodrome Volatile"],
  Aerodrome: ['Aerodrome Slipstream'],
  Velodrome: [
    'Velodrome Stable',
    'Velodrome Volatile',
    'Velodrome V2 Converter',
    'Velodrome V2 Stable',
    'Velodrome V2 Volatile',
  ],
  // Alienbase: ["Alien Base", "Alien Base Stable"],
  // Convex: ["Curve Crypto Registry", "Curve Factory", "Curve Registry"]
} as any;

export const sourceLiquidityBlacklist = ['Hashflow', 'Wombat'];

export const getUpdatedTokenVal = (
  tokenData: any,
  checkApproveForToken: (tokenData: any, val: string) => void,
) => {
  let newToken = null;
  if (tokenData.isMaxBal) {
    const maxVal = tokenData.selectedToken.balanceData.originalBalance;

    newToken = updateTokenValue(
      tokenData,
      tokenData.value,
      checkApproveForToken,
      maxVal,
    );
  } else {
    newToken = updateTokenValue(
      tokenData,
      tokenData.value,
      checkApproveForToken,
    );
  }

  return {
    contractValue: newToken?.contractValue,
    id: newToken?.id,
    selectedToken: newToken?.selectedToken,
    usdValue: newToken?.usdValue,
    value: newToken?.value,
  };
};

export const removeToken = (tokens: any[], id: string) => {
  // removing by token.id or token.selectedToken.id
  const index = tokens.findIndex(
    (item: any) => item.id === id
      || (item.selectedToken ? item.selectedToken.id === id : false),
  );
  if (index !== -1) {
    if (tokens[index].selectedToken) {
      // eslint-disable-next-line no-param-reassign
      tokens[index].selectedToken.selected = false;
    }

    tokens.splice(index, 1);
  }
};

export const getOdosOutputTokens = (data: any, selectedOutputTokens: any[]) => {
  console.log(data, '___DATA');
  if (!data || !data.outTokens || !data.outAmounts) {
    return [];
  }

  const { outTokens } = data;
  const { outAmounts } = data;
  const selectedOutputTokensCount = selectedOutputTokens.length;
  const outTokensCount = outTokens.length;
  const outAmountsCount = outAmounts.length;

  if (
    selectedOutputTokensCount < 1
    || outTokensCount < 1
    || outAmountsCount < 1
  ) {
    return [];
  }

  const selectedOutputTokensMap: any = {};
  const list = [];

  for (let i = 0; i < selectedOutputTokens.length; i++) {
    const token: any = selectedOutputTokens[i];
    selectedOutputTokensMap[
      token.selectedToken.address.toLowerCase()
    ] = token;
  }

  for (let i = 0; i < data.outTokens?.length; i++) {
    const tokenAddress = data.outTokens[i];
    const tokenAmount = data.outAmounts[i];
    const token: any = selectedOutputTokensMap[tokenAddress.toLowerCase()];
    if (token) {
      const { selectedToken } = token;
      const sum = new BN(tokenAmount)
        .div(10 ** selectedToken.decimals);
      token.sum = sum.toFixed(fixedByPrice(sum.toNumber()) + 2);
    }

    list.push(token);
  }

  return list;
};

export const getZapinOutputTokens = (data: any, selectedOutput: any[], respProp: any) => {
  if (!data || !data.outTokens || !data.outAmounts) {
    return [];
  }

  const { outTokens } = data;
  const { outAmounts } = data;
  const selectedOutputTokensCount = selectedOutput.length;
  const outTokensCount = outTokens.length;
  const outAmountsCount = outAmounts.length;

  if (
    selectedOutputTokensCount < 1
    || outTokensCount < 1
    || outAmountsCount < 1
  ) {
    return [];
  }

  const list = selectedOutput.map((token, key) => {
    const indexOfToken = data.outTokens
      .findIndex((add: string) => add
        .toLowerCase() === token.selectedToken?.address?.toLowerCase());

    const newToken = token;

    if (indexOfToken === -1) {
      const tokenAmount = respProp[4][key];
      const sum = new BN(tokenAmount)
        .div(10 ** token.selectedToken.decimals);

      return {
        ...token,
        sum: sum.toFixed(fixedByPrice(sum.toNumber()) + 2),
        originalBalance: tokenAmount.toString(),
        tokenOut: tokenAmount.toString(),
      };
    }

    if (token) {
      const tokenAmount = data.outAmounts[indexOfToken];
      const sum = new BN(tokenAmount)
        .div(10 ** token.selectedToken.decimals);

      return {
        ...token,
        sum: sum.toFixed(fixedByPrice(sum.toNumber()) + 2),
        originalBalance: tokenAmount,
        tokenOut: '0',
      };
    }

    return newToken;
  });

  return list;
};

const sumOfAllSelectedTokensInUsd = (selectedInputTokens: any[]) => {
  let sum = '0';
  for (let i = 0; i < selectedInputTokens.length; i++) {
    const token: any = selectedInputTokens[i];
    const selectedTokenUsdValue = token.usdValue;
    sum = new BN(
      selectedTokenUsdValue,
    ).plus(sum).toFixed(6, BN.ROUND_DOWN);
  }

  return sum;
};

export const recalculateOutputTokensSum = (
  selectedOutputTokens: any[],
  selectedInputTokens: any[],
) => {
  const list = [];
  for (let i = 0; i < selectedOutputTokens.length; i++) {
    const token: any = selectedOutputTokens[i];
    const tokenSum = new BN(
      sumOfAllSelectedTokensInUsd(selectedInputTokens),
    ).times(token.value).div(100);
    const sum = new BN(tokenSum).div(token.selectedToken.price);
    list.push({
      ...token,
      sum: formatMoney(sum.toNumber(), 4),
    });
  }

  return list;
};
