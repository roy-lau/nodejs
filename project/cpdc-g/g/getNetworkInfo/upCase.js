const Axios = require('axios'),
    fs = require('fs'),
    path = require('path'),
    URL_xh = 'https://chinacpdc.org.cn:9120/api/',
    URL_conpany = 'http://192.168.1.253:8087/api/'

/*
	登录
 */

async function login () {
    try {
        const { data: res } = await Axios.post(URL_conpany + 'Login/Login', { UserName: "BguAbPL6", PassWord: "55Z8yj4hMaN5", ipAddress: "", macAddress: "", RoleCode: "admin" })
        return res.Data
    } catch (e) {
        console.error(e)
    }
}
// 获取文件下载路径 (不需要token也能下载)

async function upCaseFile () {
    try {
        const FormData = require('form-data'),
            fs = require('fs'),
            http = require('http'),
            form = new FormData(),
            loginData = await login()

        form.append('UserId', loginData.UserId);
        form.append('HospitalId', 'bdf2906bc6d18a8d'); // 瑞金
        form.append('HospitalName', '上海交通大学医学院附属瑞金医院'); // 瑞金
        form.append('file', fs.createReadStream("./19年5-12.ry"));//'file'是服务器接受的key

        let headers = form.getHeaders();//这个不能少
        // headers.Cookie = cookie;//自己的headers属性在这里追加
        // Host: 192.168.1.253:8087
        // User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0
        // Accept: */*
        // Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
        // Accept-Encoding: gzip, deflate
        // Authorization: Basic eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VySWQiOiIyODMxNTgxZjU4MWZmNTI5IiwiRXhwIjoxNTg2ODQyNjMwLCJTZXNzdGlvbklkIjoiZjY1NTUwNjAtOWYzNC00MDdmLTkzZjQtOWRmM2Q5NGE5NzAwIiwiViI6MX0.CNvp4BcCo4oBMbjvk-UMbwefZSP3xDF7w0M2pnDA064
        // Content-Type: multipart/form-data; boundary=---------------------------192779788738160778843155839448
        // Content-Length: 843819
        // Origin: http://192.168.1.253:8084
        // Connection: keep-alive
        // Referer: http://192.168.1.253:8084/
        
        // headers.Host = '192.168.1.253:8087'
        // headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0'
        // headers.Accept = '*/*'
        // headers['Accept-Language'] = 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2'
        // headers['Accept-Encoding'] = 'gzip, deflate'
        // headers['Content-Length'] = 843819
        // headers.Origin = 'http://192.168.1.253:8084'
        // headers.Connection = 'keep-alive'
        // headers.Referer = 'http://192.168.1.253:8084/'
        headers.Authorization = 'Basic ' + loginData.Token//自己的headers属性在这里追加
        console.log(headers)

        // console.log(form)

        let request = http.request({
            method: 'post',
            // host: 'chinacpdc.org.cn',
            // port: 9120,
            host: '192.168.1.253',
            port: 8087,
            path: '/api/Case/PostFile',
            headers: headers
        }, function (res) {
            let str = '';
            res.on('data', buffer => {
                str += buffer;//用字符串拼接
            });
            res.on('end', () => {
                //上传之后result就是返回的结果
                let result = JSON.parse(str);
                console.log("响应：", result)
            });
            res.on('error', err => {
                console.error("接收失败 ", err)
            });
        });
        request.on("error", err => {
            console.error("发送失败 ", err)
        })
        // console.log(request)
        request.end()
    } catch (e) {
        console.error('catch ERR: ', e)
    }
}

upCaseFile()