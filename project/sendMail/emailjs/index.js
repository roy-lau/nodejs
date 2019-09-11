// 发送txt格式的邮件

'use strict';
const email = require("emailjs");
const option = require("./src/config");
console.log()

let server 	= email.server.connect(option.userinfo);

// send the message and get a callback with an error or details of the message that was sent
server.send(option.sendZip , (err, message) => { console.log(err || message); });