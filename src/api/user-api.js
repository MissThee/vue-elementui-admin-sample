import request from 'src/utils/request';

export default {
  getUserList: requestData => request({
    method: 'post',
    url: '/user/all',
    data: requestData,
  }),
  getUserOne: requestData => request({
    method: 'post',
    url: '/user',
    data: requestData,
  }),
  addUser: requestData => request({
    method: 'put',
    url: '/user',
    data: requestData,
  }),
  updateUser: requestData => request({
    method: 'patch',
    url: '/user',
    data: requestData,
  }),
  deleteUser: requestData => request({
    method: 'delete',
    url: '/user',
    data: requestData,
  }),
  resetPassword: requestData => request({
    method: 'patch',
    url: '/user/password/default',
    data: requestData,
  }),
};
