'use strict';

const ADODB = require('node-adodb'),
    cluster = require('cluster'),
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
// 清空三个随访表
async function clearByFollowTable() {
    console.time('清空三个随访表-用时')
    try {
        await connection.execute('DELETE FROM PAT_FOLLOW_UP');
        await connection.execute('DELETE FROM PAT_FOLLOW_UP_RESULT');
        const idNum = await connection.execute('DELETE FROM PAT_FOLLOW_UP_TREAT', 'SELECT @@Identity AS id');
        console.log(JSON.stringify(idNum, null, 2));
    } catch (error) {
        console.error(error)
    }
    console.timeEnd('清空三个随访表-用时')
}

// 插入SQL （随访三个表）
async function insertByFollowTable(index, count) {
    // await clearByFollowTable()
    try {
        const SQL_STR = await fs.readFileSync("./sql.txt", "utf-8"),
            SQL_ARR = SQL_STR.split('\n')

        let len = SQL_ARR.length, // 长度(总)
            interval = len / count, // 区间
            _index = Math.floor(interval * index),
            _count = Math.ceil(interval * (index + 1))

        for (let i = _index; i < _count; i++) {
            console.log(`第${index}个核心在工作，进度${_count}/${i}`)
            await connection.execute(SQL_ARR[i]);
        }

    } catch (error) {
        console.error(error)
    }
}

/*function test_cluster(index, count) {
    const len = 100, // 长度(总)
        interval = len / count, // 区间
        _index = interval * index,
        _count = interval * (index+1)
    // console.log(_index,_count)

    for (let i = _index; i < _count; i++) {
        console.log(index+'--'+ i)
    }
}
*/
    // clearByFollowTable()
if (cluster.isMaster) {

    let numCPUs = require('os').cpus().length;

    console.time('插入用时')
    for (let i = 0; i < numCPUs; i++) {
        let worker = cluster.fork();
        worker.on('message', async (msg) => {
            // console.log(msg.cmd)
            await insertByFollowTable(i, numCPUs)
        })
    }
    console.timeEnd('插入用时')

} else {
    process.send({ cmd: 'notifyRequest' });
}