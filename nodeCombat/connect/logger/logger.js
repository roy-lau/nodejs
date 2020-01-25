var connect = require('connect');

var app = connect()
  .use(connect.logger())    // 没有参数,使用默认的logger选项
  .use(hello)               // hello是假想的中间件,返回‘hello world响应’
  .listen(3000);
