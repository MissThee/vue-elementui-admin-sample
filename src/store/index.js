import Vue from 'vue';
import Vuex from 'vuex';
import modules from 'src/store/modules';
import getters from 'src/store/getters';
import actions from 'src/store/actions';
Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  getters,
  actions,
});
