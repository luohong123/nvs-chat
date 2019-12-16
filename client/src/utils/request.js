/*
 * @Author: honghong
 * @Date: 2019-11-30 10:03:17
 * @LastEditors: honghong
 * @LastEditTime: 2019-12-15 11:05:14
 * @Description:
 * @email: 3300536651@qq.com
 */
import axios from 'axios';
// eslint-disable-next-line no-console
// create an axios instance
console.log(process.env.VUE_APP_BASE_API,' process.env.VUE_APP_BASE_API')
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});


// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token = window.localStorage.getItem('token');
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = token;
    }
    return config;
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // 自定义返回码 0 表示成功
    if (res.code !== '0') {
      // eslint-disable-next-line no-console
      console.log(res.message || 'Error');
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    alert('err' + error); // for debug
    return Promise.reject(error);
  }
);

export default service;