import type { IPosthogService } from '@/types/posthog';

const isSwitchedToOtherAccount = (
  account: string,
  walletAddress: string,
) => account && walletAddress && (account !== walletAddress);

const dispatchWalletDataToPosthog = (
  account: string,
  walletAddress: string,
  posthogInstance: IPosthogService,
) => {
  if (!account && walletAddress) {
    posthogInstance
      .identyfyByWalletTrigger({ address: walletAddress });
  } else if (isSwitchedToOtherAccount(account, walletAddress)) {
    posthogInstance
      .linkWalletsTrigger({ address0: account, address1: walletAddress });
  }
};

const state = {
  account: null,
  posthogInstance: {} as IPosthogService,

  // Actual value doesnt matter, just a reactivity trigger
  balanceRefreshTrigger: false as boolean,
};

const getters = {
  account(state: any) {
    return state.account;
  },
};

const actions = {
  handleSwitchAccount({
    commit, state,
  }: any, walletAddress: string) {
    dispatchWalletDataToPosthog(state.account, walletAddress, state.posthogInstance);
    commit('setAccount', walletAddress);
  },
  handleRefreshBalances({ commit }: any) {
    commit('toggleBalanceRefresh');
  },
  initPosthog({ commit }: any, posthogService: IPosthogService) {
    commit('setPosthogInstance', posthogService);
  },
};

const mutations = {
  setAccount(state: any, value: any) {
    state.account = value;
  },
  toggleBalanceRefresh(state: any) {
    state.balanceRefreshTrigger = !state.balanceRefreshTrigger;
  },
  setPosthogInstance(state: any, posthogService: IPosthogService) {
    state.posthogInstance = posthogService;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
