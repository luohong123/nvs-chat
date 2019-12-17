/*
 * @Author: honghong
 * @Date: 2019-11-30 09:59:07
 * @LastEditors: honghong
 * @LastEditTime: 2019-12-15 10:58:55
 * @Description:
 * @email: 3300536651@qq.com
 */
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
// 解析body字段模块,post请求数据是在req.body中取
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

app.get('/public/images/*', function (req, res) {
  res.sendFile(__dirname + '/' + req.url);
  console.log('Request for ' + req.url + ' received.');
});
// 数据库
require('./db.js');
var myroute = require('./routes');

var port = 3000;
var io = require('socket.io')(http);
// socket
var socketChat = require('./core/socket.js').socketChat;
socketChat(io);
// 静态文件
// app.use('/static', app.static(path.join(__dirname, 'public')))
// 允许跨域
app.all('*', function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*');
  //允许的header类型
  res.header('Access-Control-Allow-Headers', '*');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.send(200);
  //让options尝试请求快速结束
  else next();
});
app.get('/', function (req, res) {
  res.send('<h1>Node聊天室</h1>');
});
// 登录

app.post('/login', myroute.login);

// 注册
app.post('/register', myroute.register);

// 退出登录
app.get('signout', myroute.signout);
// 消息列表
app.get('/messageList', myroute.messageList);
// 离线消息
app.get('/offlineList', myroute.offlineList);
// 消息列表-发起新的聊天
app.post('/message/create', myroute.messageCreate);
// 群列表
app.get('/groupinfo/list', myroute.groupinfoList)
// 群消息
app.get('/groupinfo/detail', myroute.groupInfoDetail);
// 群用户
app.get('/groupuser/list', myroute.groupUserList);
// 创建群聊
app.post('/groupInfo/create', myroute.groupInfoCreate);
// 获取用户信息
app.get('/userinfo/list', myroute.getUserInfo);
// 根据ID获取历史消息
app.get('/history/list', myroute.historyList);


// 端口
http.listen(port, function () {
  console.log(`Server running at http://localhost:${port}/`);
});