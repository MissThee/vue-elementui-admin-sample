
import request from 'src/utils/request';

export default {
  setLogin: requestData => request({
    method: 'post',
    url: '/login',
    data: requestData,
  }),

};
