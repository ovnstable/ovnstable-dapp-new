/* eslint-disable import/prefer-default-export */
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { getAllTokensString, getTransactionTotal } from '@/utils/tokens.ts';
import type { IPosthogService } from '@/types/posthog';
import type { TSwapSuccessData } from '@/store/modals/success-modal';
import { calculateTokenUsdValues, getTxExplorerUrl } from './helpers.ts';

export const useDispatchSwapEvents = () => {
  const posthogService = inject('posthogService') as IPosthogService;
  const { state: stateData } = useStore();
  const explorerUrl = computed(() => stateData.network.explorerUrl);
  const networkName = computed(() => stateData.network.networkName);
  const account = computed(() => stateData.accountData.account);
  return (successParams: TSwapSuccessData) => {
    const posthogEventData = {
      txUrl: getTxExplorerUrl(explorerUrl.value, successParams.successTxHash),
      token0: getAllTokensString(successParams.from),
      token1: getAllTokensString(successParams.to),
      usdTotal: getTransactionTotal(calculateTokenUsdValues(successParams.to)),
      chainName: networkName.value,
      walletAddress: account.value,
    };

    const eventType = successParams.type;
    if (eventType === 'MINT' || eventType === 'REDEEM') posthogService.mintredeemSuccessTrigger(posthogEventData);
    if (eventType === 'WRAP' || eventType === 'UNWRAP') posthogService.wrapUnwrapSuccessTrigger(posthogEventData);
    else posthogService.swapSuccessTrigger(posthogEventData);
  };
};
