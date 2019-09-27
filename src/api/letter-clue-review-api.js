import request from '../utils/request';

export default {
  getLetClueReviewList:  requestData=> request({
      method: 'post',
      url: '/review/letclue/list',
      data: requestData,
    }),
  getLetClueReviewOne: requestData => request({
      method: 'post',
      url: '/review/letclue',
      data: requestData,
    }),
  updateLetClueReview:   requestData => request({
      method: 'patch',
      url: '/review/letclue',
      data: requestData,
    }) ,
};
