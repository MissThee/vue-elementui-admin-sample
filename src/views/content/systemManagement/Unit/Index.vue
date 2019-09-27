<template>
  <div style="margin-left: 10px"  :style="{height: tableHeight + 'px'}">
    <el-button ref="AddButton" type="text" icon="el-icon-circle-plus-outline" @click="add()">添加单位
    </el-button>
    <div style="overflow: auto" :style="{height: tableHeight+ 'px'}">
      <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.data.name }}</span>
        <span>
          <el-button type="text" style="color: #67C23A;"
                     @click="() => add(node)" icon="el-icon-circle-plus-outline">添加
          </el-button>
          <el-button type="text" icon="el-icon-edit"
                     @click="() => change(node)">修改
          </el-button>
          <el-button type="text" style="color: #F56C6C;"
                     @click="() => remove(node, data)" icon="el-icon-delete">删除
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <!--添加修改-->
    <UnitDialog ref="editDialog" @up-data="upData"></UnitDialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import UnitDialog from './UnitDialog';
  import UnitApi from 'src/api/unit-api';
  import { showResMsg } from 'src/utils/operation-result-message';

  export default {
    name: 'unit',
    data() {
      return {

        treeData: [],
        tableHeight: '',
        showAdd: false,
        addInfo: {
          rowInfo: '',
          addTitle: '',
        },
        showChange: false,
        changeInfo: {
          rowInfo: '',
          changeTitle: '',
          changeTree: [],
        },
        form: {
          isDelete: false,
          orderBy: {
            name: true,
          },
          rootId: 0,
        },
      };
    },
    watch: {
      contentHeight(val) {
        this.tableHeight = val  - this.$refs.AddButton.$el.offsetHeight;
      },
    },
    created() {
      this.$nextTick(() => {
        this.tableHeight = this.contentHeight - this.$refs.AddButton.$el.offsetHeight;
      });
      this.upData();
    },
    methods: {
      // -- 添加 --
      add(node) {
        this.$refs.editDialog.show(
          false,
          JSON.parse(JSON.stringify(node === undefined ? {} : node.data)),
          JSON.parse(JSON.stringify(this.treeData))
        );
      },
      // -- 获取、更新 --
      upData() {
        UnitApi.getUnitTree(this.form)
          .then(({ data }) => {
            this.treeData = data.data.unitTree;
          });
      },
      // -- 修改 --
      change(node) {
        this.$refs.editDialog.show(
          true,
          JSON.parse(JSON.stringify(node.data)),
          JSON.parse(JSON.stringify(this.treeData))
        );
      },
      // -- 删除 --
      remove(node) {
        const id = node.data.id;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            UnitApi.deleteUnit({ id })
              .then(({ data }) => {
                showResMsg(data);
                if (data.result) {
                  this.upData();
                }
              });
          });
      },

    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
      }),
    },
    components: {
      UnitDialog,

    },
  };
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
