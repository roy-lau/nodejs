const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const config = require("../config.js")

module.exports = {

    query (str) {

        const CON = new Connection(config.tdb_addr)
        return new Promise((resolve, reject) => {
            CON.on('connect', function (err) {  // 连接数据库，执行匿名函数
                if (err) {
                    console.error('数据库连接错误：请检查账号、密码是否正确,且数据库存在\n' + err)
                } else {
                    let request = new Request(str, function (err, rowCount) {
                        if (err) reject(err)
                        resolve(arr);
                        CON.close();
                    });

                    let arr = []
                    request.on('row', function (columns) {  // 查询成功数据返回
                        // const rows = Object.create(null)
                        const rows = {}
                        columns.forEach(function (column) {
                            rows[column.metadata.colName] = column.value;   // 获取数据		
                        });
                        arr.push(rows)
                    });

                    CON.execSql(request);   // 执行sql语句
                }
            });


        })
    }
}