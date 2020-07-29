<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <el-container>
      <NavBar style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box" ref="NavBar"/>
      <SideBar style="position:absolute;top:50px;left:0;bottom: 0;overflow-x: hidden;width:180px;background-color: rgb(84, 92, 100)" ref="SideBar"/>
      <TagsBar style="position:absolute;top:50px;left:180px;right:0;height: 30px" ref="TagsBar"/>
      <div style="position:absolute;top:80px;left:180px;right:0;bottom: 0;overflow-x: hidden">
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </el-container>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import SideBar from 'src/views/Layout/SideBar';
  import NavBar from 'src/views/Layout/NavBar';
  import TagsBar from 'src/views/Layout/TagsBar';
  import * as Cookies from 'src/utils/cookies';
  import AuthApi from 'src/api/auth-api';
  import Global from 'src/utils/global';
  import { getTokenOrRedirect } from 'src/utils/cookies';
  import { Notification } from 'element-ui';

  export default {
    name: 'Home',
    components: {
      SideBar,
      NavBar,
      TagsBar,
    },
    data() {
      return {
        timer: true,
      };
    },
    sockets: {
      listener: {
        broadcast(data) {//监听广播事件
          Notification.info({
            title: '广播：' + data.msg,
            position: 'bottom-right',
          });
        },
        msgToOneUser(data) {//监听发送给本用户信息事件
          Notification.info({
            title: '新消息：' + data.msg,
            position: 'bottom-right',
          });
        },
        reconnecting(data) {
          if (data >= 3) {
            //重试3次就不重连了。这里应该改成从http端口获取后台的配置，若开启了socket服务，再连接，否则不进行连接
            this.$socket.disconnect();
          }
        },
      }
    },
    created() {
      this.initContentHeight();
      this.initUserInfo();
    },
    mounted() {
      if (this.$socket) {
        if (this.$socket.connected) {
          this.$socket.disconnect();
        }
        this.$socket.io.uri = Global.SOCKET_URL + '?token=' + getTokenOrRedirect();
        this.$socket.connect();
      }
    },
    beforeDestroy() {
      if (this.$socket) {
        this.$socket.disconnect();
      }
    },
    methods: {
      ...mapActions('layout', {
        setContentHeight: 'setContentHeight',
        setContentWidth: 'setContentWidth',
      }),
      setSize() {
        let navBarHeight = 0;
        if (this.$refs.NavBar && this.$refs.NavBar.$el && this.$refs.NavBar.$el.offsetHeight) {
          navBarHeight = this.$refs.NavBar.$el.offsetHeight;
        }
        let tagsBarHeight = 0;
        if (this.$refs.TagsBar && this.$refs.TagsBar.$el && this.$refs.TagsBar.$el.offsetHeight) {
          tagsBarHeight = this.$refs.TagsBar.$el.offsetHeight;
        }
        this.setContentHeight(window.innerHeight - navBarHeight - tagsBarHeight);
        this.setContentWidth(window.innerWidth);
      },
      initContentHeight() {
        this.$nextTick(() => {//初始化时设置高度
          this.setSize();
        });
        window.onresize = () => {//窗口大小改变设置高度，限制更新频率
          if (this.timer) {
            this.setSize();
            setTimeout(() => {
              this.timer = true;
            }, 16);
          }
        };
      },
      initUserInfo() {
        AuthApi.getAuthInfo()
          .then(({ data }) => {
            let user = data.data.user;
            Cookies.setLoginInfo(user);
            Cookies.getLoginInfoOrRedirect();
            this.$refs.NavBar.initNickname(user.nickname);
            this.$refs.SideBar.initSideBar(user.permissionValueList);
          });
      },
    },

  };
</script>

<style scoped>

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
