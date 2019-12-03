<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <el-container>
      <NavBar style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box" ref="NavBar"></NavBar>
      <SideBar style="position:absolute;top:50px;left:0;bottom: 0;overflow-x: hidden;width:180px;background-color: rgb(84, 92, 100)" ref="SideBar"></SideBar>
      <TagsBar style="position:absolute;top:50px;left:180px;right:0;height: 30px" ref="TagsBar"></TagsBar>
      <div style="position:absolute;top:80px;left:180px;right:0;bottom: 0;overflow-x: hidden">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </el-container>

  </div>
</template>

<script>
  import { mapActions} from 'vuex';
  import SideBar from 'src/views/Layout/SideBar';
  import NavBar from 'src/views/Layout/NavBar';
  import TagsBar from 'src/views/Layout/TagsBar';
  import { getLoginInfo,getToken, setLoginInfo,removeLoginInfo, removeToken } from 'src/utils/cookies';
  import AuthApi from 'src/api/auth-api';
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
    created() {
      this.initContentHeight();
      this.initUserInfo();
    },
    methods: {
      ...mapActions('layout',{
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
        getToken();
        AuthApi.getAuthInfo()
          .then(({ data }) => {
            let user = data.data.user;
            setLoginInfo(user);
            getLoginInfo();
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
