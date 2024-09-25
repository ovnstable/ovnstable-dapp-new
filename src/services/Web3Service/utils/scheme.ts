export enum DEPOSIT_TYPES {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
  ADD = 'add',
  NONE = ''
}

// for zapins
export const ZAPIN_SCHEME = {
  aerodrome: {
    zapinAdd: '0xb63F93A8020d0495fE9EDfE23Da3b7833F632c49',
    stake: DEPOSIT_TYPES.DEPOSIT,
  },
  pancake: {
    zapinAdd: '0xB1b2F63ADD990d792d436143a07b8E0c06d8Fa09',
    stakeAddress: '0xc6a2db661d5a5690172d8eb0a7dea2d3008665a3',
    stake: DEPOSIT_TYPES.TRANSFER,
  },
  uniswap: {
    zapinAdd: '',
    stake: DEPOSIT_TYPES.NONE,
  },
};
