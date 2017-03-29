var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../dataBase/db').user;

/* GET home page. */
router.get('/', function(req, res) {
		res.render('index', { title: 'Express' });
		});

/* login page */
router.get('/login', function(req, res) {
		res.render('login', { title:'login'});
		})

/* ucenter */
router.post('/ucenter', function(req, res){
		var query = {name: req.body.name, password: req.body.password};
		(function(){
		 user.count(query, function(err, doc){	// cont返回集合中文档的数量，和find一样可以接收查询条件。query表示查询的条件
				 if(doc == 1){
					 console.log(query.name + ":登陆成功 || " + new Date());
					 res.render('ucenter', { title: doc});
				 }else{
					 console.log(query.name + ":登陆失败" + new Date());
					 res.redirect('/');
				 }
			});
		 })(query);
	});

module.exports = router;
