/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { poolTypes } from '@/modules/Main/components/PoolsTable/types/index.ts';

const STABLE_TOKENS = ['USD+', 'DAI+', 'WUSD+', 'USDC+', 'USDT+'];

export const buildLink = (pool: any) => {
  let url;

  switch (pool.platform) {
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
    case 'Curve':
      url = 'https://curve.fi/#/arbitrum/pools/factory-v2-117/deposit';
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
      url = `https://pancakeswap.finance/info/v3/arb/pairs/${pool.address}`;
      break;
    case 'Baseswapdefiedge':
      url = 'https://baseswap.defiedge.io/s/base/';
      break;

    default:
      url = `${pool.explorerUrl}/address/`;
      break;
  }

  if (
    pool.platform === 'Thena'
    || pool.platform === 'Wombat'
    || pool.platform === 'Beefy'
    || pool.platform === 'Ezkalibur'
    || pool.platform === 'Mute'
    || pool.platform === 'Velodrome'
    || pool.platform === 'Aerodrome'
    || pool.platform === 'Ennead'
    || pool.platform === 'Arbidex'
    || pool.platform === 'Gnd'
    || pool.platform === 'Baseswap'
    || pool.platform === 'Velocimeter'
    || pool.platform === 'Swapbased'
    || pool.platform === 'Shekel'
    || pool.platform === 'Maverick'
    || pool.platform === 'Alienbase'
    || pool.platform === 'Convex'
    || pool.platform === 'Pancake'
  ) {
    return url;
  }

  // promoting / exceptions
  if (
    pool.platform === 'Defiedge'
    && pool.address === '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3'
  ) {
    return `https://app.defiedge.io/s/optimism/${pool.address}`;
  }

  if (
    pool.platform === 'Defiedge'
    && pool.address === '0x4784be205996d53d7a40bdb4e1d7b84e551d71d4'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (
    pool.platform === 'Defiedge'
    && pool.address === '0x73f7039224c88378de8e2ce31b13debba1f0e05a'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (
    pool.platform === 'Defiedge'
    && pool.address === '0x35a3b69f579ed1b0b88dc433ebcd7c65fdf57389'
  ) {
    return `https://app.defiedge.io/s/arbitrum/${pool.address}`;
  }

  if (pool.platform === 'Beethoven') {
    url += `${pool.address}000200000000000000000105`;
    return url;
  }

  if (
    pool.platform === 'Balancer'
    && pool.address === '0xa8af146d79ac0bb981e4e0d8b788ec5711b1d5d0'
  ) {
    url += `${pool.address}00000000000000000000047b`;
    return url;
  }

  if (
    pool.platform === 'Balancer'
    && pool.address === '0x519cce718fcd11ac09194cff4517f12d263be067'
  ) {
    url += `${pool.address}000000000000000000000382`;
    return url;
  }

  if (
    pool.platform === 'Balancer'
    && pool.address === '0xd6d20527c7b0669989ee082b9d3a1c63af742290'
  ) {
    url += `${pool.address}000000000000000000000483`;
    return url;
  }

  if (
    pool.platform === 'Balancer'
    && pool.address === '0x85ec6ae01624ae0d2a04d0ffaad3a25884c7d0f3'
  ) {
    url += `${pool.address}0002000000000000000004b6`;
    return url;
  }

  if (
    pool.platform === 'Balancer'
    && pool.address === '0xa036553ad30f077bd46c37b1e8ac28e010d7b39e'
  ) {
    url = `https://app.balancer.fi/#/base/pool/${
      pool.address
    }000200000000000000000056`;
    return url;
  }

  if (pool.address === '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013') {
    url = 'https://www.convexfinance.com/stake/arbitrum/13';
    return url;
  }

  if (
    pool.platform === 'Curve'
    && pool.address === '0xda3de145054ED30Ee937865D31B500505C4bDfe7'
  ) {
    url = 'https://curve.fi/#/base/pools/factory-v2-2/deposit';
    return url;
  }

  if (pool.platform === 'Velocore' && pool.chainName === 'linea') {
    url = 'https://linea.velocore.xyz/stable-liquidity';
    return url;
  }

  if (
    pool.platform === 'Velocore'
    && pool.address === '0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6'
  ) {
    url = 'https://zksync.velocore.xyz/stable-liquidity';
    return url;
  }

  if (
    pool.platform === 'Velocore'
    && pool.address === '0x4b9f00860d7f42870addeb687fa4e47062df71d9'
  ) {
    url = 'https://zksync-v1.velocore.xyz/liquidity/0x4b9f00860d7f42870addeb687fa4e47062df71d9';
    return url;
  }

  url += pool.address;
  return url;
};

const filterByPoolType = (
  poolsList: any[],
  filterType: poolTypes,
) => {
  if (filterType === poolTypes.TOKENPLUS) {
    return poolsList.filter((_) => {
      const poolTokens = _.name.split('/');
      if (poolTokens.some((id: string) => STABLE_TOKENS.includes(id))) return true;
      return false;
    });
  }

  if (filterType === poolTypes.OVN) {
    return poolsList.filter((_) => {
      const poolTokens = _.name.split('/');
      if (poolTokens.some((id: string) => ['OVN'].includes(id))) return true;
      return false;
    });
  }

  if (filterType === poolTypes.FEATURED) {
    return poolsList.filter((_) => (!!_.feature));
  }

  return poolsList;
};

export const getSortedPools = (
  pools: any[],
  filterByTvl: boolean,
  filterByType = poolTypes.ALL,
) => {
  let poolsList = [];

  const revertAgg = [
    '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0',
    '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197',
  ];

  const convexDuplicatePromote = '0xb34a7d1444a707349bc7b981b7f2e1f20f81f013_convex';

  // if pool tvl too low
  const promotePools = [
    '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013',
    '0xd01075f7314a6436e8b74fc18069848229d0c555',
    '0xb9c2d906f94b27bc403ab76b611d2c4490c2ae3f',
    // LYNEX
    '0x58aacbccaec30938cb2bb11653cad726e5c4194a',
    '0xc5f4c5c2077bbbac5a8381cf30ecdf18fde42a91',
    // FRAX
    '0x56390acF12bce9675ab3922060D8d955149BE286',
  ];

  // execute revert aggregator
  const filteredPools = pools.filter((pool) => {
    if (!revertAgg.includes(pool.address)) false;
    if (pool.address?.toLowerCase() === convexDuplicatePromote) return false;
    return true;
  });

  if (!filterByTvl) {
    poolsList = filteredPools
      .filter((pool) => (promotePools.includes(pool.address) ? pool : pool.tvl >= 300000));
  } else {
    poolsList = filteredPools;
  }

  poolsList = poolsList.sort((a, b) => {
    if (a.feature && !b.feature) {
      return -1;
    } if (!a.feature && b.feature) {
      return 1;
    } if (a.apr !== b.apr) {
      return b.apr - a.apr;
    }
    return b.tvl - a.tvl;
  });

  return filterByPoolType(poolsList, filterByType);
};

export const getSortedSecondPools = (
  pools: any[],
  filterByType = poolTypes.ALL,
) => {
  let secondPools = pools.filter((pool) => {
    // this is for new pools which TVL do not pass pool.tvl < 300000 && pool.tvl > 100000
    // but its should be displayed
    const exception = [
      '0x0627dcdca49d749583c6a00327eb5e3846e265d3',
      '0x77ca2ddfd61d1d5e5d709cf07549fec3e2d80315',
    ];

    // convex duplicating
    const removeFromSecondPools = [
      '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013',
    ];
    if (removeFromSecondPools.includes(pool.address)) return false;
    // if its tvl higher than restrictions and its promotoed, its gonna duplicate
    if (pool.tvl > 300000 && pool.promoted) return false;

    if (exception.includes(pool.address)) return true;
    if (pool.tvl < 300000 && pool.tvl > 100000) return true;
    if (pool.promoted !== false) return true;

    return false;
  });

  secondPools = secondPools.sort((a, b) => {
    if (a.apr !== b.apr) {
      return b.apr - a.apr; // sort by APR number
    }
    return b.tvl - a.tvl; // sort by TVL number
  });

  return filterByPoolType(secondPools, filterByType);
};

export const initFeature = (pools: any[]) => {
  const topAprByChain = pools.reduce((acc, curr) => {
    const { chain, apr } = curr;

    // ignore binance chain
    if (curr.chainName === 'bsc') {
      return acc;
    }

    if (curr.tvl < 500000) {
      return acc;
    }

    if (!acc[chain] || apr > acc[chain].apr) {
      acc[chain] = curr;
      return acc;
    }

    return acc;
  }, {});

  const topAprByAddress = Object
    .values(topAprByChain)
    .map((_: any) => _.address?.toLowerCase());

  const newPools = pools.map((entry) => {
    const { address } = entry;

    // promoting special pool in FEATURES/all-pools
    const featurePromote = [
      '0x1b05e4e814b3431a48b8164c41eac834d9ce2da6',
      '0x8a06339Abd7499Af755DF585738ebf43D5D62B94',
    ];
    const convexPromote = ['0xb34a7d1444a707349bc7b981b7f2e1f20f81f013'];
    const loweredAdd = address?.toLowerCase();

    // remove after CONVEX PROMO
    if (convexPromote.includes(loweredAdd)) {
      const aprConvex = pools.find(
        (_) => _?.address.toLowerCase()
          === '0xb34a7d1444a707349bc7b981b7f2e1f20f81f013_convex',
      );

      return {
        ...entry,
        apr: aprConvex?.apr ?? entry.apr,
        feature: true,
      };
    }

    // for all other PROMO FEATURED pools
    if (
      featurePromote.includes(loweredAdd)
      || topAprByAddress.includes(loweredAdd)
    ) {
      return {
        ...entry,
        feature: true,
      };
    }

    return entry;
  });

  return newPools;
};

export const initReversePools = (pool: any, pools: any[]) => {
  pool.aggregators = [];
  // usd+ dola arb
  const poolAddress = pool.address;

  if (
    poolAddress === '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome'
  ) {
    const findedPool = pools.find(
      (data) => data.address === '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197',
    );
    if (!pool) {
      console.error('Pool not found for aggregation reverse', poolAddress);
      return;
    }

    pool.aggregators.push({
      ...findedPool,
    });
  }

  if (
    poolAddress === '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome'
  ) {
    const findedPool = pools.find(
      (data) => data.address === '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0',
    );
    if (!pool) {
      console.error('Pool not found for aggregation reverse', poolAddress);
      return;
    }

    pool.aggregators.push({
      ...findedPool,
    });
  }
};

export const initAggregators = (pool: any) => {
  pool.aggregators = [];
  // usd+ dola arb
  const poolAddress = pool.id.address;

  if (poolAddress === '0x1F3cA66c98d682fA1BeC31264692daD4f17340BC') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/thena-hay-usd+',
    });
  }

  if (poolAddress === '0xa99817d2d286c894f8f3888096a5616d06f20d46') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-dola',
    });
  }

  if (poolAddress === '0x219fbc3ed20152a9501ddaa47f2a8c193e32d0c6') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/solidlizard-usd+-usdc',
    });
  }

  if (poolAddress === '0x69c28d5bbe392ef48c0dc347c575023daf0cd243') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-dai+',
    });
  }

  if (poolAddress === '0x8a9cd3dce710e90177b4332c108e159a15736a0f') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usd+-lusd',
    });
  }

  if (poolAddress === '0x67124355cce2ad7a8ea283e990612ebe12730175') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Beefy',
      zappable: false,
      link: 'https://app.beefy.com/vault/velodrome-usdp-usdc',
    });
  }

  if (poolAddress === '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb') {
    pool.aggregators.push({
      id: `Aggregator${pool.id.name}${pool.tvl}${pool.platform}`,
      name: pool.id.name,
      address: pool.id.address,
      platform: 'Ennead',
      zappable: false,
    });
  }

  return pool;
};
