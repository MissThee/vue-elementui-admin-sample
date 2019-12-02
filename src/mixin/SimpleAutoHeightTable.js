import { mapGetters } from 'vuex';

const SimpleAutoHeightTable = {
  data() {
    return {
      tableAutoHeight: 0
    };
  },
  created() {
    this.setTableHeight(this.contentHeight);
  },
  watch: {
    contentHeight(val) {
      this.setTableHeight(val);
    },
    contentWidth() {
      this.setTableHeight(this.contentHeight);
    },
  },
  methods: {
    setTableHeight(val) {
      this.$nextTick(() => {
        let reduceHeight = 0;//记录需要减去的高度
        let reduceHeightElements = document.getElementsByClassName('reduce-height-element');
        for (let i = 0; i < reduceHeightElements.length; i++) {
          reduceHeight += reduceHeightElements[i].offsetHeight;
        }
        this.tableAutoHeight = val - reduceHeight;
      });
    },
  },
  computed: {
    ...mapGetters({
      contentHeight: 'layout/getContentHeight',
      contentWidth: 'layout/getContentWidth',
    }),
  },
};
export default SimpleAutoHeightTable;
