/*
	一个健壮的 socket 服务器
 */
let net = require("net");
let server = net.createServer(),
  clientList = [];

server.on("connection", function (client) {
  // JS 可以为对象自由添加属性。这里我们添加一个 name 的自定义属性，用于表示哪个客户端（客户端的地址+端口为依据
  client.name = client.remoteAddress + ":" + client.remotePort;

  // 给客户端打个招呼
  client.write("Hi " + client.name + "!\n");

  clientList.push(client);

  // 监听客户端发来的数据
  client.on("data", function (data) {
    // client.write(data); // 发来什么就返回什么
    console.log(client.name + "\n", data.toString());
    broadcast(data, client);
  });

  // 客户端断开连接
  client.on("end", function () {
    clientList.splice(clientList.indexOf(client), 1); // 删除数组中的制定元素。这是 JS 基本功哦~
  });
  client.on("error", function (e) {
    console.log(e);
  });
});

/**
 * 处理客户端发来的数据
 *
 * @param  {[type]} message [description]
 * @param  {[type]} client  [description]
 * @return {[type]}         [description]
 */
function broadcast(message, client) {
  let cleanup = [];
  for (let i = 0; i < clientList.length; i += 1) {
    if (client !== clientList[i]) {
      if (clientList[i].writable) {
        // 先检查 sockets 是否可写
        clientList[i].write(client.name + " says \n " + message);
      } else {
        cleanup.push(clientList[i]); // 如果不可写，收集起来销毁。销毁之前要 Socket.destroy() 用 API 的方法销毁。
        clientList[i].destroy();
      }
    }
  } //Remove dead Nodes out of write loop to avoid trashing loop index
  for (i = 0; i < cleanup.length; i += 1) {
    clientList.splice(clientList.indexOf(cleanup[i]), 1);
  }
}

server.listen(9000);
