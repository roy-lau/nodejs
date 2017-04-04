var index = require('./index');
var register = require('./register'); 		// 引入注册路由逻辑
var messages = require('../public/lib/messages'); 		// 引入消息控制逻辑
var user = require('../public/lib/middleware/user'); 		// 引入用户认证逻辑
var validate = require('../public/lib/middleware/validate'); 		// 验证用户消息的中间件
var entries = require('./entries') 		// 消息相关的路由


module.exports = function(app) {

    app.use(user);
    app.use(messages);
    // 分页，消息列表
    app.get('/:page?', page(Entry.count, 5), entries.list); 

    // 注册路由的方法
    app.get('/register', register.form);
    app.post('/register', register.submit);
    // 登陆路由的方法
    app.get('/login', login.form);
    app.post('/login', login.submit);
    app.get('/logout', login.logout);
    // 消息列表
    app.get('/post', entries.form);
    // 校验消息路由
	    /* 方法一
	    app.post('/post', 
	    	entries.requireEntryTitle,
	    	entries.requireEntryTitleLengthAbove(4),
	    	entries.submit);
		*/
    // 方法二
    app.post('/post',
        validate.required('entry[title]'),
        validate.lengthAbove('entry[title]', 4),
        entries.submit);
};
