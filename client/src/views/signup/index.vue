<!--
 * @Author: honghong
 * @Date: 2019-11-23 10:17:20
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 13:36:16
 * @Description: 
 * @email: 3300536651@qq.com
 -->
<template>
<form class="signup">
  <div class="chat-form-main">
    <h3 class="title">聊天室</h3>
    <p class="error">{{ tips }}</p>
    <div class="form-item-control">
      <input type="text" v-model="userName" />
    </div>
    <div class="form-item-control">
      <input type="password" v-model="passWord" />
    </div>
    <div class="form-item-control">
      <button type="button" class="btn btn-primary btn-block" v-on:click="signup">
        注册
      </button>
    </div>
    <a href="javascript:;" class="link signin-link" v-on:click="signin">直接登录</a>
  </div>
</form>
</template>

<script>
import md5 from 'md5';
import {
  register
} from '@/api/userinfo'
export default {
  name: 'signup',
  data() {
    return {
      userName: '',
      passWord: '',
      tips: ''
    }
  },
  methods: {
    signin: function () {
      this.$router.push('/signin')
    },
    signup: function () {
      register({
          userName: this.userName,
          passWord: md5(this.passWord)
        })
        .then(response => {
          if (response.code === '0') {
            // 跳转到上一个页面
            this.$router.push('/signin')
            console.log(response.message)
          } else if (response.code === '-1') {
            this.tips = response.message
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style>
.signin-link {
  margin-top: 20px;
  float: right;
}
</style>
