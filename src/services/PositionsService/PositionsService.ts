import { formatPositionData } from '@/services/PositionsService/utils/positionsFormatter.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import { loadAbi, zapAbiSrcMap, rebalanceChainMap } from '@/store/views/main/zapin/index.ts';
import type { TTokenInfo } from '@/types/common/tokens';
import type { TPoolInfo } from '@/types/common/pools';

export const loadPositionContract = async (state: any, platformName: string) => {
  const chainName = state.network.networkName;
  const abiFileSrc = zapAbiSrcMap.v3?.(chainName, platformName);

  const abiFile = await loadAbi(abiFileSrc);

  const positionContract = await buildEvmContract(
    abiFile.abi,
    state.web3.evmSigner,
    abiFile.address,
  );

  return positionContract;
};

class PositionsService {
  public static async fetchPositions(state: any) {
    const platformNames = rebalanceChainMap[state.network.networkName];

    const rawPositionsData = await Promise.all(
      platformNames.map(async (platform: string) => {
        const positionsContract = await loadPositionContract(state, platform);
        const positionsData = await positionsContract.getPositions(state.accountData.account);
        console.log('__positionsData', positionsData, platform);
        return positionsData;
      }),
    );

    return rawPositionsData.flat();
  }

  public static formatPositions(
    rawPositionData: any,
    pools: TPoolInfo[],
    tokens: TTokenInfo[],
    networkId: number,
  ) {
    // console.log('__positionsServiceFormat');
    const tokenMap = new Map(tokens.map((token) => [token.address, token]));
    const poolsMap = pools.reduce((acc: any, pool: any) => ({ ...acc, [pool.address]: pool }), {});

    const positionInfo = formatPositionData(rawPositionData, poolsMap, tokenMap, networkId);
    // console.log('__positionsServiceFormatResult', positionInfo);
    return positionInfo;
  }
}

export default PositionsService;
