'use strict';
const sql = require('mssql'),
    config = require("../config.js")


// 查询16年做过胰头手术的患者
module.exports.jin = async function() {
    console.info('查询16年做过胰头手术的患者')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listJin = await pool.query `SELECT
                PATIENT_NO
            FROM
                [dbo].[PAT_SD_ITEM_RESULT] 
            WHERE
                SD_ITEM_CODE = 'YXA_O_152' 
                AND SD_ITEM_VALUE IN ( '1', '2', '3' ) 
                AND PATIENT_NO IN ( 
                SELECT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] 
                WHERE SD_ITEM_CODE = 'YXA_O_161' AND SD_ITEM_VALUE >= '2016-01-01 00:00:00' AND SD_ITEM_VALUE <= '2016-12-31 00:00:00' )`,
            retJin = listJin.recordset

        return retJin.map(item => item.PATIENT_NO)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}
// 根据38家医院id查询患者id
async function getHospitalSomeOne(hospitalName) {
    console.info('根据38家医院id查询患者id')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        let listHospital = []
        if (hospitalName) {
            listHospital = await getHospitalSomeOne(hospitalName)
        } else {
            listHospital = await getHospital38()
        }
        console.log(listHospital)
        const list38HospitalIdByPatientNo = await pool.query `SELECT
					PATIENT_NO
				FROM
					[dbo].[PAT_VISIT]
				WHERE
					HOSPITAL_ID IN (${listHospital})
					AND SD_CODE = 'YXA_O'`,
            ret38HospitalIdByPatientNo = list38HospitalIdByPatientNo.recordset

        return ret38HospitalIdByPatientNo.map(item => item.PATIENT_NO)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 根据医院名称查询医院id
async function getHospitalSomeOne(hospitalName) {
    console.info('根据医院名称查询医院id')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listHospitalSomeOne = await pool.query(`SELECT * FROM [dbo].[HOSPITAL_DICT] WHERE HOSPITAL_NAME LIKE '%${hospitalName}%'`),
            retHospitalSomeOne = listHospitalSomeOne.recordset

        return retHospitalSomeOne.map(item => item.HOSPITAL_ID)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 查询一期38家医院
async function getHospital38() {
    console.info('查询一期38家医院')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const list38Hospital = await pool.query `SELECT
						TOP 38
								*
						FROM
							[dbo].[HOSPITAL_DICT]
						ORDER BY
							HOSPITAL_CODE`,
            ret38Hospital = list38Hospital.recordset

        return ret38Hospital.map(item => item.HOSPITAL_ID)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}
// query38HospitalIdByPatientNo()