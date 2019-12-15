<template>
  <div class="ManagePanel">
    <div class="header">
      <searchbar v-on:search="search" />
    </div>
    <div class="content">
      <div class="contacts">
        <div class="contacts-list-wrap">
          <ul class="contacts-list">
            <!-- <div class="contacts-list-item action">
            <span class="action-icon"> <i class="icon iconfont icon-jia"></i></span>
            <span class="text">添加</span>
          </div> -->
            <h5>在线用户 {{ onlineUsers }} 人</h5>
            <li
              class="contacts-list-item"
              v-for="item in list"
              v-bind:key="item.ID"
              @click="startChat(item)"
            >
              <span
                class="circle"
                v-bind:class="{ active: item.ONLINESTATE === 'Y' }"
              >
              </span>
              <img :src="item.AVATAR" alt="" />
              <span class="text" :title="item.USERNAME">{{
                item.USERNAME
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="manage-setting">
        <span class="title">群名</span>
        <div class="setting-item">
          <span contentEditable="true" class="text">{{ group.GROUPNAME }}</span>
          <i class="icon iconfont icon-xiugai"></i>
        </div>
      </div>
      <div class="manage-setting">
        <span class="title">群公告</span>
        <div class="setting-item">
          <span contentEditable="true" class="text">{{
            group.GROUPREMARK
          }}</span>
          <i class="icon iconfont icon-xiugai"></i>
        </div>
      </div>
      <div class="manage-setting">
        <span class="title">我在本群的昵称</span>
        <div class="setting-item">
          <span contentEditable="true" class="text">{{ userName }}</span>
          <i class="icon iconfont icon-xiugai"></i>
        </div>
      </div>
      <div class="control">
        <a class="btn-opacity btn-delete" v-on:click="deleteExit">删除并退出</a>
      </div>
    </div>
    <!-- 发起聊天 -->
    <div>
      <a-modal title="" v-model="chatVisible" :footer="null" width="300px">
        <div class="startchat">
          <img :src="chatInfo.AVATAR" width="60" height="60" alt="" />
          <p>
            <span>{{ chatInfo.USERNAME }}</span>
          </p>
          <div style="width: 100%;">
            <a-button type="primary" v-on:click="confirmChat" block
              >发起聊天</a-button
            >
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import searchbar from '@/components/SearchBar';
import { getUserName } from '@/utils';
import { eventHub } from '@/utils/event-bus';
export default {
  name: 'ManagePanel',
  components: {
    searchbar
  },
  props: ['list', 'group'],
  data() {
    return {
      userName: getUserName(),
      chatVisible: false, // 发起聊天弹窗
      chatInfo: {} // 发起聊天的用户信息
    };
  },
  computed: {
    onlineUsers: function() {
      let res = this.list.filter(item => {
        return item.ONLINESTATE === 'Y';
      });
      return res.length;
    }
  },
  // 根据群成员的USERID 去查找用户信息表对应的用户在线状态,就可以判断在线人数
  methods: {
    search: function() {},
    // 退出群组
    deleteExit: function() {
      eventHub.$emit('exitGroup');
    },
    // 发起聊天
    startChat: function(userInfo) {
      if (userInfo.USERNAME === this.userName) {
        alert('不能向自己发起聊天');
      } else {
        this.chatVisible = true;
        this.chatInfo = userInfo;
      }
    },
    confirmChat: function() {
      this.chatVisible = false;
      eventHub.$emit('confirmchat', this.chatInfo);
    }
  }
};
</script>

<style>
.ManagePanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 25px 25px 0;
}

.ManagePanel .searchbar {
  width: 200px;
}

.ManagePanel .content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.ManagePanel .contacts {
  padding: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}

.ManagePanel .action-icon {
  width: 36px;
  height: 36px;
  line-height: 36px;
  display: block;
  text-align: center;
  border: 1px solid #ccc;
  box-sizing: border-box;
  color: #ccc;
  border-radius: 2px;
}

.action:hover .action-icon {
  color: #000;
}
.contacts-list-item {
  position: relative;
}
.contacts-list-item .text {
  width: 100%;
  text-align: center;
  display: block;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
  position: absolute;
  right: -2px;
  top: -2px;
  background: gray;
}
.circle.active {
  background: green;
}
.contacts-list-wrap {
  width: 100%;
}

.contacts-list {
  width: 100%;
  border-bottom: 1px solid #ccc;
}

.contacts-list::after {
  content: '';
  display: block;
  clear: both;
}

.contacts-list-item {
  width: 36px;
  margin-bottom: 15px;
  cursor: pointer;
  margin-right: 17px;
  float: left;
}

.contacts-list-item:nth-child(4n + 0) {
  margin-right: 0;
}

.contacts-list-item img {
  width: 36px;
  height: 36px;
  border-radius: 2px;
}

.manage-setting {
  padding: 0 25px;
  margin-bottom: 20px;
}

.manage-setting .title {
  color: #ddd;
}

.manage-setting .text {
  display: inline-block;
  font-size: 12px;
  color: #000;
  background-color: #ffffff;
  padding: 2px 8px 2px 4px;
  max-width: 100%;
}

.manage-setting .setting-item {
  color: #000;
  margin-top: 10px;
  cursor: pointer;
}

.manage-setting .setting-item .iconfont {
  visibility: hidden;
}

.manage-setting .setting-item:hover .iconfont {
  visibility: visible;
}

.control {
  width: 100%;
  padding: 0px 25px;
  box-sizing: border-box;
}

.btn-delete {
  width: 100%;
  padding: 25px 0;
  text-align: center;
  display: block;
  font-size: 16px;
  cursor: pointer;
  color: red;
  border-top: 1px solid #ccc;
}
.startchat {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
