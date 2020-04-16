/**
 * 下载病历
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    { desensitization } = require('./utils')

class DownCase {
    constructor() {
        this.init()
    }
    /**
     * 初始化 DownCase 类
     */
    async init () {
        try {
            const fileName = 'test-id' + Date.now() // 文件名
            const constSQL = require("./const-sql.js")

            const listBySelect = await sql.query(constSQL)

            await this.saveXlsx(fileName, listBySelect.map(item => `'${item.PATIENT_NO}'`).join())

        } catch (err) {
            console.error(err)
        }
        process.exit('退出……')

    }
    /**
     * 保存表格
     * @param  {String} fileName  文件名
     * @param  {Array}  numberArr 患者 数组
     * @return {[type]}           [description]
     */
    async saveXlsx (fileName, numberArr) {
        try {
            const
                PAT_VISIT = await this.query_PAT_VISIT(numberArr),
                PAT_DRAINAGE_TUBE = await this.query_PAT_DRAINAGE_TUBE(numberArr),
                PAT_FOLLOW_UP_RESULT = await this.query_PAT_FOLLOW_UP_RESULT(numberArr),
                PAT_FOLLOW_UP_TREAT = await this.query_PAT_FOLLOW_UP_TREAT(numberArr)

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
            console.log(fileName,' 下载成功！')
        } catch (e) {
            console.error('saveXlsx ERR： ', e)
        }
    }
    // 下载基本信息表
    async query_PAT_VISIT (patient_no) {
        console.time('处理患者基本信息表')
        try {
            // 查询患者基本信息
            const list_PAT_VISIT = await sql.query(`SELECT
                    a.PATIENT_NO,
                    a.PATIENT_ID AS '住院ID',
                    a.INP_NO AS '住院流水号',
                    a.NAME AS '姓名',
                    '患者性别' = ( CASE SEX WHEN '0' THEN '男' WHEN '1' THEN '女' END ),
                    a.AGE AS '患者年龄',
                    a.ADMISSION_DATE AS '入院日期',
                    a.DISCHARGE_DATE AS '出院日期',
                    a.OUT_STATUS AS '离院方式',
                    b.HOSPITAL_CODE AS '医院ID',
                    b.HOSPITAL_CITY AS '医院CITY'
                FROM
                    [dbo].[PAT_VISIT] AS a
                    LEFT JOIN [dbo].[HOSPITAL_DICT] AS b ON a.HOSPITAL_ID= b.HOSPITAL_ID
                WHERE
                    a.PATIENT_NO IN ( ${patient_no} )
                    AND a.SD_CODE = 'YXA_O'`)

            let retPatVisit = list_PAT_VISIT

            const itemListSql = require('./filter-fields.js') // 获取过滤后的字段
            for (let i = 0; i < retPatVisit.length; i++) {
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
                    result.PATIENT_NO='${retPatVisit[i].PATIENT_NO}'
                    AND result.SD_CODE= 'YXA_O'
                    ${itemListSql}
                    ORDER BY RIGHT(REPLICATE(N' ', 50) + b.DISPLAY_ORDER, 50)`)


                for (let k = 0; k < list_PAT_SD_ITEM_RESULT.length; k++) {

                    const result = list_PAT_SD_ITEM_RESULT[k]

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
                            if (_valLen > 1) {
                                result.ret_value = await this.handleMultipleValue(valueArr, _valLen, result.ITEM_CV_CODE)
                            }
                        }

                        retPatVisit[i][_key] = result.ret_value
                    }
                }
            }

            console.timeEnd('处理患者基本信息表')
            return retPatVisit
                // 排序
                // .sort((a, b) => a['患者住址#YXA_O_003'] > b['患者住址#YXA_O_003'] ? 1 : -1)

        } catch (err) {
            console.error(err)
        }
    }

    /**
     * 处理多选的情况
     * @param  {Array} multipleValue  多选值(拆分后的数组)
     * @param  {String} cv_code       多选数据的类型
     * @return {String}               处理后的数据（以加号分隔）
     */
    async handleMultipleValue (multipleValue, len, cv_code) {

        const ret_cv_dict = await sql.query(`SELECT * FROM [dbo].[SD_ITEM_CV_DICT] WHERE SD_CODE='YXA_O' AND CV_CODE='${cv_code}'`)

        let str = ""

        multipleValue.forEach((v, i) => {
            ret_cv_dict.forEach(item => {
                if (item.CV_VALUE == v) {
                    str += (len - 1) === i ? item.CV_VALUE_TEXT : item.CV_VALUE_TEXT + '+'
                }
            })
        })
        return str
    }
    // 下载引流管信息表
    async query_PAT_DRAINAGE_TUBE (patient_no) {
        console.time('处理引流管表')
        try {
            // 查询引流管信息表
            const list_PAT_DRAINAGE_TUBE = await sql.query(`SELECT
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
                WHERE PATIENT_NO IN (${patient_no})`)

            console.timeEnd('处理引流管表')
            return list_PAT_DRAINAGE_TUBE

        } catch (err) {
            console.error(err)
        }
    }

    // 下载随访信息
    async query_PAT_FOLLOW_UP_RESULT (patient_no) {
        console.time('处理随访表')
        try {
            // 查询随访时间和时长
            const ret_PAT_FOLLOW_UP = await sql.query(`SELECT
                        PATIENT_NO,
                        FU_TIMES,
                        FOLLOW_UP_DATE AS '随访时间',
                        FOLLOW_UP_MONTHS AS '随访时长'
                    FROM
                        [dbo].[PAT_FOLLOW_UP]
                    WHERE
                        PATIENT_NO IN (${patient_no})
                        AND FOLLOW_UP_DATE!='1900-01-01 00:00:00.000'`)


            let retPatFollowUP = ret_PAT_FOLLOW_UP

            for (let i = 0; i < ret_PAT_FOLLOW_UP.length; i++) {
                // 查询随访结果
                const ret_PAT_FOLLOW_UP_RESULT = await sql.query(`SELECT
                    dist.PATIENT_NO,
                    dist.FU_TIMES,
                    dist.SD_ITEM_CODE,
                    code.ITEM_NAME,
                    -- dist.SD_ITEM_VALUE,
                    -- cv.CV_VALUE_TEXT,
                    ISNULL(cv.CV_VALUE_TEXT, dist.SD_ITEM_VALUE) AS ret
                FROM
                    [dbo].[PAT_FOLLOW_UP_RESULT] AS dist
                    LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS code ON dist.SD_ITEM_CODE= code.ITEM_CODE
                    LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS cv ON cv.SD_CODE!= 'YXA'
                    AND code.ITEM_CV_CODE= cv.CV_CODE
                    AND dist.SD_ITEM_VALUE= cv.CV_VALUE
                WHERE
                    dist.PATIENT_NO='${ret_PAT_FOLLOW_UP[i].PATIENT_NO}'`)


                for (let k = 0; k < ret_PAT_FOLLOW_UP_RESULT.length; k++) {
                    if (retPatFollowUP[i].FU_TIMES === ret_PAT_FOLLOW_UP_RESULT[k].FU_TIMES) {

                        let cur = ret_PAT_FOLLOW_UP_RESULT[k],
                            _key = cur.ITEM_NAME,
                            _FOLLOW_UP_MONTHS_new = null

                        // if (cur.SD_ITEM_CODE === 'YXA_O_257') { // YXA_O_257 死亡时间
                        //     if (cur.ret) {
                        //         let death_PATIENT_NO = cur.PATIENT_NO, // 有死亡时间的患者
                        //             // 查询死亡患者的手术时间
                        //             list_death = await sql.query(`SELECT SD_ITEM_VALUE FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_161' AND PATIENT_NO='${death_PATIENT_NO}'`),
                        //             ret_death = list_death.recordset[0]

                        //         // 死亡时间 - 手术时间 = 随访时长
                        //         //****// _FOLLOW_UP_MONTHS_new = moment(cur.SD_ITEM_VALUE).diff(ret_death.SD_ITEM_VALUE, 'M')
                        //         // console.log(cur.SD_ITEM_CODE, cur.SD_ITEM_VALUE, ret_death.SD_ITEM_VALUE, _FOLLOW_UP_MONTHS_new)

                        //         // retPatFollowUP[i]['=手术时间='] = ret_death.SD_ITEM_VALUE
                        //         //****// retPatFollowUP[i]['随访时长'] = _FOLLOW_UP_MONTHS_new
                        //     }
                        // }
                        retPatFollowUP[i][_key] = cur.ret
                    }
                }
            }

            console.timeEnd('处理随访表')
            return retPatFollowUP

        } catch (err) {
            console.error(err)
        }
    }
    // 下载随访化疗信息
    async query_PAT_FOLLOW_UP_TREAT (patient_no) {
        console.time('处理化疗信息表')
        try {
            // 查询引流管信息表
            const ret_PAT_FOLLOW_UP_TREAT = await sql.query(`SELECT
                    PATIENT_NO,
                    FU_TIMES,
                    TREAT_NAME AS '治疗方法',
                    DRUG_NAME AS '药品名称(通用名)',
                    DRUG_NAME_TRADE AS '药品名称(商品名)',
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
                WHERE PATIENT_NO IN (${patient_no})`)

            console.timeEnd('处理化疗信息表')
            return ret_PAT_FOLLOW_UP_TREAT

        } catch (err) {
            console.error(err)
        }
    }
}

new DownCase()