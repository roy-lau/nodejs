/*
	计算字段的完整度
 */

'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    config = require("../config.js"),
    _ = require("lodash"),
    OBJ_CALC = Object.create(null)


// 保存计算结果
async function saveCalcResult(fileName) {
    try {
        let data = [],_num = 0
        delete OBJ_CALC._ids
        _.forEach(OBJ_CALC, (value, key) => {
            // console.log({'数据项':key,'完整率':value});
            data.push({ '数据项': key, '完整率': value })
            _num += Number(value.replace("%",""))
        });
        const totalPercent = ((data.length * 100) / _num ).toFixed(2) + '%'
        data.push({ '数据项': '总完整率', '完整率': totalPercent })

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
        console.error('处理数据出错： ', e)
    }
}
// 计算 随访结果表 --- 验证通过(字段前后逻辑未做处理)
async function handlePatFollowUpResult() {
    console.info('计算 随访结果表')
    try {
        const followDist = await initFollowDist(),
            pool = await new sql.ConnectionPool(config.db_addr).connect();

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatFollowUpResult = await pool.query `SELECT
					dist.ITEM_CODE,
					dist.ITEM_NAME,
					result.SD_ITEM_VALUE
				FROM
					[dbo].[FU_SD_ITEM_DICT] AS dist
					LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result
					ON dist.ITEM_CODE=result.SD_ITEM_CODE
					AND result.PATIENT_NO=${key}
					ORDER BY dist.DISPLAY_ORDER`,
                retPatFollowUpResult = listPatFollowUpResult.recordset
            // console.log(retPatFollowUpResult)
            for (let i = 0; i < retPatFollowUpResult.length; i++) {
                const _items = retPatFollowUpResult[i],
                    joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE
                // console.log(_items)
                followDist[joinKey + '_total'] += 1
                if (_items.SD_ITEM_VALUE) {
                    followDist[joinKey + '_num'] += 1
                }
                OBJ_CALC[joinKey] = (followDist[joinKey + '_num'] / followDist[joinKey + '_total'] * 100).toFixed(2) + '%'
            }
        }

        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('handle ERR ', err)
    }
}
async function initFollowDist() {
    console.info('初始化 随访结果表')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listPatFollowDist = await pool.query `SELECT
						dist.ITEM_CODE,
						dist.ITEM_NAME
					FROM
						[dbo].[FU_SD_ITEM_DICT] AS dist
						ORDER BY dist.DISPLAY_ORDER`,
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
// 计算 随访治疗信息
async function handlePatFollowUpTreat() {
    console.info('计算 随访治疗信息')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        let initFollowTreat = {}

        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
        const listPatFollowUpTreat = await pool.query `SELECT
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
			TREAT_EVALUTE_FRONT AS '术前CT评价',
			CA199_AFTER AS '治疗后CA199',
			CEA_AFTER AS '治疗后CEA',
			CA125_AFTER AS '治疗后CA125',
			TREAT_EVALUTE_AFTER AS '术后CT评价'
		FROM
			[dbo].[PAT_FOLLOW_UP_TREAT]
		WHERE
			PATIENT_NO= ${key}`,
            retPatFollowUpTreat = listPatFollowUpTreat.recordset,
            _followUpTreatTotal = retPatFollowUpTreat.length
		// console.log(key,index,_followUpTreatTotal)
        if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
            const _keys = Object.keys(retPatFollowUpTreat[0])
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

        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        for (let index = 0; index < OBJ_CALC._ids.length; index++) {
            const key = OBJ_CALC._ids[index]
            const listPatFollowUp = await pool.query `SELECT
				PATIENT_NO,
				FOLLOW_UP_DATE,
				FOLLOW_UP_MONTHS
			FROM
				[dbo].[PAT_FOLLOW_UP]
			WHERE
				PATIENT_NO= ${key}`,
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
// 查询条件函数
async function query() {
    console.info('获取查询查询患者pNO')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listPatientNo = await pool.query `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO IN ('ff81dd0731f38630','ffbc4406e37a7c57')
`,
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
    console.info('获取查询查询患者pNO')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listPatientNo = await pool.query `SELECT
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
					AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`,
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
    console.info('获取查询查询患者pNO')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();
        const listPatientNo = await pool.query `SELECT
					DISTINCT PATIENT_NO
				FROM
					[dbo].[PAT_FOLLOW_UP]
				WHERE
					FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
					AND FOLLOW_UP_MONTHS!=''
					AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`,
            // const listPatientNo = await pool.query `SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO IN ('179aa12a972196d9','998e2ba8c606c4f')`,
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


    await query1()
    await handlePatFollowUp()
    await handlePatFollowUpTreat()
    await handlePatFollowUpResult()

    await saveCalcResult('test')
    process.exit()
}
main()