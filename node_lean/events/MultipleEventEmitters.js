var events = require("events");
var eventEmitter = new events.EventEmitter();

//监听器 #1
var listener1 = function listener1() {
  console.log("监听器 listener1执行。\n");
};

//监听器 #2
var listener2 = function listener2() {
  console.log("监听器 listener2 执行。\n");
};

//绑定connevtion事件，处理函数为listener1
eventEmitter.addListener("connection", listener1);

//绑定connection事件，处理函数为listener2
eventEmitter.on("connection", listener2);

var eventListeners = require("events").EventEmitter.listenerCount(
  eventEmitter,
  "connection"
);
console.log(eventListeners + " 个监听器监听链接事件。\n");

//处理 connection 事件
eventEmitter.emit("connection");

//移除监听的listener2函数
eventEmitter.removeListener("connection", listener1);
console.log("listener1 不受监听\n");

//触发连接事件
eventEmitter.emit("connection");

eventListeners = require("events").EventEmitter.listenerCount(
  eventEmitter,
  "connection"
);
console.log(eventListeners + "个监听器监听链接事件\n");

console.log("程序执行完毕……");
