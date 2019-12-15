/*
 * @Author: honghong
 * @Date: 2019-11-30 11:10:47
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 13:51:20
 * @Description: 群信息
 * @email: 3300536651@qq.com
 */
import request from '@/utils/request';
/**
 * 根据 userId 获取相关的消息列表，包括私聊和群聊
 * 如果用户没有登录,身份为游客时,分配一个默认的群,只能查看群消息,不能发布评论
 * @param {*} userId
 */

export function messageList(userId) {
  return request({
    url: '/messageList',
    method: 'get',
    params: {
      userId: userId,
    }
  });
}
/**
 * 发起新的聊天
 * @param {*} data 
 */
export function messageCreate(data) {
  return request({
    url:'/message/create',
    method:'post',
    data
  })
}
export function getGroupInfoList() {
  return request({
    url:'/groupinfo/list',
    method:'get',
  })
}
/**
 * 根据 ID 获取群消息
 * @param {*} groupId
 */
export function getGroupInfoById(groupId) {
  return request({
    url: `/groupinfo/detail`,
    method: 'get',
    params: {
      groupId: groupId
    }
  });
}
/**
 * 根据群ID获取群成员
 * @param {*} groupId
 */
export function getGroupUser(groupId) {
  return request({
    url: `/groupuser/list`,
    method: 'get',
    params:{
      groupId:groupId
    }
  });
}
/**
 * 新增群消息
 * @param {*} groupId
 */
export function groupInfoCreate(data) {
  return request({
    url: `/groupInfo/create`,
    method: 'post',
    // `data` 是作为请求主体被发送的数据,只适用于这些请求方法 "PUT", "POST", 和 "PATCH",
    // 后台接参数需要序列化后在req.body中接,
    data
  });
}
/**
 * 新增群成员
 * @param {*} groupId
 */
export function groupUserAdd( data) {
  return request({
    url: `/groupuser/create`,
    method: 'post',
    data
  });
}
