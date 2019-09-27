import request from 'src/utils/request';

export default {
  getUnitTree: requestData => request({
    method: 'post',
    url: '/unit/tree',
    data: requestData,
  }),
  // 添加
  addUnit: requestData => request({
    method: 'put',
    url: '/unit',
    data: requestData,
  }),
  // 修改
  updateUnit: requestData => request({
    method: 'patch',
    url: '/unit',
    data: requestData,
  }),
  // 删除
  deleteUnit: requestData => request({
      method: 'delete',
      url: '/unit',
      data: requestData,
    }),
};
