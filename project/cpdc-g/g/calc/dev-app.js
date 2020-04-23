
/**
 * 计算字段的完整度
 * 修改最大堆栈 node --max-old-space-size=4096 calc-fild.js
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    X_utils = XLSX.utils,
    _ = require("lodash"),
    // fs = require("fs-extra"),
    ProgressBar = require('progress'),
    OBJ_CALC = Object.create(null)


// 保存计算结果
async function saveCalcResult (fileName) {
    try {
        const data = await getCalcData()
        // 创建表格
        const wb = X_utils.book_new()
        // 插入 sheet
        X_utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "统计字段完整率")
        // 保存 Excel 文件
        XLSX.writeFile(wb, './out/字段完整度_' + fileName + Date.now() + '.xlsx');
        OBJ_CALC = Object.create(null) // 清空对象
        console.log('文件：',fileName,' 保存成功！')
    } catch (e) {
        console.error('保存表格出错： ', e)
    }
}

async function getCalcData () {
    const allDict = await sql.query(`SELECT
            isnull( title.ITEM_TYPE_NAME, '' ) + isnull( '_' + title1.ITEM_TYPE_NAME, '' )  AS 'typeName',
            isnull( dist.ITEM_CODE, fu_dist.ITEM_CODE ) AS 'itemCode'
        FROM
            [dbo].[SD_ITEM_TYPE_DICT] AS title 
            LEFT JOIN [dbo].[SD_ITEM_TYPE_DICT] AS title1 ON title.ITEM_TYPE_CODE=title1.PARENT_TYPE_CODE AND title1.PARENT_TYPE_CODE IS NOT NULL AND title.SD_CODE='YXA_O' 
            LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE OR dist.ITEM_TYPE_CODE=title1.ITEM_TYPE_CODE AND dist.SD_CODE='YXA_O'
            LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS fu_dist ON fu_dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE
        WHERE
            title.PARENT_TYPE_CODE IS NULL 
            AND title.SD_CODE= 'YXA_O'`)
    let data = [], _num = 0
    delete OBJ_CALC._ids
    for (const key in OBJ_CALC) {
        const value = OBJ_CALC[key];
        const itemCode = key.split('#')[1]
        if (itemCode) {
            const [cutItem] = allDict.filter(dict => dict.itemCode == itemCode)
            if (cutItem) {
                data.push({ '类别': cutItem.typeName, '数据项': key, '完整率': value + '%' })
            }
        } else {
            const [typeName, itemName] = key.split('_')
            data.push({ '类别': typeName, '数据项': itemName, '完整率': value + '%' })
        }
        _num += Number(value)
    }
    // push 总完整率
    const totalPercent = (_num / data.length).toFixed(2) + '%'
    data.push({ '数据项': '总完整率', '完整率': totalPercent })
    return data
}
/**
 * 计算 随访结果表 ---  验证通过
 * 
 * @param {Number} index id
 * @param {String} patNo 患者id
 */
let followDist
async function handlePatFollowUpResult (index, patNo) {
    try {
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query）
            followDist = await initFollowDist() // 初始化随访数据项结果
        }
        const retPatFollowUpResult = await sql.query(`SELECT
					dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
					dict.ITEM_NAME,
					result.SD_ITEM_VALUE
				FROM
					[dbo].[FU_SD_ITEM_DICT] AS dict
					LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result
					ON dict.ITEM_CODE=result.SD_ITEM_CODE
					AND result.PATIENT_NO='${patNo}'
                    ORDER BY dict.DISPLAY_ORDER+0`)

        // console.log(retPatFollowUpResult)
        for (let i = 0; i < retPatFollowUpResult.length; i++) {
            const _items = retPatFollowUpResult[i],
                joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE
            // console.log(_items)
            followDist[joinKey + '_total'] += 1
            if (_items.SD_ITEM_VALUE || needExits(retPatFollowUpResult, _items)) {
                followDist[joinKey + '_num'] += 1
            }
            OBJ_CALC[joinKey] = (followDist[joinKey + '_num'] / followDist[joinKey + '_total'] * 100).toFixed(2)
        }
    } catch (err) {
        console.error('handlePatFollowUpResult ERR ', err)
    }
}

async function initFollowDist () {
    console.info('初始化 随访结果表')
    try {

        const retPatFollowDist = await sql.query(`SELECT
                    dist.ITEM_CODE,
                    dist.ITEM_NAME
                FROM
                    [dbo].[FU_SD_ITEM_DICT] AS dist
                    ORDER BY dist.DISPLAY_ORDER+0`)
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

/**
 * 计算 随访治疗信息 ---  验证通过
 * 
 * @param {Number} index id
 * @param {String} patNo 患者id
 */
const initFollowTreat = Object.create(null)
async function handlePatFollowUpTreat (index, patNo) {
    try {
        const retPatFollowUpTreat = await sql.query(`SELECT
            TREAT_NAME AS '随访_治疗方式',
            DRUG_NAME AS '随访_药品名称(通用名)',
            DRUG_NAME_TRADE AS '随访_药品名称(商品名)',
            DRUG_DOSE AS '随访_剂量',
            TREAT_CYCLE AS '随访_疗程/周期',
            TREAT_METHOD AS '随访_化疗方法',
            TREAT_EFFECT AS '随访_是否好转',
            TREAT_COST AS '随访_化疗费用',
            CA199_FRONT AS '随访_治疗前CA199',
            CEA_FRONT AS '随访_治疗前CEA',
            CA125_FRONT AS '随访_治疗前CA125',
            TREAT_EVALUTE_FRONT AS '随访_治疗前CT评价',
            CA199_AFTER AS '随访_治疗后CA199',
            CEA_AFTER AS '随访_治疗后CEA',
            CA125_AFTER AS '随访_治疗后CA125',
            TREAT_EVALUTE_AFTER AS '随访_治疗后CT评价'
		FROM
			[dbo].[PAT_FOLLOW_UP_TREAT]
		WHERE
			PATIENT_NO= '${patNo}'`),
            _followUpTreatTotal = retPatFollowUpTreat.length

        // console.log(key,index,_followUpTreatTotal)
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
            const _keys = ['随访_治疗方式',
                '随访_药品名称(通用名)',
                '随访_药品名称(商品名)',
                '随访_剂量',
                '随访_疗程/周期',
                '随访_化疗方法',
                '随访_是否好转',
                '随访_化疗费用',
                '随访_治疗前CA199',
                '随访_治疗前CEA',
                '随访_治疗前CA125',
                '随访_治疗前CT评价',
                '随访_治疗后CA199',
                '随访_治疗后CEA',
                '随访_治疗后CA125',
                '随访_治疗后CT评价']
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
                OBJ_CALC[key] = (initFollowTreat[key + '_num'] / initFollowTreat[key + '_total'] * 100).toFixed(2)
            });
        }
    } catch (err) {
        console.error('handlePatFollowUpTreat ERR ', err)
    }
}


/**
 * 计算 随访时间和时长 ---  验证通过（未考虑患者应随访次数）
 * 
 * @param {Number} index id
 * @param {String} patNo 患者id
 */
let follow_total = 0, followDate_num = 0, followMonths_num = 0
async function handlePatFollowUp (index, patNo) {
    try {

        const retPatFollowUp = await sql.query(`SELECT
				-- PATIENT_NO,
				FOLLOW_UP_DATE,
				FOLLOW_UP_MONTHS
			FROM
				[dbo].[PAT_FOLLOW_UP]
			WHERE
				PATIENT_NO= '${patNo}'`),
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
        /**
         * 待优化，（参与计算次数过多，可以只在最后一次进行计算。但是写法不够优雅）
         */
        OBJ_CALC['随访_随访时间'] = (followDate_num / follow_total * 100).toFixed(2)
        OBJ_CALC['随访_随访时长'] = (followMonths_num / follow_total * 100).toFixed(2)
    } catch (err) {
        console.error('handlePatFollowUp ERR ', err)
    }
}

/**
 * 计算 引流管信息(有一个引流管信息就算100%，一个也没有就算0%) -- 未验证通过
 * 
 * @param {Number} index id
 * @param {String} patNo 患者id
 */
const initDrainageTube = Object.create(null)
async function handlePatDrainageTube (index, patNo) {
    try {
        const retPatDrainageTube = await sql.query(`SELECT
                -- PATIENT_NO,
                TUBE_NAME AS '引流管_引流管部位',
                RETENTION_DAYS AS '引流管_留置天数',
                POD1 AS '引流管_POD1',
                POD3 AS '引流管_POD3',
                POD7 AS '引流管_POD7',
                AMY_POD1 AS '引流管_AMYPOD1',
                AMY_POD3 AS '引流管_AMYPOD3',
                AMY_POD7 AS '引流管_AMYPOD7',
                AMY_POD_DRAW AS '引流管_拔管前AMY'
            FROM
                [dbo].[PAT_DRAINAGE_TUBE]
            WHERE
                PATIENT_NO= '${patNo}'`),
            _DrainageTubeTotal = retPatDrainageTube.length

        // console.log(key,index,_followUpTreatTotal)
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query）
            const _keys = ['引流管_引流管部位', '引流管_留置天数', '引流管_POD1', '引流管_POD3', '引流管_POD7', '引流管_AMYPOD1', '引流管_AMYPOD3', '引流管_AMYPOD7', '引流管_拔管前AMY']
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

                } else {
                    initDrainageTube[key + '_total'] += 1
                    initDrainageTube[key + '_num'] += 0
                }
                OBJ_CALC[key] = (initDrainageTube[key + '_num'] / initDrainageTube[key + '_total'] * 100).toFixed(2)
            });
        }
    } catch (err) {
        console.error('handlePatDrainageTube ERR ', err)
    }
}
/**
 * 计算 数据项结果 --- 验证通过
 * @param {Number} index 
 * @param {String} patNo 患者id
 */
let initPatItemResult
async function handlePatItemResult (index, patNo) {
    try {
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
            initPatItemResult = await initItemDist() // 初始化数据项结果
        }

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
                        AND ret.PATIENT_NO = '${patNo}'
                WHERE
                    dict.SD_CODE = 'YXA_O'
                ORDER BY
                    dict.DISPLAY_ORDER+0`),
            _lenPatItemResult = retPatItemResult.length

        // console.log(key,index,retPatItemResult)
        for (let _item = 0; _item < _lenPatItemResult; _item++) {
            const _items = retPatItemResult[_item],
                joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE

            // console.log(_items.ITEM_NAME,_items.SD_ITEM_VALUE,_items.ITEM_PARENT_CODE)
            // console.log( needExits(retPatItemResult,_items) )
            initPatItemResult[joinKey + '_total'] += 1
            if (_items.SD_ITEM_VALUE || needExits(retPatItemResult, _items)) {
                initPatItemResult[joinKey + '_num'] += 1
            }
            OBJ_CALC[joinKey] = (initPatItemResult[joinKey + '_num'] / initPatItemResult[joinKey + '_total'] * 100).toFixed(2)
        }

    } catch (err) {
        console.error('数据项结果 ERR ', err)
    }
}
/**
 * 判断是否需要计入完整度(诊治结果表 和 随访结果表都调用里这个函数)
 * @param  {[type]} data  [description]
 * @param  {[type]} items [description]
 * @return {[type]}        true 是，不参与计算 。 null 否，参与计算
 * @description 父项为 是 和 空 的参与计算，为否的不参与计算
 */
function needExits (data, items) {
    // console.log(items)
    let _exit = null
    if (items.ITEM_PARENT_CODE) {
        let parentCode = items.ITEM_PARENT_CODE.replace(/\#1$/, '')
        data.forEach(list => {
            if (list.ITEM_CODE == parentCode) {
                // console.log(list.ITEM_CODE,parentCode,items.ITEM_NAME,list.SD_ITEM_VALUE)
                _exit = (list.SD_ITEM_VALUE == '2')
            }
        })
    }
    return _exit
}
/**
 * 初始化 数据项结果表
 * return patItemDist 数据项字典
 */
async function initItemDist () {
    console.info('初始化 数据项结果表')
    try {

        const retPatItemDist = await sql.query(`SELECT ITEM_CODE,ITEM_NAME FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE = 'YXA_O' ORDER BY DISPLAY_ORDER+0`)

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

/**
 * 计算 患者基本信息 --- 验证通过
 * @param {Number} index 
 * @param {String} patNo 患者id
 */
const initPatVist = Object.create(null)
async function handlePatVist (index, patNo) {
    try {
        const retPatVist = await sql.query(`SELECT
                        PATIENT_NO,
                        PATIENT_ID AS '基本信息_住院ID',
                        INP_NO AS '基本信息_住院流水号',
                        NAME AS '基本信息_患者姓名',
                        SEX AS '基本信息_性别',
                        AGE AS '基本信息_患者年龄',
                        ADMISSION_DATE AS '基本信息_入院日期',
                        DISCHARGE_DATE AS '基本信息_出院日期',
                        OUT_STATUS AS '基本信息_离院方式'
                    FROM
                        [dbo].[PAT_VISIT]
                    WHERE
                        PATIENT_NO= '${patNo}'`),
            _firstvistData = retPatVist[0]
        // console.log(key,index,_firstvistData)

        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query）
            const _keys = Object.keys(_firstvistData)
            for (let k = 0; k < _keys.length; k++) {
                initPatVist[_keys[k] + '_total'] = 0
                initPatVist[_keys[k] + '_num'] = 0
                OBJ_CALC[_keys[k]] = 0
            }
        }

        _.forEach(_firstvistData, (value, key) => {
            initPatVist[key + '_total'] += 1
            if (value) {
                initPatVist[key + '_num'] += 1
            }
            OBJ_CALC[key] = (initPatVist[key + '_num'] / initPatVist[key + '_total'] * 100).toFixed(2)
        });
    } catch (err) {
        console.error('handlePatVist ERR ', err)
    }
}

function startup () {

    console.time("共用时")

    sql.query("SELECT HOSPITAL_ID,HOSPITAL_NAME FROM [dbo].[HOSPITAL_DICT]").then(async hList => {
        for (let i = 0; i <= hList.length; i++) {
            const h = hList[i]
            console.log(h.HOSPITAL_NAME)
            const retPatientNo = await sql.query(`SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_CODE='YXA_O' AND SD_GROUP='1' AND HOSPITAL_ID='${h.HOSPITAL_ID}'`)
            console.log(retPatientNo)
            const len = retPatientNo.length
            if (len < 1) return
            let bar = new ProgressBar('  进度 [:bar] :current/:total :percent :etas', {
                complete: '=', // 完成
                incomplete: ' ', // 未完成
                width: 50, // 宽度
                total: len // 总数
            });

            for (let index = 0; index < len; index++) {
                const element = retPatientNo[index],
                    patNo = element.PATIENT_NO;

                await handlePatVist(index, patNo)
                await handlePatItemResult(index, patNo)
                await handlePatDrainageTube(index, patNo)

                await handlePatFollowUp(index, patNo)

                await handlePatFollowUpTreat(index, patNo)
                await handlePatFollowUpResult(index, patNo)
                bar.tick();

            }
            let data = [], _num = 0
            delete OBJ_CALC._ids
            for (const key in OBJ_CALC) {
                const value = OBJ_CALC[key];
                _num += Number(value)
            }
            // push 总完整率
            const totalPercent = (_num / data.length).toFixed(2) + '%'
            data.push({ '数据项': '总完整率', '完整率': totalPercent })
            // await saveCalcResult(h.HOSPITAL_NAME)
            console.timeEnd("共用时")
        }
    })
}
startup()