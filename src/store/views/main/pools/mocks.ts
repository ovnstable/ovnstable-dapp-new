/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
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
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197',
  '0x61366A4e6b1DB1b85DD701f2f4BFa275EF271197_Aerodrome',

  '0x6f501662a76577fbb3bb230be5e8e69d41d8c711',

  // CL
  '0x0c1A09d5D0445047DA3Ab4994262b22404288A3B',
  '0x96331Fcb46A7757854d9E26AFf3aCA2815D623fD',
  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606',
  '0x20086910E220D5f4c9695B784d304A72a0de403B',

  '0x4Ef1E503C4F1e5664ac98294d0e42ddC9c0FF961',
  '0x8e62bE92c6Fb091428d0d6cBa0C0e32529B27e51',
  '0x9EfdF5b3E05e52c2957BDA3e89Ea35C5296A78f0',

  '0xe37304F7489ed253b2A46A1d9DabDcA3d311D22E',
  '0xf92768916015b5eBd9fa54D6BA10dA5864e24914',
  '0xa1F9159e11aD48524c16C9bf10bf440815b03e6C',
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
  '0x6f501662a76577fbb3bb230be5e8e69d41d8c711',

  // FRAX
  '0x56390acF12bce9675ab3922060D8d955149BE286',

  // CL
  '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606',
  '0x20086910E220D5f4c9695B784d304A72a0de403B',

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
