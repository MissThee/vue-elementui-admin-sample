<template>
  <el-menu mode="vertical" class="el-menu-vertical-demo" router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#409EFF">
    <side-bar-item  ref="MenuItem"/>
  </el-menu>
</template>

<script>
  import SideBarItem from './SideBarItem';

  import routes from 'src/router/routes';

  export default {
    name:'SideBar',
    components: { SideBarItem },
    data() {
      return {
        sideNavigationRoutes: JSON.parse(JSON.stringify(routes)),
      };
    },

    methods: {
      initSideBar(permissionValueList) {
        //获取用户信息
        this.setStateForSideNavigationRoutes(this.sideNavigationRoutes, permissionValueList);
        console.log(this.sideNavigationRoutes)
        this.$refs.MenuItem.initMenu(this.sideNavigationRoutes);
      },
      //为侧边栏菜单设置state属性，控制显示或隐藏
      setStateForSideNavigationRoutes(routes, sideBarPermissionValueList) {
        routes.forEach((route) => {
          //有[ADMIN]权限时，认定为管理员，显示所有菜单
          if (sideBarPermissionValueList.indexOf('[ADMIN]') >= 0 || route.meta && sideBarPermissionValueList.indexOf(route.meta.value) >= 0) {
            route.state = true;
          }
          if (route.children) {
            this.setStateForSideNavigationRoutes(route.children,sideBarPermissionValueList);
          }
        });
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
