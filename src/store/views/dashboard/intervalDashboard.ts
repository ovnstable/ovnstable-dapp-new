const state = {
  intervalDashboard: 'DAY',
};

const actions = {
  async setInterval({ commit }: any, interval: any) {
    commit('setIntervalDashboard', interval);
  },
};

const mutations = {
  setIntervalDashboard(state: any, value: any) {
    state.intervalDashboard = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
