/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
export enum mintStatus {
  MINT,
  REDEEM
}

export enum wrapStatus {
  WRAP,
  UNWRAP
}

export enum mintRedeemStep {
  START = 'Start',
  APPROVE = 'Approve',
  CONFIRMATION = 'Confirmation',
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
