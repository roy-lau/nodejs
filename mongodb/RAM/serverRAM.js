// 将访问次数放到内存上
var http = require('http');
var counter = 0;
http.createServer(function (request, response) {
  counter++;
	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain'},'utf8');

	// 发送响应数据 "Hello World"
	response.end('您是第： ' + counter + '  次访问');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
