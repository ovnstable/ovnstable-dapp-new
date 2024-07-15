import { chainContractsMap } from '@/utils/contractsMap.ts';

export const poolsInfoMap: any = {
  '0xb260163158311596ea88a700c5a30f101d072326': {
    gauge: '0xCD4A56221175b88d4fb28CA2138d670Cc1197CA9',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x0df5f52afa0308fdd65423234c4fda9add0b9eba': {
    gauge: '0xF319285fa8b5323A40c71D3c006dBd0BE4f5171b',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x69fd0ea1041bc4c495d5371a074bf1dcd6700577': {
    gauge: '0xD1C05e0770968c8b9C7dC0f3aC1DD419A3417971',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x94c20b48faed9148a00ccf3229f4e50f791a26b6': {
    gauge: '0x8Bc7811fdC24c82E842452F6EA3C7a20e1994889',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xa885a1e7511cf6b572d949b1e60ac0a8449f3b18': {
    gauge: '0xc8d79Fd3Ecc0F91d9C56E279Daba12257bE24619',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66': {
    gauge: '0x3004F018B2C01d40D19C7dC4a5a0AFA8743a7e24',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xcd78e225e36e724c9fb4bd8287296557d728cda7': {
    gauge: '0x7de0998eE1Fce80c160AD1F5Fe768BFF9b0ee87f',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x1561d9618db2dcfe954f5d51f4381fa99c8e5689': {
    gauge: '0x3877c2C3D75aE80f2Ed8E9d4d68e3C1BFc77e5A6',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x1f3ca66c98d682fa1bec31264692dad4f17340bc': {
    gauge: '0xB0a69681d82c90B80B689BaF43ccfa6270f1DdE5',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // Velodrome https://api.velodrome.finance/api/v1/pairs
  '0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d': {
    gauge: '0x93e1152951ccfb02b1ad4d8a4afc68b28cac0614',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223': {
    gauge: '0x4bc0547661f40e712a9793c3b99a14a68049a836',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B': {
    gauge: '0x89913088bf483c65325fbd43ce15051b78d762d4',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0xd95E98fc33670dC033424E7Aa0578D742D00f9C7': {
    gauge: '0xc263655114cde848c73b899846fe7a2d219c10a8',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x37e7D30CC180A750C83D68ED0C2511dA10694d63': {
    gauge: '0x7dca0f3023b80e8c724b11ddccac788940275f41',
    version: 2,
    poolId: 4,
    approveType: 'TOKEN',
  },

  '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0': {
    gauge: '0xfac0cf9e487356ddc72443061dfdb109885b04fd',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x4a3636608d7bc5776cb19eb72caa36ebb9ea683b': {
    // usd+/usdbc stable
    gauge: '0xa5972f0C07a2D1cc5A8457c28d88ec4f3C009864',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0xdc0f1f6ecd03ec1c9ffc2a17bababd313477b20e': {
    // usd+/usdbc volatile
    gauge: '0xd2121cb13a28ab16cb0f0f19a665e9a9311f9abb',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x8E9154AC849e839d60299E85156bcb589De2693A': {
    // dola/usd+ volatile
    gauge: '0x969c70383A95704C6a35497d8C77BF38dc152e63',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197': {
    // ovn/usd+ volatile
    gauge: '0x00b2149d89677a5069ed4d303941614a33700146',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x306132b6147751B85E608B4C1EC452E111531eA2': {
    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
    version: 2,
    poolId: 35,
    approveType: 'TOKEN',
  },

  // Baseswap
  '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A': {
    gauge: '0x2b0a43dccbd7d42c18f6a83f86d1a19fa58d541a',
    version: 2,
    poolId: 10,
    approveType: 'TOKEN',
  },

  '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306': {
    gauge: '0x2b0a43dccbd7d42c18f6a83f86d1a19fa58d541a',
    version: 2,
    poolId: 11,
    approveType: 'TOKEN',
  },

  //  Swapbased
  '0x282f9231e5294e7354744df36461c21e0e68061c': {
    // usd+/usdbc
    gauge: '0x1b0d1C09fD360ADe0Caf4bFfE2933E2CC8846a62',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x164bc404c64fa426882d98dbce9b10d5df656eed': {
    // usd+/dai+
    gauge: '0xF4272b27C1AfE449FBdbe83C1C3D1EbC7351fA2d',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // Curve
  '0xda3de145054ED30Ee937865D31B500505C4bDfe7': {
    // usd+/crvUSD
    gauge: '0xc0798d022eEE81F1408895325A9fBe171d2a24f1',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013': {
    // usd+/crvUSD
    gauge: '0x4645e6476d3a5595be9efd39426cc10586a8393d',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7': {
    // usd+/usdt+
    gauge: '0xd68089d9daa2da7888b7ef54158480e09ecc3580',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // LYNEX
  '0xc5f4c5c2077bbbac5a8381cf30ecdf18fde42a91': {
    gauge: '0x58AC068Eef3F49E019A88C7ecc9Ac2Fdd63fA755',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x58aacbccaec30938cb2bb11653cad726e5c4194a': {
    gauge: '0xEaf988C649f44c4DDFd7FDe1a8cB290569B66253',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // Beefy
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome': {
    // ovn/usd+ Aerodrome volatile
    gauge: '0x98bEAa72230788572e3e3Be58D91C232dda315d4',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // Aerodrome
  '0x1b05e4e814b3431a48b8164c41eac834d9ce2da6': {
    gauge: '0x87803Cb321624921cedaAD4555F07Daa0D1Ed325',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0xe96c788e66a97cf455f46c5b27786191fd3bc50b': {
    gauge: '0x526b3D92fF55263dd24E3e14ccD0f5c2Dab81d3b',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  '0x844D7d2fCa6786Be7De6721AabdfF6957ACE73a0_Velodrome': {
    // ovn/usd+ Velodrome volatile
    gauge: '0x366776D0709F7C49ce5ea7cF7eAEF0AB4E746cc9',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x952388d73EA3E940eD6824DBd75ed6aD58e6B436': {
    // dola/usd+ Aerodrome
    gauge: '0x969c70383A95704C6a35497d8C77BF38dc152e63',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x418457Ca08fA5EC77f811B105F2c585cd051Ac10': {
    // usdc/usd+ Aerodrome
    gauge: '0x9701A079C6e80D91CE4c464C4a996237A27FE537',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x4704f9Cf735b58ea442E387ACca6717311597322': {
    // aero/ovn Aerodrome
    gauge: '0x365f5413BBC783D1fff1cAe9D3Bd9A16eA698D19',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xbB38EeBd670A9F3cafe6D3170862ccD930cB25f9': {
    // sfrax/usd+ Aerodrome
    gauge: '0xEc4288995734ca01eAfC97588658F37515823502',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0x8041e2A135D2da7A8E21E4B14113D8245EC532e1': {
    // usd+/eusd Aerodrome
    gauge: '0xf09B1177d10775791d5806544AB51F1990Cb7c9A',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },
  '0xf15B30a0a823f588B523fD794A43939F0B1dC582': {
    // usd+/wsteth Aerodrome
    gauge: '0xcC5931E3f7ce8967Dcdc4BC5C7cfd5bF3d7Cf1FE',
    version: 2,
    poolId: 0,
    approveType: 'TOKEN',
  },

  // CL AERODROME
  // base have unique logic of staking, compare to other DEX
  '0x0c1A09d5D0445047DA3Ab4994262b22404288A3B': {
    gauge: '0xeA22A3AAdA580bD75Fb6caC35034e09046cbFf72',
    gaugeForLP: '0x827922686190790b37229fd06084350e74485b72',
    version: 3,
    approveType: 'NFT',
    poolTokenType: 'DIFFERENT',
  },
  '0x96331Fcb46A7757854d9E26AFf3aCA2815D623fD': {
    gauge: '0xCB4B8aeD321e22B0B87D9e41538408404433Ac70',
    gaugeForLP: '0x827922686190790b37229fd06084350e74485b72',
    version: 3,
    approveType: 'NFT',
    poolTokenType: 'DIFFERENT',
  },
  '0x20086910E220D5f4c9695B784d304A72a0de403B': {
    gauge: '0x7E62007c19C9b9D581354B29c57c61C41b50851a',
    gaugeForLP: '0x827922686190790b37229fd06084350e74485b72',
    version: 3,
    approveType: 'NFT',
    poolTokenType: 'DIFFERENT',
  },
  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606': {
    gauge: '0xcC2714BF50F3c7174a868bec8f4D4d284A0b07cc',
    gaugeForLP: '0x827922686190790b37229fd06084350e74485b72',
    version: 3,
    approveType: 'NFT',
    poolTokenType: 'DIFFERENT',
  },
  // PANCAKE CL
  // '0x8a06339abd7499af755df585738ebf43d5d62b94': {
  //   gauge: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
  //   version: 3,
  //   approveType: 'NFT',
  //   poolTokenType: 'TOKEN',
  // },
  // '0x714d48cb99b87f274b33a89fbb16ead191b40b6c': {
  //   gauge: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
  //   version: 3,
  //   approveType: 'NFT',
  //   poolTokenType: 'TOKEN',
  // },
  // '0xa1f9159e11ad48524c16c9bf10bf440815b03e6c': {
  //   gauge: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
  //   version: 3,
  //   approveType: 'NFT',
  //   poolTokenType: 'TOKEN',
  // },
  // '0xf92768916015b5ebd9fa54d6ba10da5864e24914': {
  //   gauge: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
  //   version: 3,
  //   approveType: 'NFT',
  //   poolTokenType: 'TOKEN',
  // },
  // '0xe37304f7489ed253b2a46a1d9dabdca3d311d22e': {
  //   gauge: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
  //   version: 3,
  //   approveType: 'NFT',
  //   poolTokenType: 'TOKEN',
  // },
};

export const poolTokensForZapMap = {
  // V3 pancake
  // '0x714d48cb99b87f274b33a89fbb16ead191b40b6c': [
  //   {
  //     name: 'OVN',
  //     address: chainContractsMap.arbitrum.ovn,
  //   },
  //   {
  //     name: 'USD+',
  //     address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
  //   },
  // ],
  // '0x8a06339abd7499af755df585738ebf43d5d62b94': [
  //   {
  //     name: 'USDT+',
  //     address: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
  //   },
  //   {
  //     name: 'USD+',
  //     address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
  //   },
  // ],
  // v3 base
  '0x0c1A09d5D0445047DA3Ab4994262b22404288A3B': [
    {
      name: 'USDC',
      address: chainContractsMap.base.usdcNative,
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],
  '0x96331Fcb46A7757854d9E26AFf3aCA2815D623fD': [
    {
      name: 'DOLA',
      address: '0x4621b7A9c75199271F773Ebd9A499dbd165c3191',
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],
  '0x20086910E220D5f4c9695B784d304A72a0de403B': [
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
    {
      name: 'USDbC',
      address: chainContractsMap.base.usdc,
    },
  ],
  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606': [
    {
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
    },
    {
      name: 'USD+',
      address: chainContractsMap.base.usdPlus.tokenPlus,
    },
  ],
  // V2
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
  // Pancake CL
  // '0xa1f9159e11ad48524c16c9bf10bf440815b03e6c': [
  //   {
  //     name: 'USDC',
  //     address: chainContractsMap.arbitrum.usdcNative,
  //   },
  //   {
  //     name: 'USD+',
  //     address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
  //   },
  // ],
  // '0xf92768916015b5ebd9fa54d6ba10da5864e24914': [
  //   {
  //     name: 'ARB',
  //     address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  //   },
  //   {
  //     name: 'USD+',
  //     address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
  //   },
  // ],
  // '0xe37304f7489ed253b2a46a1d9dabdca3d311d22e': [
  //   {
  //     name: 'WETH',
  //     address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  //   },
  //   {
  //     name: 'USD+',
  //     address: chainContractsMap.arbitrum.usdPlus.tokenPlus,
  //   },
  // ],
} as any;

export const zapPlatformContractTypeMap: any = {
  Chronos: {
    name: 'Chronos',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'BASE_CONSTRUCTOR',
  },
  Velodrome: {
    name: 'Velodrome',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'BASE_CONSTRUCTOR',
  },
  Aerodrome: {
    name: 'Aerodrome',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'BASE_CONSTRUCTOR',
  },
  Defiedge: {
    name: 'Defiedge',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'BASE_CONSTRUCTOR',
  },
  Baseswap: {
    name: 'Baseswap',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT',
  },
  Velocimeter: {
    name: 'Velocimeter',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_TOKEN_ID',
  },
  Alienbase: {
    name: 'Alienbase',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT',
  },
  Swapbased: {
    name: 'Swapbased',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_STAKE_METHOD_AND_TOKEN_AMOUNT',
  },
  Convex: {
    name: 'Convex',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_TOKEN_ID',
  },
  Curve: {
    name: 'Curve',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_TOKEN_ID',
  },
  Lynex: {
    name: 'Lynex',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITHOUT_TOKEN_ID',
  },
  Beefy: {
    name: 'Beefy',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'BASE_CONSTRUCTOR',
  },
  '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7': {
    name: 'CurveNG',
    type: 'LP_WITH_STAKE_IN_ONE_STEP',
    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_TOKEN_ID',
  },
  '0x0c1A09d5D0445047DA3Ab4994262b22404288A3B': {
    name: 'Aerodrome',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_V3_WITH_TOKEN_ID',
  },
  '0x96331Fcb46A7757854d9E26AFf3aCA2815D623fD': {
    name: 'Aerodrome',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_V3_WITH_TOKEN_ID',
  },
  '0x20086910E220D5f4c9695B784d304A72a0de403B': {
    name: 'Aerodrome',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_V3_WITH_TOKEN_ID',
  },
  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606': {
    name: 'Aerodrome',
    type: 'LP_STAKE_DIFF_STEPS',
    typeOfDepositConstructor: 'CONSTRUCTOR_V3_WITH_TOKEN_ID',
  },
  // Pancake CL
  // '0x714d48cb99b87f274b33a89fbb16ead191b40b6c': {
  //   name: 'Pancake',
  //   type: 'LP_STAKE_DIFF_STEPS',
  //   typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID',
  // },
  // '0x8a06339abd7499af755df585738ebf43d5d62b94': {
  //   name: 'Pancake',
  //   type: 'LP_STAKE_DIFF_STEPS',
  //   typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID',
  // },
  // '0xa1f9159e11ad48524c16c9bf10bf440815b03e6c': {
  //   name: 'Pancake',
  //   type: 'LP_STAKE_DIFF_STEPS',
  //   typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID',
  // },
  // '0xf92768916015b5ebd9fa54d6ba10da5864e24914': {
  //   name: 'Pancake',
  //   type: 'LP_STAKE_DIFF_STEPS',
  //   typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID',
  // },
  // '0xe37304f7489ed253b2a46a1d9dabdca3d311d22e': {
  //   name: 'Pancake',
  //   type: 'LP_STAKE_DIFF_STEPS',
  //   typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID',
  // },
};
