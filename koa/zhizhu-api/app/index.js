const Koa = require('koa'),
  Router = require('koa-router'),
  koaBody = require('koa-body'), // koa-body 替换 koa-bodyparser，因为 koa-bodyparser 不支持上传文件
  koaStatic = require('koa-static'),
  parameter = require('koa-parameter'),
  error = require('koa-json-error'),
  mongoose = require('mongoose'),
  path = require('path'),
  app = new Koa(),
  router = new Router(),
  routing = require('./routes'),
  { connectionStr } = require('./config.js')


mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, () => {
  console.info("MongoDB 连接成功了💐")
})
mongoose.connection.on('error', console.error)
function formatError(err) {
  return {
    // Copy some attributes from
    // the original error
    status: err.status,
    message: err.message,

    // ...or add some custom ones
    success: false,
    reason: 'Unexpected'
  }
}

let options = {
  // Avoid showing the stacktrace in 'production' env
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  format: formatError
};
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error(options))
// 解析请求体
app.use(koaBody({
  multipart: true, // 支持上传文件
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 上传文件的存放路经
    keepExtensions: true // 是否保留文件扩展名
  }
}))
app.use(parameter(app)) // 校验参数

routing(app)

app.listen(3000, () => {
  console.info("listening 👀 http://localhost:3000")
})