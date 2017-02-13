var http = require('http')
var querystring = require('querystring')    // 这个包可以序列化对象

var postData =  querystring.stringify({
//    'content': ''，   // 这里放入要灌水的内容
//    'cid':          
})

var options = {
//    hostname: '',       // 这里填入主机名，如www.baidu.com
//    port: ,             // 端口号
//    path: '',           // 网页路径
//    method: 'POST',     //发送方式
//    headers: {
//          ......
//        
//         'Content-Length':postData.length,    //当前提交数据的长度。（服务器会检测提交的数据长度是否一致）
//          ......
    }
}

// 发起http请求
var req = http.request(options, function(res){
    console.log('请求成功，状态码：' + res.status)
    console.log('请求成功，头信息：' + JSON.stringify(res.headers))

    res.on('data', function(chunk){
        console.log('数据是否是Buffer类型' + Buffer.isBuffer(chunk))
        console.log(typeof chunk)
    })

    res.on('end',function(){
        console.log('灌水成功！')
    })
})

req.on('error', function(e){
    console.error('错误信息：' + e.messsage)
})
req.write(postData)
req.end()
