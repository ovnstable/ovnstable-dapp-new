import { useQuery, useQueryClient } from '@tanstack/vue-query';
import TokenService from '@/services/TokenService/TokenService.ts';
import { computed, ref } from 'vue';
import BalanceService from '@/services/BalanceService/BalanceService.ts';
import { mergeTokenLists } from '@/services/TokenService/utils/index.ts';

export const allTokensMap = (tokensList: any[]): any => new Map(tokensList
  .map((token) => [token.address, token]));

export const useTokensQuery = (stateData: any) => {
  const networkId = computed(() => stateData.network.networkId);
  const networkLoaded = computed(() => stateData.network.networkLoaded);
  const address = computed(() => stateData.accountData.account);
  const provider = computed(() => stateData.web3.evmProvider);

  const tokensQuery = useQuery(
    {
      queryKey: ['tokens'],
      queryFn: TokenService.fetchTokens,
      refetchInterval: false,
    },
  );

  const pricesQuery = useQuery(
    {
      queryKey: ['tokenPrices', networkId.value, networkLoaded.value],
      queryFn: () => TokenService.fetchTokenPricesByNetworkId(networkId.value),
      enabled: !!networkId.value,
      refetchInterval: false,
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
      queryKey: ['balances', address.value, networkId.value, networkLoaded.value],
      queryFn: () => BalanceService.fetchTokenBalances(
        provider.value,
        address.value,
        tokenList.value,
      ),
      enabled: isBalancesQueryEnabled,
      refetchInterval: 3000,
    },
  );

  const isAnyLoading = computed(
    () => tokensQuery.isLoading.value || pricesQuery.isLoading.value || balancesQuery.isLoading.value || !networkLoaded.value,
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

    if (isAnyLoading.value) return [];

    if (tokensData && pricesData && balancesData) {
      return TokenService.getTokenInfo(
        tokensData,
        pricesData,
        networkId.value,
        balancesData,
      );
    }
    return [];
  };

  const changeQueryData = (val: number) => {
    console.log(val, "changeQueryData")
  }

  return {
    data: computed(getTokenInfo),
    error: allErrors,
    isFetching: isAnyFetching,
    isLoading: isAnyLoading,
    isError: isAnyError,
    isBalancesLoading: balancesQuery.isLoading,
    changeQueryData
  };
};

export const useRefreshBalances = () => () => {
  console.log('__queryRefreshBalances');
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: ['balances'],
    refetchType: 'all',
  });
};
