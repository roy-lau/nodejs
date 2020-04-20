/**
 * 下载病历
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    X_utils = XLSX.utils
// { desensitization } = require('./utils')

// 创建一个 workbook 工作薄(Excel)
const workBook = X_utils.book_new()

function startup () {
    process.title = '下载病历'
    const constSQL = require("./const-sql.js")

    sql.query(constSQL).then(async listBySelect => {
        const fileName = 'dev_test' // 文件名
        const patList = listBySelect.map(item => `'${item.PATIENT_NO}'`).join()

        await query_PAT_VISIT(patList)
        await query_PAT_DRAINAGE_TUBE(patList)
        await query_PAT_FOLLOW_UP_RESULT(patList)
        await query_PAT_FOLLOW_UP_TREAT(patList)


        // 导出 Excel
        XLSX.writeFile(workBook, './out/' + fileName + '_' + Date.now() + '.xlsx');
        console.log(fileName, ' 下载成功！')
        // process.exit('退出……')
    }).catch(err=>{
        console.error("query or save ERR: ",err)
    })
}

/**
 * 给患者基本信息加备注
 * 
 * @param {Objer} patJsonSheet 患者基本信息的数据
 */
async function patAddComment (patJsonSheet) {
    console.time('基本信息表头添加备注')
    for (const key in patJsonSheet) {
        if (patJsonSheet.hasOwnProperty(key)) {
            const element = patJsonSheet[key];
            if (Array.isArray(X_utils.split_cell(key)) && X_utils.split_cell(key)[1] == '1') { // 找出第一行（表头）
                const itemCode = element.v.split('#')[1]
                if (itemCode) {
                    const ret = await sql.query(`SELECT
                                title.ITEM_TYPE_NAME AS 'parentName',
                                title1.ITEM_TYPE_NAME AS 'childName'
                            FROM
                                [dbo].[SD_ITEM_TYPE_DICT] AS title 
                                LEFT JOIN [dbo].[SD_ITEM_TYPE_DICT] AS title1 ON title.ITEM_TYPE_CODE=title1.PARENT_TYPE_CODE AND title1.PARENT_TYPE_CODE IS NOT NULL AND title.SD_CODE='YXA_O' 
                                LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE OR dist.ITEM_TYPE_CODE=title1.ITEM_TYPE_CODE AND dist.SD_CODE='YXA_O'
                            WHERE
                                title.PARENT_TYPE_CODE IS NULL 
                                AND title.SD_CODE= 'YXA_O'
                                AND dist.ITEM_CODE='${itemCode}'`)
                    const itemType = ret[0]
                    if (itemType) {
                        XLSX.utils.cell_add_comment(patJsonSheet[key], `父类别: ${itemType.parentName}\n子类别: ${itemType.childName || '无'}`, 'roy')
                        patJsonSheet[key].c.hidden = true;
                    }

                }
            }
        }
    }
    console.timeEnd('基本信息表头添加备注')
    return patJsonSheet
}
/**
 * 下载基本信息表
 * @param {Sting} patient_no 患者id
 */
async function query_PAT_VISIT (patient_no) {
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
                    dist.ITEM_NAME+ isnull( '(' + dist.ITEM_UNIT+ ')', '' ) + '#' + dist.ITEM_CODE AS 'name',
                    dist.ITEM_CODE,
                    'item_value' = ( CASE result.SD_ITEM_VALUE WHEN c.CV_VALUE THEN c.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END ),
                    dist.ITEM_FORMAT,
                    dist.ITEM_CV_CODE
                FROM
                    [dbo].[PAT_SD_ITEM_RESULT] AS result
                    LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON result.SD_ITEM_CODE= dist.ITEM_CODE AND result.PATIENT_NO='${retPatVisit[i].PATIENT_NO}'
                    LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS c ON dist.ITEM_CV_CODE= c.CV_CODE
                    AND result.SD_ITEM_VALUE= c.CV_VALUE
                WHERE
                    result.SD_CODE= 'YXA_O'
                    ${itemListSql}
                    ORDER BY RIGHT(REPLICATE(N' ', 10) + dist.DISPLAY_ORDER, 10)`)


            for (let k = 0; k < list_PAT_SD_ITEM_RESULT.length; k++) {

                const result = list_PAT_SD_ITEM_RESULT[k]

                if (retPatVisit[i].PATIENT_NO === result.PATIENT_NO) {
                    /**
                     * 处理多选的结果值
                     */
                    if (result.ITEM_FORMAT == 6) {
                        // console.log(result)
                        // 将多选值 已井号拆分
                        const valueArr = result.item_value.split('#'),
                            _valLen = valueArr.length
                        // 拆分后的数组长度大于 0
                        if (_valLen > 1) {
                            result.item_value = await handleMultipleValue(valueArr, _valLen, result.ITEM_CV_CODE)
                        }
                    }

                    retPatVisit[i][result.name] = result.item_value
                }
            }
        }
        // 排序
        // retPatVisit.sort((a, b) => a['患者住址#YXA_O_003'] > b['患者住址#YXA_O_003'] ? 1 : -1)

        console.timeEnd('处理患者基本信息表')
        const RetPatVisit = await patAddComment(X_utils.json_to_sheet(retPatVisit))
        X_utils.book_append_sheet(workBook, RetPatVisit, "基本信息");

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
async function handleMultipleValue (multipleValue, len, cv_code) {

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
/**
 * 下载引流管信息表
 * @param {Sting} patient_no 患者id
 */
async function query_PAT_DRAINAGE_TUBE (patient_no) {
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
        X_utils.book_append_sheet(workBook, X_utils.json_to_sheet(list_PAT_DRAINAGE_TUBE), "引流管");

    } catch (err) {
        console.error(err)
    }
}
/**
 * 下载随访信息
 * @param {Sting} patient_no 患者id
 */
async function query_PAT_FOLLOW_UP_RESULT (patient_no) {
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
        X_utils.book_append_sheet(workBook, X_utils.json_to_sheet(retPatFollowUP), "随访");

    } catch (err) {
        console.error(err)
    }
}

/**
 * 下载随访化疗信息
 * @param {Sting} patient_no 患者id
 */
async function query_PAT_FOLLOW_UP_TREAT (patient_no) {
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
        X_utils.book_append_sheet(workBook, X_utils.json_to_sheet(ret_PAT_FOLLOW_UP_TREAT), "随访化疗");

    } catch (err) {
        console.error(err)
    }
}

startup()
