/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { POOL_TYPES } from '@/store/views/main/pools/index.ts';
import {
  POOL_WHITE_LIST,
  SECOND_MIN_AMOUNT,
} from './mocks.ts';

// const OVN_STABLE_TOKENS = ['USD+', 'DAI+', 'WUSD+', 'USDC+', 'USDT+'];
const ALL_STABLE_TOKENS = [
  'usd+', 'dai+', 'wusd+', 'usdc+', 'usdt+',
  'dola', 'frax', 'sfrax', 'usdc', 'usdt',
  'usdb', 'eusd', 'usdbc', 'crvusd', 'usdz',
  'usdc.e', 'axlusdc', 'axlusdt', 'eurc',
  'mai', 'rgusdc', 'rgusd',
];

// const REVERT_AGG = [
//   '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0',
//   '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197',
// ];

export const buildLink = (pool: any, poolPlatform: string) => {
  let url;

  if (poolPlatform === 'Uniswap') {
    return `https://app.uniswap.org/pool?chain=${pool.chainName}`
  }

  if (poolPlatform === 'Trader Joe') {
    if (pool.address === '0xa8A502ACF4084B8D38362E9F620C689CB4D2EB89') {
      return 'https://traderjoexyz.com/arbitrum/pool/v22/0xe80772eaf6e2e18b651f160bc9158b2a5cafca65/ETH/10';
    }
    if (pool.address === '0x37570DB173beF23F6924beaE3CD960b41AB6AD74') {
      return 'https://traderjoexyz.com/arbitrum/pool/v22/0xe80772eaf6e2e18b651f160bc9158b2a5cafca65/0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9/1';
    }
  }

  // eusd/usd+
  if (poolPlatform === 'Aerodrome'
    && pool.address === '0x8041e2A135D2da7A8E21E4B14113D8245EC532e1'
  ) {
    url = 'https://aerodrome.finance/liquidity/?query=usd%2B%2Feusd&filter=all';
    return url;
  }

  // wsteth/usd+
  if (poolPlatform === 'Aerodrome'
    && pool.address === '0xf15B30a0a823f588B523fD794A43939F0B1dC582'
  ) {
    url = 'https://aerodrome.finance/liquidity/?query=usd%2B%2Fwsteth&filter=all';
    return url;
  }

  const pancakeChain = pool.chainName === 'arbitrum' ? 'arb' : pool.chainName;

  switch (poolPlatform) {
    case 'Dystopia':
      url = 'https://www.dystopia.exchange/liquidity/';
      break;
    case 'Cone':
      url = 'https://www.cone.exchange/liquidity/';
      break;
    case 'Thena':
      url = 'https://www.thena.fi/liquidity/';
      break;
    case 'QuickSwap':
      url = 'https://info.quickswap.exchange/#/pair/';
      break;
    case 'Meshswap':
      url = 'https://meshswap.fi/exchange/pool/detail/';
      break;
    case 'Velodrome':
      url = 'https://velodrome.finance/liquidity/?query=usd%2B&filter=all';
      break;
    case 'Aerodrome':
      url = 'https://aerodrome.finance/liquidity/?query=usd%2B&filter=all';
      break;
    case 'Beethoven':
      url = 'https://op.beets.fi/pool/';
      break;
    case 'Uniswap':
      url = 'https://info.uniswap.org/#/polygon/pools/';
      break;
    case 'Sushiswap':
      url = 'https://www.sushi.com/earn/matic:';
      break;
    case 'Solidlizard':
      url = 'https://info.solidlizard.finance/pair/';
      break;
    case 'Arbidex':
      url = 'https://arbidex.fi/farms';
      break;
    case 'Sterling':
      url = 'https://www.sterling.finance/liquidity/';
      break;
    case 'Wombat':
      url = 'https://app.wombat.exchange/pool/';
      break;
    case 'Solunea':
      url = 'https://www.solunea.xyz/liquidity/';
      break;
    case 'Ramses':
      url = 'https://app.ramses.exchange/liquidity/';
      break;
    case 'Velocore':
      url = 'https://app.velocore.xyz/liquidity/';
      break;
    case 'Chronos':
      url = 'https://app.chronos.exchange/liquidity/';
      break;
    case 'Gnd':
      url = 'https://farm.gndprotocol.com/farms';
      break;
    case 'Vesync':
      url = 'https://app.vesync.finance/liquidity/';
      break;
    case 'Beefy':
      url = 'https://app.beefy.com';
      break;
    case 'Ennead':
      url = 'https://beta.ennead.farm/pools';
      break;
    case 'Pearl':
      url = 'https://www.pearl.exchange/liquidity/manage/';
      break;
    case 'Magixfox':
      url = 'https://app.magicfox.fi/vaults/';
      break;
    case 'Sperax':
      url = 'https://demeter.sperax.io/farm/42161/';
      break;
    case 'Ezkalibur':
      url = 'https://dapp.ezkalibur.com';
      break;
    case 'Mute':
      url = 'https://app.mute.io/pool';
      break;
    case 'Dracula':
      url = 'https://draculafi.xyz/liquidity/';
      break;
    case 'Maverick':
      url = 'https://app.mav.xyz/pools?chain=324';
      break;
    case 'Baseswap':
      url = 'https://baseswap.fi/farm';
      break;
    case 'Velocimeter':
      url = 'https://base.velocimeter.xyz/liquidity';
      break;
    case 'Shekel':
      url = 'https://shekelswap.finance/#/farm';
      break;
    case 'Swapbased':
      url = 'https://swapbased.finance/#/farm';
      break;
    case 'Swapblast':
      url = 'https://swapblast.finance/#/farm';
      break;
    case 'Curve':
      url = `https://curve.fi/#/arbitrum/pools?hideSmallPools=false&search=${pool.address}`;
      break;
    case 'Alienbase':
      url = 'https://app.alienbase.xyz/farms';
      break;
    case 'Balancer':
      url = 'https://app.balancer.fi/#/arbitrum/pool/';
      break;
    case 'Convex': // aggregator of Curve
      url = 'https://www.convexfinance.com/stake/arbitrum/13';
      break;
    case 'Pancake':
      url = `https://pancakeswap.finance/info/v3/${pancakeChain}/pairs/${pool.address}?chain=${pool.chainName}`;
      break;
    case 'Lynex':
      url = 'https://app.lynex.fi/liquidity/manage/';
      break;
    case 'Baseswapdefiedge':
      url = 'https://baseswap.defiedge.io/s/base/';
      break;
    case 'Syncswap':
      url = `https://syncswap.xyz/pool/${pool.address}`;
      break;
    case 'Dyson':
      url = 'https://app.dyson.money/all?id=dyson-base-aerodrome-ovn-usd';
      break;
    case 'Trader Joe':
      url = `https://traderjoexyz.com/${pool.chainName}/pool`;
      break;

    default:
      url = `${pool.explorerUrl}/address/`;
      break;
  }

  if (
    poolPlatform === 'Thena'
    || poolPlatform === 'Wombat'
    || poolPlatform === 'Beefy'
    || poolPlatform === 'Ezkalibur'
    || poolPlatform === 'Mute'
    || poolPlatform === 'Velodrome'
    || poolPlatform === 'Aerodrome'
    || poolPlatform === 'Ennead'
    || poolPlatform === 'Arbidex'
    || poolPlatform === 'Gnd'
    || poolPlatform === 'Baseswap'
    || poolPlatform === 'Swapblast'
    || poolPlatform === 'Velocimeter'
    || poolPlatform === 'Swapbased'
    || poolPlatform === 'Maverick'
    || poolPlatform === 'Alienbase'
    || poolPlatform === 'Convex'
    || poolPlatform === 'Pancake'
    || poolPlatform === 'Syncswap'
    || poolPlatform === 'Dyson'
    || poolPlatform === 'Trader Joe'
  ) {
    return url;
  }

  // THRUSTER
  if (pool.address === '0xf2d0a6699fea86fff3eb5b64cdc53878e1d19d6f') {
    return 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000003&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005';
  }
  if (pool.address === '0x21f25b792d2e14378f93a4c3260a53f4a889e68d') {
    return 'https://app.thruster.finance/add?token1=0x4300000000000000000000000000000000000004&token2=0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd&poolVersion=V3&fee=0.0005';
  }

  // AMBIENT
  if (pool.address === '0xaAaaaAAAFfe404EE9433EEf0094b6382D81fb958_eth') {
    return 'https://ambient.finance/trade/pool/chain=0x13e31&tokenA=0x4fee793d435c6d2c10c135983bb9d6d4fc7b9bbd&tokenB=0x0000000000000000000000000000000000000000';
  }
  if (pool.address === '0xaAaaaAAAFfe404EE9433EEf0094b6382D81fb958_usdb') {
    return 'https://ambient.finance/trade/pool/chain=0x13e31&tokenA=0x4fee793d435c6d2c10c135983bb9d6d4fc7b9bbd&tokenB=0x4300000000000000000000000000000000000003';
  }

  // promoting / exceptions
  if (
    poolPlatform === 'Defiedge'
    && pool.address === '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3'
  ) {
    return `https://app.defiedge.io/s/optimism/${pool.address}`;
  }

  if (
    poolPlatform === 'Defiedge'
    && pool.address === '0x4784be205996d53d7a40bdb4e1d7b84e551d71d4'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (
    poolPlatform === 'Defiedge'
    && pool.address === '0x73f7039224c88378de8e2ce31b13debba1f0e05a'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (
    poolPlatform === 'Defiedge'
    && pool.address === '0x35a3b69f579ed1b0b88dc433ebcd7c65fdf57389'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (poolPlatform === 'Beethoven') {
    url += `${pool.address}000200000000000000000105`;
    return url;
  }

  if (
    poolPlatform === 'Balancer'
    && pool.address === '0xa8af146d79ac0bb981e4e0d8b788ec5711b1d5d0'
  ) {
    url += `${pool.address}00000000000000000000047b`;
    return url;
  }

  if (
    poolPlatform === 'Balancer'
    && pool.address === '0x519cce718fcd11ac09194cff4517f12d263be067'
  ) {
    url += `${pool.address}000000000000000000000382`;
    return url;
  }

  if (
    poolPlatform === 'Balancer'
    && pool.address === '0xd6d20527c7b0669989ee082b9d3a1c63af742290'
  ) {
    url += `${pool.address}000000000000000000000483`;
    return url;
  }

  if (
    poolPlatform === 'Balancer'
    && pool.address === '0x85ec6ae01624ae0d2a04d0ffaad3a25884c7d0f3'
  ) {
    url += `${pool.address}0002000000000000000004b6`;
    return url;
  }

  if (
    poolPlatform === 'Balancer'
    && pool.address === '0xa036553ad30f077bd46c37b1e8ac28e010d7b39e'
  ) {
    url = `https://app.balancer.fi/#/base/pool/${
      pool.address
    }000200000000000000000056`;
    return url;
  }

  if (
    poolPlatform === 'Curve'
    && pool.address === '0xda3de145054ED30Ee937865D31B500505C4bDfe7'
  ) {
    url = 'https://curve.fi/#/base/pools/factory-v2-2/deposit';
    return url;
  }

  if (poolPlatform === 'Velocore' && pool.chainName === 'linea') {
    url = 'https://linea.velocore.xyz/stable-liquidity';
    return url;
  }

  if (
    poolPlatform === 'Velocore'
    && pool.address === '0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6'
  ) {
    url = 'https://zksync.velocore.xyz/stable-liquidity';
    return url;
  }

  if (
    poolPlatform === 'Velocore'
    && pool.address === '0x4b9f00860d7f42870addeb687fa4e47062df71d9'
  ) {
    url = 'https://zksync-v1.velocore.xyz/liquidity/0x4b9f00860d7f42870addeb687fa4e47062df71d9';
    return url;
  }

  url += pool.address;
  return url;
};

export const checkIsEveryStableToken = (tokenSymbols: string[]) => {
  if (tokenSymbols.every((id: string) => ALL_STABLE_TOKENS.includes(id.toUpperCase()))) return true;
  return false;
};

export const checkIsEveryStable = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.every((id: string) => ALL_STABLE_TOKENS.includes(id?.toLowerCase()))) return true;
  return false;
};

export const checkIsUsdPlusStable = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.some((id: string) => ['USD+'].includes(id))) return true;
  return false;
};

export const checkIsOVNVolatile = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.some((id: string) => ['OVN'].includes(id))) return true;
  return false;
};

const filterByPoolType = (
  poolsList: any[],
  filterType: POOL_TYPES,
) => {
  if (filterType === POOL_TYPES.V2) return poolsList.filter((_) => (_?.poolVersion === 'v2'));
  if (filterType === POOL_TYPES.V3) return poolsList.filter((_) => (_?.poolVersion === 'v3'));
  if (filterType === POOL_TYPES.TOKENPLUS) return poolsList.filter((_) => checkIsUsdPlusStable(_));
  if (filterType === POOL_TYPES.VOLATILE) return poolsList.filter((_) => !checkIsEveryStable(_));
  if (filterType === POOL_TYPES.STABLE) return poolsList.filter((_) => checkIsEveryStable(_));
  if (filterType === POOL_TYPES.OVN) return poolsList.filter((_) => checkIsOVNVolatile(_));

  return poolsList;
};

export const getSortedPools = (
  pools: any[],
  filterByTvl: boolean,
  filterByType = POOL_TYPES.ALL,
) => {
  const minTvl = filterByTvl ? SECOND_MIN_AMOUNT : 0;

  const poolsList = pools.filter((pool) => {
    if (!!POOL_WHITE_LIST[pool?.address.toLowerCase()] || pool.tvl >= minTvl) return true;
    return false;
  });

  return filterByPoolType(poolsList, filterByType);
};

export const initAggregators = (pool: any) => {
  pool.aggregators = [];
  const poolAddress = pool.id.address;

  if (poolAddress === '0x1F3cA66c98d682fA1BeC31264692daD4f17340BC') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/thena-hay-usd+',
    });
  }

  if (poolAddress === '0xa99817d2d286c894f8f3888096a5616d06f20d46') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-dola',
    });
  }

  if (poolAddress === '0x219fbc3ed20152a9501ddaa47f2a8c193e32d0c6') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/solidlizard-usd+-usdc',
    });
  }

  if (poolAddress === '0x69c28d5bbe392ef48c0dc347c575023daf0cd243') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-dai+',
    });
  }

  if (poolAddress === '0x8a9cd3dce710e90177b4332c108e159a15736a0f') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-lusd',
    });
  }

  if (poolAddress === '0x67124355cce2ad7a8ea283e990612ebe12730175') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usdp-usdc',
    });
  }

  if (poolAddress === '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Ennead',
      zappable: false,
    });
  }

  return pool;
};

export const checkForSamePlatform = (address: string) => {
  if (address === '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome') {
    return ['Beefy', 'Aerodrome'];
  }

  // if (address === '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013') {
  //   return ['Curve', 'Convex'];
  // }

  return null;
};
