/* eslint-disable import/prefer-default-export */
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { computed } from 'vue';

export const REFETCH_INTERVAL = 5 * 60 * 60 * 1000; // 5h
export const BALANCE_REFETCH_INTERVAL = 60000;

export type TQuery = Partial<UseQueryReturnType<any[], any>>

export const getQueryStates = (queries: TQuery[]) => ({
  isAnyLoading: computed(() => queries.some((query) => query!.isLoading!.value)),
  isAnyError: computed(() => queries.some((query) => query!.isError)),
  allErrors: computed(() => JSON.stringify(queries.map((query) => query!.error))),
  isAnyFetching: computed(() => queries.some((query) => query!.isFetching)),
});

export const isAllQueryDataAvailable = (
  queries: TQuery[],
) => queries
  .every((query) => query?.data?.value);
