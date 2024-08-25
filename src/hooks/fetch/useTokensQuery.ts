import { useQuery } from '@tanstack/vue-query';
import TokenService, { type ITokenService } from '@/services/TokenService/TokenService.ts';
import { computed, inject } from 'vue';
import type { IBalanceService } from '@/services/BalanceService/BalanceService.ts';
import { mergeTokenLists } from '@/services/TokenService/utils/index.ts';
import { useStore } from 'vuex';
import { getQueryStates, isAllQueryDataAvailable } from '../utils/index.ts';

const REFETCH_INTERVAL = 5 * 60 * 60 * 1000; // 5h
const BALANCE_REFETCH_INTERVAL = 60000;

export const allTokensMap = (tokensList: any[]): any => new Map(tokensList
  .map((token) => [token.address, token]));

export const useTokensQuery = () => {
  const { state: stateData } = useStore();

  const BalanceService = inject('balanceService') as IBalanceService;
  const tokenService = inject('tokenService') as ITokenService;

  const networkId = computed(() => stateData.network.networkId);
  const address = computed(() => stateData.accountData.account);
  const balanceRefreshTrigger = computed(() => stateData.accountData.balanceRefreshTrigger);
  const provider = computed(() => stateData.web3.evmProvider);

  const tokensQuery = useQuery(
    {
      queryKey: ['tokens'],
      queryFn: tokenService.fetchTokens,
      refetchInterval: REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const pricesQuery = useQuery(
    {
      queryKey: ['prices', networkId],
      queryFn: () => tokenService.fetchTokenPricesByNetworkId(networkId.value),
      enabled: !!networkId.value && !!provider.value,
      refetchInterval: REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const isBalancesQueryEnabled = computed(
    () => !!tokensQuery.data.value && !!networkId.value && !!provider.value,
  );

  const getTokenList = () => Object.keys(
    tokensQuery.data.value ? mergeTokenLists(tokensQuery.data.value)
      .chainTokenMap[networkId.value].tokenMap : {},
  );

  const tokenList = computed(getTokenList);

  const balancesQuery = useQuery(
    {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ['balances', address, networkId, balanceRefreshTrigger],
      queryFn: () => BalanceService.fetchTokenBalances(
        provider.value,
        address.value,
        tokenList.value,
      ),
      enabled: isBalancesQueryEnabled,
      refetchInterval: BALANCE_REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );

  const queries = [tokensQuery, pricesQuery, balancesQuery];
  const {
    isAnyLoading, isAnyError, allErrors, isAnyFetching,
  } = getQueryStates(queries);

  const getTokenInfo = () => {
    if (!isAnyLoading.value && isAllQueryDataAvailable(queries)) {
      const tokenInfo = TokenService.getTokenInfo(
        tokensQuery.data.value,
        pricesQuery.data.value,
        networkId.value,
        balancesQuery.data.value,
      );
      return tokenInfo;
    }
    return [];
  };

  return {
    data: computed(getTokenInfo),
    error: allErrors,
    isFetching: isAnyFetching,
    isLoading: isAnyLoading,
    isError: isAnyError,
    isBalancesLoading: balancesQuery.isLoading,
  };
};

export const useTokensQueryNew = () => {
  const { state: stateData } = useStore();

  const tokenService = inject('tokenService') as ITokenService;
  const networkId = computed(() => stateData.network.networkId);

  const tokensQuery = useQuery(
    {
      queryKey: ['allTokens'],
      queryFn: async () => tokenService.fetchAllTokens(),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const getTokenInfo = () => {
    const tokensData = tokensQuery.data.value;

    if (tokensData) {
      const tokenInfo = TokenService.formatTokenInfo(tokensData, networkId.value);
      return tokenInfo;
    }
    return [];
  };

  return {
    data: computed(getTokenInfo),
    error: tokensQuery.error,
    isFetching: tokensQuery.isFetching,
    isLoading: tokensQuery.isLoading,
    isError: tokensQuery.isError,
    isBalancesLoading: tokensQuery.isLoading,
  };
};
