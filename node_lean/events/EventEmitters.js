//引入events.js文件
var events = require('events');
var emitter = new events.EventEmitter();

emitter.on('someEvent', function (arg1, arg2){
	console.log('listener1', arg1, arg2);
	});

emitter.on('someEvent', function (arg1, arg2){
	console.log('listener2', arg1, arg2);
	});

emitter.emit('someEvent', 'arg1参数', 'arg2参数');

//emit是EventEmitter的简写，EventEmitter 译:事件发送器
