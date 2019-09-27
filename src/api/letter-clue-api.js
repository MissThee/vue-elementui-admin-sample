import request from 'src/utils/request';

export default {
  addLetClue: requestData => request({
    method: 'put',
    url: '/letClue',
    data: requestData,
  }),
  updateLetClue: requestData => request({
    method: 'patch',
    url: '/letClue',
    data: requestData,
  }),
  getLetClueList: allData => request({
    method: 'post',
    url: '/letClue/list',
    data: allData,
  }),
  // 修改表单类型
  updateResultType: allData => request({
    method: 'patch',
    url: '/letClue/resultType',
    data: allData,
  }),
  // 删除信访表单
  deleteLetClue: allData => request({
    method: 'delete',
    url: '/letClue',
    data: allData,
  }),
  //按照id查询信访表单
  getLetClueOne: allData => request({
    method: 'post',
    url: '/letClue',
    data: allData,
  }),
};
