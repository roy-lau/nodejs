var http = require("http");
var url = require("url");

function start(route){
    function onRequest(req,res){
        var pathname = url.parse(req.url).pathname;
        console.log("Request for --" + pathname + "-- received.");     //pathname 打印出来的是端口后跟的路径

        route(pathname);

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write("hello nodejs");
        res.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log("Server has stared");
    }

    exports.start = start;
