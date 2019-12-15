/*
 * @Author: honghong
 * @Date: 2019-11-30 11:18:57
 * @LastEditors: honghong
 * @LastEditTime: 2019-11-30 11:19:05
 * @Description:
 * @email: 3300536651@qq.com
 */
import request from '@/utils/request';
/**
 * 根据ID获取历史消息
 * @param {*} id
 */
export function historyList(data) {
  return request({
    url: `/history/list`,
    method: 'get',
    params: {
      type:data.type, // QL表示群聊
      otherpartid:data.otherpartid // 对方的id
    }
  });
}
