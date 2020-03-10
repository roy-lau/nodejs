/*
	计算随访字段的完整度
    修改最大堆栈 node --max-old-space-size=4096 calc-fild.js
 */

'use strict';
const sql = require('../dbs/sqlServer.js'),
    XLSX = require("xlsx"),
    _ = require("lodash"),
    OBJ_CALC = Object.create(null)


// 保存计算结果
async function saveCalcResult(fileName) {
    try {
        let data = [],_num = 0

        delete OBJ_CALC._ids

        _.forEach(OBJ_CALC, (value, key) => {
            data.push({ '数据项': key, '完整率': value })
            _num += Number(value.replace("%",""))
        });
        // TODO： 计算有误，后期处理
        // const totalPercent = ((data.length * 10000) / _num ).toFixed(2) + '%'
        // data.push({ '数据项': '总完整率', '完整率': totalPercent })

        // 构建 workbook 对象
        let wb = {
            SheetNames: ['统计字段完整率'],
            Sheets: {
                '统计字段完整率': XLSX.utils.json_to_sheet(data),
            }
        }

        // 导出 Excel
        XLSX.writeFile(wb, './out/字段完整度_' + fileName + '.xlsx');
        console.log(fileName, '-OK ', Date.now())
    } catch (e) {
        console.error('处理表格数据出错： ', e)
    }
}
// 计算 随访结果表 --- 验证通过
async function handlePatFollowUpResult() {
    console.info('计算 随访结果表')
    try {
        const followDist = await initFollowDist()

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatFollowUpResult = await sql.query(`SELECT
					dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
					dict.ITEM_NAME,
					result.SD_ITEM_VALUE
				FROM
					[dbo].[FU_SD_ITEM_DICT] AS dict
					LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result
					ON dict.ITEM_CODE=result.SD_ITEM_CODE
					AND result.PATIENT_NO='${key}'
					ORDER BY dict.DISPLAY_ORDER`),
                retPatFollowUpResult = listPatFollowUpResult.recordset
            // console.log(retPatFollowUpResult)
            for (let i = 0; i < retPatFollowUpResult.length; i++) {
                const _items = retPatFollowUpResult[i],
                    joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE
                // console.log(_items)
                followDist[joinKey + '_total'] += 1
                if (_items.SD_ITEM_VALUE || needExits(retPatFollowUpResult,_items)) {
                    followDist[joinKey + '_num'] += 1
                }
                OBJ_CALC[joinKey] = (followDist[joinKey + '_num'] / followDist[joinKey + '_total'] * 100).toFixed(2) + '%'
            }
        }

        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handlePatFollowUpResult ERR ', err)
    }
}

async function initFollowDist() {
    console.info('初始化 随访结果表')
    try {

        const listPatFollowDist = await sql.query(`SELECT
						dist.ITEM_CODE,
						dist.ITEM_NAME
					FROM
						[dbo].[FU_SD_ITEM_DICT] AS dist
						ORDER BY dist.DISPLAY_ORDER`),
            retPatFollowDist = listPatFollowDist.recordset
        // console.log(retPatFollowDist)
        let followDist = {}
        for (let i = 0; i < retPatFollowDist.length; i++) {
            const _dist = retPatFollowDist[i],
                joinKey = _dist.ITEM_NAME + "#" + _dist.ITEM_CODE
            followDist[joinKey + '_total'] = 0
            followDist[joinKey + '_num'] = 0
            OBJ_CALC[joinKey] = 0
        }
        return followDist
    } catch (err) {
        console.error('initFollowDist ERR ', err)
    }
}
// 计算 随访治疗信息 -- 验证通过
async function handlePatFollowUpTreat() {
    console.info('计算 随访治疗信息')
    try {
        let initFollowTreat = {}

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
        const listPatFollowUpTreat = await sql.query(`SELECT
            TREAT_NAME AS '治疗方式',
            DRUG_NAME AS '药品名称(通用名)',
            DRUG_NAME_TRADE AS '药品名称(商品名)',
            DRUG_DOSE AS '剂量',
            TREAT_CYCLE AS '疗程/周期',
            TREAT_METHOD AS '化疗方法',
            TREAT_EFFECT AS '是否好转',
            TREAT_COST AS '化疗费用',
            CA199_FRONT AS '治疗前CA199',
            CEA_FRONT AS '治疗前CEA',
            CA125_FRONT AS '治疗前CA125',
            TREAT_EVALUTE_FRONT AS '治疗前CT评价',
            CA199_AFTER AS '治疗后CA199',
            CEA_AFTER AS '治疗后CEA',
            CA125_AFTER AS '治疗后CA125',
            TREAT_EVALUTE_AFTER AS '治疗后CT评价'
		FROM
			[dbo].[PAT_FOLLOW_UP_TREAT]
		WHERE
			PATIENT_NO= '${key}'`),
            retPatFollowUpTreat = listPatFollowUpTreat.recordset,
            _followUpTreatTotal = retPatFollowUpTreat.length
		// console.log(key,index,_followUpTreatTotal)
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
            const _keys = ['治疗方式','药品名称(通用名)','药品名称(商品名)','剂量','疗程/周期','化疗方法','是否好转','化疗费用','治疗前CA199','治疗前CEA','治疗前CA125','治疗前CT评价','治疗后CA199','治疗后CEA','治疗后CA125','治疗后CT评价']
            for (let k = 0; k < _keys.length; k++) {

                initFollowTreat[_keys[k] + '_total'] = 0
                initFollowTreat[_keys[k] + '_num'] = 0
                OBJ_CALC[_keys[k]] = 0
            }
        }
        for (let i = 0; i < _followUpTreatTotal; i++) {
	            const _items = retPatFollowUpTreat[i]
	            _.forEach(_items, (value, key) => {
	                // console.log(key,value);
	                initFollowTreat[key + '_total'] += 1
	                if (value) {
	                    initFollowTreat[key + '_num'] += 1
	                }
	                OBJ_CALC[key] = (initFollowTreat[key + '_num'] / initFollowTreat[key + '_total'] * 100).toFixed(2) + '%'
	            });
	        }
        }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handlePatFollowUpTreat ERR ', err)
    }
}
// 计算 随访时间和时长 ---  验证通过（未考虑患者应随访次数）
async function handlePatFollowUp() {
    console.info('计算 随访时间和时长')
    try {

        let follow_total = 0,
            followDate_num = 0,
            followMonths_num = 0

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatFollowUp = await sql.query(`SELECT
				PATIENT_NO,
				FOLLOW_UP_DATE,
				FOLLOW_UP_MONTHS
			FROM
				[dbo].[PAT_FOLLOW_UP]
			WHERE
				PATIENT_NO= '${key}'`),
                retPatFollowUp = listPatFollowUp.recordset,
                _followTotal = retPatFollowUp.length

            // console.log(retPatFollowUp)
            for (let i = 0; i < _followTotal; i++) {
                const _item = retPatFollowUp[i]
	            follow_total += 1
                if (_item.FOLLOW_UP_DATE) {
                    followDate_num += 1
                }
                if (_item.FOLLOW_UP_MONTHS) {
                    followMonths_num += 1
                }
            }
        }
        OBJ_CALC['随访时间'] = (followDate_num / follow_total * 100).toFixed(2) + '%'
        OBJ_CALC['随访时长'] = (followMonths_num / follow_total * 100).toFixed(2) + '%'
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handlePatFollowUp ERR ', err)
    }
}
// 计算 引流管信息(有一个引流管信息就算100%，一个也没有就算0%) -- 未验证通过
async function handlePatDrainageTube() {
    console.info('计算 引流管')
    try {
        let initDrainageTube = {}

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
        const listPatDrainageTube = await sql.query(`SELECT
                -- PATIENT_NO,
                TUBE_NAME AS '引流管部位',
                RETENTION_DAYS AS '留置天数',
                POD1,
                POD3,
                POD7,
                AMY_POD1,
                AMY_POD3,
                AMY_POD7,
                AMY_POD_DRAW AS '拔管前AMY'
            FROM
                [dbo].[PAT_DRAINAGE_TUBE]
            WHERE
                PATIENT_NO= '${key}'`),
            retPatDrainageTube = listPatDrainageTube.recordset,
            _DrainageTubeTotal = retPatDrainageTube.length
        // console.log(key,index,_followUpTreatTotal)
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
            const _keys = ['引流管部位','留置天数','POD1','POD3','POD7','AMY_POD1','AMY_POD3','AMY_POD7','拔管前AMY']
            for (let k = 0; k < _keys.length; k++) {

                initDrainageTube[_keys[k] + '_total'] = 0
                initDrainageTube[_keys[k] + '_num'] = 0
                OBJ_CALC[_keys[k]] = 0
            }
        }

        for (let i = 0; i < _DrainageTubeTotal; i++) {
                const _items = retPatDrainageTube[i]

                _.forEach(_items, (value, key) => {
                    // console.log(value, key)
                    if (value) {
                        initDrainageTube[key + '_total'] += 1
                        initDrainageTube[key + '_num'] += 1
                        // OBJ_CALC[key] = (initDrainageTube[key + '_num'] / initDrainageTube[key + '_total'] * 100).toFixed(2) + '%'
                        // console.log(initDrainageTube[key + '_total'],initDrainageTube[key + '_num'] )
                        // return
                    }else{
                        initDrainageTube[key + '_total'] += 1
                        initDrainageTube[key + '_num'] += 0
                        // console.log(initDrainageTube[key + '_total'],initDrainageTube[key + '_num'] )
                        // return
                    }
                        OBJ_CALC[key] = (initDrainageTube[key + '_num'] / initDrainageTube[key + '_total'] * 100).toFixed(2) + '%'
                        // console.log(OBJ_CALC[key] )
                });
            }
        }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handlePatDrainageTube ERR ', err)
    }
}
// 计算 数据项结果 --- 验证通过
async function handlePatItemResult(){
    console.info('计算 数据项结果')
    try {
        let initPatItemResult = await initItemDist()

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatItemResult = await sql.query(`SELECT
                    ret.PATIENT_NO,
                    dict.ITEM_NAME,
                    dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
                    ret.SD_ITEM_VALUE
                FROM
                    [dbo].[SD_ITEM_DICT] AS dict
                    LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS ret
                        ON dict.ITEM_CODE=ret.SD_ITEM_CODE
                        AND ret.PATIENT_NO = '${key}'
                WHERE
                    dict.SD_CODE = 'YXA_O'
                ORDER BY
                    DISPLAY_ORDER`),
                retPatItemResult = listPatItemResult.recordset,
                _lenPatItemResult = retPatItemResult.length
                // console.log(key,index,retPatItemResult)
                for(let _item = 0; _item < _lenPatItemResult; _item++){
                    const _items = retPatItemResult[_item],
                        joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE

                    // console.log(_items.ITEM_NAME,_items.SD_ITEM_VALUE,_items.ITEM_PARENT_CODE)
                    // console.log( needExits(retPatItemResult,_items) )
                        initPatItemResult[joinKey + '_total'] += 1
                        if (_items.SD_ITEM_VALUE || needExits(retPatItemResult,_items)) {
                            initPatItemResult[joinKey + '_num'] += 1
                        }
                    OBJ_CALC[joinKey] = (initPatItemResult[joinKey + '_num'] / initPatItemResult[joinKey + '_total'] * 100).toFixed(2) + '%'
                }

            }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('数据项结果 ERR ', err)
    }
}
/**
 * 判断是否需要计入完整度(诊治结果表 和 随访结果表都调用里这个函数)
 * @param  {[type]} data  [description]
 * @param  {[type]} items [description]
 * @return {[type]}        true OR null
 */
function needExits(data,items){
    // console.log(items)
    let _exit = null
    if (items.ITEM_PARENT_CODE) {
        let parentCode = items.ITEM_PARENT_CODE.replace(/\#1$/,'')
        data.forEach(list=>{
            if(list.ITEM_CODE == parentCode){
                // console.log(list.ITEM_CODE,parentCode,items.ITEM_NAME,list.SD_ITEM_VALUE)
                _exit = (list.SD_ITEM_VALUE == '2')
            }
        })
    }
    return _exit
}
async function initItemDist() {
    console.info('初始化 数据项结果表')
    try {

        const listPatItemDist = await sql.query(`SELECT ITEM_CODE,ITEM_NAME FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE = 'YXA_O' ORDER BY DISPLAY_ORDER`),
            retPatItemDist = listPatItemDist.recordset
        // console.log(retItemDist)
        let patItemDist = {}
        for (let i = 0; i < retPatItemDist.length; i++) {
            const _dist = retPatItemDist[i],
                joinKey = _dist.ITEM_NAME + "#" + _dist.ITEM_CODE
            patItemDist[joinKey + '_total'] = 0
            patItemDist[joinKey + '_num'] = 0
            OBJ_CALC[joinKey] = 0
        }
        return patItemDist
    } catch (err) {
        console.error('initItemDist ERR ', err)
    }
}
// 计算 患者基本信息 --- 验证通过
async function handlePatVist(){
    console.info('计算 患者基本信息')
    try {
        let initPatVist = {}

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatVist = await sql.query(`SELECT
                        PATIENT_NO,
                        PATIENT_ID AS '住院ID',
                        INP_NO AS '住院流水号',
                        NAME AS '患者姓名',
                      SEX AS '性别',
                        AGE AS '患者年龄',
                        ADMISSION_DATE AS '入院日期',
                        DISCHARGE_DATE AS '出院日期',
                        OUT_STATUS AS '离院方式'
                    FROM
                        [dbo].[PAT_VISIT]
                    WHERE
                        PATIENT_NO= '${key}'`),
                retPatVist = listPatVist.recordset,
                _firstvistData = retPatVist[0]
                // console.log(key,index,_firstvistData)

                if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
                    const _keys = Object.keys(_firstvistData)
                    for (let k = 0; k < _keys.length; k++) {

                        initPatVist[_keys[k] + '_total'] = 0
                        initPatVist[_keys[k] + '_num'] = 0
                        OBJ_CALC[_keys[k]] = 0
                    }
                }

                 _.forEach(_firstvistData, (value, key) => {
                    // console.log(key,value);
                    initPatVist[key + '_total'] += 1
                    if (value) {
                        initPatVist[key + '_num'] += 1
                    }
                    OBJ_CALC[key] = (initPatVist[key + '_num'] / initPatVist[key + '_total'] * 100).toFixed(2) + '%'
                });
            }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handlePatVist ERR ', err)
    }
}

// 查询条件函数
async function queryTest() {
    console.info('获取查询患者pNO')
    try {

        const listPatientNo = await sql.query(`SELECT PATIENT_NO FROM [dbo].[PAT_VISIT]
                WHERE PATIENT_NO IN ('802c621a0d478d81','ffbc4406e37a7c57')`),
            retPatientNo = listPatientNo.recordset,
            len = retPatientNo.length

        OBJ_CALC._ids = new Array(len) // 创建个空数组

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                _id = element.PATIENT_NO;

            OBJ_CALC._ids[index] = _id
        }
        // console.log(OBJ_CALC)
        return OBJ_CALC
    } catch (err) {
        console.error('handle ERR ', err)
    }
}
async function queryDie() {
    console.info('获取查询患者pNO')
    try {

        const listPatientNo = await sql.query(`SELECT
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
                            ORDER BY a.PATIENT_NO`),
            retPatientNo = listPatientNo.recordset,
            len = retPatientNo.length

        OBJ_CALC._ids = new Array(len) // 创建个空数组

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                _id = element.PATIENT_NO;

            OBJ_CALC._ids[index] = _id
        }
        // console.log(OBJ_CALC)
        return OBJ_CALC
    } catch (err) {
        console.error('handle ERR ', err)
    }
}
async function queryTotal() {
    console.info('获取 入组 患者pNO')
    try {

        const listPatientNo = await sql.query(`SELECT
                TOP 5000
                PATIENT_NO
            FROM
                [dbo].[PAT_VISIT]
            WHERE
                SD_GROUP = '1'
                AND SD_CODE = 'YXA_O'
                AND DISCHARGE_DATE >= '2016-01-01 00:00:00.000'
                AND DISCHARGE_DATE <= '2018-12-31 00:00:00.000'`),
            retPatientNo = listPatientNo.recordset,
            len = retPatientNo.length

        OBJ_CALC._ids = new Array(len) // 创建个空数组

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                _id = element.PATIENT_NO;

            OBJ_CALC._ids[index] = _id
        }
        // console.log(OBJ_CALC)
        return OBJ_CALC
    } catch (err) {
        console.error('handle ERR ', err)
    }
}
async function query2() {
    console.info('获取 一年内随访的患者 + 有死亡时间的患者 的患者pNO')
    try {
        const listPatientNo = await sql.query(`SELECT
					DISTINCT PATIENT_NO
				FROM
					[dbo].[PAT_FOLLOW_UP_RESULT]
				WHERE
					SD_ITEM_CODE = 'YXA_O_257'
					AND SD_ITEM_VALUE != ''
					AND PATIENT_NO IN (SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O')

					UNION
				SELECT
					DISTINCT PATIENT_NO
				FROM
					[dbo].[PAT_FOLLOW_UP]
				WHERE
					FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
					AND FOLLOW_UP_MONTHS!=''
					AND FOLLOW_UP_MONTHS > 12
					AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`),
            retPatientNo = listPatientNo.recordset,
            len = retPatientNo.length

        OBJ_CALC._ids = new Array(len) // 创建个空数组

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                _id = element.PATIENT_NO;

            OBJ_CALC._ids[index] = _id
        }
        // console.log(OBJ_CALC)
        return OBJ_CALC
    } catch (err) {
        console.error('handle ERR ', err)
    }
}
async function query1() {
    console.info('获取 入组的患者中有随访记录的 患者pNO')
    try {
        const listPatientNo = await sql.query(`SELECT
					DISTINCT PATIENT_NO
				FROM
					[dbo].[PAT_FOLLOW_UP]
				WHERE
					FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
					AND FOLLOW_UP_MONTHS!=''
					AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`),
            retPatientNo = listPatientNo.recordset,
            len = retPatientNo.length

        OBJ_CALC._ids = new Array(len) // 创建个空数组

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                _id = element.PATIENT_NO;

            OBJ_CALC._ids[index] = _id
        }
        // console.log(OBJ_CALC)
        return OBJ_CALC
    } catch (err) {
        console.error('handle ERR ', err)
    }
}

async function main() {

    console.time("共用时")

    // await queryTest()
    await queryTotal()
    await handlePatVist()
    // await handlePatItemResult()
    await handlePatDrainageTube()

    // await handlePatFollowUp()
    // await handlePatFollowUpTreat()
    // await handlePatFollowUpResult()

    await saveCalcResult('三年入组')
    console.timeEnd("共用时")
    process.exit(0)
}
main()