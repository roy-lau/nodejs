var fs = require("fs");
var zlib = require("zlib");

//解压output.txt.gz为output.txt
fs.createReadStream("output.txt.gz")
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream("output.txt"));

console.log("文件解压完成。");
