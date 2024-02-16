/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { poolsInfoMap } from '@/store/views/main/zapin/mocks.ts';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import BigNumber from 'bignumber.js';

export const getProportion = (poolAddress: string, zapPool: any, zapContract: any) => {
  const poolInfo = poolsInfoMap[poolAddress];
  if (!poolInfo) {
    console.log(
      'Error when get proportion. Gauge not found at pool: ',
      poolAddress,
    );
    return;
  }

  const { gauge } = poolInfo;

  // todo 4: get type from configuration
  if (
    zapPool.data.platform === 'Arbidex'
    || zapPool.data.platform === 'Baseswap'
    || zapPool.data.platform === 'Alienbase'
  ) {
    return zapContract.methods
      .getProportion(gauge, poolInfo.poolId.toString())
      .call()
      .then((data: any) => data)
      .catch((e: any) => {
        console.error(
          'Error get proportion for: ',
          poolAddress,
          gauge,
          poolInfo,
          e,
        );
      });
  }

  return zapContract.methods
    .getProportion(gauge)
    .call()
    .then((data: any) => {
      console.log('Get proportion: ', poolAddress, gauge, data, poolInfo);
      return data;
    })
    .catch((e: any) => {
      console.error(
        'Error get proportion for: ',
        poolAddress,
        gauge,
        poolInfo,
        e,
      );
    });
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
}: any) => {
  const tokenOut0 = Number.parseFloat(
    new BigNumber(outputTokensAmounts[0].toString())
      .div(new BigNumber(10).pow(outputTokensDecimals[0]))
      .toFixed(3)
      .toString(),
  ) * outputTokensPrices[0];
  const tokenOut1 = Number.parseFloat(
    new BigNumber(outputTokensAmounts[1].toString())
      .div(new BigNumber(10).pow(outputTokensDecimals[1]))
      .toFixed(3)
      .toString(),
  ) * outputTokensPrices[1];
  const sumInitialOut = tokenOut0 + tokenOut1;
  let sumInputs = 0;
  for (let i = 0; i < inputTokensAmounts.length; i++) {
    sumInputs
      += Number.parseFloat(
        new BigNumber(inputTokensAmounts[i].toString())
          .div(new BigNumber(10).pow(inputTokensDecimals[i]))
          .toFixed(3)
          .toString(),
      ) * inputTokensPrices[i];
  }
  sumInputs += sumInitialOut;

  const output0InMoneyWithProportion = sumInputs * proportion0;
  const output1InMoneyWithProportion = sumInputs * (1 - proportion0);

  const inputTokens = inputTokensAddresses.map((address: string, index: number) => ({
    tokenAddress: address,
    amount: inputTokensAmounts[index].toString(),
  }));

  if (output0InMoneyWithProportion < tokenOut0) {
    const dif = tokenOut0 - output0InMoneyWithProportion;
    const token0AmountForSwap = new BigNumber(
      (dif / outputTokensPrices[0]).toString(),
    )
      .times(new BigNumber(10).pow(outputTokensDecimals[0]))
      .toFixed(0);
    inputTokens.push({
      tokenAddress: outputTokensAddresses[0],
      amount: token0AmountForSwap.toString(),
    });

    return {
      outputTokens: [
        {
          tokenAddress: outputTokensAddresses[1],
          proportion: 1,
        },
      ],
      inputTokens,
      amountToken0Out: new BigNumber(outputTokensAmounts[0])
        .minus(token0AmountForSwap)
        .toFixed(0),
      amountToken1Out: outputTokensAmounts[1].toString(),
    };
  } if (output1InMoneyWithProportion < tokenOut1) {
    const dif = tokenOut1 - output1InMoneyWithProportion;
    const token1AmountForSwap = new BigNumber(
      (dif / outputTokensPrices[1]).toString(),
    )
      .times(new BigNumber(10).pow(outputTokensDecimals[1]))
      .toFixed(0);
    inputTokens.push({
      tokenAddress: outputTokensAddresses[1],
      amount: token1AmountForSwap.toString(),
    });

    return {
      outputTokens: [
        {
          tokenAddress: outputTokensAddresses[0],
          proportion: 1,
        },
      ],
      inputTokens,
      amountToken0Out: outputTokensAmounts[0].toString(),
      amountToken1Out: new BigNumber(outputTokensAmounts[1])
        .minus(token1AmountForSwap)
        .toFixed(0),
    };
  }
  const difToGetFromOdos0 = output0InMoneyWithProportion - tokenOut0;
  const difToGetFromOdos1 = output1InMoneyWithProportion - tokenOut1;

  return {
    inputTokens,
    outputTokens: [
      {
        tokenAddress: outputTokensAddresses[0],
        proportion: Number.parseFloat(
          (
            difToGetFromOdos0
              / (difToGetFromOdos0 + difToGetFromOdos1)
          ).toFixed(2),
        ),
      },
      {
        tokenAddress: outputTokensAddresses[1],
        proportion: Number.parseFloat(
          (
            difToGetFromOdos1
              / (difToGetFromOdos0 + difToGetFromOdos1)
          ).toFixed(2),
        ),
      },
    ],
    amountToken0Out: new BigNumber(
      (tokenOut0 / outputTokensPrices[0]).toString(),
    )
      .times(new BigNumber(10).pow(outputTokensDecimals[0]))
      .toFixed(0),
    amountToken1Out: new BigNumber(
      (tokenOut1 / outputTokensPrices[1]).toString(),
    )
      .times(new BigNumber(10).pow(outputTokensDecimals[1]))
      .toFixed(0),
  };
};

export const checkApproveForGauge = async (
  poolTokenContract: any,
  checkedAllowanceValue: BigNumber,
  routerContract: any,
  account: any,
) => {
  // checkedAllowanceValue in wei
  const allowanceValue = await getAllowanceValue(
    poolTokenContract,
    account,
    routerContract.options.address,
  );
  return new BigNumber(allowanceValue).isGreaterThanOrEqualTo(checkedAllowanceValue);
};

export const approveGaugeForStake = async (
  showWaitingModal: (val: string) => void,
  closeWaitingModal: VoidFunction,
  showErrorModalWithMsg: (val: any) => void,
  gaugeContract: any,
  poolTokenContract: any,
  account: string,
  routerContract: any,
  gasPriceGwei: any,
) => {
  const approveValue = new BigNumber(10).pow(24);
  showWaitingModal('Approving gauge in process');

  console.log(approveValue, 'approveValue');
  const isGaugeApproved = checkApproveForGauge(
    poolTokenContract,
    approveValue,
    routerContract,
    account,
  );
  if (!isGaugeApproved) {
    closeWaitingModal();
    return;
  }

  // approveToken(tokenContract, routerContract.options.address, approveValue)
  return approveToken(
    poolTokenContract,
    gaugeContract.options.address,
    approveValue,
    account,
    gasPriceGwei,
  )
    .then((data) => {
      closeWaitingModal();
    })
    .catch((e) => {
      console.error('Error when approve token.', e);
      closeWaitingModal();
      showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
    });
};

export const depositAllAtGauge = async (
  account: string,
  lastPoolInfoData: any,
  lastNftTokenId: string,
  currentZapPlatformContractType: any,
  gaugeContract: any,
  gasPriceGwei: any,
  zapPoolRoot: any,
  poolTokenContract: any,
) => {
  const params = { from: account, gasPrice: gasPriceGwei };
  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_TOKEN_ID'
  ) {
    const poolAddress = zapPoolRoot.address;
    const poolInfo = poolsInfoMap[poolAddress];
    return gaugeContract.methods
      .depositAll(poolInfo.poolId)
      .send(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'BASE_CONSTRUCTOR'
  ) {
    return gaugeContract.methods.depositAll().send(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT'
  ) {
    const balance = await poolTokenContract.methods
      .balanceOf(account)
      .call();
    return gaugeContract.methods
      .deposit(lastPoolInfoData.poolId, balance)
      .send(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_NFT_ID'
  ) {
    const data = {
      from: account,
      to: poolTokenContract.options.address,
      tokenId: lastNftTokenId,
      _data:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    return gaugeContract.methods
      .safeTransferFrom(data.from, data.to, data.tokenId, data._data)
      .send(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_STAKE_METHOD_AND_TOKEN_AMOUNT'
  ) {
    const balance = await poolTokenContract.methods
      .balanceOf(account)
      .call();
    return gaugeContract.methods.stake(balance).send(params);
  }

  console.error(
    'Type contracts for deposit in gauge not found: ',
    currentZapPlatformContractType,
    account,
  );
};
