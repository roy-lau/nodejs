/**
 * 下载病例
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
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
const query_PAT_VISIT = async (patient_no) => {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query `SELECT
				PATIENT_NO,
				PATIENT_ID AS '住院ID',
				INP_NO AS '住院流水号',
				NAME AS '患者姓名',
				'患者性别' = ( CASE SEX WHEN '0' THEN '女' WHEN '1' THEN '男' END ),
				AGE AS '患者年龄',
				ADMISSION_DATE AS '入院日期',
				DISCHARGE_DATE AS '出院日期',
				OUT_STATUS AS '离院方式'
			FROM
				[dbo].[PAT_VISIT]
			WHERE
			PATIENT_NO IN (${patient_no}) AND SD_CODE='YXA_O'`,
            ret_PAT_VISIT = list_PAT_VISIT.recordset,

            // 查询数据元 和数据项做对比
            list_PAT_SD_ITEM_RESULT = await sql.query `SELECT
	            a.PATIENT_NO,
				b.ITEM_NAME,
				a.SD_ITEM_VALUE,
				b.ITEM_UNIT
			FROM
				[dbo].[PAT_SD_ITEM_RESULT] AS a,
				[dbo].[SD_ITEM_DICT] AS b
			WHERE
				a.PATIENT_NO IN (${patient_no})
				AND a.SD_ITEM_CODE= b.ITEM_CODE
				AND b.ITEM_CV_CODE= ''
			UNION ALL
			SELECT
				a.PATIENT_NO,
				b.ITEM_NAME,
				c.CV_VALUE_TEXT,
				b.ITEM_UNIT
			FROM
				[dbo].[PAT_SD_ITEM_RESULT] AS a,
				[dbo].[SD_ITEM_DICT] AS b,
				[dbo].[SD_ITEM_CV_DICT] AS c
			WHERE
				a.PATIENT_NO IN (${patient_no})
				AND c.SD_CODE= 'YXA_O'
				AND a.SD_ITEM_CODE= b.ITEM_CODE
				AND b.ITEM_CV_CODE= c.CV_CODE
				AND a.SD_ITEM_VALUE= c.CV_VALUE`,
            ret_PAT_SD_ITEM_RESULT = list_PAT_SD_ITEM_RESULT.recordset

        let retPatVisit = ret_PAT_VISIT

        for (let i = 0; i < ret_PAT_VISIT.length; i++) {

            for (let k = 0; k < ret_PAT_SD_ITEM_RESULT.length; k++) {
                if (retPatVisit[i].PATIENT_NO === ret_PAT_SD_ITEM_RESULT[k].PATIENT_NO) {
                    /**
                     * 拼接出一个表头
                     * 如果有单位( ITEM_UNIT ) 表头为 字段名(ITEM_NAME) 加 单位(ITEM_UNIT)
                     * 如果没有单位( ITEM_UNIT ) 表头为 字段名(ITEM_NAME)
                     */
                    let _key = !!ret_PAT_SD_ITEM_RESULT[k].ITEM_UNIT ?
                        '' + ret_PAT_SD_ITEM_RESULT[k].ITEM_NAME + '(' + ret_PAT_SD_ITEM_RESULT[k].ITEM_UNIT + ')' :
                        '' + ret_PAT_SD_ITEM_RESULT[k].ITEM_NAME

                    retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].SD_ITEM_VALUE
                }
            }
        }
        console.log('处理患者基本信息表')
        // console.log(list_PAT_SD_ITEM_RESULT)
        // console.log(ret_PAT_SD_ITEM_RESULT)
        // console.log(retPatVisit)
        // await saveFile('./out/list_PAT_VISIT.json', JSON.stringify(list_PAT_VISIT.recordsets[0], null, 2))
        // await saveFile('./out/./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))
        return ret_PAT_VISIT
    } catch (err) {
        console.error(err)
    }
}

// 下载引流管信息表
const query_PAT_DRAINAGE_TUBE = async (patient_no) => {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询引流管信息表
        const list_PAT_DRAINAGE_TUBE = await sql.query `SELECT
				PATIENT_NO,
				TUBE_NAME AS '引流管部位',
				RETENTION_DAYS AS '留置天数',
				POD1,
				POD3,
				POD7,
				AMY_POD1,
				AMY_POD3,
				AMY_POD7,
				AMY_POD_DRAW AS '拔管前'
			FROM
				[dbo].[PAT_DRAINAGE_TUBE]
			WHERE PATIENT_NO IN (${patient_no})`,
            ret_PAT_DRAINAGE_TUBE = list_PAT_DRAINAGE_TUBE.recordset

        console.log('处理引流管表')
        return ret_PAT_DRAINAGE_TUBE
        // await saveFile('./out/ret_PAT_DRAINAGE_TUBE.json', JSON.stringify(ret_PAT_DRAINAGE_TUBE, null, 2))

    } catch (err) {
        console.error(err)
    }
}

// 下载随访信息
const query_PAT_FOLLOW_UP_RESULT = async (patient_no) => {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询随访信息
        const list_PAT_FOLLOW_UP = await sql.query `SELECT
					PATIENT_NO,
					FU_TIMES,
					FOLLOW_UP_DATE AS '随访时间',
					FOLLOW_UP_MONTHS AS '随访时长'
				FROM
					[dbo].[PAT_FOLLOW_UP]
				WHERE
					PATIENT_NO IN (${patient_no})`,
            ret_PAT_FOLLOW_UP = list_PAT_FOLLOW_UP.recordset,

            list_PAT_FOLLOW_UP_RESULT = await sql.query `SELECT
				dist.PATIENT_NO,
				dist.FU_TIMES,
				dist.SD_ITEM_CODE,
				code.ITEM_NAME,
				dist.SD_ITEM_VALUE,
				cv.CV_VALUE_TEXT
			FROM
				[dbo].[PAT_FOLLOW_UP_RESULT] AS dist
				LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS code ON dist.SD_ITEM_CODE= code.ITEM_CODE
				LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS cv ON cv.SD_CODE!= 'YXA'
				AND code.ITEM_CV_CODE= cv.CV_CODE
				AND dist.SD_ITEM_VALUE= cv.CV_VALUE
			WHERE
				dist.PATIENT_NO IN (${patient_no})`,
            ret_PAT_FOLLOW_UP_RESULT = list_PAT_FOLLOW_UP_RESULT.recordset

        // console.log(ret_PAT_FOLLOW_UP)

        let retPatFollowUP = ret_PAT_FOLLOW_UP

        for (let i = 0; i < ret_PAT_FOLLOW_UP.length; i++) {

            for (let k = 0; k < ret_PAT_FOLLOW_UP_RESULT.length; k++) {
                if (retPatFollowUP[i].PATIENT_NO === ret_PAT_FOLLOW_UP_RESULT[k].PATIENT_NO) {

                    let _key = ret_PAT_FOLLOW_UP_RESULT[k].ITEM_NAME

                    retPatFollowUP[i][_key] = ret_PAT_FOLLOW_UP_RESULT[k].CV_VALUE_TEXT ?
                        ret_PAT_FOLLOW_UP_RESULT[k].CV_VALUE_TEXT :
                        ret_PAT_FOLLOW_UP_RESULT[k].SD_ITEM_VALUE
                }
            }
        }

        console.log('处理随访表')
        return retPatFollowUP
        // await saveFile('./out/ret_PAT_FOLLOW_UP.json', JSON.stringify(ret_PAT_FOLLOW_UP, null, 2))
        // await saveFile('./out/ret_PAT_FOLLOW_UP_RESULT.json', JSON.stringify(ret_PAT_FOLLOW_UP_RESULT, null, 2))
        // await saveFile('./out/retPatFollowUP.json', JSON.stringify(retPatFollowUP, null, 2))

    } catch (err) {
        console.error(err)
    }
}

// 下载随访化疗信息
const query_PAT_FOLLOW_UP_TREAT = async (patient_no) => {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询引流管信息表
        const list_PAT_FOLLOW_UP_TREAT = await sql.query `SELECT
				PATIENT_NO,
				FU_TIMES,
				TREAT_NAME AS '治疗方法',
				DRUG_NAME AS '药品名称',
				DRUG_DOSE AS '剂量',
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
				[dbo].[PAT_FOLLOW_UP_TREAT]
			WHERE PATIENT_NO IN (${patient_no})`,
            ret_PAT_FOLLOW_UP_TREAT = list_PAT_FOLLOW_UP_TREAT.recordset

        console.log('处理化疗信息表')
        return ret_PAT_FOLLOW_UP_TREAT
        // await saveFile('./out/ret_PAT_FOLLOW_UP_TREAT.json', JSON.stringify(ret_PAT_FOLLOW_UP_TREAT, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function saveXlsx(fileName, numberArr) {


    const
        PAT_VISIT = await query_PAT_VISIT(numberArr),
        PAT_DRAINAGE_TUBE = await query_PAT_DRAINAGE_TUBE(numberArr),
        PAT_FOLLOW_UP_RESULT = await query_PAT_FOLLOW_UP_RESULT(numberArr),
        PAT_FOLLOW_UP_TREAT = await query_PAT_FOLLOW_UP_TREAT(numberArr)

    // 构建 workbook 对象
    let wb = {
        SheetNames: ['基本信息', '引流管', '随访', '化疗'],
        Sheets: {
            '基本信息': XLSX.utils.json_to_sheet(PAT_VISIT),
            '引流管': XLSX.utils.json_to_sheet(PAT_DRAINAGE_TUBE),
            '随访': XLSX.utils.json_to_sheet(PAT_FOLLOW_UP_RESULT),
            '化疗': XLSX.utils.json_to_sheet(PAT_FOLLOW_UP_TREAT),
        }
        // Styles:workbook['Styles']
    }

    // 导出 Excel
    XLSX.writeFile(wb, './out/' + fileName + '.xlsx');
    console.log('OK ', Date.now())
}

async function main() {

    const config = require('./config.json')
    await sql.connect(SQL_ADDR)
    config.forEach(item => {
        saveXlsx(item.addr, item.list)

    })
}

main()