const state = {
  account: null,

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
    commit, state, rootGetters,
  }: any, walletAddress: string) {
    // Posthog sideeffects
    const posthog = rootGetters['posthog/posthogService'];
    if (!state.account && walletAddress) {
    // First wallet connection
      posthog
        .identyfyByWalletTrigger({ address: walletAddress });
    } else if (state.account && walletAddress && (state.account !== walletAddress)) {
      posthog
        .linkWalletsTrigger({ address0: state.account, address1: walletAddress });
    }
    commit('setAccount', walletAddress);
  },
  handleRefreshBalances({ commit }: any) {
    commit('toggleBalanceRefresh');
  },
};

const mutations = {
  setAccount(state: any, value: any) {
    state.account = value;
  },
  toggleBalanceRefresh(state: any) {
    state.balanceRefreshTrigger = !state.balanceRefreshTrigger;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
