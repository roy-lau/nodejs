var db = require('../db/mongodb'),		// 引入数据库模型
	path = require('path'),
	fs = require('fs'),
	join = path.join;		//引入path.join,这样就可以用“path”命名变量

module.exports = {
	form: function(req, res){
		res.render('upload', {
			title: 'Photo upload'
		});
	},
	submit: function(dir){
		return function(req, res, next){
			/*
			 * 默认为 原来的文件名 
			 *
			 * req.files.photos.image 获取图片
			 * req.files.photos.name 获取图片名
			 */
			 console.log(req.files)
			 console.log(req.body)
			var  img = req.files.photos.image,
				name = req.body.photos.name || img.name,
				path = join(dir, img.name);

		/*	// 文件重命名	
			fs.rename(img.path, path, function(err){
				if (err)  return next(err);

				db.create({
					name: name,
					path: img.name
				}, function(err){
					if (err) return next(err);
					res.redirect('/');		// 重定向到首页
				});
			});*/
		};
	},
	list: function(req, res, next){
		db.find({}, function(err, photos){		// {}查出db集合中的所有记录
			if (err) return next(err);
			res.render('photos', {
				title: "photos",
				photos: photos
			});
		});
	}
}	