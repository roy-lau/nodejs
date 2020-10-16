/*
 * 引用上层目录的（./lib）中引入User模型
 * 检查会话用户ID，当ID出现时 表明用户已通过认证。
 *
 */
var User = require("../user");

module.exports = function (req, res, next) {
  var uid = req.session.uid; // 从会话中读取已登录用户的ID
  if (!uid) return next();
  User.get(uid, function (err, user) {
    // 从Redis中读取已登录用户的数据
    if (err) return next(err);
    req.user = res.locals.user = user; // 将用户数据输出到响应的对象中
    next();
  });
};
