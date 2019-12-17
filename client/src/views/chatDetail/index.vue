<template>
<div class="chatDetail">
  <div class="left">
    <div class="searchbar-wrap" v-if="userName && userName !== 'undefined'">
      <searchbar />
      <div class="action-add">
        <a-icon type="plus-square" v-on:click="groupAddModal" />
      </div>
    </div>
    <listitem :list="list" class="left-list" />
  </div>
  <div class="right">
    <headerbar v-bind:title="friendInfo.name" v-on:toggle="toggle" ref="headerbar" :more="friendInfo.type==='QL'" />
    <chat class="chat-wrap" :list="historyChats" />
    <!-- 隐藏区域 -->
    <div class="more-introduce" v-bind:class="{ show: isOpen }">
      <managepanel :group="groupInfo" :list="groupUsers" />
    </div>
  </div>
  <!-- 创建群 -->
  <a-modal title="创建群聊" :visible="groupVisible" @ok="groupInfoAdd" :confirmLoading="groupConfirmLoading" @cancel="groupCancel">
    <div>
      <p>请输入群聊名称</p>
      <a-input v-model="groupName" />
    </div>
  </a-modal>
</div>
</template>

<script>
import chat from "@/components/Chat";
import headerbar from "@/components/HeaderBar";
import listitem from "@/components/ListItem";
import managepanel from "@/components/ManagePanel";
import searchbar from "@/components/SearchBar";
import {
  eventHub
} from "@/utils/event-bus.js";
import {
  getGuid,
  getUserName,
  getTime,
  getTimeS,
  debounce,
  showDeskTopNotice,
  getUserInfoByName
} from "@/utils";
import {
  messageList,
  offlineList,
  getGroupInfoById,
  groupInfoCreate,
  getGroupUser,
  messageCreate
} from "@/api/chat";
import {
  historyList
} from "@/api/history";
import {
  searchUserInfo
} from "@/api/userinfo";
export default {
  name: "chatDetail",
  components: {
    chat,
    headerbar,
    listitem,
    managepanel,
    searchbar
  },
  data() {
    return {
      title: "",
      historyChats: [],
      userName: getUserName(),
      newUser: "",
      online: 0,
      leaveUser: "",
      count: 0,
      connected: false,
      userInfo: {},
      friendInfo: {}, // 接收人信息
      list: [],
      chatContent: {},
      groupName: "",
      groupUsers: [], // 群成员
      groupInfo: {},
      groupVisible: false,
      groupConfirmLoading: false,
      isOpen: false // 是否展开
    };
  },
  computed: {},
  watch: {},
  mounted() {
    let self = this;
    //  this.$socket.on 的原因引起多次触发
    // 解决方法: https://github.com/this.$socketio/this.$socket.io/issues/474#issuecomment-2833227
    // https://groups.google.com/forum/?hl=en&fromgroups#!topic/this.$socket_io/X9FRMjCkPco
    this.$socket.on("reconnecting", () => {
      console.log("已经连接");
      // 获取用户信息
      getUserInfoByName().then(result => {
        if (result) {
          this.userInfo = result;
          this.$socket.emit("add user", result.USERNAME);
        }
      });
    });
    getUserInfoByName().then(result => {
      if (result) {
        this.userInfo = result;
        this.$socket.emit("add user", result.USERNAME);
      }
    });
    // 接收广播的消息 群聊
    this.$socket.on("new message", data => {
      let title = `${data.message.FROMUSERID}对大家说:`;
      let msg = `${data.message.CONTENT}`;
      let icon = data.message["AVATAR"];
      let message = {
        MESSAGEID: data.message.MESSAGEID,
        GROUPID: data.message.GROUPID,
        FROMUSERID: data.message.USERID,
        TOUSERID: data.message.TOUSERID,
        CONTENT: data.message.CONTENT,
        TIME: data.message.TIME,
        TS: data.message.TS,
        AVATAR: data.message.AVATAR,
        USERNAME: data.message.USERNAME
      };
      // 刷新消息列表
      this.getMessageList();
      // 刷新历史消息
      if (message.GROUPID === this.groupInfo.GROUPID) {
        self.historyChats.push(message);
      }
      showDeskTopNotice(title, icon, msg);
      setTimeout(() => {
        this.scrollTop();
      }, 50);
    });
    // 接收到私聊
    this.$socket.on("private", data => {
      let title = `${data.message.FROMUSERID}对大家说:`;
      let msg = `${data.message.CONTENT}`;
      let icon = data.message["AVATAR"];
      let message = {
        MESSAGEID: data.message.MESSAGEID,
        GROUPID: data.message.GROUPID,
        FROMUSERID: data.message.FROMUSERID,
        TOUSERID: data.message.TOUSERID,
        CONTENT: data.message.CONTENT,
        TIME: data.message.TIME,
        TS: data.message.TS,
        AVATAR: data.message.AVATAR,
        USERNAME: data.message.USERNAME
      };
      // 刷新消息列表
      this.getMessageList();
      // 刷新历史消息
      if (
        message.GROUPID === "" &&
        message.FROMUSERID === self.friendInfo.otherpartid
      ) {
        self.historyChats.push(message);
        // showDeskTopNotice(title, icon, msg);
        setTimeout(() => {
          self.scrollTop();
        }, 50);
      }
    });
    // 发送群消息
    eventHub.$on("send", this.addChatMessage);
    // 用户正在输入
    eventHub.$on("watchinput", this.watchInput);
    eventHub.$on("toggle", this.toggle);
    // 切换历史记录消息
    eventHub.$on("change", this.changeHistroy);
    // 发起聊天
    eventHub.$on("confirmchat", this.startChat);
    // 初始化消息列表
    this.getMessageList();
  },
  created: function () {
    // 点击其他区域关闭面板
    document.addEventListener("click", e => {
      let box = document.querySelector(".toggle");
      let c1 = document.querySelector(".ManagePanel");
      if (box && !box.contains(e.target)) {
        this.isOpen = false;
      }
      if (c1 && c1.contains(e.target)) {
        this.isOpen = true;
      }
    });
  },
  beforeDestroy() {
    // 注意：注册的 Bus 要在组件销毁时卸载，否则会多次挂载，造成触发一次但多个响应的情况。
  },
  methods: {
    /**
     * 用户输入中
     */
    watchInput: function (message) {
      console.log(message, "用户正在输入中");
    },
    // 新增群组弹窗
    groupAddModal: function () {
      this.groupVisible = true;
    },
    // 创建新群
    groupInfoAdd: function () {
      this.groupInfo = {
        GROUPID: "",
        GROUPNAME: this.groupName,
        GROUPREMARK: "",
        CREATEUSERID: this.userInfo.USERID,
        CREATETIME: getTime("yyyy-MM-dd hh:mm:ss"),
        DISSOLUTIONTIME: "",
        GROUPSTATE: "0"
      };
      groupInfoCreate({
        groupInfo: this.groupInfo
      }).then(response => {
        if (response.code === "0") {
          this.$message.info(response.message);
          this.groupVisible = false;
        }
      });
    },
    // 隐藏群组弹窗
    groupCancel(e) {
      this.groupVisible = false;
    },
    // 点击消息列表切换历史记录
    changeHistroy(item) {
      this.friendInfo = item;
      // 群信息
      // 历史记录
      historyList(item).then(result => {
        if (result.code === "0") {
          this.historyChats = result["data"];
          setTimeout(() => {
            this.scrollTop();
          }, 0);
        }
      });
      // 群用户
      if (item.type === "QL") {
        getGroupInfoById(item.otherpartid).then(result => {
          if (result.code === "0") {
            this.groupInfo = result.data;
            this.title = result.data.GROUPNAME;
          }
        });
        getGroupUser(item.otherpartid).then(result => {
          if (result.code === "0") {
            this.groupUsers = result.data;
          }
        });
      } else {
        this.groupInfo.GROUPID = "";
        searchUserInfo({
          USERNAME: '',
          USERID: item.otherpartid
        }).then(res => {
          if (res.code === "0") {
            self.title = res.data.USERNAME;
          }
        });
      }
    },
    getMessageList: function () {
      getUserInfoByName().then(result => {
        let userId = result ? result["USERID"] : null;
        // 获取用户信息
        getUserInfoByName().then(result => {
          if (result) {
            this.$socket.emit("add user", result.USERNAME);
          }
        });
        messageList(userId)
          .then(response => {
            if (response.code === "0") {
              let _list = response["data"];
              let messages = [];
              offlineList(userId).then(offlines => {
                for (let i = 0; i < _list.length; i++) {
                  messages.push({
                    type: _list[i].type,
                    messageid: _list[i].messageid,
                    name: _list[i].name,
                    avatar: _list[i].avatar,
                    content: _list[i].content,
                    time: _list[i].time,
                    ts: _list[i].ts,
                    otherpartid: _list[i].otherpartid,
                    offlinescount: 0
                  });
                }
                // for (let i = 0; i < _list.length; i++) {
                //   for (let j = 0; j < offlines.length; j++) {
                //     if (_list[i].otherpartid === offlines[j].otherpartid) {
                //       this.list[i].offlinescount = offlines[j].messagecount
                //     }
                //   }
                // }
                // 查询每个消息列表的未读消息(保存在offline表中的离线消息)分别为多少条
                this.list = messages;;
                if (this.count === 0) {
                  this.changeHistroy(this.list[0]);
                  this.count++;
                }
              });
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    toggle: function () {
      this.isOpen = !this.isOpen;
      document.body.removeEventListener("click", this.toggle);
    },
    scrollTop: function () {
      this.chatContent = document.querySelector(".message-list");
      this.chatContent.scrollTop = this.chatContent.scrollHeight;
    },
    /**
     * 开始发起聊天-私聊
     */
    startChat: function (item) {
      let message = {
        MESSAGEID: "",
        GROUPID: "",
        FROMUSERID: this.userInfo.USERID,
        TOUSERID: item.USERID,
        CONTENT: "",
        TIME: getTime("yyyy-MM-dd hh:mm"),
        TS: ""
      };
      messageCreate(message).then(result => {
        if (result.code === "0") {
          // 刷新消息列表
          this.messageList();
          console.log("发起聊天成功");
        }
      });
    },
    /**
     * 新增一条消息
     */
    addChatMessage: function (data) {
      if (data) {
        // eventHub被多次触发、次数累加, 尤大回复：https://github.com/vuejs/vue/issues/3399
        // https://github.com/Pasoul/blog/issues/12
        let message = {
          MESSAGEID: getGuid(),
          GROUPID: this.groupInfo.GROUPID,
          FROMUSERID: this.userInfo.USERID,
          TOUSERID: "",
          CONTENT: data.message,
          TIME: getTime("yyyy-MM-dd hh:mm"),
          TS: getTimeS(),
          AVATAR: this.userInfo.AVATAR,
          USERNAME: this.userInfo.USERNAME
        };
        // 群发
        if (this.groupInfo.GROUPID !== "") {
          this.historyChats.push(message);
          this.$socket.emit("new message", message);
        } else {
          // 私发
          message.TOUSERID = this.friendInfo.otherpartid;
          // 刷新历史消息
          if (
            message.GROUPID === "" &&
            (message.FROMUSERID === this.userInfo.USERID ||
              message.TOUSERID === this.userInfo.USERID)
          ) {
            this.historyChats.push(message);
            this.$socket.emit("private", message);
            setTimeout(() => {
              this.scrollTop();
            }, 50);
          }
        }
      }
    }
  }
};
</script>

<style>
.chatDetail {
  position: relative;
  background: #f5f5f5;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.left {
  width: 250px;
  height: 100%;
  background: #edeae8;
  display: flex;
  flex-direction: column;
}

.left .searchbar-wrap {
  padding: 10px;
}

.left .searchbar-wrap::after {
  content: "";
  display: block;
  clear: both;
}

.left .searchbar {
  width: calc(100% - 40px);
  float: left;
}

.left .action-add {
  width: 26px;
  float: right;
}

.left-list {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.left-list::-webkit-scrollbar {
  width: 0;
}

.left-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.left-list::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.right {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.right .chat-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-subtitle {
  height: 32px;
  line-height: 32px;
}

.more-introduce {
  width: 250px;
  height: calc(100% - 50px);
  position: absolute;
  background: #fff;
  top: 50px;
  right: -250px;
  visibility: hidden;
  transition: all 0.2s ease-in;
}

.more-introduce.show {
  right: 0;
  visibility: visible;
}
</style>
