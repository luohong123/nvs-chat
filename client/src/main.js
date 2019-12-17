/*
 * @Author: honghong
 * @Date: 2019-12-15 10:53:31
 * @LastEditors: honghong
 * @LastEditTime: 2019-12-15 11:00:35
 * @Description:
 * @email: 3300536651@qq.com
 */
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
Vue.use(Antd);

import App from './App.vue';
import '@/styles/resets.css';
import '@/styles/global.css';
import '@/assets/fonts/ali_icon/iconfont.css';
import io from 'socket.io-client';
import { devEnvironment } from '../environments/enviroment.dev';
import { prodEnvironment } from '../environments/enviroment.prod';
const isDev = process.env.NODE_ENV === 'development';
const ip = isDev ? devEnvironment.apiurl : prodEnvironment.apiurl;
Vue.prototype.$socket = io(ip);
Vue.config.productionTip = false;
import axios from 'axios';
Vue.prototype.$http = axios;
// // 本地用户信息
// Vue.prototype.userInfo = {
//   id: 'adfasf'
// };
import router from './router';
new Vue({
  render: h => h(App),
  router
}).$mount('#app');
