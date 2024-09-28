/* eslint-disable vue/max-len */
/* eslint-disable import/prefer-default-export */
import { computed, inject, type Ref } from 'vue';
import { useStore } from 'vuex';
import { getTransactionTotal } from '@/utils/tokens.ts';
import { MODAL_TYPE, type ITriggerSuccessZapin } from '@/store/views/main/odos/index.ts';
import type { IPosthogService, TZapinSuccessTriggerProps } from '@/types/posthog';
import { getSumTokens, getTokenType, getTxExplorerUrl } from './helpers.ts';

export const useDispatchManagePositionEvents = () => {
  const posthogService = inject('posthogService') as IPosthogService;

  const posthogActionMap = {
    [MODAL_TYPE.HARVEST]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.harvestSuccessTrigger(posthogEventData),
    [MODAL_TYPE.WITHDRAW]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.withdrawSuccessTrigger(posthogEventData),
    [MODAL_TYPE.COMPOUND]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.compoundSuccessTrigger(posthogEventData),
    [MODAL_TYPE.REBALANCE]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.rebalanceSuccessTrigger(posthogEventData),
    [MODAL_TYPE.INCREASE]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.increaseSuccessTrigger(posthogEventData),
    [MODAL_TYPE.MERGE]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.mergeSuccessTrigger(posthogEventData),
    [MODAL_TYPE.ZAPIN]: (posthogEventData: TZapinSuccessTriggerProps) => posthogService.zapinSuccessTrigger(posthogEventData),
  };
  // Necessary state data
  const { state: stateData } = useStore();
  const successData: Ref<ITriggerSuccessZapin> = computed(() => stateData.odosData.successData);
  const account = computed(() => stateData.accountData.account);
  const explorerUrl = computed(() => stateData.network.explorerUrl);
  const lastParsedZapResponseData = computed(() => stateData.odosData.lastParsedZapResponseData);

  return (modalType: MODAL_TYPE) => {
    try {
      const posthogEventData = {
        txUrl: getTxExplorerUrl(explorerUrl.value, successData.value.hash ?? lastParsedZapResponseData.value?.hash),
        token0: getSumTokens(successData.value.inputTokens),
        token1: getSumTokens(successData.value.outputTokens),
        poolName: successData.value.pool.name,
        poolVersion: successData.value.pool.poolVersion ?? 'v3',
        usdTotal: getTransactionTotal(successData.value.inputTokens),
        poolType: getTokenType(successData.value.pool),
        walletAddress: account.value,
        chainName: successData.value.pool.chainName,
        poolPlatform: successData.value.pool.platform.toString(),
      };
      posthogActionMap[modalType](posthogEventData);
    } catch (error) {
      console.log(error);
    }
  };
};
