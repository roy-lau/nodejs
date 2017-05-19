'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '897379293@qq.com',
        pass: 'jli98ujk7jk.'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '897379293@qq.com', // 发件地址
    to: '897379293@qq.com', // 收件列表
    subject: 'Hello', // 标题

//========text和html两者只支持一种
//    text: 'Hello world ?', //标题
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
