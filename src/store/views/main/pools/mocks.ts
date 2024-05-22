/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';

export const poolTokensForZapMap = {
  // Chronos
  // pool address
  '0xb260163158311596ea88a700c5a30f101d072326': [
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
    {
      name: 'DAI+',
      address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    },
  ],
  '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66': [
    {
      name: 'DOLA',
      address: '0x6a7661795c374c0bfc635934efaddff3a7ee23b6',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  ],

  '0xcd78e225e36e724c9fb4bd8287296557d728cda7': [
    {
      name: 'LUSD',
      address: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  ],

  // Thena
  '0x1561d9618db2dcfe954f5d51f4381fa99c8e5689': [
    {
      name: 'USDT+',
      address: '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  ],

  '0x1f3ca66c98d682fa1bec31264692dad4f17340bc': [
    {
      name: 'HAY',
      address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  ],

  // Velodrome
  '0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d': [
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8cf2b920918e23032',
    },
    {
      name: 'DOLA',
      address: '0x8ae125e8653821e851f12a49f7765db9a9ce7384',
    },
  ],

  '0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223': [
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8cf2b920918e23032',
    },
    {
      name: 'DAI+',
      address: '0x970d50d09f3a656b43e11b0d45241a84e3a6e011',
    },
  ],

  '0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B': [
    {
      name: 'FRAX',
      address: '0x2e3d870790dc77a83dd1d18184acc7439a53f475',
    },
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8cf2b920918e23032',
    },
  ],

  '0xd95E98fc33670dC033424E7Aa0578D742D00f9C7': [
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8cf2b920918e23032',
    },
    {
      name: 'USDC',
      address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    },
  ],

  '0x37e7D30CC180A750C83D68ED0C2511dA10694d63': [
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8cf2b920918e23032',
    },
    {
      name: 'LUSD',
      address: '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819',
    },
  ],

  '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0': [
    {
      name: 'OVN',
      address: '0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e',
    },
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
    },
  ],

  // Arbidex
  '0xeE5e74Dc56594d070E0827ec270F974A68EBAF22': [
    {
      name: 'DAI',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
    {
      name: 'DAI+',
      address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    },
  ],

  '0xE8C060d40D7Bc96fCd5b758Bd1437C8653400b0e': [
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
    {
      name: 'DAI+',
      address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    },
  ],

  '0xECe52B1fc32D2B4f22eb45238210b470a64bfDd5': [
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
    {
      name: 'USDC.E',
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
  ],

  '0xb0Fb1787238879171Edc30b9730968600D55762A': [
    {
      name: 'FRAX',
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  ],

  // '0xEa5f97aab76E397E4089137345c38b5c4e7939B3': [
  //     {name: 'USD+', address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65'},
  //     {name: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'},
  // ],

  '0x306132b6147751B85E608B4C1EC452E111531eA2': [
    {
      name: 'FRAX',
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
    },
    {
      name: 'DAI+',
      address: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    },
  ],

  // Defiedge
  // '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3': [
  //     {name: 'USD+', address: '0x73cb180bf0521828d8849bc8cf2b920918e23032'},
  //     {name: 'USDC', address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'},
  // ],

  // Baseswap
  '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A': [
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],

  '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306': [
    {
      name: 'DAI+',
      address: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  ],

  // Velocimeter
  '0x298c9f812c470598c5f97e3da9261a9899b89d35': [
    // gauge 0x0daf00a383f8897553ac1d03f4445b15afa1dcb9
    {
      name: 'DAI+',
      address: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  ],

  '0x653685aa9913c6ab13d659a4ea8f358ecec3d34f': [
    // gauge 0xD9875fBe2A706f9Fed68F066D7420D63FDC5eD76
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],

  // Alienbase
  '0x553666081db0a8fdb337560009932852059d589a': [
    // 7 pool
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],
  '0xd97a40434627D5c897790DE9a3d2E577Cba5F2E0': [
    // 8 pool
    {
      name: 'DAI+',
      address: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  ],

  // Swapbased
  '0x282f9231e5294e7354744df36461c21e0e68061c': [
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],
  '0x164bc404c64fa426882d98dbce9b10d5df656eed': [
    {
      name: 'DAI+',
      address: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  ],

  // Aerodrome
  '0x1b05e4e814b3431a48b8164c41eac834d9ce2da6': [
    {
      name: 'DAI+',
      address: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  ],

  '0x4a3636608d7bc5776cb19eb72caa36ebb9ea683b': [
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],

  '0xdc0f1f6ecd03ec1c9ffc2a17bababd313477b20e': [
    {
      name: 'USD+',
      address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
    {
      name: 'USDbC',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    },
  ],

  '0x8E9154AC849e839d60299E85156bcb589De2693A': [
    {
      name: 'DOLA',
      address: '0x4621b7a9c75199271f773ebd9a499dbd165c3191',
    },
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
  ],

  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197': [
    {
      name: 'OVN',
      address: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    },
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
  ],

  // Curve
  '0xda3de145054ED30Ee937865D31B500505C4bDfe7': [
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    {
      name: 'crvUSD',
      address: '0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93',
    },
  ],
  '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013': [
    {
      name: 'USD+',
      address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
    },
    {
      name: 'FRAXBP-f',
      address: '0xc9b8a3fdecb9d5b218d02555a8baf332e5b740d5',
    },
  ],

  '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7': [
    {
      name: 'USD+',
      address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
    },
    {
      name: 'USDT+',
      address: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
    },
  ],

  // LYNEX
  '0xc5f4c5c2077bbbac5a8381cf30ecdf18fde42a91': [
    {
      name: 'USDT+',
      address: chainContractsMap.linea.usdtPlus.tokenPlus,
    },
    {
      name: 'USD+',
      address: chainContractsMap.linea.usdPlus.tokenPlus,
    },
  ],
  '0x58aacbccaec30938cb2bb11653cad726e5c4194a': [
    {
      name: 'USDC',
      address: chainContractsMap.linea.usdc,
    },
    {
      name: 'USD+',
      address: chainContractsMap.linea.usdPlus.tokenPlus,
    },
  ],

  // Beefy
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome': [
    // Aerodrome
    {
      name: 'OVN',
      address: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    },
    {
      name: 'USD+',
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
  ],

  '0xe96c788e66a97cf455f46c5b27786191fd3bc50b': [
    // Aerodrome
    {
      name: 'USDC+',
      address: chainContractsMap.base.usdcPlus.tokenPlus,
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],

  '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome': [
    // Velodrome
    {
      name: 'USDC+',
      address: chainContractsMap.base.usdcPlus.tokenPlus,
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],

  // PANCAKE ZAPS
  '0x8a06339abd7499af755df585738ebf43d5d62b94': [
    {
      name: 'USDT+',
      address: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
    },
    {
      name: 'USD+',
      address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
    },
  ],
  '0x952388d73EA3E940eD6824DBd75ed6aD58e6B436': [
    {
      name: 'DOLA',
      address: '0x4621b7A9c75199271F773Ebd9A499dbd165c3191',
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],
  '0x418457Ca08fA5EC77f811B105F2c585cd051Ac10': [
    {
      name: 'USDC',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],
  '0x4704f9Cf735b58ea442E387ACca6717311597322': [
    {
      name: 'AERO',
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    },
    {
      name: 'OVN',
      address: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    },
  ],
  '0xbB38EeBd670A9F3cafe6D3170862ccD930cB25f9': [
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
    {
      name: 'sFRAX',
      address: '0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E',
    },
  ],
  '0x8041e2A135D2da7A8E21E4B14113D8245EC532e1': [
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
    {
      name: 'eUSD',
      address: '0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4',
    },
  ],
  '0xf15B30a0a823f588B523fD794A43939F0B1dC582': [
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
    {
      name: 'wstETH',
      address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    },
  ],
} as any;

export const poolsForOVN = {
  base: {
    api: 'https://api.basescan.org/',
    pools: [{ address: '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197' }],
  },
  optimism: {
    api: 'https://api-optimistic.etherscan.io/',
    pools: [{ address: '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0' }],
  },
  arbitrum: {
    api: 'https://api.arbiscan.io/',
    pools: [{}],
  },
  bsc: {
    api: 'https://api.bscscan.com/',
    pools: [{}],
  },
} as any;

export const zapPlatformSupportList = [
  'Thena',
  'Velodrome',
  'Aerodrome',
  'Ramses',
  'Arbidex',
  'Sperax',
  'Convex',
  'Lynex',
  'Velocimeter',
  'Alienbase',
  'Swapbased',
  'Curve',
  'Pancake',
  'Beefy',
];

export enum POOL_TAG {
  NEW = '0',
  PROMO = '1',
  HOT = '2',
}

// POOLS WITH EARNINGS MORE THAN 500$ per month
// https://docs.google.com/spreadsheets/d/1zyNA4mbpmyG30R1aIqkkRvbCJSjfyb7pV4hhCa7pohM/edit#gid=813615557

export const NEW_POOLS: string[] = [];

export const HOT_POOLS = [
  // AERODROME
  '0xe96c788e66a97cf455f46c5b27786191fd3bc50b',
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197',
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome',
  '0x4a3636608d7bc5776cb19eb72caa36ebb9ea683b',

  // PANCAKE
  '0x8a06339abd7499af755df585738ebf43d5d62b94',
  '0x6a8fc7e8186ddc572e149dfaa49cfae1e571108b',

  // CURVE
  '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7',
  '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013',
];

export const FIRST_MIN_AMOUNT = 300000;
export const SECOND_MIN_AMOUNT = 20000;

export const LOW_TVL_PROMOTE = [
  '0xd01075f7314a6436e8b74fc18069848229d0c555',
  '0xb9c2d906f94b27bc403ab76b611d2c4490c2ae3f',

  // VELOCORE
  '0x1d0188c4b276a09366d05d6be06af61a73bc7535',

  // PANCAKE
  '0x6a8fc7e8186ddc572e149dfaa49cfae1e571108b',
  '0x35d85d531be7159cb6f92e8b9ceaf04ec28c6ad9',

  // LYNEX
  '0x58aacbccaec30938cb2bb11653cad726e5c4194a',
  '0xc5f4c5c2077bbbac5a8381cf30ecdf18fde42a91',
  // FRAX
  '0x56390acF12bce9675ab3922060D8d955149BE286',

  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606',
  // SYNCSWAP
  // '0xA06f1cce2Bb89f59D244178C2134e4Fc17B07306',

  // SWAPBLAST
  // '0x49b6992dbacf7caa9cbf4dbc37234a0167b8edcd',
  // '0xb70ab4c4be5872fdd22f43c5907428198cdcb2d5',

  // Dyson
  // '0xf63291375d3eb7014fbe658f256c79163dc308ab',

  // AMBIENT
  // '0xaAaaaAAAFfe404EE9433EEf0094b6382D81fb958_eth',
  // '0xaAaaaAAAFfe404EE9433EEf0094b6382D81fb958_usdb',
];

export const APY_POOLS = [
  'Dyson',
  'Beefy',
];
