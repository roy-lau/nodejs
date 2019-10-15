/**
 * 根据病案号下载 所需相关信息
 */


'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
     uuidv4 = require('uuid/v4'),
    config = require("../../config.js")


const fileName = '病案号.xlsx',
    // const fileName = '长海三年随访更新_test.xlsx',
    workbook = XLSX.readFile(fileName, { cellDates: true, dateNF: 'YYYY/MM/dd' }),
    // 获取 Excel 中所有表名
    sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']


class Generate {
    constructor() {}
    getXlsxData() {
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet, { raw: false })
        return json
    }
    // 查询 出院时间 和 手术时间
    async query_date() {
        try {
        	let json = this.getXlsxData(),
        		retData = []

            const poll = await new sql.ConnectionPool(config.db_addr).connect()

        	for(let i = 0; i<json.length;i++){
        		console.log(i,'/',json.length)
	            let list_date = await poll.query `SELECT
						a.PATIENT_NO,
						a.INP_NO,
						a.NAME,
						a.DISCHARGE_DATE as '出院日期',
						b.SD_ITEM_VALUE as '手术日期'
					FROM
						[dbo].[PAT_VISIT] AS a
						LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS b ON a.PATIENT_NO=b.PATIENT_NO AND b.SD_ITEM_CODE='YXA_O_161'
					WHERE
						a.INP_NO= ${json[i]['病案号']}
						AND a.SD_CODE= 'YXA_O'`,
	                ret_date = list_date.recordset
                    ret_date[0].FU_TIMES = ('roy' + uuidv4().split('-')[4])
	                retData.push(ret_date[0])
        	}

            this.saveXlsx(retData)
        } catch (err) {
            console.error(err)
        }
    }
    saveXlsx(obj) {
        let wb = {
            SheetNames: ['sheet'],
            Sheets: {
                'sheet': XLSX.utils.json_to_sheet(obj)
            }
        }
        // 导出 Excel
        XLSX.writeFile(wb, '瑞金-根据病案号下载相关信息.xlsx', );
    }
}

async function run() {
    const generate = new Generate()
    await generate.query_date()
}

run()