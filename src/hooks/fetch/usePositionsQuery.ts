/* eslint-disable vue/no-ref-as-operand */
/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { usePoolsQuery } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQueryNew } from '@/hooks/fetch/useTokensQuery.ts';
import { computed } from 'vue';
import PositionsService from '@/services/PositionsService/PositionsService.ts';
import { useStore } from 'vuex';
import { getQueryStates, isAllQueryDataAvailable, type TQuery } from '../utils/index.ts';

export const usePositionsQuery = () => {
  const { state: stateData } = useStore();

  const networkId = computed(() => stateData.network.networkId);
  const address = computed(() => stateData.accountData.account);
  const posRefreshTrigger = computed(() => stateData.accountData.posRefreshTrigger);

  const poolsQuery = usePoolsQuery();
  const tokensQuery = useTokensQueryNew() as TQuery;

  const positionsQuery = useQuery(
    {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ['positions', networkId, address, posRefreshTrigger],
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
    if (isAllQueryDataAvailable(queries)) {
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

export const useRefreshPositions = () => {
  const store = useStore();
  return () => store.dispatch('accountData/handleRefreshPositions');
};
