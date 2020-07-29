<template>
  <el-header ref="header">
    <div style="float:left;font-weight: bold;font-size: 20px;color: #6b9aff;line-height: 50px;padding-right:20px;">管理系统</div>
    <breadcrumb/>
    <el-dropdown class="headPortrait" @command="handleCommand">
      <div style="width:35px;height:35px;cursor:pointer;border-radius: 5px;overflow: hidden;box-shadow: 0 0 5px gray">
        <img :src="Img.UserAvatar" height="36" alt="头像">
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="float:right;font-weight: bold;font-size: 16px;color: #555;line-height: 50px;padding-right:10px;">{{nickname}}</div>
    <!--修改个人密码-->
    <el-dialog :close-on-click-modal="false" title="修改密码" width="400px" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="left" label-width="100px">
        <el-form-item required label="旧密码">
          <el-input type="password" v-model="form.oldPassword"/>
        </el-form-item>
        <el-form-item required label="新密码">
          <el-input type="password" v-model="form.newPassword"/>
        </el-form-item>
        <el-form-item required label="重复新密码">
          <el-input type="password" v-model="newPasswordCheck"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogChangePersonalPassword">确 定</el-button>
      </div>
    </el-dialog>
  </el-header>
</template>

<script>
  import { removeLoginInfo, removeToken } from 'src/utils/cookies';
  import Img from 'src/assets/img';
  import Breadcrumb from './Breadcrumb';
  import { Notification } from 'element-ui';
  import HomeApi from 'src/api/home-api';

  export default {
    name: 'NavBar',
    components: { Breadcrumb },
    data() {
      return {
        Img,
        nickname: '',
        dialogFormVisible: false,
        form: {
          oldPassword: '',
          newPassword: '',
        },
        newPasswordCheck: '',
      };
    },
    methods: {
      initNickname(nickname) {
        this.nickname = nickname;
      },
      handleCommand(command) {
        if (command === 'changePassword') {
          this.dialogFormVisible = true;
          return;
        }
        if (command === 'logout') {
          this.$confirm('此操作将退出此账号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              removeToken();
              removeLoginInfo();
              if (this.$socket) {
                this.$socket.disconnect();
              }
              this.$message({
                type: 'success',
                message: '已退出',
              });
              this.$router.replace('/');
            });
        }
      },
      dialogChangePersonalPassword() {
        if (this.form.oldPassword.length === 0) {
          Notification.warning({
            title: '信息有误',
            message: '旧密码不能为空'
          });
          return;
        }
        if (this.form.newPassword.length === 0) {
          Notification.warning({
            title: '信息有误',
            message: '新密码不能为空'
          });
          return;
        }
        if (this.form.newPassword !== this.newPasswordCheck) {
          Notification.warning({
            title: '信息有误',
            message: '两次输入的新密码不一致'
          });
          return;
        }
        HomeApi.setChangePersonalPassword(this.form)
          .then((result) => {
            if (result) {
              this.dialogFormVisible = false;
              this.form = {
                oldPassword: '',
                newPassword: '',
              };
              this.newPasswordCheck = '';
            }
          });
      },
    }
  };
</script>

<style scoped>
  .headPortrait {
    margin: 7px 0;
    float: right;
    height: 50px;
  }
</style>
