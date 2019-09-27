import Vue from 'vue';
import Router from 'vue-router';
import routes from 'src/router/routes';
import { MessageBox } from 'element-ui';
import { getLoginInfo, removeLoginInfo, removeToken } from 'src/utils/cookies';

Vue.use(Router);

const router = new Router({
  routes,
});

router.beforeEach((to, from, next) => {
  if ((to.matched.some(record => record.meta.auth))) {
    // 对用户身份进行验证...
    const localUser = getLoginInfo();
    if (localUser === undefined) {
      MessageBox.alert('用户登录信息已失效，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
      })
        .then(() => {
          removeToken();
          removeLoginInfo();
          window.location.href='/'
          Vue.$router.replace('/');
        });
    }
  }
  next();
})
;

export default router;
