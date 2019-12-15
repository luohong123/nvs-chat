<!--
 * @Author: honghong
 * @Date: 2019-11-23 10:17:20
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 11:13:29
 * @Description: 
 * @email: 3300536651@qq.com
 -->
<template>
  <div class="signup">
    <div class="chat-form-main">
      <h3 class="title">聊天室</h3>
      <div class="form-item-control">
        <input type="text" v-model="userName" />
      </div>
      <div class="form-item-control">
        <input type="password" id="signinBtn" v-model="passWord" />
      </div>
      <div class="form-item-control">
        <button
          type="button"
          id="signin"
          class="btn btn-primary btn-block"
          v-on:click="signin"
        >
          登录
        </button>
      </div>
      <div class="form-item-control">
        <button type="button" class="btn btn-block" v-on:click="touristGo">
          游客身份进入
        </button>
      </div>
      <a href="javascript:;" class="link signup-link" v-on:click="signup"
        >快速注册</a
      >
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
import { login } from '@/api/userinfo';
export default {
  name: 'signin',
  data() {
    return {
      userName: '',
      passWord: ''
    };
  },
  methods: {
    signin: function() {
      login({
        userName: this.userName,
        passWord: md5(this.passWord)
      })
        .then(response => {
          if (response.code === '0' && response.data) {
            console.log(response, 'res:登录');
            // 登录成功后可以评论了
            window.localStorage.setItem('userName', response.data.userName);
            window.localStorage.setItem('token', response.token);
            this.$socket.emit('add user',  response.data.userName);
            this.$router.push('/');
          }
          console.log(response, 'response');
        })
        .catch(err => {
          alert('用户名或密码错误');
        });
    },
    touristGo: function() {
      this.$router.push('/');
    },
    signup: function() {
      this.$router.push('/signup');
    },
    signinEnter: function() {
      let input = document.getElementById('signinInput');
      input.addEventListener('keyup', event => {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById('signinBtn').click();
        }
      });
    }
  }
};
</script>

<style>
.signup-link {
  margin-top: 20px;
  float: right;
}
</style>
