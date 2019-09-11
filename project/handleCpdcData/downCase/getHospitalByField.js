/**
 * 根据具体字段下载病例
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    { saveFileSync } = require('./utils'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190701'


/*

    要统计的字段和名称

    YXA_O_117 是否放化疗

    YXA_O_118 化疗药物名称(通用名)
    YXA_O_905 化疗药物名称(商品名)
    YXA_O_121 化疗周期/疗程

    YXA_O_152 手术方式
    YXA_O_158 胰瘘风险评分

    YXA_O_300 是否化疗
    YXA_O_301 药物名称（通用名）
    YXA_O_302 药物名称（商品名）
    YXA_O_304 周期/疗程

    YXA_O_243 术前检查费用
    YXA_O_244 术前放化疗费用
    YXA_O_245 手术费用
    YXA_O_246 术后治疗费用
    YXA_O_247 总费用

 */
// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
    try {
        await sql.connect(SQL_ADDR)
        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query `SELECT
                a.PATIENT_NO,
                -- a.NAME,
                -- b.HOSPITAL_ID,
                b.HOSPITAL_NAME AS '医院'
            FROM
                [dbo].[PAT_VISIT] AS a
                LEFT JOIN [dbo].[HOSPITAL_DICT] AS b ON a.HOSPITAL_ID=b.HOSPITAL_ID
            WHERE
                a.SD_CODE = 'YXA_O'
            --  AND DISCHARGE_DATE> '2016-01-01 00:00:00.000'
            --  AND DISCHARGE_DATE< '2016-12-31 00:00:00.000'
                AND DISCHARGE_DATE> '2017-01-01 00:00:00.000'
                AND DISCHARGE_DATE< '2017-12-31 00:00:00.000'
                AND a.HOSPITAL_ID IN (
                    '37127accb1918a8d',
                    '4456b5127cec8a8d',
                    '4eb4b66f46c50f17',
                    '703034868f4eea8d',
                    '8e91b6676d350a8d',
                    '9a9d9e15796b3a8d',
                    'a71157dc9cf12b17',
                    'd261d191ae048f17',
                    'd2bd353881b87597',
                    '34d52b2d3c774a8d',
                    'd4199f01698f2b17',
                'e6b6133dd6518a8d'
                )
                ORDER BY b.HOSPITAL_NAME`,
            ret_PAT_VISIT = list_PAT_VISIT.recordset,

            // 查询数据元 和数据项做对比
            list_PAT_SD_ITEM_RESULT = await sql.query `SELECT
                result.PATIENT_NO,
                b.ITEM_NAME,
                b.ITEM_CODE,
                'ret_value' = ( CASE result.SD_ITEM_VALUE WHEN c.CV_VALUE THEN c.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END ),
                b.ITEM_UNIT
            FROM
                [dbo].[PAT_SD_ITEM_RESULT] AS result
                LEFT JOIN [dbo].[SD_ITEM_DICT] AS b ON result.SD_ITEM_CODE= b.ITEM_CODE
                LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS c ON b.ITEM_CV_CODE= c.CV_CODE
                AND result.SD_ITEM_VALUE= c.CV_VALUE
            WHERE
                result.PATIENT_NO IN (${ret_PAT_VISIT.map(item => item.PATIENT_NO)})
                AND result.SD_CODE= 'YXA_O'
                AND b.ITEM_CODE IN ('YXA_O_117',
                'YXA_O_118',
                'YXA_O_905',
                'YXA_O_121',
                'YXA_O_152',
                'YXA_O_158',
                'YXA_O_300',
                'YXA_O_301',
                'YXA_O_302',
                'YXA_O_304',
                'YXA_O_243',
                'YXA_O_244',
                'YXA_O_245',
                'YXA_O_246',
                'YXA_O_247')
                ORDER BY b.ITEM_CODE`,
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
                        '' + ret_PAT_SD_ITEM_RESULT[k].ITEM_NAME + '(' + ret_PAT_SD_ITEM_RESULT[k].ITEM_UNIT + ')' + '#' + ret_PAT_SD_ITEM_RESULT[k].ITEM_CODE :
                        '' + ret_PAT_SD_ITEM_RESULT[k].ITEM_NAME + '#' + ret_PAT_SD_ITEM_RESULT[k].ITEM_CODE

                    retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].ret_value
                }
            }
        }
        console.log('处理患者基本信息表')
        // console.log(list_PAT_SD_ITEM_RESULT)
        // console.log(ret_PAT_SD_ITEM_RESULT)
        // console.log(retPatVisit)
        // await saveFileSync('./out/list_PAT_VISIT.json', JSON.stringify(list_PAT_VISIT.recordsets[0], null, 2))
        // await saveFileSync('./out/./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))
        return ret_PAT_VISIT
    } catch (err) {
        console.error(err)
    }
}


/**
 * 保存表格
 * @param  {String} fileName  文件名
 * @param  {Array} numberArr 患者 数组
 * @return {[type]}           [description]
 */
async function saveXlsx(fileName) {


    const
        PAT_VISIT = await query_PAT_VISIT()

    // 构建 workbook 对象
    let wb = {
        SheetNames: ['基本信息'],
        Sheets: {
            '基本信息': XLSX.utils.json_to_sheet(PAT_VISIT)
        }
        // Styles:workbook['Styles']
    }

    // 导出 Excel
    XLSX.writeFile(wb, './out/my/getField/' + fileName + '.xlsx');
    console.log('OK ', Date.now())
}

saveXlsx('根据医院和字段统计-17年')