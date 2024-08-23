export type TPoolTokenData = {
    tokenId: string,
    decimals: string,
    name: string,
    symbol: string,
    amount: string,
    price: string
}
export type TPoolData = {
    chainName: string,
    chainId: number,
    poolVersion: string,
    name: string,
    poolAddress: string,
    platform: string,
    fee: string,
    initPrice: string,
    price: string,
    tickSpacing: string,
    gauge: string,
    tvl: string
    token0: TPoolTokenData,
    token1: TPoolTokenData,
}

export type TTokenData = {
    address: string,
    name: string,
    symbol: string,
    id: string,
    decimals: number,
    price: string,
    image_url: string,
    isPoolToken: boolean
}

export type TChainTokenMap = {
    chainTokenMap: {
        [key: string]: {
            tokenMap: {
                [key: string]: TTokenData
            }
        },
    }
}
