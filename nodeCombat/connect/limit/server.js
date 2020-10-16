// 这是一个用中间件connect做的小型服务器（用来测试dos.js的攻击）
var connect = require("connect");
var http = require("http");

var app = connect();
var i = 0; // 统计dos次数
/* 
// gzip/deflate outgoing responses 
var compression = require('compression');
app.use(compression());
 
// store session state in browser cookie 
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));
 
// parse urlencoded request bodies into req.body 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));*/

// respond to all requests
app.use(function (req, res) {
  if (res) console.log("收到dos：" + i++);
  res.end("Hello from Connect!\n");
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
