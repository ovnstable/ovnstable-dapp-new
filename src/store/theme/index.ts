const state = {
  light: true,
};

const getters = {
  light(state: {
    light: boolean
  }) {
    return state.light;
  },
};

const actions = {

  async switchTheme({ commit, getters }: any) {
    console.log('switchTheme');
    const storageType = localStorage.getItem('theme-type');
    const isLightTheme = !storageType || storageType === 'light';

    if (isLightTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme-type', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme-type', 'light');
    }

    await commit('setLight', isLightTheme);

    // await dispatch('applyColorVariables');
    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(isLightTheme ? 'light' : 'dark');
    }
  },

  async initTheme({ commit, getters }: any) {
    const storageType = localStorage.getItem('theme-type');
    const isLightTheme = !storageType || storageType === 'light';

    if (isLightTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme-type', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    await commit('setLight', isLightTheme);

    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(isLightTheme ? 'light' : 'dark');
    }
  },
};

const mutations = {
  setLight(state: {
    light: boolean
  }, value: any) {
    state.light = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
