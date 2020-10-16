// 发送txt格式的邮件

"use strict";
const email = require("emailjs");
var http = require("http");
var url = "http://101.201.101.70:8080/ucrm/";

var html = "";
http
  .get(url, function (res) {
    res.on("data", function (data) {
      html += data;
    });

    res.on("end", function () {
      console.log(html);
      var option = {
        userinfo: {
          user: "qiangliu@cncaas.cn",
          password: "qQ110110",
          host: "smtp.exmail.qq.com",
          ssl: true,
        },
        sendHtml: {
          from: "you <qiangliu@cncaas.cn>", // 发件人
          to: "another <897379293@qq.com>", // 收件人
          subject: "ucrm",
          attachment: [
            // html类型
            { data: html, alternative: true },
          ],
        },
      };
      let server = email.server.connect(option.userinfo);

      // send the message and get a callback with an error or details of the message that was sent
      server.send(option.sendHtml, (err, message) => {
        console.log(err || message);
      });
    });
  })
  .on("error", function () {
    console.error("获取数据出错！");
  });
