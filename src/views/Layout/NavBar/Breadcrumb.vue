<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <router-link v-if="item.meta.title==='首页'" :to="item.redirect||item.path">{{(item.meta.title)}}</router-link>
        <span v-else-if='item.path' class="no-redirect">{{item.meta.title}}</span>
        <span v-else-if='index===levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{(item.meta.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    created() {
      this.getBreadcrumb();
    },
    data() {
      return {
        levelList: null
      };
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      }
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.meta.title);
        const first = matched[0];
        if (first && first.meta.title !== '首页') {
          matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched);
        }
        this.levelList = matched;
      }
    }
  };
</script>

<style scoped>
  .app-breadcrumb.el-breadcrumb {
    transition: all 0.5s;
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
  }

  .app-breadcrumb.el-breadcrumb .no-redirect {
    font-weight: bold;
    color: #727a8e;
    cursor: text;
  }

  .app-breadcrumb {
    color: white !important;
  }

  /*面包屑文字切换效果breadcrumb-xxx*/
  .breadcrumb-enter {
    opacity: 0;
    transform: translateX(-20px);
  }

  .breadcrumb-enter-active {
    transition: all .5s;
  }

  .breadcrumb-leave-active {
    position: absolute;
    transition: all .5s;
  }

  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-move {
    transition: all .5s;
  }
</style>
