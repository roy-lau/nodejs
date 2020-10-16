var http = require("http");

function onRequest(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.write("hello nodejs");
  response.end();
}

http.createServer(onRequest).listen(8888);
//在浏览器里输入  localhost:8888
