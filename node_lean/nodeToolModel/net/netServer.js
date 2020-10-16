var net = require("net");

// 创建个 socket 服务
var server = net
  .createServer(function (socket) {
    console.log("客户端链接中……");

    // 接收客户端发来的信息
    socket.on("data", function (data) {
      console.log("服务器接收信息：", data.toString());
    });

    // 监听客户端断开连接事件
    socket.on("end", function () {
      console.log("客户端关闭链接");
    });

    // 向客户端发送数据
    socket.write("你好 客户端……!\r\n");

    socket.pipe(socket);
  })
  .on("error", (err) => {
    // 处理错误
    throw err;
  });

server.listen(8080, function () {
  console.log("server is listening\n", server.address()); //服务器监听端口
});
