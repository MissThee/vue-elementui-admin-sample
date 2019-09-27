<template>
    <div style="position: absolute;height: 100%;width: 100%;z-index:2000 " class="background">
      <div class="boxCenter">
        <p class="fontZT">系统登录</p>
        <el-form :model="form" label-width="80px" style="margin-top: 30px;" class="input">
          <el-input v-model="form.username" placeholder="用户名"
                    prefix-icon="Img.User"></el-input>
          <el-input type="password" v-model="form.password" auto-complete="off"
                    @keyup.enter.native="submitForm" placeholder="密码"
                    :prefix-icon="Img.Cipher"
                    style="margin-top: 20px;"></el-input>
          <el-button type="primary" @click="submitForm"
                     style="width: 100%;margin-top: 20px;">登 录
          </el-button>
        </el-form>
      </div>
    </div>
</template>

<script>
  import Img from 'src/assets/img';
  import LoginApi from 'src/api/login-api';
  import { setLoginInfo, setToken } from 'src/utils/cookies';

  export default {
    name: 'Login',
    data() {
      return {
        Img,
        form: {
          username: '',
          password: '',
        },
      };
    },
    methods: {
      submitForm() {
        if (this.form.username.trim() === '') {
          this.$message({
            message: '请输入用户名。',
            type: 'warning',
          });
        } else if (this.form.password.trim() === '') {
          this.$message({
            message: '请输入密码。',
            type: 'warning',
          });
        } else {
          LoginApi.setLogin(this.form)
            .then(({ data: { data, result, msg }, headers }) => {
              if (result) {
                setToken(headers.authorization);
                setLoginInfo(JSON.stringify(data));
                this.$message.success('登录成功');
                this.$router.replace('/home');
              } else {
                this.$message.error(msg);
              }
            });
        }
      },
    },
  };
</script>

<style scoped>
  .background {
    background-color: #2d3a4b;
    background-size: 100% 100%;
  }

  .fontZT {
    color: white;
    font-size: 25px;
  }

  .el-form-item {
    border: 1px solid hsla(0, 0%, 100%, .1);
    background: rgba(0, 0, 0, .1);
    border-radius: 5px;
    color: #ffffff;
  }

  .boxCenter {
    position: relative;
    width: 450px;
    max-width: 100%;
    padding: 190px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .floatUser {
    width: 15px;
    height: 15px;
    float: left;
    position: fixed;
    z-index: 999;
    margin-top: 12px;
    margin-left: 8px;
  }

  .floatCipher {
    width: 15px;
    height: 15px;
    float: left;
    position: fixed;
    z-index: 999;
    margin-top: 31px;
    margin-left: 8px;
  }

  /*切换效果fade-xxx*/
  .suck-in-enter {
    opacity: 0;
    transform:scale(0,0);
  }

  .suck-in-enter-active {
    transition: all .3s;
  }

  .suck-in-leave-active {
    transition: all .3s;
  }

  .suck-in-leave-active {
    opacity: 0;
    transform: scale(0,0);
  }
</style>
