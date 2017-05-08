var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
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
                req.snd('没有api信息')
            }
        })
    });
app.use('/api', appRouter);
app.listen(9090, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('listen at API http://localhost:9090/api')
})
