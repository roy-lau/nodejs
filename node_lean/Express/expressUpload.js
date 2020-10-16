var express = require("express");
var app = express();
var fs = require("fs");

var bodyParser = require("body-parser");
var multer = require("multer");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: "/tmp/" }).array("image"));

app.get("/fileupload.html", function (req, res) {
  res.sendFile(__dirname + "/" + "fileupload.html");
});

app.post("/file_upload", function (req, res) {
  console.log(req.files[0]); // 上传文件的信息

  var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.error(err);
      } else {
        response = {
          message: "文件上传成功！",
          filename: req.files[0].originalname,
        };
      }
      console.log(response);
      res.end(JSON.stringify(response));
    });
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().post;

  console.log("请访问 127.0.0.1:8080/fileupload.html");
});
