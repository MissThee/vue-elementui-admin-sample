import types from 'src/store/mutation-types';

const state = {
  contentHeight: 0,
  contentWidth: 0,
};

const mutations = {
  [types.SET_CONTENT_HEIGHT](obj, value) {
    state.contentHeight = value;
  },
  [types.SET_CONTENT_WIDTH](obj, value) {
    state.contentWidth = value;
  },
};

export default {
  state,
  mutations,
};
