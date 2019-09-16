/**
 * 下载病例
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    fs = require('fs'),
    { desensitization, saveFileSync } = require('./utils'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190902'

// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
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
        console.log('处理患者基本信息表')
        // console.log(list_PAT_SD_ITEM_RESULT)
        // console.log(ret_PAT_SD_ITEM_RESULT)
        // console.log(retPatVisit)
        // await saveFileSync('./out/list_PAT_VISIT.json', JSON.stringify(list_PAT_VISIT.recordsets[0], null, 2))
        // await saveFileSync('./out/./out/retPatVisit.json', JSON.stringify(retPatVisit, null, 2))

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
        // await sql.connect(SQL_ADDR)
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
        await sql.connect(SQL_ADDR)

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
        console.log('OK ', Date.now())
    } catch (e) {
        console.error('处理数据出错： ', e)
    }

}

const listId = ["185c63b975e6fc72",
    "28247d2f5fc3de05",
    "33b21e248cd01ab8",
    "33bfb3e3a406dcc7",
    "35e360e120aa6947",
    "38c4f4eef5c9ba3b",
    "49801de5776c2423",
    "607b84d49bccef48",
    "882288cfc8bbe033",
    "8fd468160f9247f3",
    "957191fd14c03f67",
    "9991204ff92b85b5",
    "ade02906c88104f4",
    "beb088300e57044",
    "366e86f071f3f5f3",
    "5d0fc7518b2bcc8c",
    "79aa46699581fac6",
    "927852950fd3aba1",
    "a1f1731a91b8f787",
    "af315f698ba2ce99",
    "cc637a5b659de006",
    "eb7caf39c4f1f46d",
    "577a910c56d5bb4c",
    "5ce3d9f06f5efcac",
    "5f76e67f8ededd6c",
    "6df284a05fe483bf",
    "7b7fa7d1bdfb9910",
    "8b3ef73f6e0bfac0",
    "b7093cdf290bd17d",
    "c35bd7abd7595373",
    "da2ae2d6716c3487",
    "19efa0207b7506e9",
    "1b0a2f530508b6cd",
    "1bae83f11929bd67",
    "326611938912fe6b",
    "4dbed50f362dc94e",
    "5452b3cb61ac798c",
    "5953920be8f103a7",
    "7240e03de7f0ce90",
    "7aa86bcf9fe4f145",
    "7e56551be5ad380a",
    "7fb82703622695b6",
    "888ed68425ded6a8",
    "a9881f7435971188",
    "b0e2ae2f43ed56a6",
    "b56e10e096b07805",
    "c05078c58316a730",
    "ced770a40b0fd64",
    "d4dffb059d1bb431",
    "e145fda074e98f67",
    "164e2cda7026e80a",
    "375d28e455614389",
    "40e90c33d6fb5287",
    "4d3c2761d1fca159",
    "658c3f057e6a5b1b",
    "65b2264e6941c3fb",
    "8e442fb229d40cd",
    "adac2b4b7783b08d",
    "bcb2bf98fa45910b",
    "c3e3090f08064c62",
    "cc6666b031bab4c8",
    "cdb293712da438f4",
    "db87772d63380777",
    "e948e0993966f441",
    "f303db224298192d",
    "f9897c89b03f5df3",
    "fed4f70321d4a477",
    "1b992fc0f3526214",
    "31de1e86b16fbdf9",
    "56afd8ab092ff500",
    "97dfd175fc8d4a3a",
    "ca67dc031f7a7ebe",
    "ecd2aa379ca81275",
    "309dad1c2b6dc121",
    "30f97038d5f6cbc1",
    "3b910986d4ef4825",
    "5eb7c6abaca8a7ad",
    "8399c9c275d763a3",
    "9d5f3199f62d4005",
    "b7f148f84716dbf4",
    "dc23d87739787404",
    "fc9288b98770daf",
    "1e8c7de57a3925e4",
    "3bb03c924b44f17b",
    "6dbd2c44b34e507",
    "8ca023eb6dd98d3",
    "9a8eada418f66968",
    "bd670ec0839bb0e6",
    "c40badde162445df",
    "c7ae8927ae7a774e",
    "d3d7eb1af1760c0c",
    "e88455b6c95573e5",
    "ee4ac5263e6bd20f"
]
saveXlsx('是放化疗-2018年', listId)
// async function main() {

//     const config = require('./config.json')
//     await sql.connect(SQL_ADDR)
//     config.forEach(item => {
//         saveXlsx(item.name, item.list)

//     })
// }

// main()