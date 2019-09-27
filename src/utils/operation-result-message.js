import { Notification } from 'element-ui';

export function showResMsg({result,msg}) {
  Notification({
    customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
    title: '操作' + (result ? '成功' : '失败'),
    message: result ? null : msg,
    type: result ? 'success' : 'error'
  });
}

