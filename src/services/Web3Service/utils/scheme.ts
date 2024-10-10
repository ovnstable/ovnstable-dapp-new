export enum DEPOSIT_TYPES {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  ADD = 'add',
  NONE = ''
}

// DEV
// export const ZAPIN_SCHEME = {
//   arbitrum: {
//     pancake: {
//       zapinAdd: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
//       stake: DEPOSIT_TYPES.TRANSFER,
//     },
//   },
//   base: {
//     aerodrome: {
//       zapinAdd: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
//       stake: DEPOSIT_TYPES.DEPOSIT,
//     },
//     pancake: {
//       zapinAdd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
//       stake: DEPOSIT_TYPES.TRANSFER,
//     },
//     uniswap: {
//       zapinAdd: '',
//       stake: DEPOSIT_TYPES.NONE,
//     },
//   },
// };

// for zapins
export const ZAPIN_SCHEME = {
  arbitrum: {
    pancake: {
      zapinAdd: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
      // stakeAddress: '0xc6a2db661d5a5690172d8eb0a7dea2d3008665a3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinAdd: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
  base: {
    aerodrome: {
      zapinAdd: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
      stake: DEPOSIT_TYPES.DEPOSIT,
    },
    pancake: {
      zapinAdd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      // stakeAddress: '0xc6a2db661d5a5690172d8eb0a7dea2d3008665a3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinAdd: '0x68A213C21C9DBB6A38646B860ef10a9a95B85Da4',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
};
