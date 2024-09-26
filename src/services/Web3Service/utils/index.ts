/* eslint-disable no-restricted-syntax */
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import { fixedByPrice } from '@/utils/numbers.ts';
import { getNewOutputToken, getTokenByAddress, updateTokenValue } from '@/store/helpers/index.ts';
import { loadAbi, REWARD_TOKEN, srcStringBuilder } from '@/store/views/main/zapin/index.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { markRaw } from 'vue';
import { ZAPIN_SCHEME } from './scheme.ts';

const EVENT_SIG = ['address[]', 'uint256[]'];
const ZAP_RESULT_SIG = [
  'address[]', // tokens
  'uint256[]', // initialAmounts
  'uint256[]', // putAmounts
  'uint256[]', // returnedAmounts
];

enum ZAP_EVENTS {
    'PutIntoPool',
    'ReturnedToUser',
    'InputTokens',
}

interface IProportion {
  inputTokensDecimals: number[],
  inputTokensAddresses: string[],
  inputTokensAmounts: string[],
  inputTokensPrices: number[],
  outputTokensDecimals: string[],
  outputTokensAddresses: string[],
  outputTokensAmounts: string[],
  outputTokensPrices: number[],
  proportion0: string,
}

export const sumOfAllSelectedTokensInUsd = (selectedInputTokens: any[]) => {
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

const decodeEventData = (eventSignature: string[], eventData: string) => new ethers.AbiCoder()
  .decode(eventSignature, eventData);

const decodeTokenEvent = (data: string) => {
  const decodedData = decodeEventData(EVENT_SIG, data);

  return {
    amounts: decodedData[1],
    addresses: decodedData[0],
  };
};

const decodeReceiptEvent = (
  data: string,
  commitEventToStore: (storeField: string, data: any) => void,
) => {
  const decodedData = decodeEventData(ZAP_RESULT_SIG, data);

  const [
    addresses,
    inputTokens,
    putIntoPool,
    retuernedToUser,
  ] = decodedData;

  commitEventToStore('lastParsedInputTokensEvent', { addresses, amounts: inputTokens });
  commitEventToStore('lastParsedReturnedToUserEvent', { addresses, amounts: retuernedToUser });
  commitEventToStore('lastParsedPutIntoPoolEvent', { addresses, amounts: putIntoPool });
};

const getStoreFieldName = (eventName: string) => `lastParsed${eventName}Event`;

export const parseLogs = (
  logs: any,
  commitEventToStore: (storeField: string, data: any) => void,
): void => {
  for (const item of logs) {
    const eventName = item?.eventName;
    if (eventName === 'ZapResult') decodeReceiptEvent(item?.data, commitEventToStore);
    else if (Object.values(ZAP_EVENTS).includes(eventName)) {
      const storeField = getStoreFieldName(eventName);
      const decodedData = decodeTokenEvent(item?.data);
      commitEventToStore(storeField, decodedData);
    }
  }
};

export const calculateProportionForPool = ({
  inputTokensDecimals,
  inputTokensAddresses,
  inputTokensAmounts,
  inputTokensPrices,
  outputTokensDecimals,
  outputTokensAddresses,
  outputTokensAmounts,
  outputTokensPrices,
  proportion0,
}: IProportion) => {
  const tokenOut0 = new BN(
    new BN(outputTokensAmounts[0])
      .div(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(3, BN.ROUND_DOWN),
  )
    .times(outputTokensPrices[0])
    .toFixed();

  const tokenOut1 = new BN(
    new BN(outputTokensAmounts[1])
      .div(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(3, BN.ROUND_DOWN),
  )
    .times(outputTokensPrices[1])
    .toFixed();

  const sumInitialOut = tokenOut0 + tokenOut1;

  let sumInputs = new BN(0);

  for (let i = 0; i < inputTokensAmounts.length; i++) {
    sumInputs = sumInputs.plus(new BN(
      new BN(inputTokensAmounts[i])
        .div(new BN(10).pow(inputTokensDecimals[i]))
        .toFixed(3, BN.ROUND_DOWN),
    ).times(inputTokensPrices[i]));
  }

  sumInputs = sumInputs.plus(sumInitialOut);

  const output0InMoneyWithProportion = new BN(sumInputs).times(proportion0);
  const output1InMoneyWithProportion = new BN(sumInputs).times(new BN(1).minus(proportion0));

  const inputTokens = inputTokensAddresses.map((address: string, index: number) => ({
    tokenAddress: address,
    amount: inputTokensAmounts[index],
  }));

  if (output0InMoneyWithProportion.lt(tokenOut0)) {
    const dif = new BN(tokenOut0).minus(output0InMoneyWithProportion);
    const token0AmountForSwap = new BN(
      dif.div(outputTokensPrices[0]),
    )
      .times(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(0, BN.ROUND_DOWN);

    inputTokens.push({
      tokenAddress: outputTokensAddresses[0],
      amount: token0AmountForSwap,
    });

    console.log('1');
    return {
      outputTokens: [
        {
          tokenAddress: outputTokensAddresses[1],
          proportion: 1,
        },
      ],
      inputTokens,
      amountToken0Out: new BN(outputTokensAmounts[0])
        .minus(token0AmountForSwap)
        .toFixed(0, BN.ROUND_DOWN),
      amountToken1Out: outputTokensAmounts[1],
    };
  } if (output1InMoneyWithProportion.lt(tokenOut1)) {
    const dif = new BN(tokenOut1).minus(output1InMoneyWithProportion);
    const token1AmountForSwap = new BN(
      new BN(dif).div(outputTokensPrices[1]),
    )
      .times(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(0, BN.ROUND_DOWN);

    inputTokens.push({
      tokenAddress: outputTokensAddresses[1],
      amount: token1AmountForSwap,
    });

    console.log('2222');
    return {
      outputTokens: [
        {
          tokenAddress: outputTokensAddresses[0],
          proportion: 1,
        },
      ],
      inputTokens,
      amountToken0Out: outputTokensAmounts[0],
      amountToken1Out: new BN(outputTokensAmounts[1])
        .minus(token1AmountForSwap)
        .toFixed(0, BN.ROUND_DOWN),
    };
  }
  const difToGetFromOdos0 = output0InMoneyWithProportion.minus(tokenOut0);
  const difToGetFromOdos1 = output1InMoneyWithProportion.minus(tokenOut1);

  console.log('3333');
  return {
    inputTokens,
    outputTokens: [
      {
        tokenAddress: outputTokensAddresses[0],
        proportion:
        Number(new BN(difToGetFromOdos0)
          .div(new BN(difToGetFromOdos0).plus(difToGetFromOdos1))
          .toFixed(2)),
      },
      {
        tokenAddress: outputTokensAddresses[1],
        proportion:
            Number(new BN(difToGetFromOdos1)
              .div(new BN(difToGetFromOdos0).plus(difToGetFromOdos1))
              .toFixed(2)),
      },
    ],
    amountToken0Out: new BN(
      new BN(tokenOut0).div(outputTokensPrices[0]),
    )
      .times(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(0),
    amountToken1Out: new BN(
      new BN(tokenOut1).div(outputTokensPrices[1]),
    )
      .times(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(0),
  };
};

export const countPercentDiff = (valueA: string, valueB: string) => {
  const difference = new BN(valueA).minus(valueB);
  const percentageDifference = new BN(new BN(difference).div(valueA).times(100)).abs().toFixed();
  return percentageDifference;
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

export const getSourceLiquidityBlackList = (zapPool: any) => {
  let sourceBlacklist = [...sourceLiquidityBlacklist];
  // excluding platform for big liquidities zapins
  const excludeLiquidityByPlatform = mapExcludeLiquidityPlatform[
    zapPool.platform[0]
  ];
  if (excludeLiquidityByPlatform && excludeLiquidityByPlatform.length) {
    sourceBlacklist = [...sourceBlacklist, ...excludeLiquidityByPlatform];
  }

  return sourceBlacklist;
};

export const initZapData = (
  requestData: any,
  responseData: any,
  amountMins: string[],
  getSlippagePercent: number,
  zapPoolAdd: string,
  proportions: any,
  v3Range: any,
) => {
  const txData = {
    inputs: requestData.inputT,
    outputs: requestData.outputT.map((_: any, key: number) => ({
      ..._,
      amountMin: new BN(amountMins[key])
        .times(1 - getSlippagePercent / 100)
        .toFixed(0),
    })),
    data: responseData ? responseData.transaction.data : '0x',
  };

  const gaugeData = {
    pool: zapPoolAdd,
    tickRange: v3Range.ticks,
    amountsOut: [proportions.amountToken0Out, proportions.amountToken1Out],
    isSimulation: true,
    adjustSwapSide: false,
    adjustSwapAmount: 0,
  };

  return {
    gaugeData,
    txData,
  };
};

export const initReqData = (
  requestInputTokens: any[],
  requestOutputTokens: any[],
  zapAdd: string,
) => {
  const requestInput = [];

  for (let i = 0; i < requestInputTokens.length; i++) {
    requestInput.push({
      tokenAddress: requestInputTokens[i].tokenAddress,
      amountIn: requestInputTokens[i].amount,
    });
  }

  const requestOutput = [];
  for (let i = 0; i < requestOutputTokens.length; i++) {
    requestOutput.push({
      tokenAddress: requestOutputTokens[i].tokenAddress,
      receiver: zapAdd,
    });
  }

  return {
    inputT: requestInput,
    outputT: requestOutput,
  };
};

export const initZapinContracts = async (
  zapPool: any,
  mergedAllTokens: any[],
  evmSigner: any,
  gaugeAddress?: string,
) => {
  const tokenA = getTokenByAddress(zapPool?.token0Add, mergedAllTokens);
  const tokenB = getTokenByAddress(zapPool?.token1Add, mergedAllTokens);
  if (!zapPool.platform[0]) throw new Error('Platform not found');

  const platform = zapPool.platform[0]?.toLowerCase();

  const abiGauge = srcStringBuilder('V3GaugeRebalance')(zapPool.chainName, zapPool.platform[0]);
  const abiGaugeContractFileV3 = await loadAbi(abiGauge);

  const abiV3Zap = srcStringBuilder('Contract')('v3', 'Zapin');
  const abiContractV3Zap = await loadAbi(abiV3Zap);
  const abiZapAdd = ZAPIN_SCHEME[zapPool.chainName as keyof typeof ZAPIN_SCHEME][
    platform as keyof typeof ZAPIN_SCHEME.arbitrum
  ]?.zapinAdd;

  if (!abiZapAdd) throw new Error('abiZapAdd not found');

  // possible todo, make separate folder for it, if its same every time
  const abiV3Nft = srcStringBuilder('V3Nft')(zapPool.chainName, zapPool.platform[0]);
  const abiContractV3Nft = await loadAbi(abiV3Nft);

  const gaugeContract = gaugeAddress ? buildEvmContract(
    abiGaugeContractFileV3.abi,
    evmSigner,
    gaugeAddress,
  ) : null;

  // without markRaw, we can't read contract errors by interface
  const zapContract = markRaw(buildEvmContract(
    abiContractV3Zap.abi,
    evmSigner,
    abiZapAdd,
  ));

  console.log(zapContract, '__zapContract');

  const poolTokenContract = buildEvmContract(
    abiContractV3Nft.abi,
    evmSigner,
    abiContractV3Nft.address,
  );

  const poolTokens = [tokenA, tokenB];

  return {
    gaugeContract,
    zapContract,
    poolTokenContract,
    poolTokens,
  };
};

export const initOutputToken = (selectedToken: any, locked: any, startPercent: any) => ({
  ...getNewOutputToken(),
  locked,
  value: startPercent,
  selectedToken,
});

export const getSymbolEmmToken = (platform: string) => {
  if (platform === 'Pancake') return REWARD_TOKEN.CAKE;
  if (platform === 'Aerodrome') return REWARD_TOKEN.AERO;
  return '';
};
