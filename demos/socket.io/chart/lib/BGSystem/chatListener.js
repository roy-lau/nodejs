// 用事件发射器实现简单的发布/预定系统
var events = require("events");
var net = require("net");
var channel = new events.EventEmitter();
channel.clients = {};
channel.subsctiptions = {};

channel.on("join", function (id, client) {
  this.clients[id] = client; // 添加join事件的监听器，保存用户的client对象，以便程序可以将数据发送给用户
  this.subsctiptions[id] = function (senderId, message) {
    if (id != senderId) {
      // 忽略发出这一广播数据的用户
      this.clients[id].write(message);
    }
  };
  this.on("broadcast", this.subsctiptions[id]); // 添加一个专门针对当前用户的broadcast事件监听器
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ":" + client.remoteport;
  client.on("connect", function () {
    channel.emit("join", id, client); // 当有用户链接到服务器上来时发送一个join事件，指明用户ID和client对象
  });
  client.on("data", function (data) {
    data = data.toString();
    channel.emit("broadcast", id, data); // 当有用户发送数据时，发出一个频道broadcast事件，指明用户ID和消息
  });
});

channel.on("leave", function (id) {
  // 创建leave事件的监听器
  channel.removeListener("broadcast", this.subscriptions[id]); // 移除指定客户端的broadcast监听器
  channel.emit("broadcast", id, id + "has left the chat./n");
});

var server = net.createServer(function (client) {
  client.on("close", function () {
    channel.emit("leave", id); // 用户断开链接时发送leave事件
  });
});

// 停止聊天服务，但又不关掉服务器
channel.on("shutdown", function () {
  channel.emit("broadcast", "", "chat has shut down ./n");
  channel.removeAllListeners("broadcast");
  client.on("data", function (data) {
    data = data.toString();
    if (data == "shutdown\r\n") {
      channel.emit("shutdown");
    }
    channel.emit("broadcast", id, data);
  });
});

server.listen(3000);
