<template>
  <div>
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <el-submenu v-if="!item.meta.hidden&&item.children !== undefined && item.state === true" :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <img v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon" height="20px" alt="" :src="item.meta.icon"/>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>
        <template  v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
          <el-menu-item v-if="!child.meta.hidden && child.state === true" :index="child.path.indexOf('/')===0?child.path: item.path+'/'+child.path">
            <img v-if="child.meta&&child.meta.icon" :src="child.meta.icon" height="20px" alt=""/>
            <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
          </el-menu-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    },
    methods: {}
  };
</script>

