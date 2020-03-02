/**
 * 下载病例（北大）
 */
'use strict';
const sql = require('../dbs/sqlServer.js'),
    XLSX = require("xlsx"),
    moment = require('moment'),
    {
        desensitization,
        saveFileSync
    } = require('./utils')

// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
    console.time('处理患者基本信息表')
    try {

        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query(`SELECT
                a.PATIENT_NO,
                a.NAME AS '姓名'
            FROM
                [dbo].[PAT_VISIT] AS a
                LEFT JOIN [dbo].[HOSPITAL_DICT] as b ON a.HOSPITAL_ID=b.HOSPITAL_ID
            WHERE
                a.PATIENT_NO IN ( ${patient_no} )
                AND a.SD_CODE = 'YXA_O'`),
            ret_PAT_VISIT = list_PAT_VISIT.recordset

        // console.log(patient_no)

        let retPatVisit = ret_PAT_VISIT

        for (let i = 0; i < ret_PAT_VISIT.length; i++) {
            // 查询数据元 和数据项做对比
            const list_PAT_SD_ITEM_RESULT = await sql.query(`SELECT
                    result.PATIENT_NO,
                    b.ITEM_NAME,
                    b.ITEM_CODE,
                    'ret_value' = ( CASE result.SD_ITEM_VALUE WHEN c.CV_VALUE THEN c.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END ),
                    b.ITEM_FORMAT,
                    b.ITEM_CV_CODE,
                    b.ITEM_UNIT
                FROM
                    [dbo].[PAT_SD_ITEM_RESULT] AS result
                    LEFT JOIN [dbo].[SD_ITEM_DICT] AS b ON result.SD_ITEM_CODE= b.ITEM_CODE
                    LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS c ON b.ITEM_CV_CODE= c.CV_CODE
                    AND result.SD_ITEM_VALUE= c.CV_VALUE
                WHERE
                    result.PATIENT_NO= '${ret_PAT_VISIT[i].PATIENT_NO}'
                    AND result.SD_CODE= 'YXA_O'
                    AND b.ITEM_CODE IN (
                        'YXA_O_212',
                        'YXA_O_213',
                        'YXA_O_214',
                        'YXA_O_220',
                        'YXA_O_222',
                        'YXA_O_224'
                    )`),
                ret_PAT_SD_ITEM_RESULT = list_PAT_SD_ITEM_RESULT.recordset

            for (let k = 0; k < ret_PAT_SD_ITEM_RESULT.length; k++) {

                const result = ret_PAT_SD_ITEM_RESULT[k]

                if (retPatVisit[i].PATIENT_NO === result.PATIENT_NO) {
                    /**
                     * 拼接出一个表头
                     * 如果有单位( ITEM_UNIT ) 表头为 字段名(ITEM_NAME) 加 单位(ITEM_UNIT)
                     * 如果没有单位( ITEM_UNIT ) 表头为 字段名(ITEM_NAME)
                     */
                    let _key = !!result.ITEM_UNIT ?
                        '' + result.ITEM_NAME + '(' + result.ITEM_UNIT + ')' + '#' + result.ITEM_CODE :
                        '' + result.ITEM_NAME + '#' + result.ITEM_CODE
                    /**
                     * 处理多选的结果值
                     */
                    if (result.ITEM_FORMAT == 6) {
                        // console.log(result)
                        // 将多选值 已井号拆分
                        const valueArr = result.ret_value.split('#'),
                            _valLen = valueArr.length
                        // 拆分后的数组长度大于 0
                        if (_valLen > 0) {
                            result.ret_value = await handleMultipleValue(valueArr, _valLen, result.ITEM_CV_CODE)
                        }
                    }

                    retPatVisit[i][_key] = result.ret_value
                }
            }
        }
                // console.log(retPatVisit)
        // await saveFileSync('./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

        return retPatVisit
            // 脱敏
            .map(item => {
                item['姓名'] = desensitization(item['姓名'], 1, 3)

                return item
            })

    } catch (err) {
        console.error(err)
    }
    console.timeEnd('处理患者基本信息表')
}

/**
 * 处理多选的情况
 * @param  {Array} multipleValue  多选值(拆分后的数组)
 * @param  {String} cv_code       多选数据的类型
 * @return {String}               处理手
 */
async function handleMultipleValue(multipleValue, len, cv_code) {
    const list_cv_dict = await sql.query(`SELECT * FROM [dbo].[SD_ITEM_CV_DICT] WHERE SD_CODE='YXA_O' AND CV_CODE='${cv_code}'`),
        ret_cv_dict = list_cv_dict.recordset

    let str = ""

    multipleValue.forEach((v, i) => {
        ret_cv_dict.forEach(item => {
            if (item.CV_VALUE == v || item.CV_VALUE_TEXT==v) {
                str += (len-1) === i ? item.CV_VALUE : item.CV_VALUE + '+'
            }
        })
    })
    return str
}

/**
 * 保存表格
 * @param  {String} fileName  文件名
 * @param  {Array} numberArr 患者 数组
 * @return {[type]}           [description]
 */
async function saveXlsx(fileName, numberArr) {
    try {
        // await sql.connect(config.db_addr)
        const PAT_VISIT = await query_PAT_VISIT(numberArr)

        // 构建 workbook 对象
        let wb = {
            SheetNames: ['sheet'],
            Sheets: {
                'sheet': XLSX.utils.json_to_sheet(PAT_VISIT)
            }
            // Styles:workbook['Styles']
        }

        // 导出 Excel
        XLSX.writeFile(wb, './out/my/' + fileName + '.xlsx');
        console.log(fileName, '-OK ', Date.now())
    } catch (e) {
        console.error('处理数据出错： ', e)
    }

}


async function select(fileName) {
    try {
        const startDate16 = '2016-01-01 00:00:00.000',
            endDate16 = '2016-12-31 00:00:00.000',
            startDate17 = '2017-01-01 00:00:00.000',
            endDate17 = '2017-12-31 00:00:00.000',
            startDate18 = '2018-01-01 00:00:00.000',
            endDate18 = '2018-12-31 00:00:00.000',
            // 北大入组条件（5406）
            in_group = `
                SELECT
                            ret.PATIENT_NO
                    FROM (

                        SELECT
                            a.PATIENT_NO,
                                ( SELECT SD_ITEM_VALUE FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_220' AND SD_ITEM_VALUE != '' ) AS 'T',

                                (SELECT (CASE
                                                        WHEN SD_ITEM_VALUE <= 0 THEN '0'
                                                        WHEN SD_ITEM_VALUE <= 3 THEN '1'
                                                        WHEN SD_ITEM_VALUE >= 4 THEN '2'
                                                        ELSE '2'
                                                    END)
                                 FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_222' AND SD_ITEM_VALUE != '') AS 'N',

                                ( SELECT (CASE SD_ITEM_VALUE
                                                        WHEN '1' THEN '1'
                                                        WHEN '2' THEN '0'
                                                        ELSE NULL
                                                    END)
                                    FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_224' AND SD_ITEM_VALUE != '' ) AS 'M'

                            FROM [dbo].[PAT_VISIT] AS a
                            WHERE a.PATIENT_NO IN (
                            SELECT
                        t.PATIENT_NO
                    FROM
                        (
                        SELECT
                            PATIENT_NO,
                            MAX ( SD_ITEM_VALUE ) AS 'tmax'
                        FROM
                            [dbo].[PAT_SD_ITEM_RESULT]
                        WHERE
                            SD_ITEM_CODE IN ( 'YXA_O_212', 'YXA_O_213', 'YXA_O_214' )
                            AND SD_ITEM_VALUE != ''
                            AND PATIENT_NO IN (
                            SELECT
                            DISTINCT ids.PATIENT_NO
                        FROM
                            [dbo].[tmp_id] AS ids
                            LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS r ON ids.PATIENT_NO=r.PATIENT_NO
                        WHERE
                            r.SD_ITEM_CODE = 'YXA_O_151'
                            AND r.SD_ITEM_VALUE IN ('1','2','3','4','5','6','7','8','12','15')
                            AND ids.PATIENT_NO IN (
                        --  至少一次随访
                            SELECT
                                DISTINCT PATIENT_NO
                            FROM
                                [dbo].[PAT_FOLLOW_UP]
                            WHERE
                                FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
                                AND FOLLOW_UP_MONTHS!=''
                                AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )
                            )
                            AND ids.PATIENT_NO NOT IN (
                                -- 术前新辅助
                                SELECT
                                     r.PATIENT_NO
                                FROM
                                    [dbo].[tmp_id] AS ids
                                    LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS r ON ids.PATIENT_NO=r.PATIENT_NO
                                WHERE
                                    r.SD_ITEM_CODE = 'YXA_O_117'
                                    AND r.SD_ITEM_VALUE = '1'
                            )
                            AND ids.PATIENT_NO NOT IN (
                                -- 查询围手术期(30天内)死亡的患者
                                SELECT
                                    die.PATIENT_NO
                                FROM (
                                    -- 院内死亡
                                    SELECT DISTINCT
                                        a.PATIENT_NO
                                    FROM
                                        [dbo].[PAT_SD_ITEM_RESULT] AS a
                                    WHERE
                                        a.SD_ITEM_CODE = 'YXA_O_209'
                                        AND a.SD_ITEM_VALUE= '1'
                                        AND a.PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )

                                        UNION

                                    -- 死亡日期 减去 手术日期 小于等于30天
                                    SELECT DISTINCT
                                        a.PATIENT_NO
                                    FROM
                                        [dbo].[PAT_SD_ITEM_RESULT] AS a
                                        LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS b ON b.SD_ITEM_CODE = 'YXA_O_257' -- 随访死亡日期

                                        AND b.SD_ITEM_VALUE != ''
                                    WHERE
                                        a.SD_ITEM_CODE= 'YXA_O_161' -- 手术日期

                                        AND a.SD_ITEM_CODE!= ''
                                        AND b.PATIENT_NO= a.PATIENT_NO
                                        AND a.PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )
                                        AND DATEDIFF(
                                            mm,
                                            CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
                                            CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
                                        ) <= '1'
                                ) AS die
                            )

                            )
                            GROUP BY PATIENT_NO
                        ) AS t
                        )
                    ) AS ret
                    WHERE ret.N!='' AND ret.M!=''`
        const listBySelect = await sql.query(in_group),
            retBySelect = listBySelect.recordset

        await saveXlsx(fileName, retBySelect.map(item => `'${item.PATIENT_NO}'`))
        // return retBySelect.map(item => `'${item.PATIENT_NO}'` )
    } catch (err) {
        console.error(err)
    }
}

async function main() {

    await select('北大-5406')

    // const config = require('./config.json')
    // config.forEach(item => {
    //      saveXlsx(item.name, item.list)
    // })
    process.exit('退出……')
}

main()