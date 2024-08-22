/* eslint-disable no-restricted-syntax */
import { ethers } from 'ethers';

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
