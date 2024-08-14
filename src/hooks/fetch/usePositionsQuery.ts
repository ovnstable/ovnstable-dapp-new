/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { usePoolsQuery } from '@/hooks/fetch/usePoolsQuery.ts';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import { computed } from 'vue';
import PositionsService from '@/services/PositionsService/PositionsService.ts';

export const usePositionsQuery = (stateData: any) => {
  // const networkId = computed(() => stateData.network.networkId);
  // const address = computed(() => stateData.accountData.account);

  const { networkId } = stateData.network;
  const { address } = stateData.accountData;

  const poolsQuery = usePoolsQuery();
  const tokensQuery = useTokensQuery(stateData);

  const positionsQuery = useQuery(
    {
      queryKey: ['positions', networkId, address],
      queryFn: async () => PositionsService.fetchPositions(stateData),
      // enabled: !!networkId.value && !!address.value,
    },
  );

  const isAnyLoading = computed(
    () => tokensQuery.isLoading.value
    || poolsQuery.isLoading.value
    || positionsQuery.isLoading.value,
  );
  // const isAnyError = computed(
  //   () => tokensQuery.isError || poolsQuery.isError || positionsQuery.isError,
  // );
  // const allErrors = computed(
  //   () => JSON.stringify([tokensQuery.error, poolsQuery.error, positionsQuery.isError]),
  // );
  // const isAnyFetching = computed(
  //   () => tokensQuery.isFetching || poolsQuery.isFetching || positionsQuery.isFetching,
  // );

  const positionData = computed(() => {
    if (positionsQuery.data.value && poolsQuery.data.value) {
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
