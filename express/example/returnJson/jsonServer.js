var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    proxy = require('http-proxy-middleware'),
	app = express(),
    appRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

appRouter.get('/', function(req, res) {
    res.json({ message: 'hi! 欢迎查看API ' })
});
appRouter.route('/:apiName')
    .all(function(req, res) {
        fs.readFile('./db.json', 'utf8', function(err, data) {
            if (err) throw err
            var data = JSON.parse(data)
            if (data[req.params.apiName]) {
                res.json(data[req.params.apiName])
            } else {
                req.send('没有api信息')
            }
        })
    });
app.use('/api', appRouter);

// 代理服务

var options = {
        target: 'http://101.201.101.70:8080/ucrm', // 目标主机
        changeOrigin: true,               // 虚拟主机站点,配置为true可以结局跨域问题
        ws: true,                         // proxy websockets
        pathRewrite: {
            '^/api/old-path' : '/api/new-path',     // 重写路径
            '^/api/remove/path' : '/path'           // 删除的基本路径
        },
        router: {
            // 当请求头等于'dev.localhost:3000'时,
            // 覆盖目标 'http://www.example.org' to 'http://localhost:8000'
            'dev.localhost:9090' : 'http://101.201.101.70:8080/ucrm'
        }
    };

app.use('/path', proxy(options));


app.listen(9090, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('listen at API http://localhost:9090/api')
})
