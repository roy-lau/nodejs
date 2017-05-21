var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var _ = require('underscore')
var Moive = require("../models/movie")
mongoose.connect('mongodb://localhost/moive')

/* GET home page. */
router.get('/', function(req, res, next) {
    Moive.fetch(function(err, movies) {
        if (err) console.log(err)
        res.render('pages/index', {
            title: '电影网站——首页',
            movies: movies
        });
    })
});

/* GET detail page. */
router.get('/movie/:id', function(req, res, next) {
    var id = req.params.id // 获取当前路由的id

    Moive.findById(id, function(err, movie) {
        res.render('pages/detail', {
            title: '电影网站—--' + movie.title,
            movies: movie
        });
    })
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

/* GET post movie. */
router.get('/admin/update/:id', function(req, res) {
        var id = req.params.id
        if (id) {
            Moive.findById(id, function(err, movie) {
                req.render('admin', {
                    title: '电影网站——后台更新页',
                    movies: movie
                })
            })
        }
    })
    /* GET post movie. */
    // 将后台录入页传来的数据保存到数据库内
router.post('/admin/movie/new', function(req, res) {
        console.log(req.body)
    var id = req.body.movie._id,
        movieObj = req.body.movie,
        _movie;
    // 先判断传来的数据是否已经存在
    if (id !== 'undefined') {
        Moive.findById(id, function(err, movie) {
            if (err) console.log(err);
            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if (err) console.log(err)
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Moive({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function(err, movie) {
            if (err) console.log(err)
            res.redirect('/movie/' + movie._id)
        })
    }
})

/* GET list page. */
router.get('/admin/list', function(req, res, next) {
    Moive.fetch(function(err, movies) {
        if (err) console.log(err)
        res.render('pages/list', {
            title: '电影网站——列表页',
            movies: movie
        });
    });
});

module.exports = router
