export type TPool = {
    id: string,
    name: string,
    token0Icon: string,
    token1Icon: string,
    poolVersion: string,
    chain: number,
    chainName: string,
    address: string,
    platform: string,
    tvl: string,
    poolTag: string,
    explorerUrl: string,
    gauge: string,
    fee: string,
    initPrice: string,
    price: string,
    tickSpacing: string,
}

export type TPoolInfo = {
    id: string,
    name: string,
    token0Icon: string,
    token1Icon: string,
    token2Icon: null | string,
    token3Icon: null | string,
    poolVersion: string,
    chain: number,
    chainName: string,
    address: string,
    platform: string[],
    tvl: number,
    apr: number,
    poolTag: null | string,
    skimEnabled: boolean,
    explorerUrl: string,
    zappable: boolean,
    cardOpened: boolean,
    data: {
        id: {
            name: string,
            address: string,
            chain: string
        },
        platform: string,
        tvl: number,
        apr: number,
        pool_version: string,
        updateDate: string,
        addToSync: boolean,
        skimEnabled: boolean,
        promoted: boolean,
        transfersSyncEnabled: boolean,
        skimUpdateDate: null | string,
        zappable: boolean,
        aggregators: string[]
    },
    aggregators: [],
    promoted: false,
    isOpened: true,
    stableFishUrl: null
}

export enum POOL_CATEGORIES {
    ALL,
    VOLATILE,
    STABLE,
    V2,
    V3,
    TOKENPLUS,
    OVN,
  }

// export type TFilterPoolsParams = {
//     networkIds: number[],
//     category: POOL_CATEGORIES,
//     searchQuery: string,
// }

export type TFilterPoolsParams = {
    token0: string,
    token1: string,
    chain: string[],
    minTvl: string,
    protocol: string[],
    page: string | number,
    limit: string | number,
    sort: string,
}
