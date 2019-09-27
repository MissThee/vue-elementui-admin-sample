import request from 'src/utils/request';


export default {
  getRoleList: requestData => request({
    method: 'post',
    url: '/role/all',
    data: requestData,
  }),
  getRoleOne: requestData => request({
    method: 'post',
    url: '/role',
    data: requestData,
  }),
  addRole: requestData => request({
    method: 'put',
    url: '/role',
    data: requestData,
  }),
  updateRole: requestData => request({
    method: 'patch',
    url: '/role',
    data: requestData,
  }),
  deleteRole: requestData => request({
    method: 'delete',
    url: '/role',
    data: requestData,
  }),
}
