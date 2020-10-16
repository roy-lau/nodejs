var express = require("express");
var app = express();

// 主页输出 "Hello express-router"
app.get("/", function (req, res) {
  console.log("主页 GET 请求");
  res.send("hello express-router");
});

// POST 请求
app.post("/", function (req, res) {
  console.log("主页 POST 请求");
  res.send("POST requery");
});

// /del_user 页面响应
app.get("/del_user", function (req, res) {
  console.log("/del_user 响应delete请求");
  res.send("删除页面");
});

// /list_user 页面 GET 请求
app.get("/list_user", function (req, res) {
  console.log("/list_user GET请求");
  res.send("用户列表页");
});

// 对页面/*.html等响应 GET请求
app.get("/*.html", function (req, res) {
  console.log("/*.html GET 请求");
  res.send("正则匹配所有以.html结尾的页面");
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("experss_rotuer启动完毕：http://127.0.0.1", host, port);
});
