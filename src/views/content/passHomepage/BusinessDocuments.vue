<template>
  <div>
    <el-card class="box-card" :style="{height: `${ tableHeight }px`}">
      <div slot="header" class="clearfix">
        <el-tag type="success" style="font-size: 16px;">业务文档</el-tag>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'BusinessDocuments',
    data() {
      return {
        tableHeight: 0,
      };
    },
    watch: {
      contentHeight(val) {
        this.tableHeight = (val - 20) / 3;
      },
    },
    created() {
      this.$nextTick(() => {
        this.tableHeight = (this.contentHeight - 20) / 3;
      });
    },
    methods: {
      ...mapActions([
      ]),
    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
      }),
    },
  };
</script>

<style scoped>
  .text {
    font-size: 14px;
  }
</style>
