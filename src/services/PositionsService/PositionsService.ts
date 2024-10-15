import { formatPositionData } from '@/services/PositionsService/utils/positionsFormatter.ts';
import { buildEvmContract } from '@/utils/contractsMap.ts';
import {
  loadAbi, srcStringBuilder,
} from '@/store/views/main/zapin/index.ts';
import type { TTokenInfo } from '@/types/common/tokens';
import type { TPool, MPos } from '@/types/common/pools';
import { rebalanceChainMap, ZAPIN_SCHEME } from '../Web3Service/utils/scheme.ts';
import axios from 'axios';
import BN from 'bignumber.js';

export const loadPositionContract = async (state: any, platformName: string) => {
  const abiV3Zap = srcStringBuilder('Contract')('v3', 'Zapin');
  const abiContractV3Zap = await loadAbi(abiV3Zap);

  const abiZapAdd = ZAPIN_SCHEME[
    state.network.networkName?.toLowerCase() as keyof typeof ZAPIN_SCHEME
  ][
    platformName?.toLowerCase() as keyof typeof ZAPIN_SCHEME.arbitrum
  ]?.zapinAdd;

  const positionContract = buildEvmContract(
    abiContractV3Zap.abi,
    state.web3.evmSigner,
    abiZapAdd,
  );

  return positionContract;
};

class PositionsService {
  public static async fetchMerklePos(chainId: number, userAdd: any, paramAcc?: string): Promise<any[]> {
    const address = paramAcc ? paramAcc : userAdd;
    let data: any;

    try {
      console.log(address, '__signer')
      data = (
        await axios.get(
          `https://api.merkl.xyz/v3/userRewards?chainId=${chainId}&user=${address?.toLowerCase()}&proof=true`,
          {
            timeout: 5000,
          }
        )
      ).data;
    } catch {
      throw "Angle API not responding";
    }
  
    // console.log(data, '___data')
    const merkleByTokenid = Object.entries(data).map(([key, val]: any) => {
      const tokens = Object.entries(val?.reasons).map(([keyR, valR]: any) => {
        // console.log(posData, "__DATA")

        return {
          tokenId: keyR?.split("_")[1],
          toClaim: new BN(valR?.unclaimed).gt(0) ? valR?.unclaimed : "0",
          rewardToken: key
        }
      })

      return tokens
    });
    
    return merkleByTokenid.flat()
  }

  public static async fetchPositions(state: any, paramAcc?: string) {
    const platformNames = rebalanceChainMap[state.network.networkName];

    console.log(paramAcc, '___paramAcc')
    const rawPositionsData = await Promise.all(
      platformNames.map(async (platform: string) => {
        const positionsContract = await loadPositionContract(state, platform);
        try {
          console.log(positionsContract, platform, '___positionsContract')
          const positionsData = await positionsContract.getPositions(paramAcc ? paramAcc : state.accountData.account);
          console.log('__positionsData', positionsData, platform);
          return positionsData;
        } catch (e) {
          console.log(e, positionsContract, '___e');
          return [];
        }
      }),
    );

    // console.log(rawPositionsData, '___rawPositionsData')
    return rawPositionsData.flat();
  }

  public static formatPositions(
    rawPositionData: any,
    pools: TPool[],
    tokens: TTokenInfo[],
    positionsMerkle: MPos[],
    networkId: number,
  ) {
    const tokenMap = new Map(tokens.map((token) => [token.address, token]));
    const poolsMap = pools.reduce((acc: any, pool: any) => ({ ...acc, [pool.address]: pool }), {});

    const positionInfo = formatPositionData(rawPositionData, poolsMap, tokenMap, networkId, positionsMerkle);
    // console.log('__positionsServiceFormatResult', positionInfo);
    return positionInfo;
  }
}

export default PositionsService;
