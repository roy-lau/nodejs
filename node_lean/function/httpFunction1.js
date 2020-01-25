var http = require("http");

http.createServer(function(request,response){
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("hello nodejs");
    response.end();
}).listen(8888);

//在浏览器里输入  localhost:8888
