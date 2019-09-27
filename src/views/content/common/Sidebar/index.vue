<template>
  <el-menu mode="vertical" class="el-menu-vertical-demo" router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#409EFF">
    <sidebar-item :routes="sideNavigation"></sidebar-item>
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
        sideNavigation: JSON.parse(JSON.stringify(routes)),
        activeIndex: ''
      };
    },
    created() {
      let loginInfo = getLoginInfo();
      if (loginInfo !== undefined && loginInfo !== null && loginInfo.length > 0) {
        const sideBarData = JSON.parse(loginInfo).user.permissionValueList;
        sideBarData.forEach((infoItem) => {
          this.sideNavigation.forEach((treeItem) => {
            if (sideBarData.indexOf('[ADMIN]') !== -1) {
              treeItem.state = true;
              if (treeItem.children !== undefined) {
                treeItem.children.forEach((treeSecItem) => {
                  treeSecItem.state = true;
                });
              }
              return;
            }
            if (treeItem.children !== undefined) {
              treeItem.children.forEach((treeSecItem) => {
                if (treeSecItem.meta.value === infoItem.toString()) {
                  treeSecItem.state = true;
                  treeItem.state = true;
                }
              });
              return;
            }
            if (treeItem.meta.value === infoItem.toString()) {
              treeItem.state = true;
            }
          });
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
