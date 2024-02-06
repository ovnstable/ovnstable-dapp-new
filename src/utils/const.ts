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
  USDC_PLUS: {
    BASE: '0x85483696Cc9970Ad9EdD786b2C5ef735F38D156f',
  },
  ETH_PLUS: {
    ARBITRUM: '0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
  },
  USDT_PLUS: {
    ARBITRUM: '0xb1084db8D3C05CEbd5FA9335dF95EE4b8a0edc30',
    BSC: '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C',
    LINEA: '0x1E1F509963A6D33e169D9497b11c7DbFe73B7F13',
  },
  DAI_PLUS: {
    OPTIMISM: '0x970D50d09F3a656b43E11B0D45241a84e3a6e011',
    ARBITRUM: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    BASE: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
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

export const awaitDelay = async (time: number) => new Promise((res) => setTimeout(res, time));
