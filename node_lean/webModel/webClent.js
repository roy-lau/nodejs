var http = require('http');

// 用于请求的选项
var options = {
    host: 'localhost',
    port: '8080',
    path: '/index.html'
};

// 处理响应的回调函数
var callback = function(res){
    // 不断更新数据
    var body = '';
    res.on('data', function(data){
        body += data;
    });

    res.on('end', function(){
        // 数据接收完成
        console.log(body);
    });
}

// 向服务器发送请求
var req = http.request(options, callback);
req.end();

// 注：在webModel.js运行时 运行当前js才能打印出数据
