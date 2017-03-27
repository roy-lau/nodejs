var http = require('http');

// 告诉服务器你要发送的json数据
var req = http.request({
    method: 'POST',
    port: 3000, 
    headers:{
      'Contetn-Type': 'application/json'
    }
});

// 开始发送一个超大的数组对象
req.write('[');
var n = 30000;
while (n--){
  req.write('"fink",');      // 数组中包含 300000 个字符串 "fink"
}
req.write('"You"]');
req.end();
