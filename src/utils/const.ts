export const DAI_PLUS_CONTRACT_ADDRESS_OPTIMISM = '0x970D50d09F3a656b43E11B0D45241a84e3a6e011';
export const DAI_PLUS_CONTRACT_ADDRESS_ARBITRUM = '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8';
export const DAI_PLUS_CONTRACT_ADDRESS_BASE = '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275';

export const ETH_PLUS_CONTRACT_ADDRESS_ARBITRUM = '0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab';

export const USDT_PLUS_CONTRACT_ADDRESS_BSC = '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C';
export const USDT_PLUS_CONTRACT_ADDRESS_LINEA = '0x1E1F509963A6D33e169D9497b11c7DbFe73B7F13';
export const USDT_PLUS_CONTRACT_ADDRESS_ARBITRUM = '0xb1084db8D3C05CEbd5FA9335dF95EE4b8a0edc30';

export const USD_PLUS_CONTRACT_ADDRESS_OPTIMISM = '0x73cb180bf0521828d8849bc8CF2B920918e23032';
export const USD_PLUS_CONTRACT_ADDRESS_ARBITRUM = '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65';
export const USD_PLUS_CONTRACT_ADDRESS_ZKSYNC = '0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557';
export const USD_PLUS_CONTRACT_ADDRESS_BSC = '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65';
export const USD_PLUS_CONTRACT_ADDRESS_POLYGON = '0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f';
export const USD_PLUS_CONTRACT_ADDRESS_BASE = '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376';
export const USD_PLUS_CONTRACT_ADDRESS_LINEA = '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376';

export const OVN_INS_CONTRACT_ADDRESS_OPTIMISM = '0x5E3C33e152Be20835B9c33071C411B616688c754';

export const OVN_CONTRACT_ADDRESS_ARBITRUM = '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396';
export const OVN_CONTRACT_ADDRESS_BASE = '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396';
export const OVN_CONTRACT_ADDRESS_OPTIMISM = '0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e';

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

export const appNetworksData = [
  {
    chain: 10,
    name: 'Optimism',
    color: 'red',
  },
  {
    chain: 42161,
    name: 'Arbitrum',
    color: 'blue',
  },
  {
    chain: 8453,
    name: 'Base',
    color: 'blue',
  },
  {
    chain: 59144,
    name: 'Linea',
    color: 'black',
  },
  {
    chain: 56,
    name: 'BSC',
    color: 'yellow',
  },
  {
    chain: 324,
    name: 'ZkSync',
    color: 'red',
  },
  {
    chain: 137,
    name: 'Polygon',
    color: 'red',
  },
];
