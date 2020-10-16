//链式流 ,压缩文件
//链式是通过连接输出流到另外一个流并创建多个对个流操作链的机制。链式流一般用于管道操作
var fs = require("fs");
var zlib = require("zlib");

//压缩output.txt文件为output.txt.gz
fs.createReadStream("output.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("output.txt.gz"));

console.log("文件压缩完成。");
