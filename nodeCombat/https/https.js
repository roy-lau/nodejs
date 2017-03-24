var https = require('https');
var fs = require('fs');

// 获取做为配置项的SSL秘钥和证书
var options = {
  key: fs.readFileSync('./key.pem'),    // 秘钥
  cert: fs.readFileSync('./key-cert.pem')   // 证书
};

https.createServer(options, function(req, res){     // 第一个传入的就是配置项对象
  res.writeHead(200);
  res.end('https server running seccus\n');
}).listen(3000);

console.log('server running at https://loaclhost:3000')
