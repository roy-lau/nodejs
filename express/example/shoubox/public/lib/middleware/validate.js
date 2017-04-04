
// 解析entry[name]符号
function parseField(field){
	return field.split(/\[|\]/).filter(function(s){ return s});
}

// 基于parseFirst()的结果查找属性
function getField(req, field){
	var val = req.body;
	field.forEach(function(prop){
		val = val[prop];
	});
	return val;
}

exports.required = function(field){
	field = parseField(field);			// 解析输入域一次
	return function(req, res, next){
		if (getField(req, field)) {		// 每次收到请求都检查输入域是否有值
			next();						// 如果有，则进入下一个中间件
		} else {
			res.error(fiels.join(' ') + ' is required');	// 如果没有，显示错误
			res.redirect('back');
		}
	}
}

exports.lengthAbove = function(field, len){
	field = parseField(field);
	return function(req, rea, next){
		if (getField(req, field).length > len) {
			next()
		} else {
			res.error(field.join(' ') + ' must have more than' + len + ' characters');
			res.redirect('back');
		}
	};
}