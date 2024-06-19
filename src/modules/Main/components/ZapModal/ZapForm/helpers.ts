import { ethers } from 'ethers';

const EVENT_SIG = ['uint256[]', 'address[]'];

enum ZAP_EVENTS {
    'PutIntoPool',
    'ReturnedToUser',
    // 'TokenId', //'uint256[]' 
    'InputTokens'
};

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

export const parseLogs = (logs: any, commitEventToStore: (storeField: string, data: any) => void): void => {
    for (const item of logs) {
        const eventName = item?.eventName;
        if (Object.values(ZAP_EVENTS).includes(eventName)) {
          const storeField = getStoreFieldName(eventName);
          const decodedData = decodeTokenEvent(item?.data);
            commitEventToStore(storeField, decodedData);
        }
    }

};



export default decodeTokenEvent;
