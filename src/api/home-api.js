import request from 'src/utils/request';
import { setToken } from '../utils/cookies';
import { showResMsg } from '../utils/operation-result-message';

export default {
  setChangePersonalPassword: allData => new Promise((resolve) => {
    request({
      method: 'patch',
      url: '/myaccount',
      data: allData,
    })
      .then(({ data, headers }) => {
        showResMsg(data);
        if (data.result) {
          setToken(headers.authorization);
        }
        resolve(data.result);
      });
  }),
};
