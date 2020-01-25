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
			 * 两个bug待解决
			 *
			 * 1.获取上传文件的文件名(已解决)
			 * 2.获取上传文件的全路径
			 *  	img.name 应该获取上传文件的文件名
			 *		img.path 应该获取文件的路径
			 */
			 console.log(req.body)
			 console.log(req.files)
			var  img = req.body.photos.image,
				name = req.body.photos.name,
				path = join(dir, img.name );

			// 文件重命名	
			fs.rename( img.path , path, function(err){
				if (err)  return next(err);

				db.create({
					name: name,
					path: path
				}, function(err){
					if (err) return next(err);
					res.redirect('/');		// 重定向到首页
				});
			});
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