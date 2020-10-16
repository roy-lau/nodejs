var fs = require("fs");

module.exports = function (req, res) {
  // fs 默认从根路径读取文件
  fs.readFile("routes/vue-shopping/db.json", "utf8", function (err, data) {
    if (err) throw err;
    var data = JSON.parse(data);
    if (data[req.params.apiName]) {
      res.json(data[req.params.apiName]);
    } else {
      req.send("没有api信息");
    }
  });
};
