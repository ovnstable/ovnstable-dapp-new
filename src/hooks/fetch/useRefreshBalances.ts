/* eslint-disable import/prefer-default-export */
import { useStore } from 'vuex';

export const useRefreshBalances = () => {
  const store = useStore();
  return () => store.dispatch('accountData/handleRefreshBalances');
};
