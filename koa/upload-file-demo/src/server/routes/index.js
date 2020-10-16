const uploadFile = require("./uploadFile");

module.exports = (routes) => {
  routes
    .get("/test", (ctx, next) => {
      ctx.body = { message: "hi! this is test API , ok " };
    })

    // 上传文件- 单
    .post("/upload-single", uploadFile.single)
    // 上传文件- 多
    .post("/upload-multiple", uploadFile.multiple)
    // 上传文件- 分片
    .post("/upload-fragmentation", uploadFile.fragmentation);
};
