/*
 * @Author: honghong
 * @Date: 2019-11-30 09:59:07
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 14:17:31
 * @Description:
 * @email: 3300536651@qq.com
 */
import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from '@/utils/index';
Vue.use(Router);
import Layout from '../layout';
import { getUserName } from '../utils';
const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/', // 首页-tab
          component: () => import('@/views/chatDetail/index')
        },
        {
          path: '/addresslist', // 通讯录
          component: () => import('@/views/addresslist/index')
        },
        {
          path: '/collection', //  收藏
          component: () => import('@/views/collection/index')
        },
        {
          path: '/folder', // 文件夹
          component: () => import('@/views/folder/index')
        },
        {
          path: '/building', // 正在开发中
          component: () => import('@/views/building/index')
        },
        {
          path: '/message', // 消息
          component: () => import('@/views/message/index')
        },
        {
          path: '/profile', // 我的
          component: () => import('@/views/profile/index')
        }
      ]
    },
    {
      path: '/signin', // 登录
      component: () => import('@/views/signin/index')
    },
    {
      path: '/signup', // 注册
      component: () => import('@/views/signup/index')
    }
  ]
});

const whiteList = ['/signin', '/signup', '/']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  //  如果token没有过期,直接跳转到聊天室界面
  if (getToken() && getUserName() && getUserName() !== 'undefined') {
    if (to.path === '/signin') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // 如果token过期,跳转到登录页面,用户可以选择账号密码登录,也可以选择游客身份登录
      next();
    }
  }
});
export default router;
