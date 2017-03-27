// 这是一个用中间件connect做的小型服务器（用来测试dos.js的攻击）
var connect = require('connect');

var app = connect()
  .use(connect.bodyParser());

  app.listen(3000);
