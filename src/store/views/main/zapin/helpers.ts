/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { poolsInfoMap } from '@/store/views/main/zapin/mocks.ts';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import BigNumber from 'bignumber.js';

export const getProportion = (
  poolAddress: string,
  zapPool: any,
  zapContract: any,
  v3Data?: any,
) => {
  const poolInfo = poolsInfoMap[poolAddress];
  if (!poolInfo) {
    console.log(
      'Error when get proportion. Gauge not found at pool: ',
      poolAddress,
    );
    return;
  }

  const { gauge } = poolInfo;

  console.log(v3Data, '___zapPooladdressrange1');
  if (zapPool.poolVersion === 'v3') {
    const rangeData = v3Data?.isStable ? ['0', '0'] : v3Data.range;
    const ticks = v3Data?.isStable ? v3Data.ticks : '0';

    console.log({
      pair: zapPool.address, priceRange: rangeData, amountsOut: ['0', '0'], tickDelta: ticks,
    }, '___zapPooladdressrange');

    return zapContract
      .getProportion({
        pair: zapPool.address, priceRange: rangeData, amountsOut: ['0', '0'], tickDelta: ticks,
      })
      .then((data: any) => data)
      .catch((e: any) => {
        console.error('Error get proportion for V3', e);
      });
  }

  if (zapPool.data.platform[0] === 'Baseswap') {
    return zapContract
      .getProportion(gauge, poolInfo.poolId.toString())
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

  return zapContract
    .getProportion(gauge)
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
};

export const getProportionTicks = (
  zapPool: any,
  zapContract: any,
  v3Data?: any,
) => {
  const rangeData = v3Data?.isStable ? ['0', '0'] : v3Data.range;
  const ticks = v3Data?.isStable ? v3Data.ticks : '0';

  return zapContract
    .getPriceFromTick({
      pair: zapPool.address, priceRange: rangeData, amountsOut: ['0', '0'], tickDelta: ticks,
    })
    .then((data: any) => data)
    .catch((e: any) => {
      console.error('Error get proportion for V3', e);
    });
};

export const checkApproveForGauge = async (
  poolTokenContract: any,
  checkedAllowanceValue: string,
  routerContract: any,
  account: any,
) => {
  const allowanceValue = await getAllowanceValue(
    poolTokenContract,
    account,
    routerContract.target,
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
) => {
  const approveValue = new BigNumber(10).pow(24).toFixed();
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

  try {
    const tx = await approveToken(
      poolTokenContract,
      gaugeContract.target,
      approveValue,
      account,
    );
    await tx.wait();
    closeWaitingModal();
  } catch (e) {
    console.error('Error when approve token.', e);
    closeWaitingModal();
    showErrorModalWithMsg({ errorType: 'approve', errorMsg: e });
  }
};

export const depositAllAtGauge = async (
  account: string,
  lastPoolInfoData: any,
  lastNftTokenId: string,
  currentZapPlatformContractType: any,
  gaugeContract: any,
  zapPoolRoot: any,
  poolTokenContract: any,
) => {
  const params = { from: account };
  console.log(
    account,
    lastPoolInfoData,
    lastNftTokenId,
    currentZapPlatformContractType,
    gaugeContract,
    zapPoolRoot,
    poolTokenContract,
    'DEparamsP',
  );
  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_TOKEN_ID'
  ) {
    const poolAddress = zapPoolRoot.address;
    const poolInfo = poolsInfoMap[poolAddress];
    return gaugeContract.depositAll(poolInfo.poolId, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITHOUT_TOKEN_ID'
  ) {
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.deposit(balance, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'BASE_CONSTRUCTOR'
  ) {
    return gaugeContract.depositAll(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT'
  ) {
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.deposit(lastPoolInfoData.poolId, balance, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_NFT_ID'
  ) {
    const data = {
      from: account,
      to: poolTokenContract.target,
      tokenId: lastNftTokenId,
      _data:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    return gaugeContract.safeTransferFrom(data.from, data.to, data.tokenId, data._data, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_STAKE_METHOD_AND_TOKEN_AMOUNT'
  ) {
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.stake(balance, params);
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
}: any) => {
  const tokenOut0 = Number.parseFloat(
    new BigNumber(outputTokensAmounts[0].toString())
      .div(new BigNumber(10).pow(outputTokensDecimals[0]))
      .toFixed(3, BigNumber.ROUND_DOWN)
      .toString(),
  ) * outputTokensPrices[0];
  const tokenOut1 = Number.parseFloat(
    new BigNumber(outputTokensAmounts[1].toString())
      .div(new BigNumber(10).pow(outputTokensDecimals[1]))
      .toFixed(3, BigNumber.ROUND_DOWN)
      .toString(),
  ) * outputTokensPrices[1];
  const sumInitialOut = tokenOut0 + tokenOut1;
  let sumInputs = 0;
  for (let i = 0; i < inputTokensAmounts.length; i++) {
    sumInputs
      += Number.parseFloat(
        new BigNumber(inputTokensAmounts[i].toString())
          .div(new BigNumber(10).pow(inputTokensDecimals[i]))
          .toFixed(3, BigNumber.ROUND_DOWN)
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
      .toFixed(0, BigNumber.ROUND_DOWN);
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
        .toFixed(0, BigNumber.ROUND_DOWN),
      amountToken1Out: outputTokensAmounts[1].toString(),
    };
  } if (output1InMoneyWithProportion < tokenOut1) {
    const dif = tokenOut1 - output1InMoneyWithProportion;
    const token1AmountForSwap = new BigNumber(
      (dif / outputTokensPrices[1]).toString(),
    )
      .times(new BigNumber(10).pow(outputTokensDecimals[1]))
      .toFixed(0, BigNumber.ROUND_DOWN);

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
        .toFixed(0, BigNumber.ROUND_DOWN),
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
