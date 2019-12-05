import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'src/assets/css/style.css'
import 'src/assets/css/custom.css'

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
