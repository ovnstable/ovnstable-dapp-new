/* eslint-disable no-promise-executor-return */
export const getImageUrl = (path: string) => new URL(`../${path}`, import.meta.url).href;

export const svgIconsMap = (() => {
  function getSvgNameFromPath(path: string) {
    const pathSplit = path.split('/');
    const fileName = pathSplit[pathSplit.length - 1] || '';
    const svgName = fileName.replace('.svg', '');

    return svgName;
  }

  const modules = import.meta.glob('@/assets/icons/**/*.svg', {
    import: 'default',
    eager: true,
  });

  const svgMap = new Map();

  Object.keys(modules).forEach((path) => {
    const svgName = getSvgNameFromPath(path);
    svgMap.set(svgName, modules[path]);
  });

  return svgMap;
})();

// odos do not support currently that networks
// todo: check, maybe oudated
export const EMPTY_TOKENS_NETWORKS = [81457, 59144];
export const DEPRECATED_NETWORKS = [137, 56];

// Not supported by Odos as for May 24
export const ODOS_DEPRECATED_NETWORKS = [81457];

// Some chains have duplicates of tokens in input, some in output
export const DUPLICATED_TOKEN_CHAINS = [81457, 8453];

export const appNetworksData = [
  {
    chain: 10,
    name: 'Optimism',
    color: '#fe051f',
  },
  {
    chain: 42161,
    name: 'Arbitrum',
    color: '#25a0ee',
  },
  {
    chain: 8453,
    name: 'Base',
    color: '#4d8be8',
  },
  {
    chain: 81457,
    name: 'Blast',
    color: '#fff561',
  },
  {
    chain: 59144,
    name: 'Linea',
    color: 'black',
  },
  {
    chain: 56,
    name: 'BSC',
    color: '#f2ba2f',
  },
  {
    chain: 324,
    name: 'ZkSync',
    color: '#8b8dfc',
  },
  {
    chain: 137,
    name: 'Polygon',
    color: '#7b3fe4',
  },
];

export const awaitDelay = async (time: number) => new Promise((res) => setTimeout(res, time));

export const OVN_TOKENS = ['USD+', 'DAI+', 'USDT+', 'USDC+', 'ETH+', 'OVN', 'wETH+', 'wUSD+'];

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_CHAIN = 8453;
export const OVN_QUESTS_API = process.env.NODE_ENV === 'development' ? 'http://localhost:9091' : 'https://api.overnight.fi/root/admin';
