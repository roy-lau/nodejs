var net = require('net');

var server = net.createServer(function (socket){
  socket.on('data', function(data){
 //     socket.write(data);
        console.log(data.toString());
  })
})
server.listen(3000);

// 执行方法如下：
//  1. node echo_server.js
//  2. telnet 127.0.0.1 3000(telnet如果没有需要安装)
