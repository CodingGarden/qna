import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      if (user.providers
        && user.providers.youtube
        && user.providers.youtube.id === '116294113817670243557') {
        user.isAdmin = true;
      }
      state.user = user;
    },
  },
  actions: {
  },
});
