import { ODOS_DEPRECATED_NETWORKS, OVN_TOKENS } from '@/utils/const.ts';
import { BLAST_TOKENS_PRICES } from '@/constants/tokens/manualTokensMap.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';
import type { TChainTokenMap } from '@/types/api/overnightApi.ts';
import {
  formatTokenInfo, formatTokenInfoNew, loadContractForToken, mergeTokenLists,
} from './utils/index.ts';
import type { IOvernightApi } from '../ApiService/OvernightApi.ts';

export interface ITokenService {
  fetchTokens(): Promise<any>,
  fetchAllTokens(): Promise<TChainTokenMap>,
  fetchTokenPricesByNetworkId(chainId: number | string): Promise<any>,
  getTokenNetworkMap(): any,
}

class TokenService implements ITokenService {
  private overnightApi: IOvernightApi;

  constructor(apiService: IOvernightApi) {
    this.overnightApi = apiService;
  }

  public fetchTokens = async () => this.overnightApi.loadTokens();

  public async fetchAllTokens() {
    const chainTokenMap = await this.overnightApi.getAllTokens();
    return chainTokenMap;
  }

  public async fetchTokenPricesByNetworkId(chainId: number | string): Promise<any> {
    if (ODOS_DEPRECATED_NETWORKS.includes(Number(chainId))) {
      return {
        currencyId: 'USD',
        tokenPrices: { ...BLAST_TOKENS_PRICES }[chainId],
      };
    }
    return this.overnightApi.loadPrices(chainId);
  }

  // Compatibility method for Odos store "loadTokens"
  public async getTokenNetworkMap() {
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

  // New API
  public static formatTokenInfo = (
    tokens: TChainTokenMap,
    chainId: string,
  ) => {
    const tokenNetworkMap = mergeTokenLists(tokens);
    const tokensByNetwork = tokenNetworkMap.chainTokenMap[chainId].tokenMap;
    const tokenInfo = formatTokenInfoNew(tokensByNetwork);
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
