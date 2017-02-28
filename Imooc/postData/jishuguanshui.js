var http = require('http')
var querystring = require('querystring') // 这个包可以序列化对象

var postData = querystring.stringify({
    'content': 'postData1', // 这里放入要灌水的内容
    // 'cid': 311   //提交的ID  在表单数据：查看mid
    'cid': 'infocenter'
})

var options = {
    hostname: 'h5.qzone.qq.com', // 这里填入主机名，如www.baidu.com
    port: 80, // 端口号
    path: '/897379293/infocenter', // 网页路径
    method: 'POST', //发送方式
    headers: {
        'Host': 'h5.qzone.qq.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:51.0) Gecko/20100101 Firefox/51.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        Cookie: 'pt2gguin=o0897379293; ptcz=192ecbb0881cfb9e318df6b2483ce4f46e698b3b5d3bc5031c9f50a9e643f999; ptui_loginuin=qiangliu@cncaas.cn; pgv_pvid=8537430836; QZ_FE_WEBP_SUPPORT=0; o_cookie=897379293; pgv_gdtid=juk2ywalbiamimxdy6la; pgv_pvi=824552448; RK=lMVnbCbqUQ; uin=o0897379293; skey=@CjCB1JSeS; Loading=Yes; p_skey=qioBqWP9ctXI1TM1A0QnZxMHbTrAIAJt89WmHwK5bVM_; p_uin=o0897379293; pt4_token=mXRfROYVYCqMU5Jeh1ptblBHCFxpk-uviPHrhm3xLTQ_; pgv_info=ssid=s7973702664; cpu_performance_v8=23; pgv_si=s7619046400; rv2=80D1B3ED2FC86054119E972E69CFD148D416A86CC8373F685D; property20=073DCF73F2F0C0D8653BB3A115E59FA0684D2D7385FB22033BD118F2161F8A6A902CB4C2F5C7750D; __Q_w_s_hat_seed=1; __Q_w_s__QZN_TodoMsgCnt=1',
        Connection: 'keep-alive',
        Origin:'h5.qzone.qq.com',
        Referer:'http://user.qzone.qq.com/897379293/infocenter',
        'Upgrade-Insecure-Requests': 1,
        "Content-Type": 'application/x-www-form-urlencoded',

        'Content-Length': postData.length //当前提交数据的长度。（服务器会检测提交的数据长度是否一致）
    }
}



// 发起http请求
var req = http.request(options, function(res) {
    console.log('请求成功，状态码1：' + res.status)
    console.log('请求成功，头信息：' + JSON.stringify(res.headers))

    res.on('data', function(chunk) {
        console.log('数据是否是Buffer类型2' + Buffer.isBuffer(chunk))
        console.log(typeof chunk)
    })

    res.on('end', function() {
        console.log('灌水成功3！')
    })
})

req.on('error', function(e) {
    console.error('错误信息--------4:' + e.messsage)
})
req.write(postData)
req.end()
