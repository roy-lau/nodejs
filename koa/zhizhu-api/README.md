# 知乎专栏项目

## 开发&&部署

```sh
npm run dev # 开发
npm run start # 部署
```

### 技术栈

* `koa-json-error` 进行错误处理
* `koa-parameter` 校验参数

### 技术点

* RESTful API 理论
* koa2
* MongoDB __复杂的数据库关系（一对多，多对多）__
* JWT
* Postman
* 阿里云部署

#### REST 是什么？

- REST 是万维网软件架构**风格**
- REST 是用来创建软件服务的

#### 为什么叫 REST？

- **Re**presentational **S**tate **T**ransfer 
  - Representational: 数据的表现形式（JSON XML ……）
  - State: 当前状态或者数据
  - Transfer: 数据传输

#### REST 的六个限制

* 一、客户端——服务器（Client-Server）
  - 关注点分离
  - 服务端专注数据存储，提升了简单性
  - 前端专注用户界面，提升了可移植性
  
* 二、无状态（Stateless）
  - 所有用户会话信息都保存在客户端
  - 每次请求必须包括所有信息，不能依赖上下文信息
  - 服务端不用保存会话信息，提升了简单性、可靠性、可见性

* 三、缓存（Cache）
  - 所有服务端响应都要被标记为可缓存或不可缓存
  - 减少前后端交互，提升了性能

* 四、统一接口（Uniform Interface）
  - 接口设计尽可能统一用用，提升了简单性、可见性
  - 接口与实现解耦，使前后端可以独立开发迭代

* 五、分层系统（Layered System）
  - 每层只知道相邻的一层，后面隐藏的就不知道了
  - 客户端不知道是和代理还是真实的服务器通信
  - 其他层：安全层、负载均衡、缓存层等

* 六、按需代码（Code-On-Demand 可选）
  - 客户端可以下载运行服务端传来的代码（比如 JS）
  - 通过减少一些功能，简化了客户端

#### koa 中间件

```js
// 演示中间件的执行流程
const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(1.1);
});

app.use(async (ctx, next) => {
    console.log(2);
    await next();
    console.log(2.2);
});

app.use(async (ctx, next) => {
    console.log(3);
    await next();
    console.log(3.3);
});

app.listen(3000, () => console.log('listening 3000'));
// 打印结果

// 1
// 2
// 3
// 3.3
// 2.2
// 1.1
```

#### koa 洋葱模型

<img src="https://pic1.zhimg.com/v2-bea6522709e3aaafe08121a14dbcad34_r.jpg" alt="koajs洋葱模型">

#### 路由是什么？

- 决定了不同的 URL 是如何被不同的执行的
- 在 koajs 中是一个中间件

#### 为什么要用路由？

- 如果没有路由会怎么样？
没有路由所有的接口将会返回相同的结果

- 路由的作用是什么？
根据不同的接口返回不同的接口

- 路由存在的意义
  - 处理不同的 URL
  - 处理不同的 http 方法
  - 解析 URL 上的参数
  - ……


### HTTP options 方法作用是什么呢？

* 检查服务器支持的请求方法
* CORS 中的预检请求

#### allowedMethods 的作用

* 响应 `HTTP options` 方法，告诉他都支持的请求方法
* 相应的返回 405（不允许）和 501（没实现）


### RESTful API 最佳实践 —— 增删改查应该返回什么相应？

#### 获取 HTTP 请求参数

- 请求字符串（Query String），如 `?q=keyword`
- 路由参数（Router params），如 `/user/:id`
- 请求体（Body），如 `{name: '李雷'}`
- 请求头（Header），如 `Accept`、`Cookie`

#### 发送 HTTP 响应

- 响应状态 `Status`, 如 200 400 等
- 响应体 `Body`，如 `{name: '李雷'}`
- 响应头 `Header`, 如 `Allow` `Content-Type`


### 编写控制器的最佳实践

- 每个资源的控制器放在不同的文件里
- 尽量使用类+类方法的形式编写控制器
- 严谨的错误处理

### 错误处理

#### 什么是错误处理？

- 编程语言或计算机硬件里的一种机制
- 处理软件或信息系统中出现的异常状况

#### 异常状况有哪些？

- 运行时错误，都返回 500
- 逻辑错误，如： 找不到（404）、先决条件失败（412）、无法处理的实体（参数格式不对，422）等

#### 为什么要用错误处理？

- 防止程序挂掉
- 告诉用户错误信息
- 便于开发者调试

#### 什么是 NoSQL？

> 对不同于传统的关系型数据库的数据库管理系统的统称

#### NoSQL 数据库的分类

- 列存储（HBase）
- 文档存储（MongoDB）
- Key-Value 存储（Redis）
- 图存储（FlockDB）
- 对象存储（db4o）
- XML存储（BaseX）

#### 为什么要用 NoSQL？

- 简单（没有原子性、一致性、隔离性等复杂规范）
- 便于横向拓展
- 适合超大规模数据的存储
- 很灵活地存储复杂的数据结构（Schema Free）

### MongoDB 简介

#### 什么是 MongoDB？

- 来自于英文单词 "Humongous"，中文含义为 "庞大"
- 面向文档存储的开源数据库
- 由 c++ 编写而成

#### 为什么要用 MongoDB？

- 性能好（内存计算）
- 大规模数据存储（可拓展性）
- 可靠安全（本地复制、自动故障转移）
- 方便存储复杂的数据结构（Schema Free）


### session 简介

#### Session 的优势

- 相比 jwt，最大的优势就在于可以主动清除 session 了
- session 保存在服务器端，相对较为安全
- 结合 cookie 使用，较为灵活，兼容性较好

#### Session 的劣势

- cookie + Session 在跨域场景下表现不好
- 如果是分布式部署，需要做多机共享 Session 机制
- 基于 cookie 的机制很容易被 CSRF
- 查询 session 信息可能会有数据库查询操作

#### Session 相关的概念介绍

- session： 主要存放在服务器端，相对安全
- cookie： 主要存放在客户端，并且不是很安全
- sessionStorage： 仅在当前会话下有效，关闭页面或浏览器后被清除
- localStorage： 除非被清除，否则永久保存


### JWT 简介

#### 什么是 JWT

> JSON Web Token 是一种开放标准 [RFC 7519](https://tools.ietf.org/html/rfc7519)

- RFC9519 定义了一种紧凑且独立的方式，可以将各方之间的信息作为 JSON 对象进行安全传输
- 该信息可以验证和信任，因为是经过数字签名的

#### JWT 的构成

- 头部（Header）
例： ```{"typ":"JWT","alg":"HS256"}```
  - typ： token 的类型，这里固定为字符串 JWT
  - alg： 使用 hash 算法，例如：HMAC SHA256 或者 RSA
- 有效载荷（Payload）
  - 存储需要传递的信息，如用户 ID、用户名等
  - 还包含元数据，如过期时间、发布人等
  - 与 Header 不同，Payload 可以加密
编码前： ```{"user_id":"zhagnsan"}```
编码后（Base编码）： ```'eyj1c2VyX2lkIjoiemhhbmdzYW4ifQ=='```
编码后（Base64编码）： ```'eyj1c2VyX2lkIjoiemhhbmdzYW4ifQ'```
- 签名（Signature）
  - 对 Header 和 Payload 部分进行签名
  - 保证 Token 在传输的过程中没有被篡改或者损坏
**Signature 算法**
```js
Signature = HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

#### JWT vs Sessioin

- 可扩展性 （JWT 更强）
- 安全性（都可能被修改，中间人攻击 https 可以解决）
- RESTful API
- 性能（各有利弊）
- 时效性（JWT需要等到过期时间才可以更新，Session 可以随时更新）