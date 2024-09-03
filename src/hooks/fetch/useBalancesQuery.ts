/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { computed, inject, type Ref } from 'vue';
import { useStore } from 'vuex';
import type { IBalanceService } from '@/services/BalanceService/BalanceService.ts';
import { BALANCE_REFETCH_INTERVAL } from '../utils/index.ts';

export const useBalancesQuery = (tokenList: Ref<string[]>, isEnabled: Ref<boolean>) => {
  const balanceService = inject('tokenService') as IBalanceService;
  const { state: stateData } = useStore();
  const networkId = computed(() => stateData.network.networkId);
  const provider = computed(() => stateData.web3.evmProvider);
  const address = computed(() => stateData.accountData.account);
  const balanceRefreshTrigger = computed(() => stateData.accountData.balanceRefreshTrigger);
  return useQuery(
    {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ['balances', address, networkId, balanceRefreshTrigger],
      queryFn: () => balanceService.fetchTokenBalances(
        provider.value,
        address.value,
        tokenList.value,
      ),
      enabled: isEnabled,
      refetchInterval: BALANCE_REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );
};
