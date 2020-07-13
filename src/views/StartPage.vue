<template>
  <div>
    <!--    空页面，用于在用户打开平台时，判断是直接跳转到首页，还是跳转到登录页面-->
    <!--    如果在login页做这些判断，跳转到home页，会有一半过渡动画闪过-->
  </div>
</template>

<script>
  import * as Cookies from 'src/utils/cookies';

  export default {
    name: 'StartPage',
    created() {
      if (Cookies.getToken()) {
        this.$router.replace('/home');
      } else {
        this.$router.replace('/login');
      }
    }
  };
</script>

<style scoped>

</style>
