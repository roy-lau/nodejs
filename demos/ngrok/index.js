const ngrok = require('ngrok');
/**
 * 参考地址： https://github.com/bubenshchykov/ngrok
 */
(async function () {
    try {

        const url = await ngrok.connect({
            // proto: 'http', // http|tcp|tls, defaults to http
            addr: 8080, // port or network address, defaults to 80
            // auth: 'user:pwd', // http basic authentication for tunnel
            // subdomain: 'roylau', // reserved tunnel name https://roylau.ngrok.io
            authtoken: '86VHB6qU8AkfE8P76G4NE_7Qyw9RNELb5ueiRHt3fkx', // your authtoken from ngrok.com
            // region: 'cn', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
            // configPath: '~/git/project/ngrok.yml', // custom path for ngrok config file
            // binPath: default => default.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
            onStatusChange: status => {  // 'closed' - connection is lost, 'connected' - reconnected
                if(status === 'connected'){
                    console.log("连接成功：")
                }else if(status === 'closed'){
                    console.error("连接断开：")
                }
            },
            onLogEvent: data => { // returns stdout messages from ngrok process
                // 打印 ngrok 运行日志
                console.log("log --> ",data)
            }, 
        });

        // 打印外网地址（因为 ngrok 是国外的，所有需要翻墙才能访问）
        console.info('web addr: ',url)


        // 打印本地管理 ngrok 地址
        const apiUrl = ngrok.getUrl(url);
        console.log('admin addr: ',apiUrl)

    } catch (err) {
        console.error("ngrok connect err: ", err)
        await ngrok.disconnect(); // stops all
        await ngrok.kill(); // kills ngrok process
    }
})();