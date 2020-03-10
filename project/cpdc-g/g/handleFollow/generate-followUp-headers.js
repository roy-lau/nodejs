/**
 * 生成随访表头
 */

'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    config = require("../config.js")

class Generate {
    constructor() {}
    // 查询随访字典
    async query_FU_SD_ITEM_DICT() {
        try {
            await sql.connect(config.db_addr)
            // 查询随访字典
            const list_FU_SD_ITEM_DICT = await sql.query `SELECT ITEM_CODE, ITEM_NAME, ITEM_UNIT,
				format = ( CASE ITEM_FORMAT WHEN '1' THEN '数字' WHEN '2' THEN '文字' WHEN '3' THEN '日期' WHEN '4' THEN '没有' WHEN '5' THEN '单选' END )
			FROM
				[dbo].[FU_SD_ITEM_DICT]`,
                ret_FU_SD_ITEM_DICT = list_FU_SD_ITEM_DICT.recordset

            let xlsxObj = {}
            let _key = null
            ret_FU_SD_ITEM_DICT.forEach(item => {
                if (item.ITEM_UNIT) {
                    _key = `${item.ITEM_NAME}(${item.ITEM_UNIT})<${item.format}>#${item.ITEM_CODE}`
                } else {
                    _key = `${item.ITEM_NAME}<${item.format}>#${item.ITEM_CODE}`
                }
                xlsxObj[_key] = ''
            })

            // console.log(xlsxObj)
            this.saveXlsx(xlsxObj)
        } catch (err) {
            console.error(err)
        }
    }
    saveXlsx(obj) {
        let wb = {
            SheetNames: ['sheet'],
            Sheets: {
                'sheet': XLSX.utils.json_to_sheet([obj])
            }
        }
        // 导出 Excel
        XLSX.writeFile(wb, '生成随访字典-表头.xlsx', );
    }
}

async function run() {
    const generate = new Generate()
    await generate.query_FU_SD_ITEM_DICT()
}

run()