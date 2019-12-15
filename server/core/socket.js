/*
 * @Author: honghong
 * @Date: 2019-11-30 11:54:34
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 13:48:29
 * @Description:
 * @email: 3300536651@qq.com
 */
var path = require('path');
var fs = require('fs');
var _historyCreate = require('../db').historyCreate;
var _messageIsRepeat = require('../db').messageIsRepeat;
var common = require('../core/common');
var _onlineStateUpdate = require('../db').onlineStateUpdate;
var _getUserInfo = require('../db').getUserInfo;
var _offlineCreate = require('../db').offlineCreate;
// 客户端=》向服务端发送事件 enter进入 leave离开 sendMessage发送消息
// 系统消息 systemMessage
// 服务端=》向客户端发送事件 broadMessage广播消息 broadWhoEnter群通知谁进入、群broadWhoLeave
// Chatroom

var userInfo = {};
var socketUsers = {};
var testUsers = {};
exports.socketChat = function(io) {
  io.on('connection', socket => {
    // 用户是否进入
    let addedUser = false;
    // 当客户端发出 'add user'时，它将侦听并执行
    socket.on('add user', username => {
      // if (addedUser) return;
      // we store the username in the socket session for this client
      socket.username = username;
      socketUsers[username] = socket;
      testUsers[username] = username;
      addedUser = true;
      // 修改用户在线状态
      userInfo = {
        USERNAME: socket.username,
        ONLINESTATE: 'Y'
      };
      _onlineStateUpdate(userInfo);
    });
    // 当客户端发出 'new message' 时，它将侦听并执行
    socket.on('new message', data => {
      // we tell the client to execute 'new message'
      let message = {
        MESSAGEID: common.getGuid(),
        GROUPID: data.GROUPID,
        FROMUSERID: data.FROMUSERID,
        TOUSERID: data.TOUSERID,
        CONTENT: data.CONTENT,
        TIME: data.TIME,
        TS: data.TS, // 去重
        AVATAR: data.AVATAR,
        USERNAME: data.USERNAME
      };
      // 新增历史消息
      _messageIsRepeat(message).then(res => {
        // 不能重复添加消息
        if (!res) {
          _historyCreate(message).then(result => {
            if (message.GROUPID !== '') {
              // 通知其他人 群聊
              socket.broadcast.emit('new message', {
                username: socket.username,
                message: message
              });
            }
          });
        }
      });
    });
    // 私聊
    socket.on('private', data => {
      let message = {
        ID: common.getGuid(),
        MESSAGEID: common.getGuid(),
        GROUPID: data.GROUPID,
        FROMUSERID: data.FROMUSERID,
        TOUSERID: data.TOUSERID,
        CONTENT: data.CONTENT,
        TIME: data.TIME,
        TS: data.TS, // 去重
        AVATAR: data.AVATAR,
        USERNAME: data.USERNAME
      };
      // 新增历史消息
      _messageIsRepeat(message).then(res => {
        // 不能重复添加消息
        if (!res) {
          // 服务端接收到私聊
          if (message.TOUSERID) {
            // 首先判断是否在线,如果离线,直接把消息发送到离线记录表,待用户上线后,把
            // 离线记录表的消息copy到历史记录表中,并删除离线记录表的相关数据
            _getUserInfo({
              USERNAME: '',
              USERID: message.TOUSERID
            }).then(userInfo => {
              // 如果用户在线,把数据存到history表中,然后socket通知对方
              if (userInfo.ONLINESTATE === 'Y') {
                _historyCreate(message).then(result => {
                  if (result.code === '0') {
                    let toUser = socketUsers[userInfo.USERNAME];
                    console.log(testUsers, '==>testUsers');
                    if (toUser) {
                      // 把私聊发送给接收人
                      toUser.emit('private', {
                        username: userInfo.USERNAME,
                        message: message
                      });
                    }
                  }
                });
              } else {
                // 如果接收人不在线,不通过socket通知对方,把消息存到离线记录表中
                // 当用户上线时,先查询历史记录表,有几条消息,当用户查看消息后,把离线记录表的相关数据copy到历史记录表中,并删除离线记录表的相关信息
                _offlineCreate(message).then(result => {
                  if (result.code === '0') {
                    console.log(result.message);
                  }
                });
              }
            });
          }
          // _historyCreate(message).then(result => {
          //     // 服务端接收到私聊
          //     if (message.TOUSERID) {
          //         // 首先判断是否在线,如果离线,直接把消息发送到离线记录表,待用户上线后,把
          //         // 离线记录表的消息copy到历史记录表中,并删除离线记录表的相关数据
          //         _getUserInfo({
          //             USERNAME: '',
          //             USERID: message.TOUSERID
          //         }).then(userInfo => {
          //             if(userInfo.ONLINESTATE==='Y') {

          //             }
          //             console.log(userInfo, '====>userInfo');
          //             let toUser = socketUsers[userInfo.USERNAME];
          //             console.log(testUsers, '==>testUsers');
          //             if (toUser) {
          //                 // 把私聊发送给接收人
          //                 toUser.emit('private', {
          //                     username: userInfo.USERNAME,
          //                     message: message
          //                 });
          //             }
          //         });
          //     }
          // });
        }
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });
    // 当用户退出登录时,设置为不在线
    socket.on('user leave', username => {
      // 修改用户在线状态
      userInfo = {
        USERNAME: socket.username,
        ONLINESTATE: 'N'
      };
      _onlineStateUpdate(userInfo);
      // 设置用户离开
      addedUser = false;
    });
    // 当用户断开连接时,执行此操作
    socket.on('disconnect', () => {
      console.log('disconnect', '已经断开连接=========>');
      if (addedUser) {
        // echo globally that this client has left
        console.log('107行代码==');
        socket.broadcast.emit('user leave', {
          username: socket.username
        });
        // 修改用户在线状态,当用户断开连接时,修改为不在线
        userInfo = {
          USERNAME: socket.username,
          ONLINESTATE: 'N'
        };
        _onlineStateUpdate(userInfo);
      }
    });
    socket.on('reconnect', () => {
      console.log('再次连接');
    });
  });
};
