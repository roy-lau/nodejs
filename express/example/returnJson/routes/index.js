var routes = require("express").Router();

// 路由表

var shopping = require("./vue-shopping");
var musicMobile = require("./vue-music-mobile");

//设置全部的访问头
routes.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // 支持跨域访问
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") res.send(200);
  /*让options请求快速返回*/ else next();
});

routes.get("/", function (req, res) {
  res.json({ message: "hi! 欢迎查看API " });
});

// 电商网站
routes.route("/:apiName").all(shopping);

// 移动端音乐播放器
routes.get("/getDiscList", musicMobile.getDiscList);
routes.get("/lyric", musicMobile.lyric);

module.exports = routes;
