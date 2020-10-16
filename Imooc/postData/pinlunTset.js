/**
 * 评论功能(测试)
 */
var http = require("http");
var querystring = require("querystring");

var postData = querystring.stringify({
  content: "我是来灌水的--------------------------",
  cid: 8837, //提交的ID  在表单数据：查看mid
});
var options = {
  hostname: "www.imooc.com",
  port: 80,
  path: "/course/ajaxmediauser", //路径 查看消息头： 请求网址
  method: "POST",
  headers: {
    Host: "www.imooc.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 6.1; rv:51.0) Gecko/20100101 Firefox/51.0",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    Referer: "http://www.imooc.com/video/8837",
    "Content-Length": postData.length,
    Cookie:
      "imooc_uuid=b1a13b10-8f91-43d9-ba7f-7d383cf46938; imooc_isnew=2; imooc_isnew_ct=1487740405; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1487740519,1487757909,1487757910,1487837935; IMCDNS=0; loginstate=1; apsid=EwNzk1ZDljNmM1MTFhNDczNjc0MGFjOTE5NDFjNGYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANDE2MTE3MwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4OTczNzkyOTNAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGExMjI3YTdjNzQ2MjQzMDIxYzA0MWY4NzNlNDU5NTEzSh6tWEoerVg%3DZD; last_login_username=897379293%40qq.com; PHPSESSID=8uaoifrhmdtbjrucqs9nd9vbc1; cvde=58ae9ad08834d-69; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1487844628",
    Connection: "keep-alive",
  },
};

var req = http.request(options, function (res) {
  console.log("Status:" + res.statusCode);
  console.log("headers:" + JSON.stringify(res.headers));

  res.on("data", function (chunk) {
    console.log(Buffer.isBuffer(chunk));
    console.log(typeof chunk);
  });

  res.on("end", function () {
    console.log("评论完毕！");
  });
});

req.on("error", function (e) {
  console.log("Error:" + e.message);
});

req.write(postData);
req.end();
