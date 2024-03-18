/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
export enum mintWrapStatus {
  MINT,
  REDEEM,
  WRAP,
  UNWRAP
}

export enum mintRedeemTypes {
  WRAP = 'wrap',
  UNWRAP = 'unwrap',
  MINT = 'mint',
  REDEEM = 'redeem',
  BUY = 'buy'
}

export interface IMethodData {
  name: string,
  params: any,
  iterateArgs: boolean
}
