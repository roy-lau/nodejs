/**
 * 下载病例
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
async function query_PAT_VISIT (patient_no) {
    console.time('处理患者基本信息表')
    try {

        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query(`SELECT
                    *
                FROM
                    [dbo].[PAT_VISIT] AS a
                WHERE
                    a.PATIENT_NO IN ( ${patient_no} )`),
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
                result.PATIENT_NO='${ret_PAT_VISIT[i].PATIENT_NO}'
                AND result.SD_CODE= 'YXA_O'
                AND NOT b.ITEM_CODE IN ('YXA_O_001','YXA_O_004')
                ORDER BY b.DISPLAY_ORDER`),
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
                        if (_valLen > 1) {
                            result.ret_value = await handleMultipleValue(valueArr,_valLen,result.ITEM_CV_CODE)
                            // console.log(result.ret_value)
                        }
                    }

                    retPatVisit[i][_key] = result.ret_value
                }
            }
        }
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
async function handleMultipleValue(multipleValue, len, cv_code){

       const list_cv_dict = await sql.query(`SELECT * FROM [dbo].[SD_ITEM_CV_DICT] WHERE SD_CODE='YXA_O' AND CV_CODE='${cv_code}'`),
           ret_cv_dict = list_cv_dict.recordset

       let str = ""

       multipleValue.forEach((v,i) => {
         ret_cv_dict.forEach(item =>{
                if(item.CV_VALUE == v) {
                    str += (len - 1 ) === i ? item.CV_VALUE_TEXT : item.CV_VALUE_TEXT + '+'
                }
            })
        })
        return str
}

// 下载引流管信息表
async function query_PAT_DRAINAGE_TUBE (patient_no){
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
            WHERE PATIENT_NO IN (${patient_no})`),
            ret_PAT_DRAINAGE_TUBE = list_PAT_DRAINAGE_TUBE.recordset

        return ret_PAT_DRAINAGE_TUBE
        // await saveFileSync('./out/ret_PAT_DRAINAGE_TUBE.json', JSON.stringify(ret_PAT_DRAINAGE_TUBE, null, 2))

    } catch (err) {
        console.error(err)
    }
    console.timeEnd('处理引流管表')
}

// 下载随访信息
async function query_PAT_FOLLOW_UP_RESULT (patient_no){
    console.time('处理随访表')
    try {
        // 查询随访时间和时长
        const list_PAT_FOLLOW_UP = await sql.query(`SELECT
                    PATIENT_NO,
                    FU_TIMES,
                    FOLLOW_UP_DATE AS '随访时间',
                    FOLLOW_UP_MONTHS AS '随访时长'
                FROM
                    [dbo].[PAT_FOLLOW_UP]
                WHERE
                    PATIENT_NO IN (${patient_no})
                    AND FOLLOW_UP_DATE!='1900-01-01 00:00:00.000'`),
            ret_PAT_FOLLOW_UP = list_PAT_FOLLOW_UP.recordset


        let retPatFollowUP = ret_PAT_FOLLOW_UP

        for (let i = 0; i < ret_PAT_FOLLOW_UP.length; i++) {
            // 查询随访结果
            const list_PAT_FOLLOW_UP_RESULT = await sql.query(`SELECT
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
                dist.PATIENT_NO='${ret_PAT_FOLLOW_UP[i].PATIENT_NO}'`),
                ret_PAT_FOLLOW_UP_RESULT = list_PAT_FOLLOW_UP_RESULT.recordset


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

        return retPatFollowUP
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP.json', JSON.stringify(ret_PAT_FOLLOW_UP, null, 2))
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP_RESULT.json', JSON.stringify(ret_PAT_FOLLOW_UP_RESULT, null, 2))
        // await saveFileSync('./out/retPatFollowUP.json', JSON.stringify(retPatFollowUP, null, 2))

    } catch (err) {
        console.error(err)
    }
    console.timeEnd('处理随访表')
}

// 下载随访化疗信息
async function query_PAT_FOLLOW_UP_TREAT (patient_no){
    console.time('处理化疗信息表')
    try {
        // 查询引流管信息表
        const list_PAT_FOLLOW_UP_TREAT = await sql.query(`SELECT
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
            WHERE PATIENT_NO IN (${patient_no})`),
            ret_PAT_FOLLOW_UP_TREAT = list_PAT_FOLLOW_UP_TREAT.recordset

        return ret_PAT_FOLLOW_UP_TREAT
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP_TREAT.json', JSON.stringify(ret_PAT_FOLLOW_UP_TREAT, null, 2))

    } catch (err) {
        console.error(err)
    }
    console.timeEnd('处理化疗信息表')
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
        XLSX.writeFile(wb, './out/my/' + fileName + '.xlsx');
        console.log(fileName, '-OK ', Date.now())
    } catch (e) {
        console.error('处理数据出错： ', e)
    }

}

async function select(fileName){
    try {
        const tmp_beida = `SELECT PATIENT_NO FROM [dbo].[tmp_beida]`


        const listBySelect = await sql.query(tmp_beida),
              retBySelect = listBySelect.recordset

        await saveXlsx(fileName, retBySelect.map(item => `'${item.PATIENT_NO}'` ))
    } catch (err) {
        console.error(err)
    }
}

async function main() {

    await select('北大')

    // const config = require('./config.json')
    // config.forEach(item => {
    //      saveXlsx(item.name, item.list)
    // })
    process.exit('退出……')
}

main()