import Global from 'src/utils/global';
import { getToken, setToken } from 'src/utils/cookies';
import axios from 'axios';
import store from 'src/store';
import { Notification } from 'element-ui';
import router from 'src/router';
// 创建实例
const request = axios.create({
  baseURL: `${Global.URL}`,
  timeout: 50000,
});

// request拦截器，请求发送前修改发送内容
request.interceptors.request.use((request) => {
    request.headers.authorization = getToken();
    return request;
  }, error => {
    Notification({
      customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
      title: '出现错误request.interceptors.request',
      message: error,
      type: 'error'
    });
  }
);

// response拦截器，接收返回值后可在此先对返回值进行操作
request.interceptors.response.use((response) => {
    if (response.data.code === 401) {
      router.replace('/')
        .then();
      return;
    }
    if (response.headers.authorization !== undefined) {
      const token = response.headers.authorization;
      setToken(token);
    }
    return response;
  }, error => {
    if (error.response.status === 401) {
      router.replace('/')
        .then(() => {
          Notification({
            customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
            title: '您尚未登录',
            message: '请登录以访问平台',
            type: 'error'
          });
        });
    } else if (error.response.status === 403) {
      let msg = '请联系您的管理员以添加访问权限';
      if (error.response.data !== undefined && error.response.data.msg !== undefined) {
        msg = error.response.data.msg;
      }
      Notification({
        customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
        title: '您无权访问当前信息',
        message: msg,
        type: 'error'
      });
    } else {
      Notification({
        customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
        title: '出现错误request.interceptors.response',
        message: error,
        type: 'error'
      });
    }
  }
);

export default request;
