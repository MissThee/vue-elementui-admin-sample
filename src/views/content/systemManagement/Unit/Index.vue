<template>
  <div style="margin-left: 10px">
    <el-button ref="AddButton" type="text" icon="el-icon-circle-plus-outline" class="reduce-height-element" @click="add()">添加单位
    </el-button>
    <div style="overflow: auto" :style="{height: tableAutoHeight+ 'px'}">
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
  import UnitDialog from './UnitDialog';
  import UnitApi from 'src/api/unit-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins: [SimpleAutoHeightTable],
    name: 'unit',
    components: {
      UnitDialog,
    },
    data() {
      return {
        treeData: [],
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
    created() {
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
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
