import odosApiService from '@/services/odos-api-service.ts';
import { ODOS_DEPRECATED_NETWORKS, OVN_TOKENS } from '@/utils/const.ts';
import { BLAST_TOKENS_PRICES } from '@/constants/tokens/manualTokensMap.ts';
import { formatTokenInfo, loadContractForToken, mergeTokenLists } from './utils/index.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';

class TokenService {
  public static fetchTokens = async () => odosApiService.loadTokens();

  public static async fetchTokenPricesByNetworkId(chainId: number | string): Promise<any> {
    console.log('__TokenServiceFetchTokens');
    if (ODOS_DEPRECATED_NETWORKS.includes(Number(chainId))) {
      console.log('__tokenService', { ...BLAST_TOKENS_PRICES }[chainId]);
      return {
        currencyId: 'USD',
        tokenPrices: { ...BLAST_TOKENS_PRICES }[chainId],
      };
    }
    return odosApiService.loadPrices(chainId);
  }

  // Compatibility method for Odos store "loadTokens"
  public static async getTokenNetworkMap() {
    const receivedTokens = await this.fetchTokens();
    const tokenNetworkMap = mergeTokenLists(receivedTokens);
    return tokenNetworkMap;
  }

  public static getTokenInfo = (
    tokens: any,
    tokenPricesData: any,
    chainId: string,
    tokenBalanceMap: any = {},
  ) => {
    const tokenNetworkMap = mergeTokenLists(tokens);
    const tokensByNetwork = tokenNetworkMap.chainTokenMap[chainId].tokenMap;
    const tokenInfo = formatTokenInfo(
      tokensByNetwork,
      tokenPricesData.tokenPrices,
      tokenBalanceMap,
    );
    return tokenInfo;
  };

  public static loadTokenContract(tokenAddress: string, evmSigner: any) {
    return loadContractForToken(tokenAddress, evmSigner);
  }

  public static getFilterOvnTokens(tokenList: TTokenInfo[]) {
    return tokenList.filter((token: TTokenInfo) => OVN_TOKENS.includes(token.symbol));
  }
}

export default TokenService;
