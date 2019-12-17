/*
 * @Author: honghong
 * @Date: 2019-11-19 19:38:43
 * @LastEditors: honghong
 * @LastEditTime: 2019-12-15 11:08:26
 * @Description:
 * @email: 3300536651@qq.com
 */
import {
  searchUserInfo
} from '@/api/userinfo';
/**
 * 获取guid
 */
export function getGuid() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
/**
 * 获取当前时间戳
 */
export function getTimeS() {
  return new Date().valueOf(); //获取当前毫秒的时间戳，准确！
}

/**
 * 获取当前时间
 */
export function getTime(format) {
  let date = new Date();
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return format;
}

export function getUserName() {
  let userName = window.localStorage.getItem('userName');
  // eslint-disable-next-line no-console
  console.log(userName, 'userName');
  return userName ? userName : null;
}
/**
 * 防抖
 * @param {*} fn
 * @param {*} wait
 */
export function debounce(fn, wait) {
  var timeout = null;
  return function () {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
}
/**
 * 桌面消息提醒
 * @param {*} title
 * @param {*} msg
 */
export function showDeskTopNotice(title, icon, msg) {
  let Notification =
    window.Notification || window.mozNotification || window.webkitNotification;
  // eslint-disable-next-line no-console
  console.dir(Notification, 'Notification');
  if (Notification) {
    Notification.requestPermission(status => {
      //status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知,'granted' 意味着用户同意启用通知
      if ('granted' != status) {
        return;
      } else {
        let tag = 'sds' + Math.random();
        let notify = new Notification(title, {
          dir: 'auto',
          lang: 'zh-CN',
          tag: tag, //实例化的notification的id
          icon: icon, //通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
          body: msg //通知的具体内容
        });
        (notify.onclick = () => {
          //如果通知消息被点击,通知窗口将被激活
          window.focus();
        }),
          (notify.onerror = () => {
            // eslint-disable-next-line no-console
            console.log('HTML5桌面消息出错！！！');
          });
        notify.onshow = () => {
          // eslint-disable-next-line no-console
          console.log('msg', '桌面消息');
          setTimeout(() => {
            notify.close();
          }, 2000);
        };
        notify.onclose = () => {
          // eslint-disable-next-line no-console
          console.log('HTML5桌面消息关闭！！！');
        };
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('您的浏览器不支持桌面消息');
  }
}

export function getToken() {
  return window.localStorage.getItem('token');
}
/**
 * 根据userName查询用户信息
 */
export function getUserInfoByName() {
  let userName = window.localStorage.getItem('userName');
  return new Promise((resolve, reject) => {
    searchUserInfo({
      USERNAME: userName,
      USERID: ''
    }).then(response => {
      if (response&&response.code === '0') {
        let userInfo = response['data'];
        return resolve(userInfo);
      } else {
        return reject(response);
      }
    });
  });
}
/**
 * 根据id查询用户信息
 * @param {*} userId 
 */
export function getUserInfoById(userId) {
  return new Promise((resolve, reject) => {
    searchUserInfo({
      USERNAME: '',
      USERID: userId
    }).then(response => {
      if (response.code === '0') {
        let userInfo = response['data'];
        return resolve(userInfo);
      } else {
        return reject(response);
      }
    });
  });
}