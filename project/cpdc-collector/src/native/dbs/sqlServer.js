/*
 mssql模块简单封装
*/

'use strict';
const SQL = require('mssql'),
    config = require("../config.js")



const db = {
    // 基于连接池和事务的方式 执行SQL
    query(sql) {
        return new Promise((resolve, reject) => {
            // 创建连接池
            new SQL.ConnectionPool(config.db_addr).connect().then(pool => {

                // 创建事务连接池
                const transaction = pool.transaction()
                // const transaction = new sql.Transaction(pool)
                // 开启事务
                transaction.begin().then(t => {


                    // 监听 sql 事务是否已经回滚
                    let rolledBack = false
                    transaction.on('rollback', aborted => {
                        // emited with aborted === true
                        rolledBack = true
                    })

                    pool.request(transaction)
                        // new SQL.Request(transaction)
                        .query(sql, (err, result) => {
                            // insert should fail because of invalid value
                            if (err) {
                                // 如果已经回滚过，就不再回滚了
                                if (!rolledBack) {
                                    // 事务回滚
                                    transaction.rollback(err => {
                                        if (err) reject('【SQL server】 transaction.rollback err->\n ' + err) // 回滚出错
                                        console.info('【SQL server】 成功回滚')
                                    })
                                }
                                reject('【SQL server】 Request.query err->\n ' + sql + '\n' + err)
                            } else {
                                // 提交事务
                                transaction.commit(err => {
                                    // 提交出错
                                    if (err) reject('【SQL server】 transaction.commit err->\n ' + err)
                                    // 提交成功
                                    resolve(result)
                                })
                            }
                        })
                }).catch(err => {
                    if (err) reject('【SQL server】 transaction.begin err->\n ' + err) // 开始启动事务出错
                })
            }).catch(err => {
                console.error("【SQL server】 ConnectionPool and connect err->\n ", err)
            })
        })
    },
    queryT(sql) {
        return new Promise((resolve, reject) => {
            // 创建连接池
            const pool = new SQL.ConnectionPool(config.db_addr, (err) => {

                // 创建事务连接池
                const transaction = new SQL.Transaction(pool)

                // 开启事务
                transaction.begin(err => {
                    if (err) reject('【SQL server】 transaction.begin err->\n ' + err) // 开始启动事务出错

                    // 监听 sql 事务是否已经回滚
                    let rolledBack = false
                    transaction.on('rollback', aborted => {
                        // emited with aborted === true
                        rolledBack = true
                    })

                    new SQL.Request(transaction)
                        .query(sql, (err, result) => {
                            // insert should fail because of invalid value
                            if (err) {
                                // 如果已经回滚过，就不再回滚了
                                if (!rolledBack) {
                                    // 事务回滚
                                    transaction.rollback(err => {
                                        if (err) reject('【SQL server】 transaction.rollback err->\n ' + err) // 回滚出错
                                        console.info('【SQL server】 成功回滚')
                                    })
                                }
                                reject('【SQL server】 Request.query err->\n ' + sql + '\n' + err)
                            } else {
                                // 提交事务
                                transaction.commit(err => {
                                    // 提交出错
                                    if (err) reject('【SQL server】 transaction.commit err->\n ' + err)
                                    // 提交成功
                                    resolve(result)
                                })
                            }
                        })
                })

            })
        })
    },
    // 通过预处理的方式执行 SQL (可以防止SQL注入)
    query1(sql) {
        return new Promise((resolve, reject) => {
            const pool = new SQL.ConnectionPool(config.db_addr, (err) => {
                if (err) reject('SQL server 连接错误：', err)

                const ps = new SQL.PreparedStatement(pool)

                ps.prepare(sql, (err) => {
                    if (err) reject('SQL server prepare err：', err)

                    ps.execute('', (err, result) => {
                        if (err) reject('SQL server execute err：', err)

                        ps.unprepare(err => {
                            if (err) reject('SQL server unprepare err：', err)

                            resolve(result)

                        })
                    })
                })
            })
        })
    }
}

module.exports = db;