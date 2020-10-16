var express = require("../Express/node_modules/express");
var app = express();
var fs = require("fs");

var id = 2;

app.get("/delUser", function (req, res) {
  // 读取文件信息
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    delete data["user" + 2];

    console.log(data);
    res.end(JSON.stringify(data));
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("请访问 172.0.0.1:8080/delUser");
});
