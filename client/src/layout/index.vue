<template>
<div class="layout">
  <!-- <div class="tips" v-if="!isLogin || !userName">
    <p class="tourist">
      您现在是
      <span class="error">游客 </span>,请
      <a class="link" v-on:click="sigin"> 登录 </a> 后一起聊天吧!
    </p>
  </div> -->
  <div class="container">
    <nav class="nav">
      <tabbar v-bind:tabs="tabs" />
    </nav>
    <transition :name="transitionName">
      <!-- <RouterView class="Router main" /> -->
      <router-view class="Router main"></router-view>
    </transition>
  </div>
</div>
</template>

<script>
import tabbar from '@/components/TabBar';
import {
  getToken,
  getUserInfoByName
} from '@/utils/index';
export default {
  name: 'Layout',
  components: {
    tabbar
  },
  data: function () {
    return {
      isLogin: getToken(),
      userName: getUserInfoByName().userName,
      transitionName: 'slideleft',
      tabs: [{
          id: 1,
          name: '聊天',
          icon: 'icon-xiaoxi',
          activeIcon: 'home-active',
          router: '/'
        },
        {
          id: 2,
          name: '群组',
          icon: 'icon-tongxunlu',
          activeIcon: 'message-active',
          router: '/addresslist'
        },
        {
          id: 3,
          name: '收藏',
          icon: 'icon-shoucang',
          activeIcon: 'profile-active',
          router: '/collection'
        },
        {
          id: 4,
          name: '文件夹',
          icon: 'icon-wenjianjia',
          activeIcon: 'profile-active',
          router: '/folder'
        }
      ]
    }
  },
  mounted() {},
  watch: {
    $route() {
      // 监听路由变化重新赋值
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
  },
  methods: {
   
  }
}
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url('http://bimgs.plmeizi.com/images/bing/2019/OHR.HidingEggs_ZH-CN2732414254_1920x1080.jpg');
  background-position: center;
  background-repeat: no-repeat;
}

.container {
  width: 750px;
  height: 500px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.9);
  opacity: 0.95;
}

.container:hover {
  box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.8);
}

.nav {
  width: 60px;
  height: 100%;
}

.main {
  border: 1px solid #ccc;
  border-left: none;
  flex: 1;
}

.tips {
  position: absolute;
  top: 20px;
  right: 20px;
  background: ivory;
}
</style>
