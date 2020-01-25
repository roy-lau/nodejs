//引入events(事件)模块 
var events = require('events')
//创建eventEmitter对象
var eventEmitter = new events.EventEmitter();

//创建事件处理程序
var connectHandler = function connected(){
	console.log("连接成功.");
    //触发data_received事件
	eventEmitter.emit('data_received');
}

//绑定connection事件处理程序
eventEmitter.on('connection',connectHandler);

//使用匿名函数绑定data_received事件
eventEmitter.on('data_received',function(){
	console.log('数据连接成功。');
	});

//触发connection事件
eventEmitter.emit('connection');
console.log("程序执行完毕。")
// Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。

//当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。

//这个模型非常高效可扩展性非常强，因为webserver一直接受请求而不等待任何读写操作。（这也被称之为非阻塞式IO或者事件驱动IO）
//在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数。


