# Node.js + vue + WebSocket + 第三方登陆的聊天室
# 项目简介
此项目前端用的vue,UI界面大部分是自己用原生的html+css写的,小部分的效果使用了vue版本的antdesign,刚刚开始使用vue,想通过该项目学习vue的组件、指令、事件、生命周期等的使用,所以没有引用太多的第三方插件。
聊天的实时通信使用的是 [socket.io](https://github.com/socketio/socket.io) , 后台是用node+express写的,结合 [sqlite](https://www.runoob.com/sqlite/sqlite-syntax.html) 实现持久化存储,前后端的通信使用 [axios](https://github.com/axios/axios)
# 预览效果

# 启动项目
### 启动前端
```bash
cd client
npm install
npm start
```
在浏览器输入 `localhost:8080`
#### 启动后端
```bash
cd server
npm install
npm start
```
`localhost:3000` 为后端服务

## 功能

- [×] 使用 vue-cli 创建 client 前端项目
- [×] 使用 Node.js+sqlite 创建后台 server
- [×] 一对一私聊
- [×] 群聊
- [×] 在线人数
- [×] 部署到远程 CentOS,支持线上体验

## 用到的命令
1. 查看安装软件位置
```bash
 whereis nginx
 ```

 ## 学习笔记
- nginx配置
 ```markdown
查看nginx安装位置
whereis nginx
进入nginx配置文件目录
  cd /etc/nginx/  找到nginx.conf文件
打开配置文件
 vim nginx.conf
代理配置
server {
    // 访问端口号
    listen       80;
    // 服务器地址(访问ip)
    server_name  公网ip;
    include /etc/nginx/default.d/*.conf;
    // 静态资源文件
    location / { 
      // 静态资源存放路径
      root /home/html/; 
      // 默认读取文件
      index index.html index.htm;     
    }
    // 接口代理
    location /api {
      // 后端代码接口地址
      proxy_pass: http://120.78.xx.xx:8071;
    }
    error_page 404 /404.html;
        location = /40x.html {
    } 
    重启nginx
 nginx -s reload
 ```
 - node项目常用目录结构
 ```markdown
router:只做请求分发，没有业务逻辑 
middlewares:业务中间件，如用户权限控制 
model只能由它的proxy访问，而proxy能被controller和service访问。 
controller主要逻辑处理 
service作为项目的业务组件。如：redis连接服务，缓存组件，日志组件等，他可以减少controller的负担。 
app:放一次性脚本
```
- 安装pm2
```bash
sudo npm uninstall pm2
sudo npm i pm2@latest -g
sudo ln -s  /root/node-v9.3.0-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin/pm2
```
- sqlite3 SQL查询
```markdown
# sqlite3
当用户上线时,离线消息表的一组数据追加到历史记录表中,并删除离线消息表的相关记录
使用一个表来填充另一个表
您可以通过在一个有一组字段的表上使用 select 语句，填充数据到另一个表中。下面是语法：
INSERT INTO first_table_name [(column1, column2, ... columnN)] 
   SELECT column1, column2, ...columnN 
   FROM second_table_name
   [WHERE condition];
SELECT * FROM GROUPINFO WHERE GROUPID =  (SELECT GROUPID FROM GROUPUSER WHERE USERID = '79075de0-17ca-11ea-8b61-ebb7391af6af');
```
## 参考文章
- [【sqlite 参考文章】](https://blog.csdn.net/qq_38081746/article/details/90673681)
- [【部署 Node.js 项目（CentOS）】](https://help.aliyun.com/document_detail/50775.html)
- [【Linux CentOS + Nodejs + Express 部署 vue 项目】](https://blog.csdn.net/lihefei_coder/article/details/90700965)
- [【用 mac 电脑上传本地文件到阿里云服务器】](https://jingyan.baidu.com/article/ae97a64672d076fbfc461d29.html)
- [【阿里云CentOS 7环境静态资源部署】](https://www.jianshu.com/p/7b2bce81b4ed)
- [【启动nginx服务报错】](https://www.cnblogs.com/yihr/p/9588964.html)
- [【解决nginx 403forbidden问题】](https://blog.csdn.net/yishuifengxiao/article/details/80574769)
- [【手摸手，带你用vue撸后台 系列二(登录权限篇)】](https://juejin.im/post/591aa14f570c35006961acac)