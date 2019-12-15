var fs = require('fs');
var file = 'chat.db'; // 这里写的就是数据库文件的路径
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
const GROUPINFO = require('./models/groupinfo').obj;
const GROUPUSER = require('./models/groupuser').obj;
const HISTORY = require('./models/history').obj;
const OFFLINE = require('./models/offline').obj;
const USERINFO = require('./models/userinfo').obj;
const common = require('./core/common');
/**
 * 新增用户
 */
exports.userInfoAdd = function(data) {
  // 注册用户后加入默认的fe-free群
  let sql = `INSERT INTO USERINFO (USERID,USERCODE,USERNAME,PASSWORD,AVATAR,SEX,REMARK,ONLINESTATE,LASTONLINETIME,TS)
  VALUES (
    '${data.USERID}',
    '${data.USERCODE}',
    '${data.USERNAME}',
    '${data.PASSWORD}',
    '${data.AVATAR}',
    '${data.SEX}',
    '${data.REMARK}',
    '${data.ONLINESTATE}',
    '${data.LASTONLINETIME}',
    '${data.TS}'
    );
    INSERT INTO GROUPUSER (ID,GROUPID,USERID,STATE,JOINTIME,QUITTIME,TS)
    VALUES (
    '${common.getGuid()}',
    '16838200-1a29-11ea-92c5-f3482b4425d5',
    '${data.USERID}',
    '',
    '${data.TS}',
    '',
    '${data.TS}'
    );   
    `;
  return new Promise((resolve, reject) => {
    db.exec(sql, err => {
      if (err) return reject(err);
      return resolve('新增用户成功,加入默认群成功');
    });
  });
};
/**
 * 根据USERNAME查询用户信息,用于用户名查重、登录验证
 */
exports.getUserInfo = function(data) {
  let sql = `SELECT * FROM USERINFO WHERE USERNAME = '${data.USERNAME}' OR USERID = '${data.USERID}';`;
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) return reject(err);
      if(row){
        let img = row.AVATAR;
        row.AVATAR = common.setPort() + img;
        return resolve(row);
      }
    });
  });
};
/**
 * 修改用户信息
 */
exports.onlineStateUpdate = function(userInfo) {
  let sql = `
    UPDATE USERINFO SET ONLINESTATE = '${userInfo.ONLINESTATE}' WHERE USERNAME = '${userInfo.USERNAME}';
  `;
  db.run(sql, err => {
    if (err) return err;
    if (userInfo.ONLINESTATE === 'Y') {
    } else {
    }
  });
};
/**
 * 验证用户名和密码是否输入一直
 */
exports.loginValid = function(userInfo) {
  let query = `SELECT * FROM USERINFO WHERE USERNAME = '${userInfo.USERNAME}' AND PASSWORD = '${userInfo.PASSWORD}'`;
  let promise = new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) return reject(err);
      return resolve(row);
    });
  });
  // .then 总是返回一个承诺
  return promise.then(result => {
    if (
      userInfo.USERNAME &&
      userInfo.PASSWORD &&
      result &&
      userInfo.USERNAME === result.USERNAME &&
      userInfo.PASSWORD === result.PASSWORD
    ) {
      return true;
    } else {
      return false;
    }
  });
};
/**
 * 创建新群
 */
exports.groupInfoAdd = function(data) {
  // 操作多表: 群用户表新增一条数据 且 群用户表新增创建人
  let sql = `
  INSERT INTO GROUPINFO (GROUPID,GROUPNAME,GROUPREMARK,CREATEUSERID,CREATETIME,DISSOLUTIONTIME,GROUPSTATE,AVATAR,TS)
  VALUES (
    '${data.GROUPID}',
    '${data.GROUPNAME}',
    '${data.GROUPREMARK}',
    '${data.CREATEUSERID}',
    '${data.CREATETIME}',
    '${data.DISSOLUTIONTIME}',
    '${data.GROUPSTATE}',
    '${data.AVATAR}',
    '${data.TS}'
    );
  INSERT INTO GROUPUSER (ID,GROUPID,USERID,STATE,JOINTIME,QUITTIME,TS)
  VALUES (
    '${common.getGuid()}',
    '${data.GROUPID}',
    '${data.CREATEUSERID}',
    '0',
    '${data.CREATETIME}',
    '',
    '${data.TS}'
    );

  `;
  return new Promise((resolve, reject) => {
    db.exec(sql, err => {
      if (err) return reject(err);
      return resolve({
        code: '0',
        message: '新增群成功和设置创建人为群用户成功'
      });
    });
  });
};
/**
 * 加群
 */
exports.groupJoin = function(data) {};
/**
 * 退群
 */
exports.groupExit = function(data) {};
exports.groupInfoList = function() {
  let sql = `
  SELECT * FROM GROUPINFO;
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) return reject(err);
      for (let i = 0; i < rows.length; i++) {
        let img = rows[i].avatar;
        rows[i].avatar = common.setPort() + img;
      }
      return resolve(rows);
    });
  });
};
/**
 * 根据群ID查询群用户
 */
exports.getGroupUsersById = function(groupId) {
  let users = [],
    sql1 = '',
    sql2 = 'SELECT * FROM USERINFO WHERE ';
  sql1 = `SELECT USERID FROM GROUPUSER WHERE GROUPID = '${groupId}'`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sql1, (err, rows) => {
        if (err) return err;
        users = rows;
        let len = users.length;
        for (let i = 0; i < users.length; i++) {
          let userId = users[i].USERID;
          if (i < len - 1) {
            sql2 += `USERID = '${userId}' OR `;
          } else {
            sql2 += `USERID = '${userId}'`;
          }
        }
        db.all(sql2, (err, rows) => {
          if (err) return err;
          for (let i = 0; i < rows.length; i++) {
            let img = rows[i].avatar;
            rows[i].avatar = common.setPort() + img;
          }
          return resolve(rows);
        });
      });
    });
  });
};
/**
 * 根据群ID查询群信息
 */
exports.getGroupInfoById = function(groupId) {
  let sql = `
    SELECT * FROM GROUPINFO WHERE GROUPID = '${groupId}'
  `;
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) return reject(err);
      for (let i = 0; i < row.length; i++) {
        let img = row[i].AVATAR;
        row[i].avatar = common.setPort() + img;
      }
      return resolve(row);
    });
  });
};
// 获取消息列表
exports.getMessageList = function(userId) {
  // 返回 消息标题(群ID、群名称、私聊时对方的姓名和ID)、历史记录表中最近消息的时间、
  let sql,
    groupsSql,
    privateSql, // 私聊
    groups = [], // 群聊
    historySql = 'SELECT * FROM HISTORY WHERE ',
    privateChats = [], // 私聊
    messages = [];
    // d3ced1b0-1d4f-11ea-b9cf-9b09cc351cea
  // 用户已登录
  if (userId) {
    sql = `
    select * from (
    --------------------------正式使用版本--------------------
                 
    --查询最后与对方的最新一条私信信息                                 
    select 'SL' type,
           messageid,
           otherpartid,
           ui.username name,
           ui.AVATAR avatar,
           mi.content,
           mi.time,
           mi.ts
      from (select messageid, touserid otherpartid, content, time, ts
              from history hi
             where 
             erid || '__' || touserid in
                   (select max(ts) || ft
                      from (select messageid,
                                   fromuserid || '__' || touserid ft,
                                   fromuserid,
                                   touserid,
                                   content,
                                   groupid,
                                   time,
                                   ts
                              from history hi
                             where (hi.fromuserid =
                                   (select userid
                                       from userinfo ui
                                      where ui.USERID = '${userId}'))
                               and length(groupid) = 0   
                               and length(touserid)!=0              
                               and hi.fromuserid!=touserid
                            union all
                            select messageid,
                                   touserid || '__' || fromuserid ft,
                                   fromuserid,
                                   touserid,
                                   content,
                                   groupid,
                                   time,
                                   ts
                              from history hi
                             where (hi.touserid =
                                   (select userid
                                       from userinfo ui
                                      where ui.USERID = '${userId}'))
                               and length(groupid) = 0   
                               and length(fromuserid)!=0              
                               and hi.fromuserid!=touserid) hi
                    
                     group by ft)
            union all
            select messageid, fromuserid otherpartid, content, time, ts
              from history hi
             where ts || hi.touserid || '__' || fromuserid in
                   (select max(ts) || ft
                      from (select messageid,
                                   fromuserid || '__' || touserid ft,
                                   fromuserid,
                                   touserid,
                                   content,
                                   groupid,
                                   time,
                                   ts
                              from history hi
                             where (hi.fromuserid =
                                   (select userid
                                       from userinfo ui
                                      where ui.USERID = '${userId}'))
                               and length(groupid) = 0       
                               and length(touserid)!=0          
                               and hi.fromuserid!=touserid
                            union all
                            select messageid,
                                   touserid || '__' || fromuserid ft,
                                   fromuserid,
                                   touserid,
                                   content,
                                   groupid,
                                   time,
                                   ts
                              from history hi
                             where (hi.touserid =
                                   (select userid
                                       from userinfo ui
                                      where ui.USERID = '${userId}'))
                               and length(groupid) = 0     
                               and length(fromuserid)!=0            
                               and hi.fromuserid!=touserid) hi
                    
                     group by ft)) mi
      left join userinfo ui
        on mi.otherpartid = ui.USERID
    -----以上是私聊    
    
    union all
    -----群聊     
    
    select 'QL' type,
           mi.messageid,
           mi.groupid otherpartid,
           gi.GROUPNAME name,
           gi.AVATAR avatar,
           mi.content,
           mi.time,
           mi.ts
      from (select *
              from history hi
             where ts || hi.GROUPID in
                   (select max(ts) || groupid
                      from history hi
                     where hi.GROUPID in
                           (select GROUPID
                              from groupuser gu
                             where gu.USERID =
                                   (select userid
                                      from userinfo ui
                                     where ui.USERID = '${userId}'))
                     group by groupid)) mi
      left join groupinfo gi
        on gi.GROUPID = mi.groupid) date
        order by ts desc
    
    `;
    return new Promise((resolve, reject) => {
      db.serialize(()=>{
        db.all(sql, (err, rows) => {
          if (err) return reject(err);
          // let unreadSql = `
          // SELECT 
          // `;
          for (let i = 0; i < rows.length; i++) {
            let img = rows[i].avatar;
            rows[i].avatar = common.setPort() + img;
          }
          // 查询离线记录表,返回未读消息条数
          return resolve(rows);
        });
      })
    });
  } else {
    // 游客身份可以浏览一个默认的群  智能机器人
    sql = `SELECT * FROM GROUPINFO WHERE GROUPID = '16838200-1a29-11ea-92c5-f3482b4425d5'`;
    return new Promise((resolve, reject) => {
      db.get(sql, (err, row) => {
        if (err) reject(err);
        if (row) {
          messages.push({
            ID: common.getGuid(),
            GROUPID: row.GROUPID,
            GROUPNAME: row.GROUPNAME,
            AVATAR: row.AVATAR,
            CONTENT: '', // 预览最近的一条信息
            LATEDTIME: '',
            FROMUSERID: '', // 发送人
            TOUSERID: ''
          });
        }
        return resolve(messages);
      });
    });
  }
};
// 获取历史消息
exports.getHistoryList = function(data) {
  let sql,
    messages = [], // 消息集合
    userSql = 'SELECT * FROM USERINFO WHERE', // 用户信息
    privateSql,
    historys = [];
  // 群聊
  if (data.type === 'QL') {
    // 根据群ID查询历史记录表并根据时间降序排序
    sql = `
      SELECT * FROM HISTORY WHERE GROUPID = '${data.otherpartid}'  ORDER BY TS ASC;
    `;
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(sql, (err, messages) => {
          if (err) return err;
          for (let i = 0; i < messages.length; i++) {
            userSql +=
              i < messages.length - 1
                ? `
            USERID = '${messages[i].FROMUSERID}' OR `
                : `USERID = '${messages[i].FROMUSERID}' `;
          }
          db.all(userSql, (err, users) => {
            if (err) return reject(err);
            for (let i = 0; i < messages.length; i++) {
              let userInfo = users.filter(
                item => messages[i].FROMUSERID === item.USERID
              );
              historys.push({
                MESSAGEID: messages[i].MESSAGEID,
                GROUPID: messages[i].GROUPID,
                FROMUSERID: messages[i].FROMUSERID,
                TOUSERID: messages[i].TOUSERID,
                CONTENT: messages[i].CONTENT,
                TIME: messages[i].TIME,
                TS: messages[i].TS,
                AVATAR: userInfo[0].AVATAR,
                USERNAME: userInfo[0].USERNAME
              });
            }
            return resolve(historys);
          });
        });
      });
    });
  } else {
    // 私聊
    privateSql = `
    SELECT * FROM HISTORY WHERE (FROMUSERID = '${data.otherpartid}' OR TOUSERID = '${data.otherpartid}' ) AND GROUPID = '';
    `;
    return new Promise((resolve, reject) => {
      db.all(privateSql, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }
};
// 判断消息是否已存在
exports.messageIsRepeat = function(data) {
  let sql = `
            SELECT * FROM HISTORY WHERE TS = '${data.TS}';
            `;
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) return reject(err);
      return resolve(row);
    });
  });
};
// 新增一条历史消息
exports.historyCreate = function(data) {
  let sql = `
            INSERT INTO HISTORY(MESSAGEID, GROUPID, FROMUSERID, TOUSERID, CONTENT, TIME, TS)
            VALUES(
              '${data.MESSAGEID}',
              '${data.GROUPID}',
              '${data.FROMUSERID}',
              '${data.TOUSERID}',
              '${data.CONTENT}',
              '${data.TIME}',
              '${data.TS}'
            )
              `;
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) reject(err);
      resolve({
        code: '0',
        message: '成功新增一条消息!'
      });
    });
  });
};
exports.offlineCreate = function(data) {
  let sql = `
    INSERT INTO OFFLINE(ID,MESSAGEID, GROUPID, FROMUSERID, TOUSERID, CONTENT, TIME, TS)
    VALUES(
      '${data.ID}',
      '${data.MESSAGEID}',
      '${data.GROUPID}',
      '${data.FROMUSERID}',
      '${data.TOUSERID}',
      '${data.CONTENT}',
      '${data.TIME}',
      '${data.TS}'
    )
  `;
  return new Promise((resolve,reject)=>{
    db.run(sql,(err)=>{
      if(err) reject(err);
      return resolve({
        code:'0',
        message:`新增离线记录:${data.CONTENT} .`
      })
    })
  })
};
