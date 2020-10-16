const user = require("../db/mysql/user");

module.exports = {
  // 新增用户
  async add(ctx) {
    try {
      const params = [
        "admin-" + Date.now(), // 用户名
        "pwd" + Math.random(), // 密码
        "192.100.1.21", // ip
        "CN", // 地址
        new Date(), // 创建时间
      ];

      const result = await user.add(params);

      ctx.body = { res: result, msg: "add success" };
    } catch (err) {
      ctx.body = { msg: "API ERR INFO:" + err };
    }
  },
  // 查询用户（当前是查询全部用户，以后优化为可以查询全部也可以查询单个）
  async query(ctx) {
    try {
      const result = await user.query("user");
      ctx.body = { res: result, msg: "query success" };
    } catch (err) {
      ctx.body = { msg: "API ERR INFO:" + err };
    }
  },
  // 修改用户
  async update(ctx) {
    try {
      const params = ["user1", "pwd456", 1];
      const result = await user.update(params);
      ctx.body = { res: result, msg: "update success" };
    } catch (err) {
      ctx.body = { msg: "API ERR INFO:" + err };
    }
  },
};
