var http = require('http');
var url = require('url');
var items = [];                   // 创建一个空数组存放数据

var server = http.createServer(function(req, res) {
    switch (req.method) {                             // req.method 是请求所用的HTTP方法
        case 'POST':
            var item = '';                            // 为进来的事项设置字符串缓存
            req.setEncoding('utf8');                  // 为进来的data事件设置编码为utf8字符串
            req.on('data', function(chunk) {
                item += chunk;                        // 将数据块拼接到缓存上
            });
            req.on('end', function() {
                items.push(item);                     // 将完整的新事项push到事项数组中
                res.end('OK\n');
            });
            break;
        case 'GET':
            items.forEach(function(item, i) {
                res.write(i + ') ' + item + '\n');
            });
            res.end();
            break;
        case 'DELETE':                                // 在switch语句中添加DELETE
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);

            if (isNaN(i)) {                           // 检查字数是否有效
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {                   // 确保请求的索引存在
                res.statusCode = 404;
                res.end('Item not found');
            } else {                                  // 删除请求的事项
                items.splice(i, 1);
                res.end('Ok\n');
            }
            break;
    }
});
server.listen(3000);
console.log('此程序测试方法如下：\n\n'
              + '   注： 参数-d会将请求方法设为POST，中文会出现乱码！\n\n'
              + "   步骤1. curl -d  '第一个待办事项' http://localhost:3000\n"
              + "   步骤2. curl -d  '第二个待办事项' http://localhost:3000\n"
              + '   步骤3. curl http://loaclhost:3000\n')
 
 
 
 
 