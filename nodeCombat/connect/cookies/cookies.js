var connect = require('connect');

var app = connect()
//    .use(connect.cookieParser('tobi is a cool ferret'))  connect版本更新cookieParser函数
    .use(function(req, res){
      console.log(req.headers.cookie);     
      console.log(req.signedCookie);
      // console.log(req.method);
      res.end('hello\n');
    }).listen(3000);
console.log("测试方法: 	curl http://localhost:3000 -H 'Cookie:foo-bar,bar=baz'")