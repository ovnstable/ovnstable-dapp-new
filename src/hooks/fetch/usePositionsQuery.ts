/* eslint-disable vue/no-ref-as-operand */
/* eslint-disable import/prefer-default-export */
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import { usePoolsQuery } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { computed } from 'vue';
import PositionsService from '@/services/PositionsService/PositionsService.ts';
import { useStore } from 'vuex';
import { getQueryStates, type TQuery } from '../utils/index.ts';

const isDataAvailable = (
  query: UseQueryReturnType<any[], any>,
) => query?.data?.value && query?.data?.value.length > 0;

const isAllDataAvailable = (
  queries: UseQueryReturnType<any[], any>[],
) => queries.every((query) => isDataAvailable(query));

export const usePositionsQuery = () => {
  const { state: stateData } = useStore();

  const networkId = computed(() => stateData.network.networkId);
  const address = computed(() => stateData.accountData.account);

  const poolsQuery = usePoolsQuery();
  const tokensQuery = useTokensQueryNew() as TQuery;

  const positionsQuery = useQuery(
    {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ['positions', networkId, address],
      queryFn: async () => PositionsService.fetchPositions(stateData),
      enabled: !!networkId && !!address,
      staleTime: 0,
    },
  );

  const queries = [tokensQuery, positionsQuery, poolsQuery];
  const {
    isAnyLoading, isAnyError, allErrors, isAnyFetching,
  } = getQueryStates(queries);

  const positionData = computed(() => {
    if (isAllDataAvailable([positionsQuery, poolsQuery, tokensQuery as any])) {
      return PositionsService
        .formatPositions(
          positionsQuery!.data!.value ?? [],
          poolsQuery!.data!.value ?? [],
          tokensQuery!.data!.value ?? [],
          networkId.value,
        );
    }
    return [];
  });

  return {
    isLoading: isAnyLoading,
    isError: isAnyError,
    data: positionData,
    error: allErrors,
    isFetching: isAnyFetching,
  };
};
