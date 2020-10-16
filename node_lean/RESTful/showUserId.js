var express = require("../Express/node_modules/express");
var app = express();
var fs = require("fs");

app.get("/:id", function (req, res) {
  //读取已存在的用户
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    var user = data["user" + req.params.id];
    console.log(user);
    res.end(JSON.stringify(user));
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address.port;

  console.log("请访问127.0.0.1:8080/1-3");
});
