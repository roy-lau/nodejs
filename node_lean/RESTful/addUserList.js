var express = require("../Express/node_modules/express");
var app = express();
var fs = require("fs");

// 添加新用户数据
var user = {
  user4: {
    name: "mohit",
    password: "passwors4",
    prodession: "teacher",
    id: 4,
  },
};

app.get("/addUser", function (req, res) {
  // 读取已存在的数据
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    data["user4"] = user["user4"];
    console.log(data);
    res.end(JSON.stringify(data));
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("请访问：127.0.0.1:8080/adduser");
});
