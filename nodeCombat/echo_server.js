var net = require('net'),
    num = 0;

var server = net.createServer(function(socket) {
    socket.on('data', function(data) {
        socket.write(data);
        console.log("第 "+ num++ +" 次触发");
        console.log(data.toString());
    })
    socket.on('error', (e) => {
        console.error(e.message);
    })
})
server.listen(3000);

// 执行方法如下：
//  1. node echo_server.js
//  2. telnet 127.0.0.1 3000(telnet如果没有需要安装)