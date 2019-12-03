<template>
  <div>
    <template v-for="item in routes">
      <el-submenu v-if="!item.meta.hidden && item.state" :index="item.path.indexOf('/')===0?item.path: item.path+'/'+item.path" :key="item.path">
        <template slot="title">
          <img :src="getIcon(item)" height="20px" alt=""/>
          <span>{{getTitle(item)}}</span>
        </template>
        <template v-for="itemChild in item.children" v-if="!itemChild.hidden">
          <side-bar-item v-if="itemChild.children" :routes="[itemChild]"></side-bar-item>
          <el-menu-item v-if="!itemChild.meta.hidden && !itemChild.children && itemChild.state" :index="itemChild.path.indexOf('/')===0?itemChild.path: item.path+'/'+itemChild.path">
            <img :src="getIcon(itemChild)" height="20px" alt=""/>
            <span>{{getTitle(itemChild)}}</span>
          </el-menu-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>

  export default {
    name: 'SideBarItem',
    data() {
      return { routes: [] };
    },
    methods: {
      initMenu(routes) {
        this.routes = routes;
      },
      getIcon(item) {
        if (item) {
          if (item.meta) {
            return item.meta.icon;
          }
        }
      },
      getTitle(item) {
        if (item) {
          if (item.meta) {
            return item.meta.title;
          }
        }
      }
    }
  };
</script>

