module.exports = {
    /*
    发件人信息
    */
    userinfo: {
        user: "qiangliu@cncaas.cn",
        password: "qQ110110",
        host: "smtp.exmail.qq.com",
        ssl: true
    },
    /*
		纯文本格式
	*/
    sendTxt: {
        text: "此邮件使用emailjs发送，格式为txt。", // 邮件内容
        from: "you <qiangliu@cncaas.cn>", // 发件人
        to: "someone <qiangliu@cncaas.cn>, another <897379293@qq.com>", // 收件人(逗号隔开可以发送多个收件人)
        cc: "else <qiangliu@cncaas.cn>", // 抄送
        subject: "测试-gy-emalijs-标题-txt" // 邮件标题
    },
    /*
		HTML格式
	*/
    sendHtml: {
        from: "you <qiangliu@cncaas.cn>", // 发件人
        to: "another <897379293@qq.com>", // 收件人
        subject: "测试-gy-emalijs-标题-HTML+gif",
        attachment: [
            // html类型
            { data: "<html><h2>html标题</h2><p>一段内容</p></html>", alternative: true }
        ]
    },
    /*
		压缩包格式
	*/
    sendZip: {
        from: "you <qiangliu@cncaas.cn>", // 发件人
        to: "another <897379293@qq.com>", // 收件人
        subject: "测试-gy-emalijs-标题-HTML+zip",
        attachment: [
            // html类型
            { data: "<html><h2>zip邮件</h2><p>这是一个使用emailjs发送的带有压缩包的的邮件</p></html>", alternative: true },
            // zip类型，附件
            // path 是相对于index.js的
            { path: "src/assets/test-send--by-zip-file.zip", type: "application/zip", name: "附件-压缩包.zip" },
            { path: "src/assets/imges.gif", type: "image/gif", name: "附件-图片.gif" }
        ]
    },
    /*
    	带图片的HTMl邮件
    */
    sendImg: {
        from: "you <qiangliu@cncaas.cn>", // 发件人
        to: "another <897379293@qq.com>", // 收件人
        subject: "测试-gy-emalijs-标题-HTML+gif",
        attachment: [
            // html类型
            { data: "<html><h2>image邮件</h2><p>这是一个使用emailjs发送的带有图片的邮件</p><img src='cid:my-image' width='100' height ='50'></html>", alternative: true },
            // jpg 类型 附件
            // path 是相对于index.js的
            { path: "src/assets/imges.gif", type: "image/gif", headers: { "Content-ID": "<my-image>" } }
        ]
    }
}
