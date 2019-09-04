// 下载病例
//
'use strict';
const sql = require('mssql'),
    fs = require('fs'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190701'

/**
 * 写入文件
 * @param  {[type]} fileName [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
async function saveFile(fileName, data) {
    fs.writeFile(fileName, data, function(err) {
        if (err) {
            console.log(fileName, "数据写入失败！");
            return console.error(err);
        }
        console.log(fileName, "数据写入成功！");
    });
}

// 下载基本信息表
const query_PAT_VISIT = async () => {
    try {
        await sql.connect(SQL_ADDR)
        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query `SELECT
				PATIENT_NO,
				PATIENT_ID AS '住院ID',
				INP_NO AS '住院流水号',
				NAME AS '患者姓名',
				SEX AS '患者性别',
				AGE AS '患者年龄',
				ADMISSION_DATE AS '入院日期',
				DISCHARGE_DATE AS '出院日期',
				OUT_STATUS AS '离院方式'
			FROM
				[dbo].[PAT_VISIT]
			WHERE
			INP_NO = '2392449' AND SD_CODE='YXA_O'`,
            PATIENT_NO = list_PAT_VISIT.recordsets[0][0].PATIENT_NO,

            // 查询数据元 和数据项做对比
            list_PAT_SD_ITEM_RESULT = await sql.query `SELECT
				b.ITEM_NAME,
				a.SD_ITEM_VALUE,
				b.ITEM_UNIT
			FROM
				[dbo].[PAT_SD_ITEM_RESULT] AS a,
				[dbo].[SD_ITEM_DICT] AS b
			WHERE
				a.PATIENT_NO= ${PATIENT_NO}
				AND a.SD_ITEM_CODE= b.ITEM_CODE
				AND b.ITEM_CV_CODE= ''
			UNION ALL
			SELECT
				b.ITEM_NAME,
				c.CV_VALUE_TEXT,
				b.ITEM_UNIT
			FROM
				[dbo].[PAT_SD_ITEM_RESULT] AS a,
				[dbo].[SD_ITEM_DICT] AS b,
				[dbo].[SD_ITEM_CV_DICT] AS c
			WHERE
				a.PATIENT_NO= ${PATIENT_NO}
				AND c.SD_CODE= 'YXA_O'
				AND a.SD_ITEM_CODE= b.ITEM_CODE
				AND b.ITEM_CV_CODE= c.CV_CODE
				AND a.SD_ITEM_VALUE= c.CV_VALUE`,
            ret_PAT_SD_ITEM_RESULT = list_PAT_SD_ITEM_RESULT.recordsets[0]

        console.log(ret_PAT_SD_ITEM_RESULT)


        // await saveFile('list_PAT_SD_ITEM_RESULT.json', JSON.stringify(list_PAT_SD_ITEM_RESULT.recordsets, null, 2))

    } catch (err) {
        console.error(err)
    }
}


query_PAT_VISIT()