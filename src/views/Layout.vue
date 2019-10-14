<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <el-container>
      <el-header ref="header" style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box">
        <div style="float:left;font-weight: bold;font-size: 20px;color: #6b9aff;line-height: 50px;padding-right:20px;">管理系统</div>
        <breadcrumb></breadcrumb>
        <el-dropdown class="headPortrait" @command="handleCommand">
          <div style="width:36px;height:35px;background-color:deepskyblue;cursor:pointer;border-radius: 4px">
            <img :src="Img.UserAvatar" height="36" alt="头像">
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="float:right;font-weight: bold;font-size: 16px;color: #555;line-height: 50px;padding-right:10px;">{{getLoginNickName()}}</div>
      </el-header>
      <Sidebar style="position:absolute;top:50px;left:0;bottom: 0;overflow-x: hidden;width:180px;background-color: rgb(84, 92, 100)"></Sidebar>
      <TagsBar style="position:absolute;top:50px;left:180px;right:0;height: 30px" ref="tabs"></TagsBar>
      <div style="position:absolute;top:80px;left:180px;right:0;bottom: 0;overflow-x: hidden">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </el-container>
    <!--修改个人密码-->
    <el-dialog :close-on-click-modal="false" title="修改密码" width="400px" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="left" label-width="100px">
        <el-form-item required label="旧密码">
          <el-input type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item required label="新密码">
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item required label="重复新密码">
          <el-input type="password" v-model="newPasswordCheck"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogChangePersonalPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Sidebar from 'src/views/content/common/layout/Sidebar';
  import Breadcrumb from 'src/views/content/common/layout/Breadcrumb';
  import TagsBar from 'src/views/content/common/layout/TagsBar';
  import Img from 'src/assets/img';
  import types from 'src/store/mutation-types';
  import HomeApi from 'src/api/home-api';
  import { Notification } from 'element-ui';
  import { getLoginInfo, removeLoginInfo, removeToken } from '../utils/cookies';

  export default {
    name: 'Home',
    components: {
      Sidebar,
      Breadcrumb,
      TagsBar,
    },
    data() {
      return {
        Img,
        timer: true,
        dialogFormVisible: false,
        form: {
          oldPassword: '',
          newPassword: '',
        },
        newPasswordCheck: '',
      };
    },
    created() {
      this.$nextTick(() => {//初始化时设置高度
        this.setContentHeight(window.innerHeight - this.$refs.header.$el.offsetHeight - this.$refs.tabs.$el.offsetHeight);
      });
      window.onresize = () => {//窗口大小改变设置高度，限制更新频率
        if (this.timer) {
          this.setContentHeight(window.innerHeight - this.$refs.header.$el.offsetHeight - this.$refs.tabs.$el.offsetHeight);
          this.setContentWidth(window.innerWidth);
          setTimeout(() => {
            this.timer = true;
          }, 16);
        }
      };
    },
    methods: {
      ...mapMutations({
        setContentHeight: types.SET_CONTENT_HEIGHT,
        setContentWidth: types.SET_CONTENT_WIDTH,
      }),
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
              this.$router.replace('/');
              this.$message({
                type: 'success',
                message: '退出成功!',
              });
            });
        }
      },
      getLoginNickName() {
        return JSON.parse(getLoginInfo()).user.nickname;
      }
    },

  };
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: white;
    color: #333;
    text-align: left;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: white;
    color: #333;
    text-align: left;
    padding: 0;
  }

  .headPortrait {
    margin: 7px 0;
    float: right;
    height: 50px;
  }


  .TabsStyle {
    background-color: #f8f8f8;
    border-bottom: #BFBFBF solid 1px;
  }

  /*切换效果fade-xxx*/
  .fade-enter {
    opacity: 0;
    transform: translateX(10px);
  }

  .fade-enter-active {
    transition: all .3s;
  }

  .fade-leave-active {
    transition: all .3s;
    opacity: 0;
    transform: translateX(10px);
  }

</style>
