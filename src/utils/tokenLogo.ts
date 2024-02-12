import { loadJSON } from '@/utils/httpUtils.ts';

export const loadTokenImage = (itemSymbol: any) => {
  let path = null;

  if (itemSymbol?.includes(' (OLD)')) {
    path = new URL(`../assets/icons/currencies/select/${
      itemSymbol.replace(' (OLD)', '')
    }.webp`, import.meta.url);
    return path;
  }

  path = new URL(`../assets/icons/currencies/select/${itemSymbol}.webp`, import.meta.url);

  if (path?.pathname?.includes('undefined')) {
    return new URL('../assets/icons/currencies/select/undefined.webp', import.meta.url);
  }

  return path;
};

export const getOvnCoinBaseImagePath = (tokenSymbol: any) => {
  const svgIcons = ['ETH+', 'USDC+'];
  if (svgIcons?.includes(tokenSymbol)) {
    return new URL(`../assets/icons/currencies/stablecoins/${
      tokenSymbol
    }.svg`, import.meta.url);
  }
  return new URL(`../assets/icons/currencies/stablecoins/${
    tokenSymbol
  }.png`, import.meta.url);
};

export const loadOvernightTokenImage = (tokenSymbol: any) => {
  try {
    // let tokenUrl = await loadCoingeckoOvernightTokenImage(tokenSymbol);
    // if (tokenUrl) {
    //     return tokenUrl;
    // }

    return getOvnCoinBaseImagePath(tokenSymbol);
  } catch (e) {
    return getOvnCoinBaseImagePath(tokenSymbol);
  }
};

export const loadCoingeckoOvernightTokenImage = async (symbol: any) => {
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
};
