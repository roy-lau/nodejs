const User = require("./user");

// 路由表
module.exports = (routes) => {
  routes.get("/", (ctx, next) => {
    ctx.body = { msg: "hi! 欢迎查看API " };
  });

  routes.get("/add", User.add);
  routes.get("/query", User.query);
  routes.get("/update", User.update);
};
