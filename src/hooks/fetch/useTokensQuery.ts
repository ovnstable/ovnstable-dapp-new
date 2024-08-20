import { useQuery } from '@tanstack/vue-query';
import TokenService from '@/services/TokenService/TokenService.ts';
import { computed } from 'vue';
import BalanceService from '@/services/BalanceService/BalanceService.ts';
import { mergeTokenLists } from '@/services/TokenService/utils/index.ts';

const REFETCH_INTERVAL = 5 * 60 * 60 * 1000; // 5h
const BALANCE_REFETCH_INTERVAL = 3000;

export const useRefreshBalances = () => () => 0;

export const allTokensMap = (tokensList: any[]): any => new Map(tokensList
  .map((token) => [token.address, token]));

export const useTokensQuery = (stateData: any) => {
  const networkId = computed(() => stateData.network.networkId);
  const address = computed(() => stateData.accountData.account);
  const provider = computed(() => stateData.web3.evmProvider);

  const tokensQuery = useQuery(
    {
      queryKey: ['tokens'],
      queryFn: TokenService.fetchTokens,
      refetchInterval: REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
    },
  );

  const pricesQuery = useQuery(
    {
      queryKey: ['prices', networkId],
      queryFn: () => TokenService.fetchTokenPricesByNetworkId(networkId.value),
      enabled: !!networkId.value && !!provider.value,
      refetchInterval: REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
      staleTime: 0,
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
      queryKey: ['balances', address, networkId],
      queryFn: () => BalanceService.fetchTokenBalances(
        provider.value,
        address.value,
        tokenList.value,
      ),
      enabled: isBalancesQueryEnabled,
      refetchInterval: BALANCE_REFETCH_INTERVAL,
      staleTime: 0,
    },
  );

  const isAnyLoading = computed(
    () => tokensQuery.isLoading.value
     || pricesQuery.isLoading.value
     || balancesQuery.isLoading.value,
  );
  const isAnyError = computed(
    () => tokensQuery.isError || pricesQuery.isError || balancesQuery.isError,
  );
  const allErrors = computed(
    () => JSON.stringify([tokensQuery.error, pricesQuery.error, balancesQuery.isError]),
  );
  const isAnyFetching = computed(
    () => tokensQuery.isFetching || pricesQuery.isFetching || balancesQuery.isFetching,
  );

  const getTokenInfo = () => {
    const tokensData = tokensQuery.data.value;
    const pricesData = pricesQuery.data.value;
    const balancesData = balancesQuery.data.value;
    const isLoaded = !isAnyLoading.value;

    if (isLoaded && tokensData && pricesData && balancesData) {
      const tokenInfo = TokenService.getTokenInfo(
        tokensData,
        pricesData,
        networkId.value,
        balancesData,
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
