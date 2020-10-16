var fs = require("fs");

fs.readFile("input.txt", function (err, data) {
  if (err) {
    console.log(err.stack); //读取文件错误抛出此异常
    return;
  }
  console.log(data.toString()); //打印文件内容
  console.log("程序读取完毕...");
});
