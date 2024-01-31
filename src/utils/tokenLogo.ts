import { loadJSON } from '@/utils/httpUtils.ts';

export default {
  loadTokenImage(item: any) {
    try {
      if (item.symbol.includes(' (OLD)')) {
        return new URL(`../assets/icons/currencies/select/${
          item.symbol.replace(' (OLD)', '')
        }.webp`, import.meta.url);
      }
      return new URL(`../assets/icons/currencies/select/${item.symbol}.webp`, import.meta.url);
    } catch (error) {
      return new URL('../assets/icons/currencies/undefined.svg', import.meta.url);
    }
  },

  loadOvernightTokenImage(token: any) {
    try {
      // let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
      // if (tokenUrl) {
      //     return tokenUrl;
      // }

      return this.getOvnCoinBaseImagePath(token);
    } catch (e) {
      return this.getOvnCoinBaseImagePath(token);
    }
  },
  getOvnCoinBaseImagePath(token: any) {
    try {
      const svgIcons = ['ETH+', 'USDC+'];
      if (svgIcons.includes(token.symbol)) {
        return new URL(`../assets/icons/currencies/stablecoins/${
          token.symbol
        }.svg`, import.meta.url);
      }
      return new URL(`../assets/icons/currencies/stablecoins/${
        token.symbol
      }.png`, import.meta.url);
    } catch (error) {
      return new URL('../assets/icons/currencies/undefined.svg', import.meta.url);
    }
  },
  async loadCoingeckoOvernightTokenImage(symbol: any) {
    // example
    // https://api.coingecko.com/api/v3/coins/overnight-dai?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false
    const coinGeckoUrl = 'https://api.coingecko.com/api';
    const coinGeckoApiVersion = 'v3';
    const coinGeckoApiMethod = 'coins';
    const coinGeckoApiParams = 'localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false';

    const symbolInfo = `overnight-${symbol.replace('+', '').toLowerCase()}`;
    const url = `${coinGeckoUrl}/${coinGeckoApiVersion}/${coinGeckoApiMethod}/${symbolInfo}?${coinGeckoApiParams}`;
    const coinInfo = await loadJSON(url);
    if (coinInfo.error) {
      console.log('Coingecko image not found', coinInfo);
      return null;
    }

    return coinInfo.image.large;
  },
};
