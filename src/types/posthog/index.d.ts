export enum POOL_TYPE {
    stable,
    volatile,
}

export enum POOL_VERSION {
    v2,
    v3,
}

export type TSwapSuccessTriggerProps = {
    txUrl: string,
    token0: string,
    token1: string,
    totalAmount: string,
    chainName: string,
    walletAddress: string,
}

export type TMintRedeemSuccessTriggerProps = {
    txUrl: string,
    totalAmount: string,
    chainName: string,
    walletAddress: string,
}

export type TZapinSuccessTriggerProps = {
    txUrl: string,
    poolName: string,
    poolVersion: string,
    totalAmount: string,
    poolType: string,
    walletAddress: string,
    chainName: string,
    poolPlatform: string
}

export type TIdentyfyByWalletTriggerProps = {
    address: string,
}

export type TLinkWalletTriggerProps = {
    address0: string,
    address1: string,
}

export interface IPosthogService {
    captureEvent(eventName: string, props: any): void,
    swapSuccessTrigger(props: TSwapSuccessTriggerProps): void
    zapinSuccessTrigger(props: TZapinSuccessTriggerProps): void
    rebalanceSuccessTrigger(props: TZapinSuccessTriggerProps): void
    mintredeemSuccessTrigger(props: TMintRedeemSuccessTriggerProps): void
    wrapUnwrapSuccessTrigger(props: TMintRedeemSuccessTriggerProps): void
    identyfyByWalletTrigger(props: TIdentyfyByWalletTriggerProps): void
    linkWalletsTrigger(props: TLinkWalletTriggerProps): void
}
