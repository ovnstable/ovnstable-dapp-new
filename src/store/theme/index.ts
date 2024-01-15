/* eslint-disable no-unused-vars */
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

  async switchTheme({ commit, dispatch, getters }: any) {
    const themeType = document.documentElement.getAttribute('data-theme');

    console.log(themeType, '---switchTheme');
    if (themeType === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    await commit('setLight', themeType === 'light');

    // await dispatch('applyColorVariables');
    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(themeType ? 'light' : 'dark');
    }
  },

  async initTheme({ commit, getters }: any) {
    console.log('---initTheme');
    const themeType = document.documentElement.getAttribute('data-theme');

    console.log(themeType, '---isLight');
    if (themeType === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    await commit('setLight', themeType === 'light');

    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(themeType === 'light' ? 'light' : 'dark');
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
