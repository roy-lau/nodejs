//评论功能
var http = require('http')
var querystring = require('querystring')

var postData = querystring.stringify({
    'content': '我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------我是来灌水的--------------------------',
    'cid': 8837 //提交的ID  在表单数据：查看mid
})
var options = {
    hostname: 'www.imooc.com',
    port: 80,
    path:'/course/ajaxmediauser', //路径 查看消息头： 请求网址
    method:'POST',
    headers:{
        'Host':'www.imooc.com',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0',
        'Accept':'application/json, text/javascript, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding':'gzip, deflate',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With':'XMLHttpRequest',
        'Referer':'http://www.imooc.com/video/8837',
        'Content-Length':postData.length,
        'Cookie':'imooc_uuid=23fb0fc6-ad6f-40d2-8667-8781e002bf04; imooc_isnew=2; imooc_isnew_ct=1448286380; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1448286401,1449758110,1450102551; loginstate=1; apsid=FiYjhlZDQzYjUyOTJmMDFjMTQ2YWYzYTVlOTk3ZWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMDUxMjY1NjUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjk2Mzk3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzNDIxOTEyODhAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGY0ZjQ5MTNjZmNhOTFkNmRiZTBhNWJhZTc3NDVmZjMxaQcEVL71R1Y%3DOT; IMCDNS=0; cvde=566ecf1642040-14; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1450105415; PHPSESSID=2vl74j2nm4iosiemadrjuancb3; jwplayer.qualityLabel=é«æ¸',
        'Connection':'keep-alive',
        'Pragma':'no-cache',
        'Cache-Control':'no-cache'
    }
}

var req = http.request(options, function(res){
    console.log('Status:' + res.statusCode)
    console.log('headers:' + JSON.stringify(res.headers))

    res.on('data', function(chunk){
        console.log(Buffer.isBuffer(chunk))
        console.log(typeof chunk)
    })

    res.on('end', function(){
        console.log('评论完毕！')
    })
})

req.on('error', function(e){
    console.log('Error:' + e.message)
})

req.write(postData)
req.end()