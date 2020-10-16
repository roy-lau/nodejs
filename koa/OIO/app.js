var app = require("koa")(),
  logger = require("koa-logger"),
  json = require("koa-json"),
  views = require("koa-views"),
  onerror = require("koa-onerror");

var index = require("./routes/index");
var users = require("./routes/users");

// error 处理程序
onerror(app);

// 全局中间件
app.use(
  views("views", {
    root: __dirname + "/views",
    default: "jade",
  })
);
app.use(require("koa-bodyparser")());
app.use(json());
app.use(logger());

// 输出log
app.use(function* (next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

app.use(require("koa-static")(__dirname + "/public"));

// routes 规则
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;
