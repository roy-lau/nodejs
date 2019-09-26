
'use strict';
const sql = require('mssql'),
    config = require("../config.js")

async function usePool() {
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        for (var i = 100; i >= 0; i--) {
			const users = await pool.query `SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO='01c7bf8461693338'`
        }
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}


async function noPool() {
    try {
        await sql.connect(config.db_addr)

        for (var i = 100; i >= 0; i--) {
			const users = await sql.query `SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO='01c7bf8461693338'`
        }
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}


console.time('不使用链接池')
noPool()
console.timeEnd('不使用链接池')

console.time('使用链接池')
usePool()
console.timeEnd('使用链接池')
