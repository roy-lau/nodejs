/**
 * 下载病例
 */
'use strict';
const sql = require('mssql'),
    Excel = require('exceljs'),
    fs = require('fs'),
    { desensitization, saveFileSync } = require('./utils'),
    config = require("../config.js")


// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
    try {
        // await sql.connect(config.db_addr)
        // 查询患者基本信息
        const list_PAT_VISIT = await sql.query `SELECT
                PATIENT_NO,
                PATIENT_ID AS '住院ID',
                INP_NO AS '住院流水号',
                '患者性别' = ( CASE SEX WHEN '0' THEN '女' WHEN '1' THEN '男' END ),
                AGE AS '患者年龄',
                ADMISSION_DATE AS '入院日期',
                DISCHARGE_DATE AS '出院日期',
                OUT_STATUS AS '离院方式'
            FROM
                [dbo].[PAT_VISIT]
            WHERE
            PATIENT_NO IN (${patient_no}) AND SD_CODE='YXA_O'`,
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


                    // 脱敏
                    if (_key === '患者住址#YXA_O_003') retPatVisit[i][_key] = desensitization(ret_PAT_SD_ITEM_RESULT[k].ret_value, 3, 25);
                    if (_key === '主刀医师#YXA_O_005') retPatVisit[i][_key] = desensitization(ret_PAT_SD_ITEM_RESULT[k].ret_value, 3, 25);
                    if (_key === '其他既往史#YXA_O_024') {
                        retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].ret_value
                        retPatVisit[i]['有无高血压'] = (/高血压/).test(ret_PAT_SD_ITEM_RESULT[k].ret_value) ? '有' : '无'
                    }
                    retPatVisit[i][_key] = ret_PAT_SD_ITEM_RESULT[k].ret_value
                }
            }
        }
        console.log('处理患者基本信息表')
        // console.log(list_PAT_SD_ITEM_RESULT)
        // console.log(ret_PAT_SD_ITEM_RESULT)
        // console.log(retPatVisit)
        // await saveFileSync('./out/ret_PAT_VISIT.json', JSON.stringify(ret_PAT_VISIT, null, 2))
        // await saveFileSync('./out/./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

        return ret_PAT_VISIT
            // 排序
            .sort((a, b) => a['患者住址#YXA_O_003'] > b['患者住址#YXA_O_003'] ? 1 : -1)

    } catch (err) {
        console.error(err)
    }
}

// 下载引流管信息表
const query_PAT_DRAINAGE_TUBE = async (patient_no) => {
    try {
        // await sql.connect(config.db_addr)
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

        console.log('处理引流管表')
        return ret_PAT_DRAINAGE_TUBE
        // await saveFileSync('./out/ret_PAT_DRAINAGE_TUBE.json', JSON.stringify(ret_PAT_DRAINAGE_TUBE, null, 2))

    } catch (err) {
        console.error(err)
    }
}

// 下载随访信息
const query_PAT_FOLLOW_UP_RESULT = async (patient_no) => {
    try {
        // await sql.connect(config.db_addr)
        // 查询随访信息
        const list_PAT_FOLLOW_UP = await sql.query `SELECT
                    PATIENT_NO,
                    FU_TIMES,
                    FOLLOW_UP_DATE AS '随访时间',
                    FOLLOW_UP_MONTHS AS '随访时长'
                FROM
                    [dbo].[PAT_FOLLOW_UP]
                WHERE
                    PATIENT_NO IN (${patient_no})`,
            ret_PAT_FOLLOW_UP = list_PAT_FOLLOW_UP.recordset

        // console.log(ret_PAT_FOLLOW_UP)

        let retPatFollowUP = ret_PAT_FOLLOW_UP

        for (let i = 0; i < ret_PAT_FOLLOW_UP.length; i++) {
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
                dist.PATIENT_NO=${ret_PAT_FOLLOW_UP[i].PATIENT_NO} `,
                ret_PAT_FOLLOW_UP_RESULT = list_PAT_FOLLOW_UP_RESULT.recordset


            for (let k = 0; k < ret_PAT_FOLLOW_UP_RESULT.length; k++) {
                if (retPatFollowUP[i].PATIENT_NO === ret_PAT_FOLLOW_UP_RESULT[k].PATIENT_NO) {

                    let _key = ret_PAT_FOLLOW_UP_RESULT[k].ITEM_NAME

                    retPatFollowUP[i][_key] = ret_PAT_FOLLOW_UP_RESULT[k].CV_VALUE_TEXT ?
                        ret_PAT_FOLLOW_UP_RESULT[k].CV_VALUE_TEXT :
                        ret_PAT_FOLLOW_UP_RESULT[k].SD_ITEM_VALUE
                }
            }
        }

        console.log('处理随访表')
        return retPatFollowUP
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP.json', JSON.stringify(ret_PAT_FOLLOW_UP, null, 2))
        // await saveFileSync('./out/ret_PAT_FOLLOW_UP_RESULT.json', JSON.stringify(ret_PAT_FOLLOW_UP_RESULT, null, 2))
        // await saveFileSync('./out/retPatFollowUP.json', JSON.stringify(retPatFollowUP, null, 2))

    } catch (err) {
        console.error(err)
    }
}

// 下载随访化疗信息
const query_PAT_FOLLOW_UP_TREAT = async (patient_no) => {
    try {
        // await sql.connect(config.db_addr)
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

        console.log('处理化疗信息表')
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
        await sql.connect(config.db_addr)

        const list_PAT_VISIT = await query_PAT_VISIT(numberArr)
        const workBook = new Excel.Workbook(),
            Xlsx = workBook.xlsx,
            firstWs = workBook.addWorksheet('基本信息'),
            writePath = './out/my/exceljs-' + Date.now() + '.xlsx'


        // list_PAT_VISIT.forEach(item => {
        //     firstWs.columns = Object.keys(item)
        //     firstWs.addRow(item)
        // })

        // firstWs.columns = Object.keys(list_PAT_VISIT[0])
        // firstWs.addRow(list_PAT_VISIT)

        // firstWs.columns = [
        //     { header: 'Id', key: 'id',name:'hi',value:'roy', width: 10 },
        //     { header: 'Name', key: 'name',name:'hi',value:'roy', width: 32 },
        //     { header: 'D.O.B.', key: 'dob',name:'hi',value:'roy', width: 10, outlineLevel: 1 }
        // ];
        // firstWs.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)})

        let headers = []
        for (let _key in list_PAT_VISIT[0]) {
            if (_key === '其他既往史#YXA_O_024') {
                headers.push({ header: _key, key: _key, style: { font: { color: { argb: 'FFAA0000' } } } })
            } else {
                headers.push({ header: _key, key: _key })
            }
        }
        firstWs.columns = headers

        for (let i = 0; i < list_PAT_VISIT.length; i++) {
            list_PAT_VISIT[i].style = { font: { color: { argb: 'FF00AA00' } } }

            firstWs.addRow(list_PAT_VISIT[i])
        }


        Xlsx.writeFile(writePath).then(function() {
            console.log(writePath, ' 写入完成！')
        })


    } catch (e) {
        console.error('处理数据出错： ', e)
    }

}

// const listId =['c2963ab9145003a0',
// '4d3f302f55ab03a0',
// 'd5ef871ded7657a4',
// 'd6b0233e441b9879',
// '8c9af72ba027ba0',
// 'd134fe680add19d2',
// '12229ad7c4fe293c',
// '14464c6497704496',
// '17c91b901eb8651d',
// '625ca5f4b4b07299',
// 'a718eceadd7b6b98',
// 'eea906bb345c03a0',
// '255f19a870983e9a',
// 'a18355c543684e0',
// 'a526461abcbc6a80',
// '3e0de600460613da',
// '4000573f546c57e0',
// '4435ff40f68961e7',
// 'b58aa8ba2ee953fa',
// 'faf66cb88c4f87b5']
// saveXlsx('是放疗-2016年', listId)

async function main() {

    const config = require('./config.json')
    await sql.connect(config.db_addr)
    config.forEach(item => {
        saveXlsx(item.name, item.list)

    })
}

main()