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

// todo in contractsmap
interface ContractAddressMap {
  [token: string]: {
    [network: string]: string;
  };
}

export const contractAddressMap:ContractAddressMap = {
  USD_PLUS: {
    OPTIMISM: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
    ARBITRUM: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    ZKSYNC: '0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557',
    BSC: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    POLYGON: '0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f',
    BASE: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    LINEA: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
  },
};

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
