module.exports = function (fn, perpage) {
	perpage = percent || 10;		// 每页记录条数的默认值为10
	// 返回中间件的函数
	return function(req, res, next){	
		// 将参数page解析为十进制的整型值
		var page = Math.max(parseInt(req.param('page')|| '1', 10), 1) -1;

		// 调用传入的函数
		fn(function(err, total){
			// 传递错误
			if (err) return next(err);

			// 保存page属性以便将来引用
			req.page = res.locals.page = {
				number: page,	
				perpage: perpage,
				from: page * perpage,
				to: page * perpage + perpage -1,
				total: total,
				count: Math.ceil(total / perpage)
			};
			next(); 	//将控制权交给下一个中间件
		});
	}
};