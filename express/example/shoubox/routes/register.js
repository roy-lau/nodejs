var User = require('../public/lib/user')
/* GET register listing. */

module.exports = {
	form: function (req, res) {
		res.render('register', {title: 'Register'});
		console.log(req.body)
	},
	submit: function(ewq, res, next){
		var data = req.body.user;
		User.getByName(data.name, function(err, user){	// 检查用户名是否是唯一的
			if (err) return next(err);					// 顺延传递数据库错误和其他错误

			if (user.id) {
				res.error('用户名已被占用！')
				res.redirect('back');
			} else {
			
				user = new User({      // 用post数据创建用户
					name: data.name,
					pass: data.pass
				});

				user.save(function(err){			// 保存新用户
					if (err) return next(err);	
					req.session.uid = user.id;   	// 为认证保存uid
					res.redirect('/')
				});
			}
		});
	}
}

