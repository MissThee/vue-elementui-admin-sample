<template>
  <el-menu mode="vertical" class="el-menu-vertical-demo" router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#409EFF">
    <sidebar-item :routes="sideNavigationRoutes"></sidebar-item>
  </el-menu>
</template>

<script>
  import SidebarItem from './SidebarItem';

  import routes from 'src/router/routes';
  import { getLoginInfo } from 'src/utils/cookies';

  export default {
    components: { SidebarItem },
    data() {
      return {
        sideNavigationRoutes: JSON.parse(JSON.stringify(routes)),
        activeIndex: ''
      };
    },
    created() {
      //获取用户信息
      let loginInfo = getLoginInfo();
      //检查用户信息不为空时，执行侧边栏菜单过滤方法
      if (loginInfo !== undefined && loginInfo !== null && loginInfo.length > 0) {
        const sideBarPermissionValueList = JSON.parse(loginInfo).user.permissionValueList;
        this.setStateForSideNavigationRoutes(this.sideNavigationRoutes, sideBarPermissionValueList);
      }
    },
    methods: {
      //为侧边栏菜单设置state属性，控制显示或隐藏
      setStateForSideNavigationRoutes(routes, sideBarPermissionValueList) {
        routes.forEach((route) => {
          //有[ADMIN]权限时，认定为管理员，显示所有菜单
          if (sideBarPermissionValueList.indexOf('[ADMIN]') > 0 || route.meta && sideBarPermissionValueList.indexOf(route.meta.value) > 0) {
            route.state = true;
          }
          if (route.children) {
            this.setStateForSideNavigationRoutes(route.children,sideBarPermissionValueList);
          }
        });
      }
    },
    watch: {
      $router() {
        let matched = this.$route.matched.filter(item => item.meta.title);
        this.activeIndex = matched.pop();
      }
    },
  };
</script>
<style scoped>
  /deep/ .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
  }

  /deep/ .el-menu--collapse {
    width: 40px;
  }

</style>
