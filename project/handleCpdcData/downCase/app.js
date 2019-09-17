/**
 * 下载病例
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    moment = require('moment'),
    {
        desensitization,
        saveFileSync
    } = require('./utils'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190902'

// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
    console.log('处理患者基本信息表')
    try {
        // await sql.connect(SQL_ADDR)
        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query `SELECT
                a.PATIENT_NO,
                a.PATIENT_ID AS '住院ID',
                a.INP_NO AS '住院流水号',
                '患者性别' = ( CASE SEX WHEN '0' THEN '女' WHEN '1' THEN '男' END ),
                a.AGE AS '患者年龄',
                a.ADMISSION_DATE AS '入院日期',
                a.DISCHARGE_DATE AS '出院日期',
                a.OUT_STATUS AS '离院方式',
                b.HOSPITAL_NAME AS '医院'
            FROM
                [dbo].[PAT_VISIT] AS a
                LEFT JOIN [dbo].[HOSPITAL_DICT] as b ON a.HOSPITAL_ID=b.HOSPITAL_ID
            WHERE
                a.PATIENT_NO IN ( ${patient_no})
                AND a.SD_CODE = 'YXA_O'`,
            ret_PAT_VISIT = list_PAT_VISIT.recordset

        let retPatVisit = ret_PAT_VISIT

        for (let i = 0; i < ret_PAT_VISIT.length; i++) {
            // 查询数据元 和数据项做对比
            const list_PAT_SD_ITEM_RESULT = await sql.query `SELECT
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
                result.PATIENT_NO= ${ret_PAT_VISIT[i].PATIENT_NO}
                AND result.SD_CODE= 'YXA_O'
                AND NOT b.ITEM_CODE IN ('YXA_O_001','YXA_O_004')
                ORDER BY b.DISPLAY_ORDER`,
                ret_PAT_SD_ITEM_RESULT = list_PAT_SD_ITEM_RESULT.recordset


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

                    // if (_key === '其他既往史#YXA_O_024') {
                    //     retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].ret_value
                    //     retPatVisit[i]['有无高血压'] = (/高血压/).test(ret_PAT_SD_ITEM_RESULT[k].ret_value) ? '有' : '无'
                    // }
                    retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].ret_value
                }
            }
        }
        // await saveFileSync('./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

        return ret_PAT_VISIT
            // 排序
            .sort((a, b) => a['患者住址#YXA_O_003'] > b['患者住址#YXA_O_003'] ? 1 : -1)
            // 脱敏
            .map(item => {

                item['患者住址#YXA_O_003'] = desensitization(item['患者住址#YXA_O_003'], 3, 25)
                item['主刀医师#YXA_O_005'] = item['主刀医师#YXA_O_005'] && desensitization(item['主刀医师#YXA_O_005'], 1, 3).substr(0, 2)

                return item
            })

    } catch (err) {
        console.error(err)
    }
}

// 下载引流管信息表
const query_PAT_DRAINAGE_TUBE = async (patient_no) => {
    console.log('处理引流管表')
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

        return ret_PAT_DRAINAGE_TUBE
        // await saveFileSync('./out/ret_PAT_DRAINAGE_TUBE.json', JSON.stringify(ret_PAT_DRAINAGE_TUBE, null, 2))

    } catch (err) {
        console.error(err)
    }
}

// 下载随访信息
const query_PAT_FOLLOW_UP_RESULT = async (patient_no,PAT_VISIT) => {
    console.log('处理随访表')
    try {
        // await sql.connect(SQL_ADDR)
        // 查询随访时间和时长
        const list_PAT_FOLLOW_UP = await sql.query `SELECT
                    PATIENT_NO,
                    FU_TIMES,
                    FOLLOW_UP_DATE AS '随访时间',
                    FOLLOW_UP_MONTHS AS '随访时长'
                FROM
                    [dbo].[PAT_FOLLOW_UP]
                WHERE
                    PATIENT_NO IN (${patient_no})
                    AND FOLLOW_UP_DATE!='1900-01-01 00:00:00.000'`,
            ret_PAT_FOLLOW_UP = list_PAT_FOLLOW_UP.recordset


        let retPatFollowUP = ret_PAT_FOLLOW_UP

        for (let i = 0; i < ret_PAT_FOLLOW_UP.length; i++) {
            // 查询随访结果
            const list_PAT_FOLLOW_UP_RESULT = await sql.query `SELECT
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
                dist.PATIENT_NO=${ret_PAT_FOLLOW_UP[i].PATIENT_NO}`,
                ret_PAT_FOLLOW_UP_RESULT = list_PAT_FOLLOW_UP_RESULT.recordset


            for (let k = 0; k < ret_PAT_FOLLOW_UP_RESULT.length; k++) {
                if (retPatFollowUP[i].FU_TIMES === ret_PAT_FOLLOW_UP_RESULT[k].FU_TIMES) {

                    let cur_ret = ret_PAT_FOLLOW_UP_RESULT[k],
                        _key = cur_ret.ITEM_NAME,
                        _FOLLOW_UP_MONTHS_new = null

                    retPatFollowUP[i][_key] = cur_ret.CV_VALUE_TEXT ?
                        cur_ret.CV_VALUE_TEXT :
                        cur_ret.SD_ITEM_VALUE

                    if (cur_ret.SD_ITEM_CODE === 'YXA_O_257') { // YXA_O_257 死亡时间
                        if (cur_ret.SD_ITEM_VALUE) {
                            let death_PATIENT_NO = cur_ret.PATIENT_NO, // 有死亡时间的患者
                                // 查询死亡患者的手术时间
                                // list_death = await sql.query `SELECT
                                // SD_ITEM_VALUE FROM [dbo].[PAT_SD_ITEM_RESULT]
                                // WHERE SD_ITEM_CODE='YXA_O_161'
                                // AND PATIENT_NO=${death_PATIENT_NO}`,
                                // ret_death = list_death.recordset[0]
                                surgeryDate =''

                                PAT_VISIT.forEach(item=>{
                                    if(item.PATIENT_NO === death_PATIENT_NO){
                                        surgeryDate= item['手术日期#YXA_O_161']
                                    }
                                })
                            // 死亡时间 - 手术时间 = 随访时长
                            _FOLLOW_UP_MONTHS_new = moment(cur_ret.SD_ITEM_VALUE).diff(surgeryDate, 'M')
                            // console.log(cur_ret.SD_ITEM_CODE, cur_ret.SD_ITEM_VALUE, ret_death.SD_ITEM_VALUE, _FOLLOW_UP_MONTHS_new)

                            // retPatFollowUP[i]['=手术时间='] = ret_death.SD_ITEM_VALUE
                            retPatFollowUP[i]['随访时长'] = _FOLLOW_UP_MONTHS_new


                        }
                    }
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
}
// query_PAT_FOLLOW_UP_RESULT(["4cb915fd7c0543a1"])
// 下载随访化疗信息
const query_PAT_FOLLOW_UP_TREAT = async (patient_no) => {
    console.log('处理化疗信息表')
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

        return ret_PAT_FOLLOW_UP_TREAT
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP_TREAT.json', JSON.stringify(ret_PAT_FOLLOW_UP_TREAT, null, 2))

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
async function saveXlsx(fileName, numberArr) {
    try {
        // await sql.connect(SQL_ADDR)
        const
            PAT_VISIT = await query_PAT_VISIT(numberArr),
            PAT_DRAINAGE_TUBE = await query_PAT_DRAINAGE_TUBE(numberArr),
            PAT_FOLLOW_UP_RESULT = await query_PAT_FOLLOW_UP_RESULT(numberArr,PAT_VISIT),
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

/**
 * 查询某地某年的患者
 * @param {String} fileName 文件名
 * @param {String} address 查询地址
 * @param {Sting,Date} startDate 开始时间
 * @param {String,Date} endDate 结束时间
 */
async function select_addr_year(fileName, address, startDate, endDate) {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询某地某年的患者
        const list_select_year = await sql.query `SELECT
                a.PATIENT_NO
                -- a.NAME,
                -- a.DISCHARGE_DATE,
                -- b.SD_ITEM_VALUE
            FROM
                [dbo].[PAT_VISIT] AS a
                LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS b ON a.PATIENT_NO= b.PATIENT_NO
            WHERE
                a.SD_CODE= 'YXA_O'
                AND b.SD_ITEM_CODE= 'YXA_O_003'
                AND b.SD_ITEM_VALUE LIKE ${address}
                AND a.DISCHARGE_DATE>${startDate}
                AND a.DISCHARGE_DATE<${endDate}`,
            ret_select_year = list_select_year.recordset


        await saveXlsx(fileName, ret_select_year.map(item => item.PATIENT_NO))

    } catch (err) {
        console.error(err)
    }
}
/**
 * 查询某年有放化疗的患者
 * @param {String} fileName 文件名
 * @param {Sting,Date} startDate 开始时间
 * @param {String,Date} endDate 结束时间
 */
async function select_fhl(fileName, startDate, endDate) {
    try {
        // await sql.connect(SQL_ADDR)
        // 查询某地某年的患者
        const list_select_fhl = await sql.query `SELECT
                a.PATIENT_NO
                -- a.NAME,
                -- b.SD_ITEM_CODE,
                -- b.SD_ITEM_VALUE
            FROM
                [dbo].[PAT_VISIT] AS a
                LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS b ON a.PATIENT_NO= b.PATIENT_NO
            WHERE
                a.SD_CODE='YXA_O'
                AND a.DISCHARGE_DATE> ${startDate}
                AND a.DISCHARGE_DATE< ${endDate}
                AND b.SD_ITEM_CODE='YXA_O_117' -- 是否放化疗
                AND b.SD_ITEM_VALUE='1' -- 是`,
            ret_select_fhl = list_select_fhl.recordset


        await saveXlsx(fileName, ret_select_fhl.map(item => item.PATIENT_NO))

    } catch (err) {
        console.error(err)
    }
}

async function main() {
    const startDate16 = '2016-01-01 00:00:00.000',
        endDate16 = '2016-12-31 00:00:00.000',
        startDate17 = '2017-01-01 00:00:00.000',
        endDate17 = '2017-12-31 00:00:00.000',
        startDate18 = '2018-01-01 00:00:00.000',
        endDate18 = '2018-12-31 00:00:00.000',
        address_shanghai = '上海%'


    await sql.connect(SQL_ADDR)

    await select_addr_year('上海-16年', address_shanghai, startDate16, endDate16)
    // await select_addr_year('上海-17年', address_shanghai, startDate17, endDate17)
    // await select_addr_year('上海-18年', address_shanghai, startDate18, endDate18)

    // await select_fhl('是放化疗-16年', startDate16, endDate16)
    // await select_fhl('是放化疗-17年', startDate17, endDate17)
    // await select_fhl('是放化疗-18年', startDate18, endDate18)

    // const config = require('./config.json')
    // config.forEach(item => {
    //      saveXlsx(item.name, item.list)
    // })
    process.exit('退出……')
}

main()