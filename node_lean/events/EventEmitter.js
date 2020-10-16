//引入events的EventEmitter(事件发送器)类
var EventEmitter = require("events").EventEmitter;
var event = new EventEmitter();

event.on("some_event", function () {
  console.log("some_Event 事件触发");
});

setTimeout(function () {
  event.emit("some_event"); //setTimeout 在 1000 毫秒以后向 event 对象发送事件 some_event
}, 1000);
