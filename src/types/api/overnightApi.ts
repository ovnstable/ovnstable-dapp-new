type TPoolTokenData = {
    tokenId: string,
    decimals: string,
    name: string,
    symbol: string,
    amount: string,
    price: string
}
export type TPoolData = {
    chain: string,
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
