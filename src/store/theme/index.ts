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
    let isLight = false;

    if (getters.light === null || getters.light === undefined) {
      isLight = true;
    } else {
      isLight = !getters.light;
    }

    localStorage.setItem('light_theme_on', JSON.stringify(isLight));

    await commit('setLight', isLight);
    await dispatch('applyColorVariables');
    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(isLight ? 'light' : 'dark');
    }
  },

  async initTheme({ commit, getters }: any) {
    let isLight = localStorage.getItem('light_theme_on');

    if (isLight === null || isLight === undefined) {
      isLight = 'true';
    } else {
      isLight = isLight ? 'true' : '';
    }

    await commit('setLight', isLight);

    if (getters.onboard) {
      getters.onboard.state.actions.updateTheme(isLight ? 'light' : 'dark');
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
