var express = require('express');
var res = express.response;

// 响应消息
res.message = function(msg, type){
	type = type || 'info';
	var sess = this.req.seaaion;
	sess.message = sess.message||[];
	sess.message.push({ type: type, string: msg});
};

// 响应错误信息
res.error = function(msg){
	return this.message(msg, 'error')
}

module.exports = function(req, res, next){
	res.locals.message = req.session.message || [];
	res.locals.removeMessages = function(){
		req.session.message = [];
	};
	next();
};