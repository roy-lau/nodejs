
var http = require('http');
var server = http.createServer();

server.on('request',function (req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('nodejs http sever boot  success\n');
	}).listen(3000);
	console.log('server running at http://127.0.0.1:3000/')
