/*
 mssql模块简单封装
*/

'use strict';
const SQL = require('mssql'),
    config = require("../config.js")



const db = {
    // 基于事务的方式 执行SQL
    query(sql) {
        return new Promise((resolve, reject) => {
          // 创建连接池
            const pool = new SQL.ConnectionPool(config.db_addr, (err) => {

                // 创建事务连接池
                const transaction = new SQL.Transaction(pool)

                // 开启事务
                transaction.begin(err => {
                    if (err) reject('【SQL server】 transaction.begin err: '+ err) // 开始启动事务出错

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
                                        if (err) reject('【SQL server】 transaction.rollback err: '+ err) // 回滚出错
                                        console.info('【SQL server】 成功回滚')
                                    })
                                }
                                if (err) reject('【SQL server】 Request.query err: '+ err)
                            } else {
                                transaction.commit(err => {
                                    if (err) reject('【SQL server】 transaction.commit err: '+ err)
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

// module.exports = db;



  // cosnt db = require('./db');

  async function handle(){

   try  {
      const result = await db.query(`SELECT
  PATIENT_NO,
  FU_TIMES,
  TREAT_NAME AS '治疗方式',
  DRUG_NAME AS '药品名称(通用名)',
  DRUG_NAME_TRADE AS '药品名称(商品名)',
  DRUG_DOSE AS '剂量',
  TREAT_CYCLE AS '疗程/周期',
  TREAT_METHOD AS '化疗方法',
  TREAT_EFFECT AS '是否好转',
  TREAT_COST AS '化疗费用',
  CA199_FRONT AS '治疗前CA199',
  CEA_FRONT AS '治疗前CEA',
  CA125_FRONT AS '治疗前CA125',
  TREAT_EVALUTE_FRONT AS '术前CT评价',
  CA199_AFTER AS '治疗后CA199',
  CEA_AFTER AS '治疗后CEA',
  CA125_AFTER AS '治疗后CA125',
  TREAT_EVALUTE_AFTER AS '术后CT评价'
FROM
  [dbo].[PAT_FOLLOW_UP_TREAT]`)
     console.log('用户总数为 :',result);
   }catch (err){
    console.error(err)
   }
  }

  handle();

