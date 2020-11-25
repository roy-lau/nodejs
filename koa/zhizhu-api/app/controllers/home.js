const path = require('path')

class HomeCtl {
  index(ctx) {
    ctx.body = `<h1> 这是主页 </h1> <a href="upload.html">上传文件 demo </a>`
  }
  upload(ctx) {
    const file = ctx.request.files.file,
      basename = path.basename(file.path)
    ctx.body = { picUrl: `${ctx.origin}/uploads/${basename}` }
  }
}

module.exports = new HomeCtl()