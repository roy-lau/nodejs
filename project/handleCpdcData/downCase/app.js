/**
 * 下载病例
 */
'use strict';
const sql = require('mssql'),
    Excel = require('exceljs'),
    fs = require('fs'),
    { desensitization, saveFileSync } = require('./utils'),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190701'

// 下载基本信息表
const query_PAT_VISIT = async (patient_no) => {
    try {
        // await sql.connect(SQL_ADDR)
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
                    if (_key === '患者住址#YXA_O_003') retPatVisit[i][_key] = desensitization(ret_PAT_SD_ITEM_RESULT[k].ret_value, 3, 25);continue;
                    if (_key === '主刀医师#YXA_O_005') retPatVisit[i][_key] = desensitization(ret_PAT_SD_ITEM_RESULT[k].ret_value, 3, 25);continue;
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

const listId = ["17df255e56d5f1e2",
    "21dd9717089fc106",
    "e51158cab99c8264",
    "31a3d53a56aadb62",
    "62e4e6c1090ef882",
    "9948d58998a22947",
    "1bb675dc0fdad5b7",
    "2dc61735e46c82db",
    "ae6d22bd3d3f5850",
    "c5716f2e458e6f6c",
    "41fe85c85e485419",
    "f1a4b2e59836836d",
    "25a144fc3856318f",
    "1b1cf7964b9dda52",
    "7bac7023763c5561",
    "51882cb62457d27f",
    "af7c4486ee10447b",
    "1b9e2276aac93adc",
    "35e36d72cde2ad0a",
    "283ddb064795cce7",
    "c71257c1d0ecdcb2",
    "3fafda09d88b08ad",
    "eca990ee8692bac",
    "575d34a70d635da5",
    "9d8433425a50bc17",
    "96ac6861da9dad53",
    "9c85debf6c115508",
    "b76cc9ac18a827",
    "206e86eac18e8947",
    "35fb4eff45bfcf6f",
    "4dcaa004e84b4b46",
    "9af0ee5cc095781c",
    "103c6207bb9aa20a",
    "7f3b5624284e09c5",
    "cd8c531c719ebcad",
    "ea7af14ada7b7203",
    "e0afea8e75aa5f1f",
    "4475641bc1f374a",
    "6fcf4c4ab9655723",
    "9f74529f8a6df2db",
    "22351037b44de759",
    "601ce4d57b5956f",
    "f70e4c8861859193",
    "f04d16f4fda95b9d",
    "1b37bfde732f3d7",
    "b7955d8b3b10bed2",
    "19637e9dae5a457e",
    "9b04c46388f1a4aa",
    "eb95c426215979ad",
    "6286d5053842f507",
    "2c60b2e9dc41e036",
    "b23e2b9b7a212f2e",
    "66f534701fc86a1c",
    "b44b4c9d52ebd027",
    "10af9be42ca2b15",
    "47ba0c07e66dc3",
    "652530baa77dc16b",
    "6b2bcb7ae7308943",
    "27b4a1ef41319924",
    "ca67dc031f7a7ebe",
    "e7b91b572eaa7770",
    "8eb2fca66252ef10",
    "f7c8c422af26e751",
    "ed85abe79d795bb8",
    "7baf0698d54130e0",
    "2f91b2b0b9629db7",
    "41914b06c8f5f7c0",
    "fdccb25599f213b0",
    "a5c9251d5408285e",
    "fa168c22419ef200",
    "8676e609b01ee6ef",
    "f59f3ddff0e68431",
    "8e990f6cface7557",
    "1e289072c18030a0",
    "5a93c3cde1f0e904",
    "948d9ebfdd2a3adb",
    "a93f5c8eed27fd48",
    "b3ce5b1fd5215e60",
    "9d9ba5f2d262b9d9",
    "9d92fd9f622e5b2",
    "5e77e086f3f4a124",
    "3991bccd73b98d00",
    "4f7b3d0de42a7d14",
    "7de1b4fe2075746",
    "b1dc0795822ed4da",
    "d1e3ea6dbd676d29",
    "e72bf826724a6f83",
    "7fb0773e0523af33",
    "4904c9370bcd7649",
    "f22a9706452b4802",
    "f8f9f49dbe33dad1",
    "f860108d4175eaf0",
    "fb4cc38432a6d50c",
    "fefedaeb40ecf60b",
    "35930f447a8467d9",
    "40d4a0b60ddeda1e",
    "8d03a4355f737a30",
    "da71f36598cd207",
    "f4045f1a048b1981",
    "bcb2c5be173e69ad",
    "adb0cd761d2826d2",
    "7f111d1e52b9833e",
    "e585b5824d5da3f6",
    "62637287a108f585",
    "93153fbd8ab6d6a",
    "3cce04fa22071326",
    "3a4e117236427245",
    "a34edd2fe7b3cfd8",
    "997d3a3e39119bbc",
    "afd1f7aafe064357",
    "e4e12bf9dac8617f",
    "77e0b58e8daeb0e9",
    "668397d016be5be6",
    "764f452ef8f081a4",
    "fedc4e984f8f5cbe",
    "53bf37ba9a69857b",
    "aa823642f42bb7d2",
    "7290c3e9f20dc448",
    "c94e8302895624f8",
    "394250316842dd88",
    "18bb70ca2fd10460",
    "e45887dfd67f7cd8",
    "dbde5324822badb0",
    "7a90b2a3c7abefb8",
    "75bfc59274fd4256",
    "64e5ecbc40eefd56",
    "b616a8f7f6175fd",
    "b0cf26db82f9dd5f",
    "5bc77c7fa92a16ba",
    "8d92f299dde57610",
    "e6d4140db2b3bf3",
    "320a6bb1b303157a",
    "3343b00f5125eb1d",
    "26b5b1329b8fd815",
    "b115b7658fc4125d",
    "c61a57612d8c065c",
    "9bc28040e1ecf17e",
    "b7643ea48ce96b5c",
    "cfa4ebc2e12a8dfc",
    "3100242d11205b66",
    "665d0ff12e8ac592",
    "5ea4082f02f6a522",
    "349ca54192e7f078",
    "7bca3b5e9dd9da16",
    "a9cce4d299e26244",
    "5ace750e011a936a",
    "28f756ef224499fb",
    "939f3d39fe5f3d2a",
    "2868b8e145ecb5dd",
    "44d2524c4f5071c",
    "9f699f5e5a87ebe7",
    "d2bee54d8aaca540",
    "fefa142b5596e6ae",
    "a5441f350c45b1de",
    "360b2d557421de31",
    "1249f1b764baf157",
    "b062b747354d0190",
    "e800a900265fba9b",
    "ccb10e133b1e5c9d",
    "6e6988d36338a7ae",
    "12e9717c4072c91a",
    "c343337529988950",
    "756678caa1067c15",
    "cdfcd1e2c920a740",
    "7d56c4442046fa9",
    "dece81d839f7fab7",
    "33de371a0c254f1b",
    "bed48b6e342dc957",
    "f0bdcf6b17dc0bcb",
    "333690e1c1e193e3",
    "81b37385eddabf1c",
    "345bda4fda79e57b",
    "e6e72fe403296b87",
    "59a87cdc20061ab7",
    "fbb2828b90088eaa",
    "2f836f9ea6d45f0d",
    "617341896fa04588",
    "1b98279ddc74f4cf",
    "f9eca34600d4d5c3",
    "c6d10b81fb11abf1",
    "8076e27211672833",
    "bc677e1d49ea9bec",
    "be3fd70e83bddfcb",
    "dae162eb74beb00c",
    "ef918ffe92b5675d",
    "8c3b420decfa668f",
    "3c5aa87b4b03a78b",
    "24859c3bcf361c5f",
    "30b8b3dedae99f2f",
    "9c88958b2712359a",
    "a1bace9ca5df8d7c",
    "4cb915fd7c0543a1",
    "ecba98f5abf702f",
    "276bd0f197422575",
    "2c6c386525ddcf4",
    "f786d42c67c110aa",
    "22f384f70b080b8e",
    "3d844e53d988dc15",
    "35873edccb837327",
    "7682418bcd125b15"
]
saveXlsx('十地区病例', listId)