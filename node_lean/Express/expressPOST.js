var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// 创建 applaication/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extened: false });

app.use(express.static("public"));

app.get("/post.html", function (req, res) {
  res.sendFile(__dirname + "/" + "post.html");
});

app.post("/process_post", urlencodedParser, function (req, res) {
  //输出 JSON 格式
  response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("访问：127.0.0.1:8080/post.html");
});
