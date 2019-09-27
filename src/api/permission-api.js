import request from 'src/utils/request';

export default {
  getPermissionTree: requestData => request({
    method: 'post',
    url: '/permission/tree',
    data: requestData,
  }),
  addPermission: requestData => request({
    method: 'put',
    url: '/permission',
    data: requestData,
  }),
  updatePermission: requestData => request({
    method: 'patch',
    url: '/permission',
    data: requestData,
  }),
  deletePermission: requestData => request({
    method: 'delete',
    url: '/permission',
    data: requestData,
  }),
};
