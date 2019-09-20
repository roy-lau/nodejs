
'use strict';
const sql = require('mssql'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190902'

async function usePool() {
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();

        for (var i = 100; i >= 0; i--) {
			const users = await pool.query `SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO='01c7bf8461693338'`
        }
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}


async function noPool() {
    try {
        await sql.connect(SQL_ADDR)

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
