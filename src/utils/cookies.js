import Cookies from 'js-cookie';
import router from 'src/router/index';
import { Notification } from 'element-ui';

const tokenKey = 'UserTokenKey';
const loginInfoKey = 'UserLoginInfoKey';

export function getToken() {
  let token = Cookies.get(tokenKey);
  if (token === undefined || token === null || token.length === 0) {
    return undefined;
  }
  return token;
}
export function getTokenOrRedirect() {
  let token = Cookies.get(tokenKey);
  if (token === undefined || token === null || token.length === 0) {
    noAuth();
  }
  return token;
}

export function setToken(value, isLongLogin) {
  let cookieOptions = {};
  if (isLongLogin) {
    //登录的时候选择“记住登录状态”，保存token到cookie中且设置过期日期。
    //其他的情况如：修改密码、token过期后续期，拿到的token保存到cookie不再设置过期日期，用户本次关闭浏览器后清除
    cookieOptions = { expires: 365 };
  }
  return Cookies.set(tokenKey, value, cookieOptions);
}

export function removeToken() {
  return Cookies.remove(tokenKey);
}

export function getLoginInfo() {
  let loginInfo = Cookies.get(loginInfoKey);
  if (loginInfo === undefined || loginInfo === null || loginInfo.length === 0) {
    return undefined;
  }
  return JSON.parse(loginInfo);
}

export function getLoginInfoOrRedirect() {
  let loginInfo = Cookies.get(loginInfoKey);
  if (loginInfo === undefined || loginInfo === null || loginInfo.length === 0) {
    noAuth();
  }
  return JSON.parse(loginInfo);
}

export function setLoginInfo(value) {
  return Cookies.set(loginInfoKey, JSON.stringify(value));
}

export function removeLoginInfo() {
  return Cookies.remove(loginInfoKey);
}

function noAuth() {
  Cookies.remove(tokenKey);
  router.replace('/')
    .then(() => {
      // Notification({
      //   customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
      //   title: '您尚未登录',
      //   message: '请登录以访问平台。',
      //   type: 'error'
      // });
    });
}
