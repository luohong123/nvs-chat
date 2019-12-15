<!--
 * @Author: honghong
 * @Date: 2019-11-23 10:17:20
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-23 10:46:21
 * @Description: 
 * @email: 3300536651@qq.com
 -->
<template>
  <div class="chat">
    <ul class="message-list">
      <li v-for="item in list" v-bind:key="item.MESSAGEID" class="chat-item">
        <p class="time-show">
          <span class="time">{{ item.TIME }}</span>
        </p>
        <div class="chat-conversation them" v-if="item.USERNAME !== userName">
          <img :src="item.AVATAR" class="avatar" alt />
          <div class="chat-message">
            <span class="chat-user">{{ item.USERNAME }}</span>
            <div class="chat-popover">{{ item.CONTENT }}</div>
          </div>
        </div>
        <div class="chat-conversation me" v-if="item.USERNAME === userName">
          <div class="chat-message">
            <div class="chat-popover">{{ item.CONTENT }}</div>
          </div>
          <img :src="item.AVATAR" class="avatar" alt />
        </div>
      </li>
    </ul>
    <div v-if="userName && userName !== 'undefined'" class="sendMessage">
      <div class="message-toolbar">
        <div class="message-toolbar-left"></div>
        <div class="message-toolbar-left"></div>
      </div>
      <textarea
        class="message-control"
        v-model="message"
        v-on:input="watchInput"
        rows="3"
        cols="20"
        v-on:keyup.enter="sendMessage"
      >
      </textarea>
      <div class="send-control">
        <div class="popover" v-if="showTips">
          <div class="tips">{{ tips }}</div>
        </div>
        <button type="submit" class="btn btn-primary" v-on:click="sendMessage">
          发送(S)
        </button>
      </div>
    </div>
    <div v-if="!userName || userName === 'undefined'" class="dontSend">
      您现在是游客身份,请<a class="link" v-on:click="sigin">登录</a
      >后一起参与讨论吧！
    </div>
  </div>
</template>

<script>
import { getUserName, getGuid, debounce, getUserInfoByName } from '@/utils';
import { eventHub } from '@/utils/event-bus.js';
export default {
  name: 'Chat',
  props: {
    list: Array
  },
  data() {
    return {
      userInfo: getUserInfoByName(),
      userName: getUserName(),
      chatContent: {},
      message: '',
      tips: '不能发送空白消息',
      showTips: false
    };
  },
  mounted() {},
  created() {
    setTimeout(() => {
      this.scrollTop();
    }, 50);
  },
  methods: {
    sigin: function() {
      this.$router.push('/signin');
    },
    sendMessage: function() {
      console.log(this.message == true, 'this.message ===');
      if (this.message.match(/^\s*$/)) {
        this.showTips = true;
        setTimeout(() => {
          this.showTips = false;
        }, 3000);
      } else {
        eventHub.$emit('send', {
          message: this.message
        });
        // 解决滚动条不能完全滚到底部的问题
        setTimeout(() => {
          this.scrollTop();
          this.message = '';
          this.showTips = false;
        }, 50);
      }
    },
    watchInput:function() {
      eventHub.$emit('watchinput', {
          message: this.message
        });
    },
    scrollTop: function() {
      this.chatContent = document.querySelector('.message-list');
      this.chatContent.scrollTop = this.chatContent.scrollHeight;
    }
  }
};
</script>

<style>
.chat {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}

.message-list {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 15px;
}

.chat-item {
  margin-top: 30px;
  padding: 0 20px;
}

.chat-item:first-child {
  margin-top: 0px;
  margin-top: 10px;
}

.chat-item-me {
  justify-content: flex-end;
}

.chat-item .time-show {
  text-align: center;
}

.chat-item .time {
  background: #dadada;
  color: #fff;
  font-size: 12px;
  text-align: center;
  padding: 1px 8px;
  border-radius: 2px;
}

.chat-item .avatar {
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin-right: 10px;
}

.me .avatar {
  margin-left: 10px;
}

.them .avatar {
  margin-right: 10px;
}

.chat-conversation {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}

.me {
  justify-content: flex-end;
}

.chat-message {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.them .chat-message {
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
}

.chat-user {
  color: #ccc;
  font-size: 12px;
  margin-bottom: 5px;
}

.chat-popover {
  background: #fff;
  padding: 9px 10px;
  border-radius: 4px;
  min-width: 100px;
  border: 1px solid #ccc;
  position: relative;
  max-width: 70%;
  user-select: text;
  word-break: break-word;
  cursor: text;
}

.me .chat-popover {
  background: #9eea6a;
  color: #fff;
  border: 0.5px solid #9eea6a;
}

.me .chat-popover::after {
  content: '';
  width: 0;
  height: 0;
  display: block;
  border-top: 8px solid transparent;
  border-left: 8px solid #9eea6a;
  border-bottom: 8px solid transparent;
  position: absolute;
  right: -7px;
  top: 9px;
}

.me .chat-popover:hover {
  background: #8bdb56;
}

.me .chat-popover:hover::after {
  border-left: 8px solid #8bdb56;
}

.them .chat-popover::before {
  content: '';
  width: 8px;
  height: 8px;
  display: block;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #fff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  left: -5px;
  top: 8px;
}

.them .chat-popover:hover {
  background: #f6f6f6;
}

.them .chat-popover:hover::before {
  background: #f6f6f6;
}

/* 发送消息 */
.sendMessage {
  width: 100%;
  height: 150px;
  padding: 10px 30px;
  border-top: 1px solid #ececec;
  background: #fff;
  box-sizing: border-box;
  /* display: flex; */
  /* margin-top: 20px; */
}

.message-toolbar {
}

.message-control {
  border: 0;
  outline: none;
  overflow: auto;
  resize: none;
  width: 100%;
}

.send-control {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: right;
  position: absolute;
  left: 0;
  bottom: 10px;
}

.send-control .btn {
  background: #f5f5f5;
  color: #606060;
  border: 1px solid #e5e5e5;
  margin-right: 30px;
  font-weight: normal;
  font-size: 12px;
  transform: scale(0.9);
}

.send-control .btn:hover {
  background: #09bb07;
  color: #fff;
  border: 1px solid #09bb07;
}

.popover {
  position: absolute;
  right: 0px;
  bottom: 40px;
}

.popover .tips {
  padding: 0px 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
  color: #000;
  font-size: 12px;
  transform: scale(0.8);
  position: relative;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
}

.popover .tips::after {
  content: '';
  width: 12px;
  height: 12px;
  border-left: 1px solid #ccc;
  position: absolute;
  border-bottom: 1px solid #ccc;
  bottom: -7px;
  right: 30px;
  -webkit-transform: rotate(90deg);
  transform: rotate(-45deg);
  background: #fff;
  z-index: 100;
}

.dontSend {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #77d376;
  color: #000;
}
</style>
