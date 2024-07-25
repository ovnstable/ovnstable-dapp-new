// import BalanceService from '@/services/BalanceService/BalanceService.ts';
// import type { TTokenInfo, TTokenBalanceData } from '@/types/common/tokens';

// const BALANCE_FETCH_INTERVAL = 30000;

// const state = {
//   isBalancesLoaded: false,
//   isBalancesLoading: false as boolean,
//   tokenBalanceMap: {} as TTokenBalanceData,
//   fetchIntervalId: null,
// };

// const getters = {
//   getTokenBalances(state: any) {
//     return state.tokenBalanceMap;
//   },
//   getTokenBalanceInfo(state: any, getters: any, rootState: any) {
//     const allTokenList = rootState.odosData.tokens;
//     const tokenInfo = BalanceService.geTTokenBalanceData(allTokenList, state.tokenBalanceMap);
//     return tokenInfo;
//   },
// };

// const actions = {
//   // Todo remove and subscribe for token contract events instead
//   initUpdateBalancesInterval({
//     commit, dispatch,
//   }: any) {
//     dispatch('loadBalances');
//     commit('setFetchIntervalId', setInterval(() => {
//       dispatch('loadBalances');
//     }, BALANCE_FETCH_INTERVAL));
//   },
//   async loadBalances({
//     commit, rootState, rootGetters,
//   }: any, providerInstance: any): Promise<void> {
//     const provider = providerInstance || rootState.web3.evmProvider;

//     if (state.isBalancesLoading) return;

//     const allTokenList = await rootGetters['odosData/allTokensList']!;

//     const { account } = rootState.accountData;

//     if (!account || !provider || !allTokenList || allTokenList?.length === 0) {
//       commit('setIsBalancesLoading', false);
//       return;
//     }

//     commit('setIsBalancesLoading', true);

//     try {
//       const balanceMap: TTokenBalanceData = await BalanceService
//         .getAllTokenBalance(provider, allTokenList, account);

//       // Only updating if changed
//       if (!isEqual(state.tokenBalanceMap, balanceMap)) {
//         commit('setTokenBalances', balanceMap);
//         commit('setIsBalancesLoaded', true);
//       }
//     } catch (e) {
//       console.error('Error loading balances to store', e);
//       commit('setIsBalancesLoading', false);
//     }
//     commit('setIsBalancesLoading', false);
//   },
// };

// const mutations = {
//   setTokenBalances(state: any, balanceMap: TTokenBalanceData) {
//     state.tokenBalanceMap = balanceMap;
//   },
//   setFetchIntervalId(state: any, id: string) {
//     state.fetchIntervalId = id;
//   },
//   setIsBalancesLoading(state: any, val: boolean) {
//     state.isBalancesLoading = val;
//   },
//   setIsBalancesLoaded(state: any, val: boolean) {
//     state.isBalancesLoaded = val;
//   },
// };

// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations,
// };
