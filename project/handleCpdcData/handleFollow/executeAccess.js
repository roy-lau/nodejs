'use strict';

const ADODB = require('node-adodb'),
    config = require('../config.js'),
    connection = ADODB.open(config.access_addr_c),
    moment = require('moment'),
    fs = require('fs')



// 删除
// await connection.execute("delete from PAT_VISIT where PATIENT_NO='1cc28e34c801d9fd'")
// 查询
// const users = await connection.query('SELECT * FROM Users');
// console.log(JSON.stringify(users, null, 2));


async function query_PAT_VISIT() {
    try {
        const userList = await connection.query('SELECT * FROM PAT_VISIT');
        console.log(JSON.stringify(userList, null, 2));

        /*
            将 Sql 语句写入文件
         */
        // 创建一个可以写入的流，写入到文件 output.txt 中
        let writerStream = fs.createWriteStream('PAT_VISIT.json');
        // console.log(SQL)
        // 使用 utf8 编码写入数据
        writerStream.write(JSON.stringify(userList, null, 2), 'UTF8');

        // 标记文件末尾
        writerStream.end();

        // 处理流事件 --> data, end, and error
        writerStream.on('finish', function() {
            console.log("写入完成。");
        });

        writerStream.on('error', function(err) {
            console.log(err.stack);
        });


    } catch (error) {
        console.error(error)
    }
}

// 查询随访表
async function query_PAT_FOLLOW_UP() {
    try {
        const PAT_FOLLOW_UP = await connection.query('SELECT * FROM PAT_FOLLOW_UP');
        console.log(JSON.stringify(PAT_FOLLOW_UP, null, 2));
    } catch (error) {
        console.error(error)
    }
}

// 全部提交（更新）
async function updata_PAT_SD_QUEUE() {
    try {
        const PAT_SD_QUEUE = await connection.query('SELECT * FROM PAT_SD_QUEUE');
        console.log(JSON.stringify(PAT_SD_QUEUE, null, 2));
        PAT_SD_QUEUE.forEach(item => {
            connection.execute(`UPDATE PAT_SD_QUEUE SET SUBMIT_USER_ID='02' SUBMIT_DATE='2019/08/28 01:56:66' WHERE PATIENT_NO='${item.PATIENT_NO}';`);
        })
    } catch (error) {
        console.error(error)
    }
}

// 删除
async function del_INSERT_PAT_FOLLOW_UP() {
    try {
        await connection.execute("delete from PAT_FOLLOW_UP where PATIENT_NO='1cc28e34c801d9fd'");

    } catch (error) {
        console.error(error)
    }
}

updata_PAT_SD_QUEUE()