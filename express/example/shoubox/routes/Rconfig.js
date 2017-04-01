var index = require('./index');
var register = require('./register');	// 引入注册路由逻辑
var messages = require('../public/lib/messages');	// 引入消息控制逻辑


module.exports =function (app) {

// 注册路由的方法
app.get('/', register.form);
app.post('/', register.submit);
app.use(messages);
