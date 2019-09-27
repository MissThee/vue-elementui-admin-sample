import types from 'src/store/mutation-types';

const state = {
  contentHeight: '',
};

const mutations = {
  [types.SET_CONTENT_HEIGHT](obj, value) {
    state.contentHeight = value;
  },
};

export default {
  state,
  mutations,
};
