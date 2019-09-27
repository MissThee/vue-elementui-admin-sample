import Cookies from 'js-cookie';
import router from 'src/router/index';
import { Notification } from 'element-ui';

const tokenKey = 'Admin-Token';
const loginInfoKey = 'Admin-LoginInfo';

export function getToken() {
  let token = Cookies.get(tokenKey);
  if (token === undefined || token === null || token.length === 0) {
    noAuth();
  }
  return token;
}

export function setToken(value) {
  return Cookies.set(tokenKey, value);
}

export function removeToken() {
  return Cookies.remove(tokenKey);
}

export function getLoginInfo() {
  let loginInfo = Cookies.get(loginInfoKey);
  if (loginInfo === undefined || loginInfo === null || loginInfo.length === 0) {
    noAuth();
  }
  return loginInfo;
}

export function setLoginInfo(value) {
  return Cookies.set(loginInfoKey, value);
}

export function removeLoginInfo() {
  return Cookies.remove(loginInfoKey);
}

function noAuth() {
  router.replace('/')
    .then(() => {
      Notification({
        customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
        title: '您尚未登录',
        message: '请登录以访问平台',
        type: 'error'
      });
    });
}
