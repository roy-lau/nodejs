var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var router = express.Router();

var index = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos');
var upload = require('./routes/upload');

// view engine setup
app.set('views', path.join(__dirname, 'views'));    	// 配置视图文件
app.set('view engine', 'ejs');      					// 配置视图模板
app.set('upload', path.join(__dirname, 'public/images'));    	// 设置存放文件的路径

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));         // 输出有颜色区分的日志，便于开发调试
app.use(bodyParser.json());     // 解析请求体req.body为json格式
app.use(bodyParser.urlencoded({ extended: false }));	// 创建 application/x-www-form-urlencoded 解析
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    // 提供./pulic下的静态文件

app.use('/', index);
app.use('/users', users);
app.use('/photos', photos);

// app.use('/upload/', upload);

app.get('/upload', upload.form);
app.post('/upload', upload.submit(app.get('upload')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 返回错误页
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
