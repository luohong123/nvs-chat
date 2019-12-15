```markdown
router:只做请求分发，没有业务逻辑 
middlewares:业务中间件，如用户权限控制 
model只能由它的proxy访问，而proxy能被controller和service访问。 
controller主要逻辑处理 
service作为项目的业务组件。如：redis连接服务，缓存组件，日志组件等，他可以减少controller的负担。 
app:放一次性脚本
```
# sqlite3
当用户上线时,离线消息表的一组数据追加到历史记录表中,并删除离线消息表的相关记录
使用一个表来填充另一个表
您可以通过在一个有一组字段的表上使用 select 语句，填充数据到另一个表中。下面是语法：
```
INSERT INTO first_table_name [(column1, column2, ... columnN)] 
   SELECT column1, column2, ...columnN 
   FROM second_table_name
   [WHERE condition];
```
```
SELECT * FROM GROUPINFO WHERE GROUPID =  (SELECT GROUPID FROM GROUPUSER WHERE USERID = '79075de0-17ca-11ea-8b61-ebb7391af6af');

```

消息列表
