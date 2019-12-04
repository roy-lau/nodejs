/**
 * 下载病例 -- 百济
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
                -- a.PATIENT_ID AS '住院ID',
                -- a.INP_NO AS '住院流水号',
                a.NAME AS '姓名',
                '患者性别' = ( CASE SEX WHEN '0' THEN '女' WHEN '1' THEN '男' END ),
                -- a.AGE AS '患者年龄',
                a.ADMISSION_DATE AS '入院日期'
                -- a.DISCHARGE_DATE AS '出院日期',
                -- a.OUT_STATUS AS '离院方式',
                -- b.HOSPITAL_NAME AS '医院'
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
                        'YXA_O_003',
                        'YXA_O_006',
                        'YXA_O_009',
                        'YXA_O_010',
                        'YXA_O_011',
                        'YXA_O_012',
                        'YXA_O_013',
                        'YXA_O_014',
                        'YXA_O_015',
                        'YXA_O_016',
                        'YXA_O_017',
                        'YXA_O_018',
                        'YXA_O_019',
                        'YXA_O_020',
                        'YXA_O_021',
                        'YXA_O_022',
                        'YXA_O_023',
                        'YXA_O_024',
                        'YXA_O_025',
                        'YXA_O_026',
                        'YXA_O_027',
                        'YXA_O_028',
                        'YXA_O_029',
                        'YXA_O_030',
                        'YXA_O_031',
                        'YXA_O_032',
                        'YXA_O_033',
                        'YXA_O_096',
                        'YXA_O_117',
                        'YXA_O_118',
                        'YXA_O_905',
                        'YXA_O_119',
                        'YXA_O_120',
                        'YXA_O_121',
                        'YXA_O_123',
                        'YXA_O_128',
                        'YXA_O_131',
                        'YXA_O_134',
                        'YXA_O_920',
                        'YXA_O_906',
                        'YXA_O_135',
                        'YXA_O_161',
                        'YXA_O_210',
                        'YXA_O_211',
                        'YXA_O_215',
                        'YXA_O_220',
                        'YXA_O_221',
                        'YXA_O_222',
                        'YXA_O_223',
                        'YXA_O_224',
                        'YXA_O_300',
                        'YXA_O_919',
                        'YXA_O_301',
                        'YXA_O_302',
                        'YXA_O_303',
                        'YXA_O_304',
                        'YXA_O_314',
                        'YXA_O_918',
                        'YXA_O_920',
                        'YXA_O_921',
                        'YXA_O_922',
                        'YXA_O_195',
                        'YXA_O_159',
                        'YXA_O_136',
                        'YXA_O_305'
                    )

                UNION ALL

                SELECT
                    dist.PATIENT_NO,
                    code.ITEM_NAME,
                    dist.SD_ITEM_CODE AS 'ITEM_CODE',
                    MIN(ISNULL( cv.CV_VALUE_TEXT, dist.SD_ITEM_VALUE )) AS ret_value,
                    code.ITEM_FORMAT,
                    code.ITEM_CV_CODE,
                    code.ITEM_UNIT
                FROM
                    [dbo].[PAT_FOLLOW_UP_RESULT] AS dist
                    LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS code ON dist.SD_ITEM_CODE= code.ITEM_CODE
                    LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS cv ON cv.SD_CODE!= 'YXA'
                    AND code.ITEM_CV_CODE= cv.CV_CODE
                    AND dist.SD_ITEM_VALUE= cv.CV_VALUE
                WHERE
                    dist.PATIENT_NO= '${ret_PAT_VISIT[i].PATIENT_NO}'
                    AND dist.SD_ITEM_CODE IN ( 'YXA_O_250', 'YXA_O_252', 'YXA_O_253', 'YXA_O_255', 'YXA_O_256', 'YXA_O_257' )
                GROUP BY
                    dist.PATIENT_NO,
                    code.ITEM_NAME,
                    dist.SD_ITEM_CODE,
                    code.ITEM_FORMAT,
                    code.ITEM_CV_CODE,
                    code.ITEM_UNIT`),
                ret_PAT_SD_ITEM_RESULT = list_PAT_SD_ITEM_RESULT.recordset

             // 查询引流管信息表
            const list_PAT_FOLLOW_UP_TREAT = await sql.query(`SELECT
                    PATIENT_NO,
                    FU_TIMES,
                    TREAT_EVALUTE_FRONT AS '治疗前CT评价',
                    TREAT_EVALUTE_AFTER AS '治疗后CT评价'
                FROM
                    [dbo].[PAT_FOLLOW_UP_TREAT]
                WHERE PATIENT_NO= '${ret_PAT_VISIT[i].PATIENT_NO}'`),
                ret_PAT_FOLLOW_UP_TREAT = list_PAT_FOLLOW_UP_TREAT.recordset

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
                        if (_valLen >0) {
                            result.ret_value = await handleMultipleValue(valueArr, _valLen, result.ITEM_CV_CODE)
                        }else{
                            console.log(valueArr, _valLen, result.ITEM_CV_CODE)

                        }
                    }

                    retPatVisit[i][_key] = result.ret_value
                }
            }
            // 处理化疗相关的数据
            for (let k = 0; k < ret_PAT_FOLLOW_UP_TREAT.length; k++) {
                const result = ret_PAT_FOLLOW_UP_TREAT[k]
                if (retPatVisit[i].PATIENT_NO === result.PATIENT_NO) {
                    retPatVisit[i]['治疗前CT评价'+(k+1)] =result['治疗前CT评价']
                    retPatVisit[i]['治疗后CT评价'+(k+1)] =result['治疗后CT评价']
                }
            }
        }
                // console.log(retPatVisit)
        // await saveFileSync('./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

        return retPatVisit
            // 排序
            .sort((a, b) => a['患者住址#YXA_O_003'] > b['患者住址#YXA_O_003'] ? 1 : -1)
            // 脱敏
            .map(item => {

                item['姓名'] = desensitization(item['姓名'], 1, 3)
                item['患者住址#YXA_O_003'] = desensitization(item['患者住址#YXA_O_003'], 3, 25)
                // item['主刀医师#YXA_O_005'] = item['主刀医师#YXA_O_005'] && desensitization(item['主刀医师#YXA_O_005'], 1, 3).substr(0, 2)

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
            address = '上海%',
            // 查询麻醉方式是多选的患者
            mz_m = `SELECT TOP 1 * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_172' AND LEN(SD_ITEM_VALUE)>1`,
            // 查询胰腺导管腺癌三年的数据
            get_3year_in_group = `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT]
                WHERE SD_GROUP = '1'
                AND SD_CODE = 'YXA_O'
                AND DISCHARGE_DATE>='${startDate16}' AND DISCHARGE_DATE<='${endDate18}'`,
            // 查询 用药情况比较全的患者
            only_drug = `SELECT DISTINCT TOP 200 PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE IN ('YXA_O_117','YXA_O_134') AND SD_ITEM_VALUE='1'`,
            one = `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO='87c2df38e23331ff'`

        const listBySelect = await sql.query(get_3year_in_group),
            retBySelect = listBySelect.recordset

        await saveXlsx(fileName, retBySelect.map(item => `'${item.PATIENT_NO}'`))
        // return retBySelect.map(item => `'${item.PATIENT_NO}'` )
    } catch (err) {
        console.error(err)
    }
}

async function main() {
    console.time("共用时")
    // await select('百济-one')
    await select('百济-get_3year_in_group')
    console.timeEnd("共用时")

    // const config = require('./config.json')
    // config.forEach(item => {
    //      saveXlsx(item.name, item.list)
    // })
    process.exit('退出……')
}

main()