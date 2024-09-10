/* eslint-disable no-restricted-syntax */
import { ethers } from 'ethers';
import { updateTokenValue } from '@/store/helpers/index.ts';

const EVENT_SIG = ['uint256[]', 'address[]'];

enum ZAP_EVENTS {
    'PutIntoPool',
    'ReturnedToUser',
    'InputTokens'
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

export default decodeTokenEvent;
