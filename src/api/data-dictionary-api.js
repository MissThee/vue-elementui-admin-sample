import request from 'src/utils/request';

export default {
  getDictionary: dataData => request({
    method: 'post',
    url: dataData.listUrl,
    data: {
      isDelete: dataData.isDelete,
    },
  }),
  addDictionary: dataData => request({
    method: dataData.methodKind,
    url: dataData.addDeleteChange,
    data: {
      id: dataData.deleteId,
      name: dataData.name,
      indexNumber: dataData.indexNumber,
    },
  }),
};
