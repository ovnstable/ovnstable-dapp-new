const state = {
  account: null,
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
};

const mutations = {
  setAccount(state: any, value: any) {
    state.account = value;
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
