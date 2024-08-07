import odosApiService from '@/services/odos-api-service.ts';
import { mergeTokenLists } from './utils/index.ts';

class TokenService {
  private static async fetchTokens() {
    const tokens = await odosApiService.loadTokens();
    return tokens;
  }

  private static async formatTokens(tokens: any) {
    return mergeTokenLists(tokens);
  }

  public static async getTokenInfo() {
    const receivedTokens = await this.fetchTokens();
    const tokenList = await this.formatTokens(receivedTokens);
    return tokenList;
  }
}

export default TokenService;
