# Node.js + vue + WebSocket + 第三方登陆的聊天室

## 一、预览

### 源码地址:

### 在线预览地址:

### 下载到本地体验

```bash
# 克隆代码到本地
git clone 项目地址

#  下载客户端node_modules
cd client
npm install

# 启动客户端代码
npm run serve

# 下载服务端node_modules
cd server
npm install

# 启动服务端代码
npm run start

# 打开页面预览
在浏览器输入 `192.168.0.111:`
```

## 二、功能

- [ ] 原型设计 - 移动端
- [ ] 第三方登录(GitHub 授权登录)
- [ ] 使用 vue-cli 创建 client 前端项目
- [ ] 使用 Node.js 创建后台 server
- [ ] 一对一私聊
- [ ] 群聊
- [ ] 离线通知和在线人数
- [ ] 已读消息和未读消息
- [ ] 数据库
- [ ] 部署到远程 CentOS,支持线上体验
- [ ] 支持手机扫码体验
- [ ] rem + vm 适配移动端
- [ ] 优化代码
- [ ] 使用 xcode 把页面嵌入到 app 里面并发布
- [ ] 智能机器人聊天(图灵机器人)

## 三、目录结构

自动生成目录结构是使用

```markdown
client 客户端代码
server 服务端代码
```

## 四、记录我的实战过程

### 构思前端界面

1. 下载 AntDesign 的 [Axure 素材](http://library.ant.design/) 画原型
2. https://socket.io/get-started/chat/
3. socket.io-client 客户端
   原型地址: https://ncm6rr.axshare.com
   原型预览:

### 遇到的问题

1. vue 中 eventHub 被多次触发, 比如点击一次按钮增加两条数据

### 接口设计

## 五、建议

> 如果有什么建议可以到 issue 区留言

### sqlite 参考文章

https://blog.csdn.net/qq_38081746/article/details/90673681

### 部署

部署 Node.js 项目（CentOS） https://help.aliyun.com/document_detail/50775.html
Linux CentOS + Nodejs + Express 部署 vue 项目 https://blog.csdn.net/lihefei_coder/article/details/90700965

用 mac 电脑上传本地文件到阿里云服务器 https://jingyan.baidu.com/article/ae97a64672d076fbfc461d29.html


 whereis nginx
 三、 nginx配置
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
    server_name  116.62.238.176;
  
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

 阿里云CentOS 7环境静态资源部署 https://www.jianshu.com/p/7b2bce81b4ed

 启动nginx服务报错 https://www.cnblogs.com/yihr/p/9588964.html
 解决nginx 403forbidden问题: https://blog.csdn.net/yishuifengxiao/article/details/80574769


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
```
sudo npm uninstall pm2

sudo npm i pm2@latest -g

sudo ln -s  /root/node-v9.3.0-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin/pm2
```

