//依赖模块
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

//目标网址
var url = "https://cn.bing.com/images/search?q=%e7%be%8e%e5%a5%b3&form=HDRSC2&first=1&scenario=ImageBasicHover";

//本地存储目录
var dir = "./images";

//创建目录
fs.existsSync(dir) || fs.mkdir(dir, function (err) {
  if (err) console.error(err);
});

//发送请求
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // fs.writeFileSync("look.html",body)
    var $ = cheerio.load(body);
    var filenumber = 1
    $("a.thumb").each(function () {
      var src = $(this).attr("href");
      console.log("正在下载 %s - %s" ,filenumber, src);
      download(
        src,
        dir,
        (filenumber++) + src.substr(-4, 4)
      );
      console.log("下载完成");
    });
  }
});

//下载方法
var download = function (url, dir, filename) {
  request.head(url, function (err, res, body) {
    request(url).pipe(fs.createWriteStream(dir + "/" + filename));
  });
};
