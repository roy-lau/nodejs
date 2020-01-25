var http = require('http');
var url = require('url');
var util = require('util');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'text/plain'});      //注意头部类型 plain

    //解析 url 参数
    var params = url.parse(req.url, true).query;
    res.write("网络名:" + params.name);
    res.write("\n");
    res.write("网站 URL：" + params.url);
    res.end();

}).listen(3000);


console.log(" 在浏览器中访问 http://localhost:3000/user?name=菜鸟教程&url=www.runoob.com 然后查看返回结果: ")
