<template>
  <div>
    <div style="width: 50%;float: left">
      <el-table :data="tableData" border :height="tableAutoHeight" stripe header-cell-class-name="custom-header-cell" @row-click="rowClickHandler" style="width: 100%">
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{scope.$index+(searchForm.pageNum - 1) * searchForm.pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="name" align="center" sortable min-width="150" label="角色名"></el-table-column>
        <el-table-column prop="isEnable" align="center" sortable width="80" label="状态">
          <template slot-scope="scope">
            <el-tag style="margin-left: 2px" :type="scope.row.isEnable ?'primary':'danger'" size="mini"> {{ scope.row.isEnable === true ? '可用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="80" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-delete" @click="roleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;box-sizing: border-box"
        class="reduce-height-element"
        ref="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchForm.pageNum"
        :page-size="searchForm.pageSize"
        :page-sizes="[10,20,30,40,50,100, 200, 300, 400,500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber">
      </el-pagination>
    </div>

    <div style="width: 50%;float: left;overflow: hidden;border: 1px solid #ccc;box-sizing: border-box;border-radius: 5px" >
      <div slot="header" style="height: 30px;font-size:20px;font-weight: bold;border-bottom: 1px solid #ccc;padding:0 30px ">
        <span>{{isUpdate?'修改':'新建'}}{{(form.name===undefined||form.name===''?'':'【')+form.name+(form.name===undefined||form.name===''?'':'】')}}</span>
      </div>
      <div :style="{height:tableAutoHeight-70+'px'}" style="overflow: scroll">
        <el-form :model="form" label-position="right" label-width="130px">
          <el-form-item label="角色名称:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="角色值:">
            <el-input v-model="form.role"></el-input>
          </el-form-item>
          <el-form-item label="角色状态:">
            <el-switch v-model="form.isEnable" active-text="可用" inactive-text="停用" inactive-color="red"></el-switch>
          </el-form-item>
          <el-form-item label="拥有的权限:">
            <el-scrollbar>
              <el-tree
                :data="permissionTree"
                show-checkbox
                node-key="id"
                ref="permissionTree"
                :props="permissionTreeProps"
                default-expand-all
              >
              </el-tree>
            </el-scrollbar>
          </el-form-item>
        </el-form>
      </div>
      <div style="height: 30px;border-top: 1px solid #ccc;padding:10px 30px;text-align: center">
        <el-button type="success" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="addRoleFunction">清空/新建</el-button>
        <el-button type="primary" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-check" @click="addAmendConfirm">保存</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import RoleApi from 'src/api/role-api';
  import PermissionApi from 'src/api/permission-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins: [SimpleAutoHeightTable],
    name: 'Role',
    data() {
      return {
        isUpdate: undefined,
        thisRowId: '',
        tableData: [],
        totalNumber: 0,
        permissionTree: [],
        form: {},
        formEmpty: {
          isEnable: true,
          name: '',
          role: '',
          permissionIdList: [],
        },
        treeSelect: [],
        searchForm:{
          pageNum: 1,
          pageSize: 100,
          isDelete: false,
          orderBy: { name: true }
        },
        transferParameters: {
          isDelete: false,
          orderBy: {
            index_num: true,
            name: true,
          },
          rootId: 0,
        },
        permissionTreeProps: {
          children: 'children',
          label: 'name',
        },
      };
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.formEmpty));
      this.fetchData();
      this.initPermissionTree();
    },
    methods: {
      fetchData() {
        RoleApi.getRoleList(this.searchForm)
          .then(({ data }) => {
            this.tableData = data.data.roleList;
            this.totalNumber = data.data.total;
          });
      },
      initPermissionTree() {
        PermissionApi.getPermissionTree(this.transferParameters)
          .then(({ data }) => {
            this.permissionTree = data.data.permissionTree;
          });
      },
      addAmendConfirm() {
        let permissionTreeArr = [];
        permissionTreeArr = permissionTreeArr.concat(this.$refs.permissionTree.getHalfCheckedKeys());
        permissionTreeArr = permissionTreeArr.concat(this.$refs.permissionTree.getCheckedKeys());
        this.form.permissionIdList = permissionTreeArr;
        if (this.isUpdate) {
          RoleApi.updateRole(this.form)
            .then(({ data }) => {
              showResMsg(data);
              this.fetchData();
            });

        } else {
          RoleApi.addRole(this.form)
            .then(({ data }) => {
              showResMsg(data);
              this.fetchData();
            });
        }
      },
      addRoleFunction() {
        this.isUpdate = false;
        this.form = JSON.parse(JSON.stringify(this.formEmpty));
        this.$refs.permissionTree.setCheckedKeys([]);
      },
      rowClickHandler(row) {
        this.isUpdate = true;
        let permissionTreeEL = this.$refs.permissionTree;
        RoleApi.getRoleOne({ id: row.id })
          .then(({ data }) => {
            this.form = data.data.role;
            this.form.id = row.id;
            let permissionIdListTmp = [...this.form.permissionIdList];
            let permissionIdList = this.form.permissionIdList;
            for (let nodeId of permissionIdListTmp) {
              let node = permissionTreeEL.getNode(nodeId);
              if (node !== undefined && node !== null) {
                if (!node.isLeaf) {
                  if(permissionIdList.indexOf(nodeId)!==-1)
                  permissionIdList.splice(permissionIdList.indexOf(nodeId), 1);
                }
              }
            }
            permissionTreeEL.setCheckedKeys(permissionIdList);
          });
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNum = val;
        this.fetchData();
      },
      roleDelete(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            RoleApi.deleteRole({ id: row.id, })
              .then(({ data }) => {
                showResMsg(data);
                this.fetchData();
              });
          });
      },
    },
  };
</script>

