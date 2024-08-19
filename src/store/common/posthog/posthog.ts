import type { IPosthogService } from '@/types/posthog';

const state = {
  posthogService: {} as IPosthogService,
};

const getters = {
  posthogService(state: any) {
    return state.posthogService;
  },
};

const actions = {
  initPosthog({ commit }: any, posthogService: IPosthogService) {
    commit('setPosthogInstance', posthogService);
  },
};

const mutations = {
  setPosthogInstance(state: any, posthogService: IPosthogService) {
    state.posthogService = posthogService;
  },
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};
