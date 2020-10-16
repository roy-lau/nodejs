var http = require("http"); // 内置http提供了http服务器和客户端功能
var fs = require("fs"); // 内置fs文件系统
var path = require("path"); // 内置的path模块提供了与文件系统路径相关的功能
var mime = require("mime"); // 附加的mime模块有根据文件扩展名得出MIME类型的能力
var cache = {}; // cache是用来缓存文件内容的对象
var chatServer = require("./lib/chat_server"); // 加载一个定制的Node模块，他提供的逻辑是用来处理基于Socket.IO的服务端聊天功能的

chatServer.listen(server); // 将server传递给chatServer模块的listen函数

function send404(res) {
  res.writeHead(404, { "content-type": "text/plain" });
  res.write("Error 404: resource not found.");
  res.end();
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(200, { "content-type": mime.lookup(path.basename(filePath)) });
  res.end(fileContents);
}
/*
 * 提供静态文件服务
 */
function serverStatic(res, cache, absPath) {
  if (cache[absPath]) {
    // 检查文件是否缓存在内存中
    sendFile(res, absPath, cache[absPath]); // 从内存中返回文件
  } else {
    fs.exists(absPath, function (exists) {
      // 检查文件是否存在
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          // 从硬盘中读取文件
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data); // 从硬盘中读取文件并返回
          }
        });
      } else {
        send404(res); // 发送HTTP 404响应
      }
    });
  }
}

/*
 * 创建HTTP服务器的逻辑
 */
var server = http.createServer(function (req, res) {
  // 创建HTTP服务器，用匿名函数定义对每个请求的处理行为
  var filePath = false;
  if (req.url == "/") {
    filePath = "public/index.html"; // 确定返回的默认HTML文件
  } else {
    filePath = "public" + req.url; // 将URL路径转化为文件的相对路径
  }
  var absPath = "./" + filePath;
  serverStatic(res, cache, absPath); // 返回静态文件
});

/*
 * 启动http服务器,监听端口
 */
server.listen(3000, function () {
  console.log("Sever listening on port 3000");
});
