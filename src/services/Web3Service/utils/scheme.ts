import { PLATFORMS } from "@/types/common/pools";

export enum DEPOSIT_TYPES {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  ADD = 'add',
  NONE = ''
}

export const rebalanceChainMap: {[key: string]: string[]} = {
  base: [PLATFORMS.AERO, PLATFORMS.PANCAKE, PLATFORMS.UNI],
  arbitrum: [PLATFORMS.PANCAKE, PLATFORMS.UNI],
};

// for zapins dev/prod
export const ZAPIN_SCHEME = {
  arbitrum: {
    pancake: {
      zapinDev: '0x24C032f63Bd3De6AB47F4ADeE83D46A99a98a7F9',
      zapinAdd: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinDev: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      zapinAdd: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
  base: {
    aerodrome: {
      zapinDev: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
      zapinAdd: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
      stake: DEPOSIT_TYPES.DEPOSIT,
    },
    pancake: {
      zapinDev: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      zapinAdd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinDev: '0x8A368427Fc41D314174FdB8d2F8d444de8db362b',
      zapinAdd: '0x8A368427Fc41D314174FdB8d2F8d444de8db362b',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
};
