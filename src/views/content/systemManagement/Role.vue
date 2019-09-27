<template>
  <div>
    <div style="width: 50%;float: left">
      <el-table :data="tableData" border :height="tableHeight" stripe header-cell-class-name="custom-header-cell" @row-click="rowClickHandler" style="width: 100%">
        <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
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
    </div>
    <div style="width: 50%;float: left">
      <el-card>
        <div slot="header" style="height: 30px;font-size:20px;font-weight: bold">
          <span>{{isUpdate?'修改':'新建'}}{{(form.name===undefined||form.name===''?'':'【')+form.name+(form.name===undefined||form.name===''?'':'】')}}</span>
        </div>
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
          <el-form-item>
            <el-button type="success" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="addRoleFunction">新建</el-button>
            <el-button type="primary" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-check" @click="addAmendConfirm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import RoleApi from 'src/api/role-api';
  import PermissionApi from 'src/api/permission-api';
  import { showResMsg } from 'src/utils/operation-result-message';

  export default {
    name: 'Role',
    data() {
      return {
        isUpdate: undefined,
        thisRowId: '',
        tableHeight: 0,
        tableData: [],
        permissionTree: [],
        form: {},
        formEmpty: {
          isEnable: true,
          name: '',
          role: '',
          permissionIdList: [],
        },
        treeSelect: [],
        isDelete: false,
        transferParameters: {
          isDelete: false,
          orderBy: {
            name: true,
            index_num: true,
          },
          rootId: 0,
        },
        permissionTreeProps: {
          children: 'children',
          label: 'name',
        },
      };
    },
    watch: {
      contentHeight(val) {
        this.tableHeight = val ;
      },
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.formEmpty));
      this.$nextTick(() => {
        this.tableHeight = this.contentHeight ;
      });
      this.fetchData();
      this.initPermissionTree();
    },
    methods: {
      fetchData() {
        RoleApi.getRoleList({ isDelete: this.isDelete, orderBy: { name: true } })
          .then(({ data }) => {
            this.tableData = data.data.roleList;
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
                    permissionIdList.splice(permissionIdList.indexOf(nodeId),1);
                  }
                }
            }
            permissionTreeEL.setCheckedKeys(permissionIdList);
          });
      },
      roleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
      }),
    },
  };
</script>

