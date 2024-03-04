/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js';
import { loadTokenImage, loadOvernightTokenImage } from '@/utils/tokenLogo.ts';
import odosApiService from '@/services/odos-api-service.ts';
import type { stateData } from '@/store/views/main/odos/index';

const SECONDTOKEN_SECOND_DEFAULT_SYMBOL = 'DAI+';
const SECONDTOKEN_DEFAULT_SYMBOL = 'USD+';

export const WHITE_LIST_ODOS = {
  59144: [],
  56: [
    'Overnight Exchange',
    'PancakeSwap V3',
    'NomiSwap Stable',
    'Thena Fusion',
    'Thena Stable',
    'Wrapped BNB',
  ],
  42161: [
    'Overnight Exchange',
    'Ramses V2',
    'Camelot Stable',
    'Camelot V3',
    'Balancer V2 Stable',
    'PancakeSwap V3',
    'Uniswap V3',
    'Trader Joe V2.1',
    'Swaap V2',
    'Lighter V2',
    'Curve Stable NG',
    'Wrapped Ether',
    'Overnight Wrapper',
  ],
  8453: [
    'Overnight Exchange',
    'Aerodrome Volatile',
    'Aerodrome Stable',
    'Uniswap V3',
    'SynthSwap',
    'Maverick',
    'Wrapped Ether',
    'Overnight Wrapper',
  ],
  10: [
    'Overnight Exchange',
    'Velodrome V2 Stable',
    'Uniswap V3',
    'Curve Registry',
    'Velodrome V2 Volatile',
    'Solidly V3',
    'Wrapped Ether',
    'Overnight Wrapper',
  ],
  137: [
    'Overnight Exchange',
    'Aave V2',
    'Curve Registry',
    'Uniswap V3',
    'QuickSwap',
    'Dodo V2',
    'Wrapped Matic',
    'Overnight Wrapper',
  ],
  324: [
    'Overnight Exchange',
    'SyncSwap Stable',
    'PancakeSwap V3',
    'Maverick',
    'Wrapped Ether',
  ],
};

export const addItemToFilteredTokens = (
  tokens: any,
  key: string | number,
  item: any,
) => {
  let logoUrl;
  if (
    item.protocolId === 'overnight'
      || item.symbol === 'USD+'
      || item.symbol === 'USDC+'
      || item.symbol === 'DAI+'
      || item.symbol === 'USDT+'
      || item.symbol === 'OVN'
  ) {
    if (item.symbol === 'OVN') {
      logoUrl = loadTokenImage(item?.symbol);
    } else {
      logoUrl = loadOvernightTokenImage(item?.symbol);
    }
  } else {
    logoUrl = loadTokenImage(item?.symbol);
  }

  tokens.push({
    id: item.assetId + key,
    address: key,
    decimals: item.decimals,
    assetType: item.assetType,
    name: item.name,
    symbol: item.symbol,
    logoUrl,
    selected: false,
    balanceData: {},
    approveData: {
      allowanceValue: 0,
      approved: false,
    },
    price: 0,
    estimatePerOne: 0,
  });
};

export const getFilteredPoolTokens = (
  chainId: string | number,
  isIncludeInListAddresses: boolean,
  listTokensAddresses: string[],
  ignoreBaseNetworkCurrency: boolean,
  state: typeof stateData,
): any[] => {
  if (!state.tokensMap || !state.tokensMap.chainTokenMap) return [];
  let tokens: any = [];
  const { tokenMap } = state.tokensMap.chainTokenMap[`${chainId}`];
  let leftListTokensAddresses = listTokensAddresses;
  const keys = Object.keys(tokenMap);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = tokenMap[key];

    const isKeyIncludeList = leftListTokensAddresses.some(
      (address: string) => address.toLowerCase() === key.toLowerCase(),
    );

    const isNeedTokenIgnore = false;
    const isNeedIgnore = key === '0x0000000000000000000000000000000000000000'
        || isNeedTokenIgnore;
    if (ignoreBaseNetworkCurrency && isNeedIgnore) continue;

    // add only included in list
    if (isIncludeInListAddresses && isKeyIncludeList) {
      addItemToFilteredTokens(tokens, key, item);
      leftListTokensAddresses = leftListTokensAddresses.filter(
        (address: string) => address.toLowerCase() !== key.toLowerCase(),
      );
      continue;
    }

    // add only non-list
    if (!isIncludeInListAddresses && !isKeyIncludeList) {
      addItemToFilteredTokens(tokens, key, item);
    }
  }

  // order tokens like as list addresses.
  if (isIncludeInListAddresses) {
    if (listTokensAddresses.length === tokens.length) {
      tokens = tokens.sort((a: any, b: any) => {
        const indexA = listTokensAddresses.findIndex(
          (item: any) => item.toLowerCase() === a.address.toLowerCase(),
        );
        const indexB = listTokensAddresses.findIndex(
          (item: any) => item.toLowerCase() === b.address.toLowerCase(),
        );
        return indexA - indexB;
      });
    } else {
      console.error(
        'Error when order token by list of addresses.',
        listTokensAddresses,
        tokens,
      );
    }
  }

  return tokens;
};

export const getFilteredOvernightTokens = (
  state: typeof stateData,
  chainId: number,
  isOnlyOvnToken: any,
) => {
  if (!state.tokensMap || !state.tokensMap.chainTokenMap) return [];

  const tokens: any = [];
  const { tokenMap } = state.tokensMap.chainTokenMap[chainId];
  const keys = Object.keys(tokenMap);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = tokenMap[key];

    // add only overnight
    if (
      (isOnlyOvnToken && item.protocolId === 'overnight')
        || item.symbol === 'USD+'
        || item.symbol === 'DAI+'
        || item.symbol === 'USDT+'
    ) {
      addItemToFilteredTokens(tokens, key, item);
      continue;
    }

    // add only overnight
    if (!isOnlyOvnToken) {
      addItemToFilteredTokens(tokens, key, item);
      continue;
    }
  }

  return tokens;
};

export const innerGetDefaultSecondtokenBySymobl = (tokensList: any[], symbolName: string) => {
  if (!tokensList.length) {
    console.log(
      'Inner get default token by symbol fail, secondTokens is empty.',
      tokensList,
    );
    return null;
  }

  for (let i = 0; i < tokensList.length; i++) {
    const token: any = tokensList[i];
    if (token.symbol === symbolName) {
      return token;
    }
  }

  // return first if usd+ not found
  return tokensList[0];
};

export const innerGetDefaultSecondtokenByIndex = (secondTokens: any[], index: number) => {
  if (!secondTokens.length || secondTokens.length < index + 1) {
    console.log(
      'Inner get default token by index fail, secondTokens is empty or index not exist',
      secondTokens,
    );
    return null;
  }

  return secondTokens[index];
};

export const getSecondDefaultSecondtoken = (
  tokenSeparationScheme: string,
  tokensList: any[],
): any => {
  if (tokenSeparationScheme === 'OVERNIGHT_SWAP') {
    return innerGetDefaultSecondtokenBySymobl(
      tokensList,
      SECONDTOKEN_SECOND_DEFAULT_SYMBOL,
    );
  }

  if (tokenSeparationScheme === 'POOL_SWAP') {
    return innerGetDefaultSecondtokenByIndex(tokensList, 1);
  }

  console.error(
    'TOKEN SEPARATION SCHEME NOT FOUND FOR GET SECOND DEFAULT',
    tokenSeparationScheme,
  );

  return null;
};

export const getTokenBySymbol = (
  symbol: string,
  tokensList: any[],
) => tokensList.find((_) => _.symbol === symbol);

export const getDefaultSecondtoken = (
  tokenSeparationScheme: string,
  tokensList: any[],
  symbol?: string | null,
) => {
  if (tokenSeparationScheme === 'OVERNIGHT_SWAP') {
    return innerGetDefaultSecondtokenBySymobl(
      tokensList,
      symbol || SECONDTOKEN_DEFAULT_SYMBOL,
    );
  }

  if (tokenSeparationScheme === 'POOL_SWAP') {
    return innerGetDefaultSecondtokenByIndex(tokensList, 0);
  }

  console.error(
    'TOKEN SEPARATION SCHEME NOT FOUND FOR GET DEFAULT',
    tokenSeparationScheme,
  );
  return null;
};

export const loadContractInstance = (file: any, web3: any, address: any) => {
  let addressArg = address;
  if (!address) {
    addressArg = file.address;
  }

  return new web3.eth.Contract(file.abi, addressArg);
};

export const getNewInputToken = () => {
  const randomId = (Math.random() + 1).toString(36).substring(2);
  return {
    id: randomId,
    value: null,
    usdValue: null,
    contractValue: null,
    selectedToken: null,
  } as any;
};

export const getNewOutputToken = () => {
  const randomId = (Math.random() + 1).toString(36).substring(2);
  return {
    id: randomId,
    value: 0,
    sum: 0,
    locked: false,
    selectedToken: null,
  };
};

export const updateTokenValue = (
  token: any,
  value: any,
  checkApprove: (tokenData: any, val: string) => void,
  originalBalance?: string,
) => {
  if (!value) return token;

  const { selectedToken } = token;
  console.log(selectedToken, token, '----selectedToken');
  console.log(value, '---value');
  if (selectedToken) {
    token.contractValue = originalBalance
    || new BigNumber(value)
      .times(10 ** selectedToken.decimals)
      .toFixed(0);
    token.usdValue = new BigNumber(value)
      .times(selectedToken.price)
      .toFixed(6, BigNumber.ROUND_DOWN);

    if (
      selectedToken.address === '0x0000000000000000000000000000000000000000'
    ) {
      console.log(
        'Check approve in update value not available. its a root token: ',
        token,
      );
      selectedToken.approveData.approved = true;
    }

    checkApprove(token, token.contractValue);
  }

  // eslint-disable-next-line consistent-return
  return {
    ...token,
    value,
  };
};

export const maxAll = (
  selectedInputTokens: any[],
  checkApprove: (tokenData: any, val: string) => void,
) => {
  console.log(selectedInputTokens, 'SELECTED');
  return selectedInputTokens.map((item) => updateTokenValue(
    item,
    item.selectedToken.balanceData.balance,
    checkApprove,
    item.selectedToken.balanceData.originalBalance,
  ));
};

export const loadBalance = async (
  rootState: any,
  data: {
    contract: any,
    token: any
  },
) => {
  // console.log("Load balance from contract: ", token)
  try {
    // balance for network currency
    if (data.token.address === '0x0000000000000000000000000000000000000000') {
      // const evmProvider = new ethers.BrowserProvider(rootState.web3.provider);
      const ethBalance = await rootState.web3.evmProvider.getBalance(rootState.accountData.account);
      const balance = new BigNumber(ethBalance).div(10 ** data.token.decimals);
      data.token.balanceData = {
        name: data.token.symbol,
        balance,
        balanceInUsd: balance.times(data.token.price).toString(),
        originalBalance: ethBalance,
        decimal: data.token.decimals,
      };

      return {
        name: data.token.symbol,
        balance,
        balanceInUsd: balance.times(data.token.price).toString(),
        originalBalance: ethBalance,
        decimal: data.token.decimals,
      };
    }

    // balance for ERC20
    const erc20Balance = await data.contract.balanceOf(rootState.accountData.account);
    const balance = new BigNumber(erc20Balance).div(10 ** data.token.decimals);

    return {
      name: data.token.symbol,
      balance,
      balanceInUsd: balance.times(data.token.price).toString(),
      originalBalance: erc20Balance,
      decimal: data.token.decimals,
    };
  } catch (e) {
    console.log('Error when load balance at token: ', data.token.address, e);
    return {
      name: data.token.symbol,
      balance: '0',
      balanceInUsd: '0',
      originalBalance: '0',
      decimal: data.token.decimals,
    };
  }
};

const KEY = 'REFERRAL_CODE';

export const getReferralCode = () => {
  const match = document.cookie.match(new RegExp(`(^| )${KEY}=([^;]+)`));
  if (match) {
    const referralCode = match[2];
    console.log(`Referral code found in cookie = [${referralCode}]`);
    return referralCode;
  }
  // console.log('Referral code not found in cookies');
  return '';
};

export const loadPrices = async (chainId: number | string) => odosApiService
  .loadPrices(chainId)
  .then((data: any) => data.tokenPrices)
  .catch((e: any) => {
    console.error('Error load contract', e);
  });