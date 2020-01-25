/**
 * 下载病例 -- 百济
 * 修改最大堆栈 node --max-old-space-size=4096 app-baiji.js
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
                a.NAME AS '姓名',
                '患者性别' = ( CASE SEX WHEN '0' THEN '男' WHEN '1' THEN '女' END ),
                a.AGE AS '年龄'
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
                    'YXA_O_036',
                    'YXA_O_047',
                    'YXA_O_050',
                    'YXA_O_062',
                    'YXA_O_063',
                    'YXA_O_064',
                    'YXA_O_065',
                    'YXA_O_074',
                    'YXA_O_908',
                    'YXA_O_054',
                    'YXA_O_055',
                    'YXA_O_096',
                    'YXA_O_097',
                    'YXA_O_099',
                    'YXA_O_100',
                    'YXA_O_092',
                    'YXA_O_093',
                    'YXA_O_909',
                    'YXA_O_020',
                    'YXA_O_021',
                    'YXA_O_024',
                    'YXA_O_032',
                    'YXA_O_033',
					'YXA_O_101',
					'YXA_O_102',
					'YXA_O_103',
					'YXA_O_104',
					'YXA_O_105',
					'YXA_O_106',
					'YXA_O_107',
					'YXA_O_108',
					'YXA_O_109',
					'YXA_O_151',
					'YXA_O_211',
					'YXA_O_222',
					'YXA_O_223',
					'YXA_O_117',
					'YXA_O_918')`),
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
                        const valueArr = result.ret_value.split(/\+|\#/),
                            _valLen = valueArr.length
                        // 拆分后的数组长度大于 1
                        if (_valLen > 1) {
                            result.ret_value = await handleMultipleValue(valueArr, _valLen, result.ITEM_CV_CODE)
                        }
                    }

                    retPatVisit[i][_key] = result.ret_value
                }
            }
        }
                // console.log(retPatVisit)
        // await saveFileSync('./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

        return retPatVisit  // 脱敏
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
                str += (len-1) === i ? item.CV_VALUE_TEXT : item.CV_VALUE_TEXT + '+'
                // console.log(str,item.CV_VALUE)
            }
        })
    })
        // console.log(str)
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
            // 查询 用药情况比较全的患者
            one_die = `SELECT
							DISTINCT a.PATIENT_NO
						FROM
							[dbo].[PAT_SD_ITEM_RESULT] AS a
							LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS b ON b.SD_ITEM_CODE = 'YXA_O_257' -- 随访死亡日期

							AND b.SD_ITEM_VALUE != ''
						WHERE
							a.SD_ITEM_CODE= 'YXA_O_161' -- 手术日期

							AND a.SD_ITEM_CODE!= ''
							AND b.PATIENT_NO= a.PATIENT_NO
							AND a.PATIENT_NO IN (
							SELECT
								PATIENT_NO
							FROM
								[dbo].[PAT_SD_ITEM_RESULT]
							WHERE
								SD_ITEM_CODE = 'YXA_O_151'
								AND ( SD_ITEM_VALUE = '1' OR SD_ITEM_VALUE = '2' OR SD_ITEM_VALUE = '3' OR SD_ITEM_VALUE = '12' )
								AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )
							)
							AND DATEDIFF(
								mm,
								CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
								CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
							) <= '12'
							AND DATEDIFF(
								mm,
								CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
							CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
							) >= '0'
							ORDER BY a.PATIENT_NO`,
		live = `SELECT
					PATIENT_NO,
					MAX ( FOLLOW_UP_MONTHS ) AS '随访月份'
				FROM
					[dbo].[PAT_FOLLOW_UP]
				WHERE
					FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
					AND FOLLOW_UP_MONTHS!=''
					AND FOLLOW_UP_MONTHS > 12 -- 超过12个月
					AND PATIENT_NO IN (
					-- 根治术
						SELECT
							PATIENT_NO
						FROM
							[dbo].[PAT_SD_ITEM_RESULT]
						WHERE
							SD_ITEM_CODE = 'YXA_O_151'
							AND ( SD_ITEM_VALUE = '1' OR SD_ITEM_VALUE = '2' OR SD_ITEM_VALUE = '3' OR SD_ITEM_VALUE = '12' )
							AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )
						)
					AND PATIENT_NO NOT IN (
					-- 排除一年内死亡的患者
						SELECT
							DISTINCT a.PATIENT_NO
						FROM
							[dbo].[PAT_SD_ITEM_RESULT] AS a
							LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS b ON b.SD_ITEM_CODE = 'YXA_O_257' -- 随访死亡日期
							AND b.SD_ITEM_VALUE != ''
						WHERE
							a.SD_ITEM_CODE= 'YXA_O_161' -- 手术日期
							AND a.SD_ITEM_CODE!= ''
							AND b.PATIENT_NO= a.PATIENT_NO
							AND DATEDIFF(
								mm,
								CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
								CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
							) <= '12'
							AND DATEDIFF(
								mm,
								CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
							CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
							) >= '0'
					)
				GROUP BY PATIENT_NO`

        const listBySelect = await sql.query(one_die),
            retBySelect = listBySelect.recordset

        await saveXlsx(fileName, retBySelect.map(item => `'${item.PATIENT_NO}'`))
        // return retBySelect.map(item => `'${item.PATIENT_NO}'` )
    } catch (err) {
        console.error(err)
    }
}

async function main() {
    console.time("共用时")
    await select('根治术一年死亡-楼')
    console.timeEnd("共用时")

    process.exit('退出……')
}

main()