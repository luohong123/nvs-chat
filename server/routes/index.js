var fs = require('fs');
var path = require('path');
var common = require('../core/common');
// 用户认证中间件
const JWT = require('jsonwebtoken');
const secret = 'chegi123456';
const algorithm = 'HS256';
const _userInfoAdd = require('../db').userInfoAdd;
const _getUserInfo = require('../db').getUserInfo;
const loginValid = require('../db').loginValid;
const _groupInfoAdd = require('../db').groupInfoAdd;
const _getMessageList = require('../db').getMessageList;
const _getHistoryList = require('../db').getHistoryList;
const _getGroupInfoById = require('../db').getGroupInfoById;
const _getGroupUsersById = require('../db').getGroupUsersById;
const _historyCreate = require('../db').historyCreate;
const _groupInfoList = require('../db').groupInfoList;
function JWT_auth(req, res, next) {
  let authorization = req.headers['X-Token'];
  // 如果存在token
  console.log('X-Token', authorization);
  if (authorization)
    try {
      let token = authorization;
      JWT.verify(token, secret, { algorithm: 'HS256' }, (err, decoded) => {
        // 用户认证
        if (err) {
          console.log(err);
          next(err);
        } else {
          console.log(decoded);
          req.username = decoded.username; // 在 req 上添加 username,以便于传到下一个中间件取出 username 来查询数据库
          next();
        }
      });
    } catch (err) {
      res.status(401).send('未授权');
    }
  else res.status(401).send('未授权');
}
// 注册
exports.register = function (req, res) {
  let imgUrl =
    'public/images/' +
    Math.round(Math.random() * 10) +
    '.jpeg';
  let person = {
    USERID: common.getGuid(),
    USERCODE: req.body.userName,
    USERNAME: req.body.userName,
    PASSWORD: req.body.passWord,
    AVATAR: imgUrl,
    SEX: '',
    REMARK: '',
    ONLINESTATE: '',
    LASTONLINETIME: '',
    TS: common.getTimeS()
  };
  _getUserInfo(person).then(result => {
    if (result && person.USERNAME === result.USERNAME) {
      return res.send({
        message: '用户名已被占用, 请重新注册',
        code: '-1'
      });
    } else {
      _userInfoAdd(person)
        .then(res => {
          res.status(200).send({
            message: res,
            code: '0'
          });
        })
        .catch(err => {
          res.status(200).send({
            code: '0',
            message: err,
          });
        })
    }
  });
};
// 登录
exports.login = function (req, res) {
  let person = {
    USERNAME: req.body.userName,
    PASSWORD: req.body.passWord
  };
  loginValid(person).then(result => {
    if (result) {
      // 授权方法 2. JWT
      let token = JWT.sign(
        { username: person.USERNAME, exp: Date.now() + 1000 * 60 }, // payload
        secret, // 签名密钥
        { algorithm } // 签名算法
      );
      return res.status(200).send({
        code: '0',
        message: '登录成功',
        token: token,
        data: {
          userName: person.USERNAME
        }
      });
    } else {
      return res.status(200).send({
        code: '-1',
        message: '用户名或密码错误'
      });
    }
  });
};
// 登出
exports.signout = function (req, res) {
  req.session.destroy(() => console.log('销毁session，已经推出登录'));
  res.send({
    code: '0',
    message: '已登出'
  });
};
// 消息列表
exports.messageList = function (req, res) {
  // 根据userId 查询和自己相关的群聊和私聊,加入到消息列表中,并根据群聊或者私聊的最后一条聊天记录时间倒序排序
  let userId = req.query.userId;
  if (userId && userId !== undefined && userId !== null && userId !== '') {
    // 查询和此用户相关的私聊和群聊消息
    _getMessageList(userId).then(result => {
      return res.status(200).send({
        code: '0',
        message: '以用户身份请求成功',
        data: result
      });
    });

  } else {
    // 游客身份
    _getMessageList(userId).then(result => {
      return res.status(200).send({
        code: '0',
        message: '以游客身份请求成功',
        data: result
      });
    });
  }
};
// 消息列表-发起新的聊天
exports.messageCreate = function (req, res) {
  let data = req.body;
  let message = {
    MESSAGEID: common.getGuid(),
    GROUPID: data.GROUPID,
    FROMUSERID: data.FROMUSERID,
    TOUSERID: data.TOUSERID,
    CONTENT: data.CONTENT,
    TIME: data.TIME,
    TS: common.getTimeS()
  }
  console.log(message, '发起新的聊天');
  _historyCreate(message).then(result => {
    res.status(200).send({
      code: '0',
      message: '成功发起新的聊天',
      data: []
    })
  })
};

// 消息详情
exports.historyList = function (req, res) {
  let query = {
    type: req.query.type, // QL表示群聊
    otherpartid: req.query.otherpartid // 对方的id
  };
  _getHistoryList(query)
    .then(result => {
      res.status(200).send({
        code: '0',
        message: '请求成功',
        data: result
      });
    })
    .catch(err => {
      res.status(200).send({
        code: '-1',
        message: '请求失败',
        data: []
      });
    });
};

// 用户信息
exports.getUserInfo = function (req, res) {
  let person = {
    USERNAME: req.query.USERNAME,
    USERID: req.query.USERID
  }
  _getUserInfo(person).then(result => {
    return res.status(200).send({
      code: '0',
      message: '请求成功',
      data: result
    });
  });
};
//群信息-列表集合
exports.groupinfoList = function (req, res) {
  _groupInfoList().then(result => {
    res.status(200).send({
      code: '0',
      message: '请求成功',
      data: {
        groups: result
      }
    })
  })
}
// 群聊-详情
exports.groupInfoDetail = function (req, res) {
  _getGroupInfoById(req.query.groupId).then(result => {
    res.status(200).send({
      code: '0',
      message: '请求成功',
      data: result
    })
  })
    .catch(err => {
      res.status(200).send({
        code: '-1',
        message: '请求失败',
        data: err
      })
    })
};
// 群用户
exports.groupUserList = function (req, res) {
  _getGroupUsersById(req.query.groupId).then(result => {
    res.status(200).send({
      code: '0',
      message: '请求成功',
      data: result
    })
  })
    .catch(err => {
      res.status(200).send({
        code: '-1',
        message: '请求失败',
        data: err
      })
    })
}
// 创建新群
exports.groupInfoCreate = function (req, res) {
  let groupInfo = req.body.groupInfo;
  groupInfo.GROUPID = common.getGuid();
  groupInfo.TS = common.getTimeS();
  groupInfo.AVATAR =
    'public/images/' +
    Math.round(Math.random() * 10) +
    '.jpeg';
  _groupInfoAdd(groupInfo).then(result => {
    if (result.code === '0') {
      res.status(200).send(result);
    }
  });
};

