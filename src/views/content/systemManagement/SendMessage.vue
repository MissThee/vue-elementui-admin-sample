<template>
  <div>
    <el-form inline style="width: 400px;padding: 30px" label-width="80px">
      <el-form-item label="">
        <span>一个简陋的socket.io广播测试页，您可尝试在多个页签或多个浏览器登录账号（一个账号可同时登录多处，并没有限制），在此发送广播消息，所有的页面都会弹出广播消息</span>
      </el-form-item>

      <el-form-item label="广播">
        <el-input v-model="message"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="sendHandler">发送广播</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SendMessage',
    data() {
      return {
        message: '',
      };
    },
    methods: {
      sendHandler() {
        this.$socket.emit('broadcast', { 'content': '广播消息', 'msg': this.message });
      }
    }
  };
</script>

<style scoped>

</style>
