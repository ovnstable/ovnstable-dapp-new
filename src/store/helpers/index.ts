/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js';
import { loadTokenImage, loadOvernightTokenImage } from '@/utils/tokenLogo.ts';
import { DEPRECATED_NETWORKS } from '@/utils/const.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

const SECONDTOKEN_SECOND_DEFAULT_SYMBOL = 'DAI+';
const SECONDTOKEN_DEFAULT_SYMBOL = 'USD+';

export const WHITE_LIST_ODOS = {
  59144: [
    'Wrapped Ether',
    'PancakeSwap V3',
    'iZiSwap',
    'NileV2',
    'Lynex Fusion',
    'Overnight Exchange',
  ],
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
    'Camelot Stable',
    'Camelot V3',
    'Balancer V2 Stable',
    'PancakeSwap V3',
    'Uniswap V3',
    'Trader Joe V2.1',
    'Swaap V2',
    'Lighter V2',
    'Curve Stable NG',
    'Curve Factory',
    'Wrapped Ether',
    'Overnight Wrapper',
  ],
  8453: [
    'Overnight Exchange',
    'Aerodrome Volatile',
    'Aerodrome Stable',
    'Aerodrome Slipstream',
    'BaseSwap',
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
    'Velocore Volatile',
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
  });
};

export const innerGetDefaultSecondtokenBySymobl = (tokensList: any[], symbolName: string) => {
  if (!tokensList.length) return null;

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
) => tokensList.find((_) => _.symbol?.toLowerCase() === symbol?.toLowerCase());

export const getTokenByAddress = (
  address: string,
  tokensList: any[],
) => tokensList.find((_) => _.address?.toLowerCase() === address?.toLowerCase());

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
      selectedToken.approveData.approved = true;
    }

    checkApprove(token, token.contractValue);
  }

  return {
    ...token,
    value,
  };
};

export const maxAll = (
  selectedInputTokens: any[],
  checkApprove: (tokenData: any, val: string) => void,
  isZap?: boolean,
) => selectedInputTokens.map((item) => {
  const maxContractBal = isZap
    ? new BigNumber(item.selectedToken.balanceData.originalBalance).minus(1).toFixed()
    : item.selectedToken.balanceData.originalBalance;

  return updateTokenValue(
    item,
    item.selectedToken.balanceData.balance,
    checkApprove,
    maxContractBal,
  );
});

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
        balanceInUsd: balance.times(data.token.price).toFixed(),
        originalBalance: ethBalance,
        decimal: data.token.decimals,
      };

      return {
        name: data.token.symbol,
        balance,
        balanceInUsd: balance.times(data.token.price).toFixed(),
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
      balanceInUsd: balance.times(data.token.price).toFixed(),
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

export const loadPrices = async (chainId: number | string) => new OvernightApi()
  .loadPrices(chainId)
  .then((data: any) => data.tokenPrices)
  .catch((e: any) => {
    console.error('Error load contract', e);
  });

export const sortedChainsByTVL = async (
  chains: any,
  showDeprecated: boolean,
) => {
  const overnightApiInstance = new OvernightApi();
  const tvl = await overnightApiInstance.loadTVL();
  const filterDeprecated = chains.filter((_: any) => {
    if (showDeprecated) return chains;

    return !DEPRECATED_NETWORKS.includes(_.chain);
  });

  const chainsWithTVL = filterDeprecated.map((chainData: any) => {
    const chain = tvl.find((_: any) => _.chainName.toLowerCase() === chainData.name.toLowerCase());
    if (!chain) return { chainName: chainData.name, tvl: 0 };

    const totalTVL = chain.values.reduce((total: any) => total, 0);

    return { chainName: chainData.name, tvl: totalTVL };
  });

  const sortedChains = chainsWithTVL.sort((a: { tvl: number; }, b: { tvl: number; }) => b
    .tvl - a.tvl);

  const networksMap: any = filterDeprecated.reduce((acc: any, network: any) => ({
    ...acc,
    [network.name.toLowerCase()]: network,
  }), {});

  const orderedNetworks = sortedChains.map((chain: any) => {
    const chainName = chain.chainName.toLowerCase();
    return networksMap[chainName] || null;
  });

  return orderedNetworks;
};

export const getFormattedPeriodDashboard = (dashboardInterval: any, portfolioBalanceData: any) => {
  const today = new Date();
  let formattedDate = '';
  switch (dashboardInterval.toLowerCase()) {
    case 'day': {
      formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(',', '').replace(/ /g, ' ');
      break;
    }
    case 'week': {
      const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      formattedDate = weekAgo.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(',', '').replace(/ /g, ' ');
      break;
    }
    case 'month': {
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      formattedDate = monthAgo.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(',', '').replace(/ /g, ' ');
      break;
    }
    case 'all time':
      console.log('portfolioBalanceData from all time');
      console.log(portfolioBalanceData);
      console.log(portfolioBalanceData.length);
      if (portfolioBalanceData && portfolioBalanceData.length > 0) {
        const earliestTransaction = portfolioBalanceData[portfolioBalanceData.length - 1];
        const earliestDate = new Date(earliestTransaction.date);
        formattedDate = earliestDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        }).replace(',', '').replace(/ /g, ' ');
        console.log('formatted date in all time case');
        console.log(formattedDate);
      }
      break;
    default: {
      formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(',', '').replace(/ /g, ' ');
    }
  }

  const formattedDateParts = formattedDate.split(' ');
  if (formattedDateParts.length === 3) {
    formattedDate = `From ${formattedDateParts[0]} ${formattedDateParts[1]} ‘${formattedDateParts[2]}`;
  }
  return formattedDate || '';
};
