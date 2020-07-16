<template>
  <div>
    <el-form :inline="true" class="form-top reduce-height-element">
      <el-form-item>
        <el-button type="primary" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="prepareAdd">增加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border header-cell-class-name="custom-header-cell" :height="tableAutoHeight" stripe style="width: 100%">
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{scope.$index+(searchForm.pageNum - 1) * searchForm.pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="username" align="center" width="150" label="用户名" sortable/>
      <el-table-column prop="nickname" align="center" width="150" label="昵称" sortable/>
      <el-table-column prop="unitName" align="center" min-width="120" label="所属组织机构名称" sortable/>
      <el-table-column prop="roleList" align="left" min-width="200" label="账号角色" sortable>
        <template slot-scope="scope">
            <span v-for="item in scope.row.roleList">
              <el-tag style="margin-left: 2px;margin-top:2px" :type="item.isEnable ?'primary':'danger'" size="mini">{{item.name}}</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="isEnable" align="center" width="80" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag style="margin-left: 2px" :type="scope.row.isEnable ?'primary':'danger'" size="mini"> {{ scope.row.isEnable === true ? '可用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAdmin" align="center" width="90" label="管理员" sortable>
        <template slot-scope="scope">
          <el-tag style="margin-left: 2px" :type="scope.row.isAdmin ?'primary':'info'" size="mini"> {{ scope.row.isAdmin === true ? '管理员' : '用户' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="220" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain class="custom-button-in-table" icon="el-icon-edit"
                     @click="prepareUpdate(scope.$index, scope.row)">修改
          </el-button>
          <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-delete"
                     @click="userDelete(scope.$index, scope.row)">删除
          </el-button>
          <el-button type="warning" size="mini" plain class="custom-button-in-table" icon="el-icon-refresh"
                     @click="resetPassword(scope.$index, scope.row)">重置密码
          </el-button>
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
    <!------------增加修改弹窗----------->
    <el-dialog :close-on-click-modal="false" :title="(isCreate?'增加':'修改')+'用户'" width="600px" :visible.sync="isShowAddOrUpdateDialog">
      <el-form ref="addOrUpdateForm" :model="form" label-position="right" label-width="80px">
        <el-form-item label="昵称:">
          <el-input v-model="form.nickname"/>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码:" v-if="isShowPasswordEditor">
          <el-input v-model="form.password"/>
        </el-form-item>
        <el-form-item label="组织机构:">
          <tree-select v-model="form.unitId" :treeData="unitTreeData" :props="{ children: 'children', label: 'name' }" nodeKey="id"/>
        </el-form-item>
        <el-form-item label="账户状态:">
          <el-switch v-model="form.isEnable" active-text="可用" inactive-text="停用"/>
        </el-form-item>
        <el-form-item label="管理员:">
          <el-switch v-model="form.isAdmin" active-text="是" inactive-text="否"/>
        </el-form-item>
        <el-form-item label="角色:">
          <el-checkbox-group
            v-model="form.roleIdList">
            <el-checkbox v-for="item in roleData" :label="item.id" :key="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitAddOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import UserApi from 'src/api/user-api';
  import RoleApi from 'src/api/role-api.js';
  import UnitApi from 'src/api/unit-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';
  import TreeSelect from '../../common/TreeSelect';

  export default {
    mixins: [SimpleAutoHeightTable],
    components: {TreeSelect},
    name: 'User',
    data() {
      return {
        treeProps: {
          checkStrictly: true,
          value: 'id',
          label: 'name',
          children: 'children',
        },
        isCreate: true,
        tableData: [],
        totalNumber: 0,
        unitTreeData: [],
        isShowAddOrUpdateDialog: false,
        isShowPasswordEditor: false,
        form: {},
        formEmpty: {
          isEnable: true,
          isAdmin: false,
          nickname: '',
          password: '',
          roleIdList: [],
          unitId: [],
          username: '',
        },
        searchForm: {
          pageNum: 1,
          pageSize: 100,
          isDelete: false,
          orderBy: {},
        },
        roleData: [],
      };
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.formEmpty));
      UnitApi.getUnitTree({
        isDelete: false,
        orderBy: {
          name: true,
        },
        rootId: 0,
      })
        .then(({ data }) => {
          this.unitTreeData = data.data.unitTree;
        });

      this.fetchData();
      RoleApi.getRoleList({
          isDelete: this.isDelete,
          orderBy: { name: true, }
        }
      )
        .then(({ data }) => {
          this.roleData = data.data.roleList;
        });
    },
    methods: {
      fetchData() {
        UserApi.getUserList(this.searchForm)
          .then(({ data }) => {
            this.tableData = data.data.userList;
            this.totalNumber = data.data.total;
          });
      },
      commitAddOrUpdate() {
        if (this.isCreate) {
          UserApi.addUser(this.form)
            .then(({ data }) => {
              showResMsg(data);
              if (data.result) {
                this.isShowAddOrUpdateDialog = false;
                this.fetchData();
              }
            });
        } else {
          UserApi.updateUser(this.form)
            .then(({ data }) => {
              showResMsg(data);
              if (data.result) {
                this.isShowAddOrUpdateDialog = false;
                this.fetchData();
              }
            });
        }
      },
      prepareAdd() {
        this.form = JSON.parse(JSON.stringify(this.formEmpty));
        this.isCreate = true;
        this.isShowPasswordEditor = true;
        this.isShowAddOrUpdateDialog = true;
      },
      prepareUpdate(index, row) {
        this.isCreate = false;
        this.isShowAddOrUpdateDialog = true;
        this.isShowPasswordEditor = false;
        this.form = JSON.parse(JSON.stringify(this.formEmpty));
        UserApi.getUserOne({
          id: row.id,
        })
          .then(({ data }) => {
            this.form = data.data.user;
          });
      },
      userDelete(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            UserApi.deleteUser({
              id: row.id,
            })
              .then(({ data }) => {
                showResMsg(data);
                this.fetchData();
              });
          });
      },
      resetPassword(index, row) {
        this.$confirm('此操作将重置此用户密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            UserApi.resetPassword({
              id: row.id,
            })
              .then(({ data }) => {
                showResMsg(data);
                this.fetchData();
              });
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
    },

  };
</script>

<style scoped>
</style>
