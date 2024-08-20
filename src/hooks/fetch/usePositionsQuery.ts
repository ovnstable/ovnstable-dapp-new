/* eslint-disable vue/no-ref-as-operand */
/* eslint-disable import/prefer-default-export */
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import { usePoolsQuery } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import { computed } from 'vue';
import PositionsService from '@/services/PositionsService/PositionsService.ts';

const isDataAvailable = (
  query: UseQueryReturnType<any[], any>,
) => query?.data?.value && query?.data?.value.length > 0;

const isAllDataAvailable = (
  queries: UseQueryReturnType<any[], any>[],
) => queries.every((query) => isDataAvailable(query));

export const usePositionsQuery = (stateData: any) => {
  const networkId = computed(() => stateData.network.networkId);
  const address = computed(() => stateData.accountData.account);

  const poolsQuery = usePoolsQuery();
  const tokensQuery = useTokensQuery(stateData);

  const positionsQuery = useQuery(
    {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ['positions', networkId, address],
      queryFn: async () => PositionsService.fetchPositions(stateData),
      enabled: !!networkId && !!address,
      staleTime: 0,
    },
  );

  const isAnyLoading = computed(
    () => tokensQuery.isLoading.value
    || poolsQuery.isLoading.value
    || positionsQuery.isLoading.value,
  );
  const positionData = computed(() => {
    if (isAllDataAvailable([positionsQuery, poolsQuery, tokensQuery as any])) {
      return PositionsService
        .formatPositions(
          positionsQuery.data.value,
          poolsQuery.data.value as any,
          tokensQuery.data.value as any,
        );
    }
    return [];
  });

  return {
    isLoading: isAnyLoading,
    // isError: isAnyError,
    data: positionData,
    // error: allErrors,
    // isFetching: isAnyFetching,
  };
};
