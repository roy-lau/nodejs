const fs = require("fs")

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file == 'index.js') return
    const route = require(`./${file}`)

    app.use(route.routes()) // koa 使用所有 koa-router 的接口
      .use(route.allowedMethods()) // 告诉 http options 支持的方法
  })
}