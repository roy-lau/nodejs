var net = require("net");
var client = net.connect({ port: 8080 }, function () {
  console.log("连接到服务器！");
  // 给服务器发送数据
  client.write("你好 服务器!\r\n");
});
// 接收来自服务器的数据
client.on("data", function (data) {
  console.log("响应：", data.toString());
  client.end(); // 断开连接
});

// 监听断开事件
client.on("end", function () {
  console.log("断开与服务器的链接");
});

// 注：netServer.js运行的情况下，再运行本文件
