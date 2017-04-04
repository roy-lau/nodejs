var Entry = require('../public/lib/entry');

module.exports = {
	list: function(req, res, next){
		Entry.getRange(page.from, page.to, function(err, entries){		// 获取消息
			if (err) return next(err);

			res.render('entries',{						// 渲染HTTP响应
				title: 'Entries',
				entries: entries
			});
		});
	},
	form: function(req, res){
		res.render('post', {title: 'Post'});
	},
	submit: function(req, res, next){
		var data = req.body.entry;

		var entry = new Entry({
			"username": res.locals.user.name,
			"title": data.title,
			"body": data.body
		});
		Entry.save(function(err){
			if (err) return next(err);
			res.redirect('/');
		});
	}/*,方法一
	requireEntryTitle: function(req,res,next){
		var title = req.body.entry.title;
		if (title) {
			next();
		}else{
			res.error("Title is required.");
			res.redirect('back');
		}
	},
	requireEntryTitleLengthAbove: function(len){
		return function(req, res, next){
			var title = req.body.entry.title;
			if (title.length > len) {
				next()
			}else{
				res.error("Title must be longer than " + len);
				res.redirect('back');
			};
		};
	}*/
}