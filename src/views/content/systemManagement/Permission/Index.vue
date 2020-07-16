<template>
  <div style="margin-left: 10px">
    <el-button ref="AddButton" type="text" icon="el-icon-circle-plus-outline" class="reduce-height-element" @click="add()">添加权限</el-button>
    <div style="overflow: auto" :style="{height: tableAutoHeight+ 'px'}">
      <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :style="{color:node.data.isEnable?'black':'red' }"><i :class="getIconClass(node.data.type)" :style="{color: getIconColor(node.data.type)}"></i>{{ node.data.name }}</span>
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
    <!-- 弹窗 -->
    <PermissionDialog ref="editDialog" @up-data="fetchData"/>
  </div>
</template>

<script>
  import PermissionDialog from './PermissionDialog';
  import PermissionApi from 'src/api/permission-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins: [SimpleAutoHeightTable],
    name: 'Permission',
    components: {
      PermissionDialog,
    },
    data() {
      return {
        treeData: [],
        treeInfo: [],
        nodeInfo: {},
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      // -- 列表 --
      fetchData() {
        PermissionApi.getPermissionTree({ isDelete: false, orderBy: { index_num: true, name: true }, rootId: 0 })
          .then(({ data }) => {
            this.treeData = data.data.permissionTree;
          });
      },
      // -- 添加 --
      add(node) {
        this.$refs.editDialog.show(
          false,
          JSON.parse(JSON.stringify(node === undefined ? {} : node.data)),
          JSON.parse(JSON.stringify(this.treeData))
        );
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
            PermissionApi.deletePermission({ id })
              .then(({ data }) => {
                showResMsg(data);
                this.fetchData();
              });
          });
      },
      getIconClass(type) {
        switch (type) {
          case 'group':
            return 'el-icon-s-cooperation';
          case 'page':
            return 'el-icon-s-order';
          case 'permission':
            return 'el-icon-s-flag';
          default:
            return 'el-icon-question';
        }
      },
      getIconColor(type) {
        switch (type) {
          case 'group':
            return '#3a8ee6';
          case 'page':
            return '#24d6bb';
          case 'permission':
            return '#7de244';
          default:
            return 'orange';
        }
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
