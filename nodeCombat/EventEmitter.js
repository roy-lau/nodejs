var EventEmitter = require('events').EventEmitter;
var channel = new EventEmitter();

//  监听人员进入
channel.on('join', function (){
  console.log('Welcome!');
});

channel.emit('join');
