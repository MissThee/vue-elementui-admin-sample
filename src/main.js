import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'src/assets/css/style.css'
import 'src/assets/css/custom.css'

if (!!window.ActiveXObject || 'ActiveXObject' in window) {
  //IE系列浏览器不使用vueSocketIO，因为不支持，会因依赖报错导致整个页面出不来
}else{
  //动态加载socketio依赖
  Promise.all([import('vue-socket.io')])
    .then(([VueSocketIO]) => {
      let vueSocketIO = new VueSocketIO.default({
        debug: true,
        connection: '',
        options: {
          // path: "/" ,
          forceNew: true,
          transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
          autoConnect: false,
        }
      });
      Vue.use(vueSocketIO);
    });
}
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
