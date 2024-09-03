/* eslint-disable import/prefer-default-export */
import type { ITokenService } from '@/services/TokenService/TokenService.ts';
import { useQuery } from '@tanstack/vue-query';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { REFETCH_INTERVAL } from '../utils/index.ts';

export const usePricesQuery = () => {
  const tokenService = inject('tokenService') as ITokenService;
  const { state: stateData } = useStore();
  const networkId = computed(() => stateData.network.networkId);
  const provider = computed(() => stateData.web3.evmProvider);
  return useQuery(
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
};
