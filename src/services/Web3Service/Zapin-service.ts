/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { poolsInfoMap } from '@/store/views/main/zapin/mocks.ts';
import { approveToken, getAllowanceValue } from '@/utils/contractApprove.ts';
import BN from 'bignumber.js';
import { fixedByPrice, formatMoney } from '@/utils/numbers.ts';
import { WHITE_LIST_ODOS } from '@/store/helpers/index.ts';
import { ethers } from 'ethers';
import { MODAL_TYPE, ODOS_REF_CODE, type ITriggerSuccessZapin } from '@/store/views/main/odos/index.ts';
import { parseErrorLog } from '@/utils/errors.ts';
import type { IPositionsInfo } from '@/types/positions/index.ts';
import { PLATFORMS } from '@/types/common/pools/index.ts';
import {
  calculateProportionForPool,
  countPercentDiff,
  getSourceLiquidityBlackList,
  sumOfAllSelectedTokensInUsd,
} from './utils/index.ts';
import { OvernightApi, type IOvernightApi } from '../ApiService/OvernightApi.ts';
import {
  Distributor__factory,
  type MerklAPIData,
  registry,
} from "@angleprotocol/sdk";
import axios from 'axios';

export enum ZAPIN_TYPE {
  ZAPIN,
  REBALANCE,
  MERGE,
}

export enum ZAPIN_FUNCTIONS {
  ZAPIN = 'zapIn',
  REBALANCE = 'rebalance',
  INCREASE = 'increase',
  MERGE = 'merge',
}

interface IZapinProportion {
  outputToken: any[]
  odosData: {
    priceImpact: number,
    percentDiff: number,
    netOutValue: number,
    pathId: string | null
  }
  amountMins: string[]
}

interface IRecalculateProportionOdosV3 {
  selectedInputTokens: any[],
  selectedOutputTokens: any[],
  zapPool: any,
  zapContract: any,
  v3RangeTicks: string[],
  networkId: number,
  slippageLimitPercent: number,
  odosSwapRequest: Function,
  simulateSwap: boolean,
  typeFunc: ZAPIN_TYPE,
  showErrorModalWithMsg: (val: any) => void,
  mergeIds?: string[]
}

interface ISwapData {
  tokenAddress: string,
  price: string;
  amount: string;
}

interface IPoolTokensData {
  tokenAddress: string,
  price: string;
}

// for positions
export const ACTIVE_PROTOCOLS_V3 = {
  AERODROME: [8453],
  PANCAKE: [8453, 42161],
};

class ZapinService {
  private overnightApi: IOvernightApi;

  constructor() {
    this.overnightApi = new OvernightApi();
  }

  async claimUniswap(chainId: number, signer: any) {
    let data: any;
    try {
      console.log(signer, '__signer')
      data = (
        await axios.get(
          `https://api.merkl.xyz/v3/userRewards?chainId=${chainId}&user=${signer.address?.toLowerCase()}&proof=true`,
          {
            timeout: 5000,
          }
        )
      ).data;
    } catch {
      throw "Angle API not responding";
    }

    console.log(data, '___data')
    const tokens = Object.keys(data).filter(
      (k) => data[k].proof !== undefined || data[k].proof.length > 0
    );
    const claims = tokens.map((t) => data[t].accumulated);
    const proofs = tokens.map((t) => data[t].proof);

    if (tokens.length === 0) throw "No tokens to claim";

    const contractAddress = registry(chainId)?.Merkl?.Distributor;
    if (!contractAddress) throw "Chain not supported";
    const contract = Distributor__factory.connect(contractAddress, signer);
    await (
      await contract.claim(
        tokens.map((t) => signer._address),
        tokens,
        claims,
        proofs as string[][]
      )
    ).wait();
  }

  async claimPosition(
    zapPool: IPositionsInfo,
    gaugeContract: any,
    poolTokenContract: any,
    triggerSuccess: (successData: ITriggerSuccessZapin) => void,
    account: string,
    evmSigner: any,
    chainId: number,
    inputTokens?: any[],
  ) {
    let tx = null;

    if (zapPool?.platform[0] === PLATFORMS.UNI) {
      tx = await this.claimUniswap(chainId, evmSigner);
    }

    if (zapPool?.platform[0] === PLATFORMS.PANCAKE && zapPool.isStaked) {
      tx = await gaugeContract.harvest(zapPool.tokenId, account);
      tx = await gaugeContract.collect({
        tokenId: zapPool.tokenId,
        recipient: account,
        amount0Max: new BN(10).pow(24).toFixed(),
        amount1Max: new BN(10).pow(24).toFixed()
      });
    }

    if (zapPool?.platform[0] === PLATFORMS.PANCAKE && !zapPool.isStaked) {
      tx = await gaugeContract.collect({
        tokenId: zapPool.tokenId,
        recipient: account,
        amount0Max: new BN(10).pow(24).toFixed(),
        amount1Max: new BN(10).pow(24).toFixed()
      });
    }

    if (zapPool?.platform[0] === PLATFORMS.AERO && zapPool.isStaked) {
      tx = await gaugeContract.getReward(zapPool.tokenId);
    }

    if (zapPool?.platform[0] === PLATFORMS.AERO && !zapPool.isStaked) {
      console.log(poolTokenContract, "COLLECT")
      tx = await poolTokenContract.collect({
        tokenId: zapPool.tokenId,
        recipient: account,
        amount0Max: new BN(10).pow(24).toFixed(),
        amount1Max: new BN(10).pow(24).toFixed()
      });
    }

    if (!tx) throw new Error("Can't be claimed");

    await tx.wait();

    const successData = {
      isShow: true,
      inputTokens: inputTokens ?? zapPool.rewards.tokensInfo ?? [],
      outputTokens: inputTokens ?? zapPool.rewards.tokensInfo ?? [],
      hash: tx.hash,
      pool: zapPool,
      modalType: MODAL_TYPE.HARVEST,
      putIntoPoolEvent: {},
      returnedToUserEvent: {},
    };

    triggerSuccess(successData);

    return tx;
  }

  async getV3Rebalance(
    tokenId: number,
    poolAddress: string,
    tickRange: string[],
    inputSwapTokens: IPoolTokensData[],
    zapContract: any,
  ) {
    return zapContract
      .getProportionForRebalance(Number(tokenId), poolAddress, tickRange, inputSwapTokens);
  }

  async getV3PositionAmounts(
    zapContract: any,
    tokenId: string,
  ) {
    return zapContract
      .getPositionAmounts(tokenId)
      .then((data: any) => data)
      .catch((e: any) => {
        console.error('Error get proportion for V3', e);
      });
  }

  async getV3Proportion(
    poolAddress: string,
    tickRange: string[],
    inputSwapTokens: ISwapData[],
    zapContract: any,
    tokenIds = [] as string[],
  ) {
    console.log({pair: poolAddress, tickRange, inputTokens: inputSwapTokens, tokenIds}, '___ARGS');
    return zapContract
      .getProportionForZap({
        pair: poolAddress,
        tickRange,
        inputTokens: inputSwapTokens,
        tokenIds
      })
      .then((data: any) => data)
      .catch((e: any) => {
        console.log(JSON.parse(JSON.stringify(e)), '___decoded1');
        const decoded = zapContract.interface.parseError(e?.data);
        console.log(decoded, '__ERR');
      });
  }

  async getV2Reserves(
    poolAddress: string,
    zapPool: any,
    zapContract: any,
  ) {
    const poolInfo = poolsInfoMap[poolAddress];
    if (!poolInfo) return null;

    const { gauge } = poolInfo;

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
  }

  async checkApproveForGauge(
    poolTokenContract: any,
    checkedAllowanceValue: string,
    routerContract: any,
    account: any,
  ) {
    const allowanceValue = await getAllowanceValue(
      poolTokenContract,
      account,
      routerContract.target,
    );

    return new BN(allowanceValue).isGreaterThanOrEqualTo(checkedAllowanceValue);
  }

  async approveGaugeForStake(
    showWaitingModal: (val: string) => void,
    closeWaitingModal: () => void,
    showErrorModalWithMsg: (val: any) => void,
    gaugeContract: any,
    poolTokenContract: any,
    account: string,
    routerContract: any,
  ) {
    const approveValue = new BN(10).pow(24).toFixed();
    showWaitingModal('Approving gauge in process');

    console.log(approveValue, 'approveValue');
    const isGaugeApproved = this.checkApproveForGauge(
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
      closeWaitingModal();
      showErrorModalWithMsg({ errorMsg: parseErrorLog(e) });
    }
  }

  async depositAllAtGauge(
    account: string,
    lastPoolInfoData: any,
    lastNftTokenId: string,
    currentZapPlatformContractType: any,
    gaugeContract: any,
    zapPoolRoot: any,
    poolTokenContract: any,
    gaugeContractV3: any,
  ) {
    const params = { from: account };
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
      return gaugeContract.deposit(balance);
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

    // v3 pools at diff dex, have diff methods
    if (
      currentZapPlatformContractType.typeOfDepositConstructor
      === 'CONSTRUCTOR_V3_WITH_TOKEN_ID'
    ) {
      console.log(lastNftTokenId, '1');
      return gaugeContractV3.deposit(Number(lastNftTokenId));
    }

    console.log(currentZapPlatformContractType, '__currentZapPlatformContractType');

    if (
      currentZapPlatformContractType.typeOfDepositConstructor
      === 'CONSTRUCTOR_WITH_NFT_ID'
    ) {
      console.log('6');
      const data = {
        from: account,
        to: poolTokenContract.target,
        tokenId: lastNftTokenId,
        nftData:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      };
      return gaugeContract.safeTransferFrom(data.from, data.to, data.tokenId, data.nftData, params);
    }

    if (
      currentZapPlatformContractType.typeOfDepositConstructor
      === 'CONSTRUCTOR_STAKE_METHOD_AND_TOKEN_AMOUNT'
    ) {
      console.log('7');
      const balance = await poolTokenContract.balanceOf(account);
      return gaugeContract.stake(Number(balance));
    }

    return null;
  }

  getZapinOutputTokens(
    data: any,
    respProp: any,
    selectedOutput: any[],
    selectedInput: any[],
  ): IZapinProportion | null {
    if (!data || !data.outTokens || !data.outAmounts) return null;

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
      return null;
    }

    const list = selectedOutput.map((token, key) => {
      const indexOfToken = data.outTokens
        .findIndex((add: string) => add
          .toLowerCase() === token.selectedToken?.address?.toLowerCase());

      const newToken = token;

      if (indexOfToken === -1) {
        const amountOut = respProp[4][key];
        const sum = new BN(amountOut)
          .div(10 ** token.selectedToken.decimals);

        return {
          ...token,
          sum: sum.toFixed(fixedByPrice(sum.toNumber()) + 2),
          amountMin: amountOut.toString(),
          tokenOut: amountOut?.toString(),
        };
      }

      if (token) {
        const tokenAmount = data.outAmounts[indexOfToken];
        const amountOut = respProp[4][key];
        const tokenAmountProp = respProp[4][key];
        const sum = new BN(tokenAmount)
          .plus(tokenAmountProp)
          .div(10 ** token.selectedToken.decimals);

        return {
          ...token,
          sum: sum.toFixed(fixedByPrice(sum.toNumber()) + 2),
          amountMin: tokenAmount,
          tokenOut: amountOut?.toString(),
        };
      }

      return newToken;
    });

    const amountMins = list.map((_) => {
      const tokenFound = data.outTokens.map((_: string) => _.toLowerCase())
        .includes(_.selectedToken.address?.toLowerCase());

      return tokenFound ? _.amountMin : '0';
    });

    const totalInputUsd = selectedInput
      .reduce((acc: BN, curr:any) => acc.plus(curr.usdValue), new BN(0)).toFixed();

    const totalOutputUsd = list
      .reduce((acc, curr) => acc
        .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0))
      .toFixed();

    return {
      outputToken: list,
      odosData: {
        ...data,
        percentDiff: countPercentDiff(totalInputUsd, totalOutputUsd),
        netOutValue: totalOutputUsd,
      },
      amountMins,
    };
  }

  recalculateOutputTokensSum(
    selectedOutputTokens: any[],
    selectedInputTokens: any[],
  ) {
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
  }

  async getV2Proportions(
    userInputTokens: any[],
    poolOutputTokens: any[],
    zapPool: any,
    zapContract: any,
  ) {
    const outputToken0Price = poolOutputTokens[0].selectedToken.price;
    const outputToken1Price = poolOutputTokens[1].selectedToken.price;

    const reserves = await this.getV2Reserves(
      zapPool.address,
      zapPool,
      zapContract,
    );

    const sumReserves = (
      new BN(reserves.token0Amount).times(outputToken0Price)
    )
      .plus(
        new BN(reserves.token1Amount).times(outputToken1Price),
      ).toFixed(0);

    const formulaInputTokens = [];
    let formulaOutputTokens = [];

    for (let i = 0; i < userInputTokens.length; i++) {
      const inputToken = userInputTokens[i];
      const userInputToken = inputToken.selectedToken;

      const isFindUserInputTokenInPoolTokens = poolOutputTokens.find(
        (poolToken) => poolToken.selectedToken.address === userInputToken.address,
      );

      if (isFindUserInputTokenInPoolTokens) {
      // if user token exist in pool pair, move to output for proportion formula
        formulaOutputTokens.push({
          decimals: userInputToken.decimals,
          address: userInputToken.address,
          contractValue: inputToken.contractValue,
          price: userInputToken.price,
        });
        // eslint-disable-next-line no-continue
        continue;
      }

      // if user token don't exist in pool pair, move to input for proportion formula
      formulaInputTokens.push({
        decimals: userInputToken.decimals,
        address: userInputToken.address,
        contractValue: inputToken.contractValue,
        price: userInputToken.price,
      });
    }

    // sort output formula and fill amount by 0;
    const formulaResultOutputWithZero = [];
    for (let i = 0; i < poolOutputTokens.length; i++) {
      const outputToken = poolOutputTokens[i];
      const poolOutputToken = outputToken.selectedToken;
      const userInputTokenInFormulaOutputTokens = formulaOutputTokens.find(
        (formulaToken) => formulaToken.address === poolOutputToken.address,
      );
      if (userInputTokenInFormulaOutputTokens) {
      // if user token exist in pool pair, move to output for proportion formula
        formulaResultOutputWithZero.push(userInputTokenInFormulaOutputTokens);
        // eslint-disable-next-line no-continue
        continue;
      }

      // fill amount with 0
      formulaResultOutputWithZero.push({
        decimals: poolOutputToken.decimals,
        address: poolOutputToken.address,
        contractValue: 0,
        price: poolOutputToken.price,
      });
    }

    // formulaOutputTokens sorted by pool pair and with zero for not exist in output formula.
    formulaOutputTokens = formulaResultOutputWithZero;

    const inputDecimals = formulaInputTokens.map((token: any) => token.decimals);
    const inputAddresses = formulaInputTokens.map((token: any) => token.address);
    const inputAmounts = formulaInputTokens.map((token: any) => token.contractValue);
    const inputPrices = formulaInputTokens.map((token: any) => token.price);

    // (!) List - formulaOutputTokens with 0 amount and sort like in pool pair.
    const outputDecimals = formulaOutputTokens.map((token: any) => token.decimals);
    const outputAddresses = formulaOutputTokens.map((token: any) => token.address);
    const outputAmounts = formulaOutputTokens.map((token: any) => token.contractValue);
    const outputPrices = formulaOutputTokens.map((token: any) => token.price);

    return calculateProportionForPool({
      inputTokensDecimals: [...inputDecimals],
      inputTokensAddresses: [...inputAddresses],
      inputTokensAmounts: [...inputAmounts],
      inputTokensPrices: [...inputPrices],
      outputTokensDecimals: [...outputDecimals],
      outputTokensAddresses: [...outputAddresses],
      outputTokensAmounts: [...outputAmounts],
      outputTokensPrices: [...outputPrices],
      proportion0: new BN(reserves[0])
        .times(outputPrices[0])
        .div(sumReserves)
        .toFixed(),
    });
  }

  async stakeTrigger(
    zapPlatform: PLATFORMS,
    gaugeContract: any,
    newTokenId: number | string,
    account: string,
    poolTokenContract: any,
  ) {
    try {
      let tx: any = null;

      console.log(poolTokenContract, '___poolTokenContract');
      console.log(gaugeContract, '___this.gaugeContract');
      if (zapPlatform === PLATFORMS.AERO) tx = await gaugeContract.deposit(newTokenId);

      if (zapPlatform === PLATFORMS.PANCAKE) {
        const data = {
          from: account,
          to: gaugeContract.target,
          tokenId: newTokenId,
          _data: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };

        tx = await poolTokenContract
          .safeTransferFrom(data.from, data.to, data.tokenId, data._data, { from: account });
      }

      await tx.wait();

      return tx;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async withdrawTrigger(
    zapPool: IPositionsInfo,
    tokenId: string,
    gaugeContract: any,
    account?: string,
  ) {
    try {
      let tx: any = null;

      console.log(gaugeContract, '___this.gaugeContract');
      if (zapPool.platform[0] === PLATFORMS.AERO) {
        tx = await gaugeContract.withdraw(tokenId);
      }

      if (zapPool.platform[0] === PLATFORMS.PANCAKE) {
        tx = await gaugeContract.withdraw(tokenId, account);
      }

      return await tx.wait();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async triggerZapin(
    zapContract: any,
    argTxData: any,
    argGaugeData: any,
    params: any,
    method: ZAPIN_FUNCTIONS,
    tokenId?: string,
    tokensMerge?: string[],
  ) {
    const txData = { ...argTxData };
    let gaugeData = { ...argGaugeData, tokenId: tokenId ?? 0, tokensOut: tokensMerge ?? [] };

    console.log(gaugeData, '___gaugeData')
    if (gaugeData.isSimulation) {
      try {
        if (method === ZAPIN_FUNCTIONS.MERGE) {
          await zapContract[method](txData, gaugeData);
        }
        if (method === ZAPIN_FUNCTIONS.ZAPIN) {
          await zapContract[method](txData, gaugeData);
        }
        if ([ZAPIN_FUNCTIONS.REBALANCE, ZAPIN_FUNCTIONS.INCREASE].includes(method) && tokenId) {
          console.log(zapContract, '__zap');
          console.log({
            txData,
            gaugeData,
          }, '__zap');
          await zapContract[method](txData, gaugeData);
        }
      } catch (e: any) {
        console.log(JSON.parse(JSON.stringify(e)), '___decoded1');
        const decoded = zapContract.interface.parseError(e?.data);

        console.log(decoded, '___decoded2');
        if (!decoded) throw new Error("Simulation error");

        gaugeData = {
          ...gaugeData,
          isSimulation: false,
          adjustSwapAmount: decoded.args[4],
          adjustSwapSide: decoded.args[5],
        };
      }
    }

    try {
      let tx = null;

      if (method === ZAPIN_FUNCTIONS.MERGE) {
         tx = await zapContract[method](txData, gaugeData, params);
      }
      if (method === ZAPIN_FUNCTIONS.ZAPIN) {
         tx = await zapContract[method](txData, gaugeData, params);
      }

      if ([ZAPIN_FUNCTIONS.REBALANCE, ZAPIN_FUNCTIONS.INCREASE].includes(method) && tokenId) {
         tx = await zapContract[method](txData, gaugeData, params);
      }

      if (tx) return tx.wait();
      else throw new Error('Such method do not exist');
    } catch (e: any) {
      console.log(JSON.parse(JSON.stringify(e)), '___decoded3');
      throw new Error(e?.reason ?? "Simulation start error");
    }
  }

  async recalculateProportionOdosV3({
    selectedInputTokens,
    selectedOutputTokens,
    zapPool,
    zapContract,
    v3RangeTicks,
    networkId,
    slippageLimitPercent,
    odosSwapRequest,
    simulateSwap,
    typeFunc = ZAPIN_TYPE.ZAPIN,
    showErrorModalWithMsg,
    mergeIds = [],
  }: IRecalculateProportionOdosV3) {
    const emptyVals = selectedInputTokens.map((_) => {
      if (new BN(_?.value).eq(0) || !_?.value) return null;

      return _;
    });

    if (emptyVals.every((_) => !_)) return null;

    let resp: any = null;

    if (typeFunc === ZAPIN_TYPE.ZAPIN) {
      console.log(
        JSON.stringify({
          add: zapPool.address,
          ticks: v3RangeTicks,
          tokens: selectedInputTokens.map((_) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: _?.contractValue,
            price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
          })),
        }),
        'LOOGS___',
      );

      resp = await this.getV3Proportion(
        zapPool.address,
        v3RangeTicks,
        selectedInputTokens.map((_) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: _?.contractValue,
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        zapContract,
      );
    }

    if (typeFunc === ZAPIN_TYPE.REBALANCE) {
      console.log(
        JSON.stringify({
          add: zapPool.address,
          ticks: v3RangeTicks,
          tokens: selectedInputTokens.map((_, key) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: '0',
            price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
          })),
          tokenIds: [zapPool.tokenId?.toString()],
        }),
        'LOOGS___',
      );

      resp = await this.getV3Proportion(
        zapPool.address,
        v3RangeTicks,
        selectedInputTokens.map((_, key) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: '0',
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        zapContract,
        [zapPool.tokenId?.toString()],
      );
    }

    if (typeFunc === ZAPIN_TYPE.MERGE) {
      console.log(
        JSON.stringify({
          add: zapPool.address,
          ticks: v3RangeTicks,
          tokens: selectedInputTokens.map((_, key) => ({
            tokenAddress: _?.selectedToken?.address,
            amount: '0',
            price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
          })),
          tokenIds: mergeIds,
        }),
        'LOOGS___',
      );

      resp = await this.getV3Proportion(
        zapPool.address,
        v3RangeTicks,
        selectedInputTokens.map((_, key) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: '0',
          price: new BN(_?.selectedToken?.price).times(10 ** 18).toFixed(),
        })),
        zapContract,
        mergeIds,
      );
    }

    if (!resp) {
      showErrorModalWithMsg({
        errorType: 'zap',
        errorMsg: 'Simulation error. Empty response when calculating proportion',
      });
      return null;
    }

    let inputTokens = [];

    if (typeFunc === ZAPIN_TYPE.ZAPIN) {
      inputTokens = selectedInputTokens
        .map((_: any, key: number) => ({
          tokenAddress: _?.selectedToken?.address,
          amount: resp[1][key]?.toString(),
        }))
        .filter(
          (item: any) => new BN(item.amount).gt(0),
        );
    }

    if ([ZAPIN_TYPE.REBALANCE, ZAPIN_TYPE.MERGE].includes(typeFunc)) {
      inputTokens = resp[0].map((_: any, key: number) => ({
        tokenAddress: _,
        amount: resp[1][key]?.toString(),
      }))
        .filter((_: any) => new BN(_.amount).gt(0));
    }

    if (inputTokens?.length === 0) return null;

    const outputTokens = resp[2]
      .map((_: any, key: number) => ({
        tokenAddress: _,
        proportion: new BN(resp[3][key]?.toString()).div(10 ** 6).toFixed(),
      }))
      .filter(
        (item: any) => new BN(item.proportion).gt(0),
      );

    // init zapin without swap
    if (inputTokens?.length === 0 && outputTokens?.length === 0) {
      const amountMins = resp[2].map((_: any, key: number) => resp[6][key]?.toString());

      return {
        inputTokens,
        outputTokens,
        outputTokensForZap: outputTokens,
        amountToken0Out: '0',
        amountToken1Out: '0',
        responseProportionV3: resp,
        odosData: null,
        amountMins,
      };
    }

    const whiteList = WHITE_LIST_ODOS[networkId as keyof typeof WHITE_LIST_ODOS];

    let requestData = null;
    const userAddr = ethers.getAddress(zapContract?.target?.toLowerCase());

    if (simulateSwap) {
      requestData = {
        chainId: networkId,
        inputTokens,
        outputTokens,
        userAddr,
        slippageLimitPercent,
        sourceBlacklist: getSourceLiquidityBlackList(zapPool),
        sourceWhitelist: whiteList ?? [],
        simulate: true,
        pathViz: true,
      };
    }

    if (!simulateSwap) {
      const actualGas = await this.overnightApi.getActualGasPrice(networkId) as any;

      requestData = {
        chainId: networkId,
        inputTokens,
        outputTokens,
        gasPrice: actualGas.gasPrice?.baseFee,
        userAddr,
        slippageLimitPercent,
        sourceBlacklist: getSourceLiquidityBlackList(zapPool),
        sourceWhitelist: whiteList ?? [],
        simulate: false,
        pathViz: false,
        disableRFQs: false,
        referralCode: ODOS_REF_CODE,
      };
    }

    const data: any = await odosSwapRequest(requestData);

    if (!data) {
      showErrorModalWithMsg({
        errorType: 'zap',
        errorMsg: 'Odos error. Swap request failed',
      });
      return null;
    }

    const finalOutput = this.getZapinOutputTokens(
      data,
      resp,
      selectedOutputTokens,
      selectedInputTokens,
    );

    if (!finalOutput) {
      showErrorModalWithMsg({
        errorType: 'zap',
        errorMsg: 'Simulation error. Empty response when estimating output liquidity',
      });
      return null;
    }

    return {
      inputTokens,
      outputTokens: finalOutput?.outputToken,
      outputTokensForZap: outputTokens,
      amountOut: {
        amountToken0Out: finalOutput?.outputToken[0]?.tokenOut,
        amountToken1Out: finalOutput?.outputToken[1]?.tokenOut,
      },
      responseProportionV3: resp,
      amountMins: finalOutput?.amountMins,
      odosData: finalOutput?.odosData,
    };
  }
}

export default new ZapinService();
