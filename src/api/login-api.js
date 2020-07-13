
import request from 'src/utils/request';

export default {
  login: requestData => request({
    method: 'post',
    url: '/login',
    data: requestData,
  }),

};
