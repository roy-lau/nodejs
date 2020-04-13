/*
	计算随访字段的完整度
    修改最大堆栈 node --max-old-space-size=4096 calc-fild.js
 */

'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    _ = require("lodash"),
    // fs = require("fs-extra"),
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
            const retPatFollowUpResult = await sql.query(`SELECT
					dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
					dict.ITEM_NAME,
					result.SD_ITEM_VALUE
				FROM
					[dbo].[FU_SD_ITEM_DICT] AS dict
					LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result
					ON dict.ITEM_CODE=result.SD_ITEM_CODE
					AND result.PATIENT_NO='${key}'
                    ORDER BY dict.DISPLAY_ORDER`)
                    
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

        const retPatFollowDist = await sql.query(`SELECT
                    dist.ITEM_CODE,
                    dist.ITEM_NAME
                FROM
                    [dbo].[FU_SD_ITEM_DICT] AS dist
                    ORDER BY dist.DISPLAY_ORDER`)
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
        const retPatFollowUpTreat = await sql.query(`SELECT
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
            const retPatFollowUp = await sql.query(`SELECT
				PATIENT_NO,
				FOLLOW_UP_DATE,
				FOLLOW_UP_MONTHS
			FROM
				[dbo].[PAT_FOLLOW_UP]
			WHERE
				PATIENT_NO= '${key}'`),
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
        const retPatDrainageTube = await sql.query(`SELECT
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
            const retPatItemResult = await sql.query(`SELECT
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

        const retPatItemDist = await sql.query(`SELECT ITEM_CODE,ITEM_NAME FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE = 'YXA_O' ORDER BY DISPLAY_ORDER`)
        
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
            const retPatVist = await sql.query(`SELECT
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
async function query() {
    console.info('获取查询患者pNO')
    try {
        const querySql = require("./querySql.js")
        const retPatientNo = await sql.query(querySql),
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

async function startup() {

    console.time("共用时")

    await query()

    await handlePatVist()
    await handlePatItemResult()
    await handlePatDrainageTube()

    await handlePatFollowUp()
    await handlePatFollowUpTreat()
    await handlePatFollowUpResult()

    await saveCalcResult('金薇薇')
    console.timeEnd("共用时")
    process.exit(0)
}
startup()