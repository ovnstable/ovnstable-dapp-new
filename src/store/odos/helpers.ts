/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import tokenLogo from '@/helpers/token-logo.ts';
import { getWeiMarker } from '@/utils/web3.ts';
import type { stateData } from './index';

const SECONDTOKEN_SECOND_DEFAULT_SYMBOL = 'DAI+';
const SECONDTOKEN_DEFAULT_SYMBOL = 'USD+';

export const addItemToFilteredTokens = async (
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
      logoUrl = tokenLogo.loadTokenImage(item);
    } else {
      logoUrl = await tokenLogo.loadOvernightTokenImage(item);
    }
  } else {
    logoUrl = tokenLogo.loadTokenImage(item);
  }

  tokens.push({
    id: item.assetId + key,
    address: key,
    decimals: item.decimals,
    assetType: item.assetType,
    name: item.name,
    symbol: item.symbol,
    logoUrl,
    weiMarker: getWeiMarker(item.decimals),
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

export const getFilteredPoolTokens = async (
  chainId: string | number,
  isIncludeInListAddresses: any,
  listTokensAddresses: any,
  ignoreBaseNetworkCurrency: any,
  state: typeof stateData,
): Promise<any[]> => {
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
    /* if (state.typeOfPoolScheme === 'OVN') {
                  isNeedTokenIgnore = (item.protocolId === 'overnight' && item.symbol === 'OVN');
              } */

    const isNeedIgnore = key === '0x0000000000000000000000000000000000000000'
        || isNeedTokenIgnore;
      // key === token address
    if (ignoreBaseNetworkCurrency && isNeedIgnore) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // add only included in list
    if (isIncludeInListAddresses && isKeyIncludeList) {
      await addItemToFilteredTokens(tokens, key, item);
      leftListTokensAddresses = leftListTokensAddresses.filter(
        (address: string) => address.toLowerCase() !== key.toLowerCase(),
      );
      // eslint-disable-next-line no-continue
      continue;
    }

    // add only non-list
    if (!isIncludeInListAddresses && !isKeyIncludeList) {
      await addItemToFilteredTokens(tokens, key, item);
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

export const getFilteredOvernightTokens = async (
  state: typeof stateData,
  chainId: number,
  isOnlyOvnToken: any,
) => {
  const tokens: any = [];
  const { tokenMap } = state.tokensMap.chainTokenMap[`${chainId}`];
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
      await addItemToFilteredTokens(tokens, key, item);
      continue;
    }

    // add only overnight
    if (!isOnlyOvnToken) {
      await addItemToFilteredTokens(tokens, key, item);
      continue;
    }
  }

  return tokens;
};

export const innerGetDefaultSecondtokenBySymobl = (state: typeof stateData, symbolName: string) => {
  if (!state.secondTokens.length) {
    console.log(
      'Inner get default token by symbol fail, secondTokens is empty.',
      state.secondTokens,
    );
    return null;
  }

  for (let i = 0; i < state.secondTokens.length; i++) {
    const token: any = state.secondTokens[i];
    if (token.symbol === symbolName) {
      return token;
    }
  }

  // return first if usd+ not found
  return state.secondTokens[0];
};

export const innerGetDefaultSecondtokenByIndex = (state: typeof stateData, index: number) => {
  if (!state.secondTokens.length || state.secondTokens.length < index + 1) {
    console.log(
      'Inner get default token by index fail, secondTokens is empty or index not exist',
      state.secondTokens,
    );
    return null;
  }

  return state.secondTokens[index];
};

export const getSecondDefaultSecondtoken = (state: typeof stateData): any => {
  if (state.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
    return innerGetDefaultSecondtokenBySymobl(
      state,
      SECONDTOKEN_SECOND_DEFAULT_SYMBOL,
    );
  }

  if (state.tokenSeparationScheme === 'POOL_SWAP') {
    return innerGetDefaultSecondtokenByIndex(state, 1);
  }

  console.error(
    'TOKEN SEPARATION SCHEME NOT FOUND FOR GET SECOND DEFAULT',
    state.tokenSeparationScheme,
  );

  return null;
};

export const getDefaultSecondtoken = (state: typeof stateData, symbol: string | null) => {
  if (state.tokenSeparationScheme === 'OVERNIGHT_SWAP') {
    return innerGetDefaultSecondtokenBySymobl(
      state,
      symbol || SECONDTOKEN_DEFAULT_SYMBOL,
    );
  }

  if (state.tokenSeparationScheme === 'POOL_SWAP') {
    return innerGetDefaultSecondtokenByIndex(state, 0);
  }

  console.error(
    'TOKEN SEPARATION SCHEME NOT FOUND FOR GET DEFAULT',
    state.tokenSeparationScheme,
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
  };
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

export const updateTokenValue = (token: any, value: any, toWeiFunc: any) => {
  token.value = value;
  // state.updateQuotaInfo();

  if (!value) {
    token.usdValue = 0;
    token.value = 0;
    return;
  }

  const { selectedToken } = token;
  if (selectedToken) {
    const sum = token.decimals === 6 ? `${token.value * 100}` : `${token.value}`;
    token.contractValue = toWeiFunc(
      sum,
      token.selectedToken.weiMarker,
    );
    token.usdValue = token.value * selectedToken.price;

    if (
      selectedToken.address === '0x0000000000000000000000000000000000000000'
    ) {
      console.log(
        'Check approve in update value not available. its a root token: ',
        token,
      );
      selectedToken.approveData.approved = true;
    }
  }
};

export const maxAll = (selectedInputTokens: any[], toWeiFunc: any) => {
  for (let i = 0; i < selectedInputTokens.length; i++) {
    const token = selectedInputTokens[i];
    console.log(
      token.selectedToken.balanceData.balance,
      'token.selectedToken.balanceData.balance',
    );
    updateTokenValue(token, token.selectedToken.balanceData.balance, toWeiFunc);
  }
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
      const ethBalance = await rootState.web3.web3.eth.getBalance(rootState.accountData.account);
      const balance = rootState.web3.web3.utils.fromWei(
        ethBalance,
        getWeiMarker(data.token.decimals),
      );
      data.token.balanceData = {
        name: data.token.symbol,
        balance,
        balanceInUsd: balance * data.token.price,
        originalBalance: ethBalance,
        decimal: data.token.decimals,
      };

      return {
        name: data.token.symbol,
        balance,
        balanceInUsd: balance * data.token.price,
        originalBalance: ethBalance,
        decimal: data.token.decimals,
      };
    }

    // balance for ERC20
    const erc20Balance = await data.contract.methods
      .balanceOf(rootState.accountData.account)
      .call();

    const balance = rootState.web3.web3.utils.fromWei(
      erc20Balance,
      getWeiMarker(data.token.decimals),
    );

    return {
      name: data.token.symbol,
      balance,
      balanceInUsd: balance * data.token.price,
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
