// 发送压缩邮件

'use strict';
const adm_zip = require('adm-zip');
const email = require("emailjs");

// 压缩文价夹
let zip = new adm_zip();
zip.addLocalFolder('dist');
zip.writeZip('dist_electron_harsom.zip');

// 解压文件夹
// let unzip = new adm_zip('adm/adm-archive.zip');
// unzip.extractAllTo("adm/adm-unarchive/", /*overwrite*/true);


let option = {
    userinfo: {
        user: "13526636962@163.com",
        password: "roy123",
        host: "smtp.163.com",
        ssl: true
    },
    sendZip: {
        from: "you <13526636962@163.com>", // 发件人
        to: "another <897379293@qq.com>", // 收件人
        subject: "测试-gy-emalijs-标题-HTML+zip",
        attachment: [
            // html类型
            { data: "<html><h2>zip邮件</h2><p>这是一个使用emailjs发送的带有压缩包的的邮件</p></html>", alternative: true },
            // zip类型，附件
            // path 是相对于index.js的
            { path: "dist_electron_harsom.zip", type: "application/zip", name: "附件-压缩包.zip" },
            // { path: "src/assets/imges.gif", type: "image/gif", name: "附件-图片.gif" }
        ]
    }
}
const server = email.server.connect(option.userinfo);

// send the message and get a callback with an error or details of the message that was sent
server.send(option.sendZip, (err, message) => { console.log(err || message); });