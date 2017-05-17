var express = require('express');
var router = express.Router();



    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('pages/index', {
            title: '电影网站——首页',
            movies: [{
                title: "1-1.项目前期准备",
                _id: 1,
                poster: "../video/movie-1.1.mp4"
            }, {
                title: "2-1.nodejs入口文件分析和初始化",
                _id: 2,
                poster: "../video/movie-1.2.mp4"
            }, {
                title: "2-2.创建jade视图",
                _id: 3,
                poster: "../video/movie-1.3.mp4"
            }, {
                title: "2-3.伪造模板，跑通前后端",
                _id: 4,
                poster: "../video/movie-1.4.mp4"
            }, {
                title: "3-1.mongodb模型设计及编码",
                _id: 5,
                poster: "../video/movie-1.5.mp4"
            }, {
                title: "3-2.编写数据库交互代码",
                _id: 6,
                poster: "../video/movie-1.6.mp4"
            }, {
                title: "4-1.删除功能及项目生成文件",
                _id: 7,
                poster: "../video/movie-1.7.mp4"
            }]
        });
    });

    /* GET detail page. */
    router.get('/movie/:id', function(req, res, next) {
        res.render('pages/detail', {
            title: '电影网站——详情页',
            movie: [{
                doctor: "Scott",
                country: "中国",
                title: "nodejs 100分钟建站攻略！",
                year: 2017,
                poster: "../video/movie-1.7",
                language: "中文",
                flash: "../video/movie-1.7",
                summary: "想了解前后端同力合作的整个作业流程吗？本课程带你实现一个从前端到后端的项目，包括nodejs，express，mongodb，jade模板引擎的使用，以及bootstrap/jQuery的实际应用及场景评估，让你更好的窥探前端的职业发展，为进一步快速自学打下基础。"
            }]
        });
 });

    /* GET admin page. */
    router.get('/admin/movie', function(req, res, next) {
        res.render('pages/admin', {
            title: '电影网站——后台录入页',
            movie: {
                title: '',
                doctor: '',
                country: '',
                year: '',
                poster: '',
                flash: '',
                summary: '',
                language: ''
            }
        });
    });

    /* GET list page. */
    router.get('/admin/list', function(req, res, next) {
        res.render('pages/list', {
            title: '电影网站——列表页',
            movie: [{
                title: "nodejs 100分钟",
                _id: 1,
                doctor: "Scott",
                country: "中国",
                year: 2015,
                poster: "../video/movie-1.7.mp4",
                language: "中文",
                flash: "../video/movie-1.7.mp4",
                summary: "想了解前后端同力合作的整个作业流程吗？本课程带你实现一个从前端到后端的项目，包括nodejs，express，mongodb，jade模板引擎的使用，以及bootstrap/jQuery的实际应用及场景评估，让你更好的窥探前端的职业发展，为进一步快速自学打下基础。"
            }]
        });
     });

module.exports = router 