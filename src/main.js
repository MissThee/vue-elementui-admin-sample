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
Vue.prototype.$confirm = ElementUI.MessageBox.confirm;
Vue.prototype.$checkNull = (val) => {// 判断提交对象是否有空值
  let flag = true;
  if (JSON.stringify(val) === '{}') {
    flag = false;
  } else {
    for (const item in val) {
      if (val.hasOwnProperty(item)) {
        if (val[item] instanceof Array && val[item].length === 0 || val[item] === '') {
          flag = false;
        }
      } else {
        flag = false;
      }
    }
  }
  return flag;
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
