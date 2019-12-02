export default {
  namespaced: true,
  state: {
    contentHeight: 0,
    contentWidth: 0,
  },
  mutations: {
    setContentHeight(state, value) {
      state.contentHeight = value;
    },
    setContentWidth(state, value) {
      state.contentWidth = value;
    },
  },
  actions: {
    setContentHeight(context, value) {
      context.commit('setContentHeight', value);
    },
    setContentWidth(context, value) {
      context.commit('setContentWidth', value);
    },
  },
  getters: {
    getContentHeight: state => state.contentHeight,
    getContentWidth: state => state.contentWidth,
  }
};
