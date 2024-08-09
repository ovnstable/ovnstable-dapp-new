/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import TokenService from '@/services/TokenService/TokenService.ts';
import { computed } from 'vue';
import BalanceService from '@/services/BalanceService/BalanceService.ts';
import { mergeTokenLists } from '@/services/TokenService/utils/index.ts';

export const useTokensQuery = (stateData: any) => {
  const networkId = computed(() => stateData.network.networkId);
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
      queryKey: ['tokenPrices', networkId.value],
      queryFn: () => TokenService.fetchTokenPricesByNetworkId(networkId.value),
      enabled: !!networkId.value,
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
      queryKey: ['balances', address.value, networkId.value],
      queryFn: () => BalanceService.fetchTokenBalances(
        provider.value,
        address.value,
        tokenList.value,
      ),
      enabled: isBalancesQueryEnabled,
    },
  );

  const isAnyLoading = computed(
    () => tokensQuery.isLoading || pricesQuery.isLoading || balancesQuery.isLoading,
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

  return {
    isLoading: isAnyLoading,
    isError: isAnyError,
    data: computed(getTokenInfo),
    error: allErrors,
    isFetching: isAnyFetching,
  };
};
