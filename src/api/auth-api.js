import request from 'src/utils/request';

export default {
  getAuthInfo: requestData => request({
    method: 'post',
    url: '/info',
  })
};
