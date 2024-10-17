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
  bsc: [PLATFORMS.PANCAKE],
};

// for autozapins dev/prod
// prod is fixed contract, without updates, and usually the most stable
// dev is for experiments or some hotfixes
export const ZAPIN_SCHEME = {
  arbitrum: {
    pancake: {
      zapinProd: '0x24C032f63Bd3De6AB47F4ADeE83D46A99a98a7F9',
      zapinDev: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
      zapinAdd: '0x2540E54C91F24a8E89c36fCA9073447a291E1CC3',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinProd: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      zapinDev: '0x68A213C21C9DBB6A38646B860ef10a9a95B85Da4',
      zapinAdd: '0x68A213C21C9DBB6A38646B860ef10a9a95B85Da4',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
  bsc: {
    uniswap: {
      zapinAdd: '',
    },
    pancake: {
      zapinProd: '0x65BEBAf04b3Bc943B49a2Ec5727cf991f45C2290',
      zapinDev: '0x2A86C30c2688E9970E7a57dc4215F32697219491',
      zapinAdd: '0x2A86C30c2688E9970E7a57dc4215F32697219491',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
  },
  base: {
    aerodrome: {
      zapinProd: '0x0a20444bf4621d348E139D77CC3837464932226a',
      zapinDev: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
      zapinAdd: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
      stake: DEPOSIT_TYPES.DEPOSIT,
    },
    pancake: {
      zapinProd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      zapinDev: '0xB1b2F63ADD990d792d436143a07b8E0c06d8Fa09',
      zapinAdd: '0x7E7F8D5547B93F38bd3B893C09A80BD0233265Dc',
      stake: DEPOSIT_TYPES.TRANSFER,
    },
    uniswap: {
      zapinProd: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      zapinDev: '0x8A368427Fc41D314174FdB8d2F8d444de8db362b',
      zapinAdd: '0x767bf60d3D22B3bfad879ff4bF311Ef1594b4B0c',
      stake: DEPOSIT_TYPES.NONE,
    },
  },
};
