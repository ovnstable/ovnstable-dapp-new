import type {
  IInsPayoutResponse, IInsPayoutResponseOld, IStrategyResponse, IStrategyResponseOld,
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
