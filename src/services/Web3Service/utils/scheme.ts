export enum DEPOSIT_TYPES {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  ADD = 'add',
  NONE = ''
}

// for zapins
export const ZAPIN_SCHEME = {
  arbitrum: {
    pancake: {
      zapinAdd: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
      // stakeAddress: '0xc6a2db661d5a5690172d8eb0a7dea2d3008665a3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
  },
  base: {
    aerodrome: {
      zapinAdd: '0x0a20444bf4621d348E139D77CC3837464932226a',
      stake: DEPOSIT_TYPES.DEPOSIT,
    },
    pancake: {
      zapinAdd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      // stakeAddress: '0xc6a2db661d5a5690172d8eb0a7dea2d3008665a3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinAdd: '',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
};
