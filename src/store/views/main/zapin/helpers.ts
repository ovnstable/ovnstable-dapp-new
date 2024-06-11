/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { poolsInfoMap } from '@/store/views/main/zapin/mocks.ts';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import BN from 'bignumber.js';

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

  if (zapPool.poolVersion === 'v3') {
    const rangeData = v3Data.range;
    const ticks = v3Data?.isStable ? v3Data.ticks : '0';
    console.log({
      pair: zapPool.address, priceRange: rangeData, amountsOut: ['0', '0'], tickDelta: ticks,
    }, '__PARAMS');
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
  return new BN(allowanceValue).isGreaterThanOrEqualTo(checkedAllowanceValue);
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
  const approveValue = new BN(10).pow(24).toFixed();
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
  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_V3_WITH_TOKEN_ID'
  ) {
    console.log('1');
    return poolTokenContract.deposit(Number(lastNftTokenId));
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_TOKEN_ID'
  ) {
    console.log('2');
    const poolAddress = zapPoolRoot.address;
    const poolInfo = poolsInfoMap[poolAddress];
    return gaugeContract.depositAll(poolInfo.poolId, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITHOUT_TOKEN_ID'
  ) {
    console.log('3');
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.deposit(balance, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'BASE_CONSTRUCTOR'
  ) {
    console.log('4');
    return gaugeContract.depositAll(params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT'
  ) {
    console.log('15');
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.deposit(lastPoolInfoData.poolId, balance, params);
  }

  if (
    currentZapPlatformContractType.typeOfDepositConstructor
    === 'CONSTRUCTOR_WITH_NFT_ID'
  ) {
    console.log('6');
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
    console.log('7');
    const balance = await poolTokenContract.balanceOf(account);
    return gaugeContract.stake(balance, params);
  }
};

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
  const tokenOut0 = Number.parseFloat(
    new BN(outputTokensAmounts[0].toString())
      .div(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(3, BN.ROUND_DOWN)
      .toString(),
  ) * outputTokensPrices[0];
  const tokenOut1 = Number.parseFloat(
    new BN(outputTokensAmounts[1].toString())
      .div(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(3, BN.ROUND_DOWN)
      .toString(),
  ) * outputTokensPrices[1];
  const sumInitialOut = tokenOut0 + tokenOut1;
  let sumInputs = 0;
  for (let i = 0; i < inputTokensAmounts.length; i++) {
    sumInputs
      += Number.parseFloat(
        new BN(inputTokensAmounts[i].toString())
          .div(new BN(10).pow(inputTokensDecimals[i]))
          .toFixed(3, BN.ROUND_DOWN)
          .toString(),
      ) * inputTokensPrices[i];
  }
  sumInputs += sumInitialOut;

  const output0InMoneyWithProportion = new BN(sumInputs).times(proportion0);
  const output1InMoneyWithProportion = new BN(sumInputs).times(new BN(1).minus(proportion0));

  const inputTokens = inputTokensAddresses.map((address: string, index: number) => ({
    tokenAddress: address,
    amount: inputTokensAmounts[index].toString(),
  }));

  if (output0InMoneyWithProportion.lt(tokenOut0)) {
    const dif = new BN(tokenOut0).minus(output0InMoneyWithProportion);
    const token0AmountForSwap = new BN(
      (dif.div(outputTokensPrices[0])).toString(),
    )
      .times(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(0, BN.ROUND_DOWN);
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
      amountToken0Out: new BN(outputTokensAmounts[0])
        .minus(token0AmountForSwap)
        .toFixed(0, BN.ROUND_DOWN),
      amountToken1Out: outputTokensAmounts[1].toString(),
    };
  } if (output1InMoneyWithProportion.lt(tokenOut1)) {
    const dif = new BN(tokenOut1).minus(output1InMoneyWithProportion);
    const token1AmountForSwap = new BN(
      (new BN(dif).div(outputTokensPrices[1])).toString(),
    )
      .times(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(0, BN.ROUND_DOWN);

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
      amountToken1Out: new BN(outputTokensAmounts[1])
        .minus(token1AmountForSwap)
        .toFixed(0, BN.ROUND_DOWN),
    };
  }
  const difToGetFromOdos0 = output0InMoneyWithProportion.minus(tokenOut0);
  const difToGetFromOdos1 = output1InMoneyWithProportion.minus(tokenOut1);

  return {
    inputTokens,
    outputTokens: [
      {
        tokenAddress: outputTokensAddresses[0],
        proportion: Number.parseFloat(
          (
            new BN(difToGetFromOdos0).div(new BN(difToGetFromOdos0).plus(difToGetFromOdos1))
          ).toFixed(2),
        ),
      },
      {
        tokenAddress: outputTokensAddresses[1],
        proportion: Number.parseFloat(
          (
            new BN(difToGetFromOdos1).div(new BN(difToGetFromOdos0).plus(difToGetFromOdos1))
          ).toFixed(2),
        ),
      },
    ],
    amountToken0Out: new BN(
      (new BN(tokenOut0).div(outputTokensPrices[0])).toString(),
    )
      .times(new BN(10).pow(outputTokensDecimals[0]))
      .toFixed(0),
    amountToken1Out: new BN(
      (new BN(tokenOut1).div(outputTokensPrices[1])).toString(),
    )
      .times(new BN(10).pow(outputTokensDecimals[1]))
      .toFixed(0),
  };
};
