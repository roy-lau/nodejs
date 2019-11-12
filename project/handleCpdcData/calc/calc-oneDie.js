'use strict';
const sql = require('mssql'),
    config = require("../config.js")

async function usePool() {
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const opList = await pool.query `SELECT
				*
			FROM
				[dbo].[PAT_SD_ITEM_RESULT] AS a
			WHERE
				a.SD_ITEM_CODE = 'YXA_O_161'`,
            retOp = opList.recordset
        // console.log(retOp)
                let n = 1
        for (let i = 0; i < retOp.length; i++) {
            // console.log(retOp[i])
            const fuList = await pool.query `SELECT TOP
				1 *
			FROM
				[dbo].[PAT_FOLLOW_UP]
			WHERE
				FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
				AND PATIENT_NO = ${retOp[i].PATIENT_NO}
			ORDER BY
				FOLLOW_UP_DATE DESC`,
                retfu = fuList.recordset,
                inRetfu = retfu[0]
                if (inRetfu && inRetfu.FOLLOW_UP_MONTHS > 12) {
	                console.log(n++,inRetfu.FOLLOW_UP_MONTHS)
	                // console.log(inRetfu)
                }
        }
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}
usePool()