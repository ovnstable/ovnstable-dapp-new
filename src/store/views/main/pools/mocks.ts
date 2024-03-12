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

  '0x0d20ef7033b73ea0c9c320304b05da82e2c14e33': [
    {
      name: 'FRAX',
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
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

  // Demeter Sperax TODO: TOKEN ADDRESSES need to update
  '0x9be8026c5c55a3d5513d4c6607355b3678c0afdb': [
    {
      name: 'USDS',
      address: '0xD74f5255D557944cf7Dd0E45FF521520002D5748',
    },
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
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
  // Curve (3 tokens) -> usd+ / fraxbp
  '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013': [
    {
      name: 'USD+',
      address: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
    {
      name: 'FRAXbp',
      address: '0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5',
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

  '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome': [
    // Velodrome
    {
      name: 'OVN',
      address: '0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e',
    },
    {
      name: 'USD+',
      address: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
    },
  ],

  // PANCAKE ZAPS
  '0x721F37495cD70383B0A77Bf1eB8f97eef29498Bb': [
    {
      name: 'USDC',
      address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    },
    {
      name: 'USD+',
      address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
    },
  ],

  '0x8a06339Abd7499Af755DF585738ebf43D5D62B94': [
    {
      name: 'USDT+',
      address: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
    },
    {
      name: 'USD+',
      address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
    },
  ],
} as any;

export const poolsForOVN = {
  base: {
    api: 'https://api.basescan.org/',
    pools: [
      { address: '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197' },
    ],
  },
  optimism: {
    api: 'https://api-optimistic.etherscan.io/',
    pools: [
      { address: '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0' },
    ],
  },
  arbitrum: {
    api: 'https://api.arbiscan.io/',
    pools: [
      { },
    ],
  },
  bsc: {
    api: 'https://api.bscscan.com/',
    pools: [
      { },
    ],
  },
} as any;

export const zapPlatformSupportList = [
  // 'Chronos',
  'Thena',
  'Velodrome',
  'Aerodrome',
  'Ramses',
  'Arbidex',
  'Sperax',
  'Convex',
  // 'Defiedge',
  // 'Baseswap',
  'Velocimeter',
  'Alienbase',
  'Swapbased',
  'Curve',
  'Pancake',
  'Beefy',
];
