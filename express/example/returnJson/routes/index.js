var routes = require('express').Router()

// 路由表

var shopping = require('./vue-shopping')
var musicMobile = require('./vue-music-mobile')



routes.get('/', function(req, res) {
    res.json({ message: 'hi! 欢迎查看API ' })
});

// 电商网站
// routes.all('/:apiName', shopping)

// 移动端音乐播放器
routes.get('/getDiscList', musicMobile.getDiscList)
routes.get('/lyric', musicMobile.lyric)

module.exports = routes