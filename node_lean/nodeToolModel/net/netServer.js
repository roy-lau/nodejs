var net = require('net');

var server = net.createServer(function(connection) {
    console.log('客户端链接中……');
    connection.on('end', function(){
        console.log('客户端关闭链接');
    });
    connection.write("后台监控中……!\r\n");
    connection.pipe(connection);
});

server.listen(8080, function(){
    console.log('server is listening');     //服务器监听端口
});
