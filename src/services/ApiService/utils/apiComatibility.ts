import BigNumber from 'bignumber.js';
import type {
  IClientBalanceChangeResponse,
  IClientBalanceChangeResponseOld,
  IInsPayoutResponse, IInsPayoutResponseOld, IInsStatResponse,
  IInsStatResponseOld, IStrategyResponse, IStrategyResponseOld,
} from '@/types/api/overnightApi';

export const tranformPayoutResponse = async (
  response: Promise<IInsPayoutResponse[]>,
): Promise<IInsPayoutResponseOld[]> => {
  const payoutResponses = await response;
  return payoutResponses.map((payoutEntity: IInsPayoutResponse) => ({
    id: {
      hash: payoutEntity.hash,
      chain: payoutEntity.chain,
    },
    token: 'USD+',
    supply: Number(payoutEntity.totalSupply),
    deltaSupply: Number(payoutEntity.deltaSupply),
    profit: Number(payoutEntity.profit),
    dailyProfit: Number(payoutEntity.dailyProfit),
    elapsedTime: Number(payoutEntity.elapsedTime),
    apy: Number(payoutEntity.apy),
    liquidityIndex: 0,
    users: Number(payoutEntity.ownerLength),
    deltaUsers: Number(payoutEntity.deltaUsers),
    date: payoutEntity.timestamp,
    hash: payoutEntity.hash,
    timestamp: payoutEntity.timestamp,
  }));
};

export const tranformStrategyResponse = async (
  response: Promise<IStrategyResponse[]>,
): Promise<IStrategyResponseOld[]> => {
  const strategyResponses = await response;
  return strategyResponses.map((strategyEntity: IStrategyResponse) => ({
    id: strategyEntity.name,
    name: strategyEntity.name,
    type: 'Strategy',
    fullName: strategyEntity.name,
    weight: Number(strategyEntity.weight),
    address: strategyEntity.strategy,
    explorerAddress: strategyEntity.strategy,
    netAssetValue: Number(strategyEntity.netAssetValue),
    liquidationValue: Number(strategyEntity.liquidationValue),
    riskFactor: 0,
  }));
};

export const tranformClientBalanceChangeResponse = async (
  response: Promise<IClientBalanceChangeResponse[]>,
): Promise<IClientBalanceChangeResponseOld[]> => {
  const balanceChangeResponses = await response;
  return balanceChangeResponses.map((balanceChangeEntity: IClientBalanceChangeResponse) => ({
    address: balanceChangeEntity.hash,
    transaction_hash: balanceChangeEntity.hash,
    date: balanceChangeEntity.timestamp,
    type: balanceChangeEntity.type,
    opening_balance: Number(balanceChangeEntity.balanceBefore),
    change_balance: Number(balanceChangeEntity.amount),
    closing_balance: Number(balanceChangeEntity.balanceAfter),
    fee: 0,
    apy: 0,
    elapsed_time: 0,
  }));
};

export const tranformInsuranceStatsResponse = (
  insuranceStats: IInsStatResponse,
  ovnPrice: string | BigNumber,
): IInsStatResponseOld => ({
  apy: Number(insuranceStats.apy),
  apyAll: Number(insuranceStats.apyAll),
  apyMonth: Number(insuranceStats.apyMonth),
  supply: Number(insuranceStats.supply),
  supplyUSD: new BigNumber(ovnPrice).times(insuranceStats.supply).toNumber(),
  coverage: 0,
  insuredList: ['USD+'],
});
