/**
 *  计算患者数据字段
 */
'use strict';
const sql = require('mssql'),
    _ = require("lodash"),
    XLSX = require("xlsx"),
    SQL_ADDR = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190902',
    OBJ_CALC = Object.create(null)
// {id:{
//     id: '',
//     name: '',
//     num: 0, // 上报字段数
//     total: 0, // 应上报字段数
//     info: ''
// }}

async function saveCalcResult() {
    console.log(OBJ_CALC)
}

// 计算 随访治疗信息 3
async function handlePatFollowUpTreat() {
    console.info('计算 随访治疗信息')
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        for (const key in OBJ_CALC) {
            const listPatFollowUpTreat = await pool.query `SELECT
                        PATIENT_NO,
                        FU_TIMES,
                        TREAT_NAME AS '治疗方式',
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
                    WHERE
                    PATIENT_NO=${key}`,
                retPatFollowUpTreat = listPatFollowUpTreat.recordset

                // console.log(retPatFollowUpTreat)
            OBJ_CALC[key].patFollowUpTreat_num = 0
            OBJ_CALC[key].patFollowUpTreat_total = 0
            for (let i = 0; i < retPatFollowUpTreat.length; i++) {
                const element = retPatFollowUpTreat[i]

                // console.log(key,_.compact(Object.values(element)).length)
                OBJ_CALC[key].patFollowUpTreat_num += _.compact(Object.values(element)).length
                OBJ_CALC[key].patFollowUpTreat_total += Object.keys(element).length
            }
            OBJ_CALC[key].num += OBJ_CALC[key].patFollowUpTreat_num
            OBJ_CALC[key].total += OBJ_CALC[key].patFollowUpTreat_total
        }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 随访结果表 2
async function handlePatFollowUpResult() {
    console.info('计算 随访结果表')
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();

        for (const key in OBJ_CALC) {
            /*
                查询条件如下：
                1，根据一个患者id查询 （key：患者id）
                2，根据数据项字典对比数据项结果
             */
            const listPatFollowUpResult = await pool.query `SELECT
                    result.PATIENT_NO,
                    dist.ITEM_CODE,
                    dist.ITEM_NAME,
                    dist.ITEM_PARENT_CODE,
                    result.SD_ITEM_VALUE
                FROM
                    [dbo].[FU_SD_ITEM_DICT] AS dist
                    LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result ON dist.ITEM_CODE= result.SD_ITEM_CODE
                    AND result.PATIENT_NO= ${key}`,
                retPatFollowUpResult = listPatFollowUpResult.recordset

            // console.log(retPatFollowUpResult.length)
            OBJ_CALC[key].patFollowUpResult_num = 0
            OBJ_CALC[key].patFollowUpResult_total = 0

            let isClacChild = true, // 是否计算子项？ 默认计算
                parentCode
            /**
             * 双指针循环
             *  0 1
             *  1 2
             *  2 3
             *  4 0
             */
            for (let i = 0, k = 1, len = retPatFollowUpResult.length; i < len; i++, k++) {
                if (k >= len) k = 0 // 最后一项和第一项进行比较
                const curItem = retPatFollowUpResult[i],
                    nextItem = retPatFollowUpResult[k]

                /**
                 * 独项： 没有父项 也没有子项
                 *         ITEM_PARENT_CODE 如果是 null，这个数据项不是独项就是父项
                 *
                 *{ PATIENT_NO: '44da1ff33c8e14a4',
                 *  ITEM_CODE: 'YXA_O_001',
                 *  ITEM_NAME: '患者身份证号',
                 *  ITEM_PARENT_CODE: null,
                 *  SD_ITEM_VALUE: '310108196207080084' }
                 *
                 *
                 *
                 * 父项： 自身是数据项。
                 *         如果父项为 1(是) ，那么需要计算子项。
                 *         如果父项为 2（否），不需要计算子项。
                 *         如果父项为空，那么 ？？？ 是否计算子项
                 *
                 * { PATIENT_NO: '44da1ff33c8e14a4',
                 *     ITEM_CODE: 'YXA_O_008',
                 *     ITEM_NAME: '有无症状',
                 *     ITEM_PARENT_CODE: null,
                 *     SD_ITEM_VALUE: '1' }
                 *
                 *
                 * 子项： 父项为 1，方才计算子项
                 *         ITEM_PARENT_CODE 的井号前部分是它父项的code 。
                 *
                 * { PATIENT_NO: '44da1ff33c8e14a4',
                 *     ITEM_CODE: 'YXA_O_009',
                 *     ITEM_NAME: '腹痛',
                 *     ITEM_PARENT_CODE: 'YXA_O_008#1',
                 *     SD_ITEM_VALUE: '1' }
                 *
                 */
                if (nextItem.ITEM_PARENT_CODE) {
                    parentCode = nextItem.ITEM_PARENT_CODE.split('#')[0]

                    if (curItem.ITEM_CODE === parentCode) { // 父项。 有三种情况：SD_ITEM_VALUE为1(是)，SD_ITEM_VALUE为2(否)，SD_ITEM_VALUE为空
                        // console.log('Parent: ',curItem.ITEM_NAME,curItem.SD_ITEM_VALUE)
                        OBJ_CALC[key].patFollowUpResult_total += 1 // 不论哪一种情情况，总数都加1
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 1) { // 不为空且值为'是', 分子加1
                            OBJ_CALC[key].patFollowUpResult_num += 1
                        }
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 2) { // 不为空且值为'否', 分子加1。
                            OBJ_CALC[key].patFollowUpResult_num += 1
                            isClacChild = false //不计算子项
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                        }

                    } else if (isClacChild) { // 子项
                        // console.log('\t child: ',curItem.ITEM_NAME,isClacChild)
                        OBJ_CALC[key].patFollowUpResult_total += 1 // 如果需要计算子项，总数加1
                        if (curItem.SD_ITEM_VALUE) {
                            OBJ_CALC[key].patFollowUpResult_num += 1 // 如果子项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                        }
                    }
                }
                if (!curItem.ITEM_PARENT_CODE && curItem.ITEM_CODE !== parentCode) { // 独项
                    // console.log('-single:',curItem.ITEM_NAME)
                    OBJ_CALC[key].patFollowUpResult_total += 1 // 如果需要计算独项，总数加1
                    if (curItem.SD_ITEM_VALUE) {
                        OBJ_CALC[key].patFollowUpResult_num += 1 // 如果独项有值, 分子加1。
                    } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                    }
                }
            }
            OBJ_CALC[key].num += OBJ_CALC[key].patFollowUpResult_num
            OBJ_CALC[key].total += OBJ_CALC[key].patFollowUpResult_total
            // console.log(OBJ_CALC[key])
        };
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 随访时间 3
async function handlePatFollowUp() {
    console.info('计算 随访时间')
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        for (const key in OBJ_CALC) {
            const listPatFollowUp = await pool.query `SELECT
                        PATIENT_NO,
                        FOLLOW_UP_DATE,
                        FOLLOW_UP_MONTHS
                    FROM
                        [dbo].[PAT_FOLLOW_UP]
                    WHERE
                    PATIENT_NO=${key}`,
                retPatFollowUp = listPatFollowUp.recordset

            OBJ_CALC[key].patFollowUp_num = 0
            OBJ_CALC[key].patFollowUp_total = 0
            for (let i = 0; i < retPatFollowUp.length; i++) {
                const element = retPatFollowUp[i]

                // console.log(key,_.compact(Object.values(element)).length)
                OBJ_CALC[key].patFollowUp_num += _.compact(Object.values(element)).length
                OBJ_CALC[key].patFollowUp_total += Object.keys(element).length
            }
            OBJ_CALC[key].num += OBJ_CALC[key].patFollowUp_num
            OBJ_CALC[key].total += OBJ_CALC[key].patFollowUp_total
        }
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 引流管 3
async function handleDrainageTube() {
    console.log('计算引流管字段')
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        for (const key in OBJ_CALC) {
            const listDrainageTube = await pool.query `SELECT
                    PATIENT_NO,
                    TUBE_NAME,
                    RETENTION_DAYS,
                    POD1,
                    POD3,
                    POD7,
                    AMY_POD1,
                    AMY_POD3,
                    AMY_POD7,
                    AMY_POD_DRAW
                FROM
                    [dbo].[PAT_DRAINAGE_TUBE]
                WHERE
                PATIENT_NO=${key}`,
                retDrainageTube = listDrainageTube.recordset

            OBJ_CALC[key].drainageTube_num = 0
            OBJ_CALC[key].drainageTube_total = 0
            for (let i = 0; i < retDrainageTube.length; i++) {
                const element = retDrainageTube[i]

                // console.log(_id,_.compact(Object.values(element)).length)
                OBJ_CALC[key].drainageTube_num += _.compact(Object.values(element)).length
                OBJ_CALC[key].drainageTube_total += Object.keys(element).length
            }
            OBJ_CALC[key].num += OBJ_CALC[key].drainageTube_num
            OBJ_CALC[key].total += OBJ_CALC[key].drainageTube_total
        }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 数据项结果 2
async function handlePatItemResult() {
    console.info('计算数据项结果')
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        for (const key in OBJ_CALC) {
            /*
                查询条件如下：
                1，根据一个患者id查询 （key：患者id）
                2，根据数据项字典对比数据项结果
             */
            const listPatItemResult = await pool.query `SELECT
                    result.PATIENT_NO,
                    dist.ITEM_CODE,
                    dist.ITEM_NAME,
                    dist.ITEM_PARENT_CODE,
                    result.SD_ITEM_VALUE
                FROM
                    [dbo].[SD_ITEM_DICT] AS dist
                    LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS result
                    ON dist.ITEM_CODE= result.SD_ITEM_CODE
                    AND result.PATIENT_NO= ${key}
                WHERE
                    dist.SD_CODE= 'YXA_O'`,
                retPatItemResult = listPatItemResult.recordset

            // console.log(retPatItemResult.length)
            OBJ_CALC[key].itemValue_num = 0
            OBJ_CALC[key].itemValue_total = 0

            let isClacChild = true, // 是否计算子项？ 默认计算
                parentCode
            /**
             * 双指针循环
             *  0 1
             *  1 2
             *  2 3
             *  4 0
             */
            for (let i = 0, k = 1, len = retPatItemResult.length; i < len; i++, k++) {
                if (k >= len) k = 0 // 最后一项和第一项进行比较
                const curItem = retPatItemResult[i],
                    nextItem = retPatItemResult[k]

                /**
                 * 独项： 没有父项 也没有子项
                 *         ITEM_PARENT_CODE 如果是 null，这个数据项不是独项就是父项
                 *
                 *{ PATIENT_NO: '44da1ff33c8e14a4',
                 *  ITEM_CODE: 'YXA_O_001',
                 *  ITEM_NAME: '患者身份证号',
                 *  ITEM_PARENT_CODE: null,
                 *  SD_ITEM_VALUE: '310108196207080084' }
                 *
                 *
                 *
                 * 父项： 自身是数据项。
                 *         如果父项为 1(是) ，那么需要计算子项。
                 *         如果父项为 2（否），不需要计算子项。
                 *         如果父项为空，那么 ？？？ 是否计算子项
                 *
                 * { PATIENT_NO: '44da1ff33c8e14a4',
                 *     ITEM_CODE: 'YXA_O_008',
                 *     ITEM_NAME: '有无症状',
                 *     ITEM_PARENT_CODE: null,
                 *     SD_ITEM_VALUE: '1' }
                 *
                 *
                 * 子项： 父项为 1，方才计算子项
                 *         ITEM_PARENT_CODE 的井号前部分是它父项的code 。
                 *
                 * { PATIENT_NO: '44da1ff33c8e14a4',
                 *     ITEM_CODE: 'YXA_O_009',
                 *     ITEM_NAME: '腹痛',
                 *     ITEM_PARENT_CODE: 'YXA_O_008#1',
                 *     SD_ITEM_VALUE: '1' }
                 *
                 */
                if (nextItem.ITEM_PARENT_CODE) {
                    parentCode = nextItem.ITEM_PARENT_CODE.split('#')[0]

                    if (curItem.ITEM_CODE === parentCode) { // 父项。 有三种情况：SD_ITEM_VALUE为1(是)，SD_ITEM_VALUE为2(否)，SD_ITEM_VALUE为空
                        // console.log('Parent: ',curItem.ITEM_NAME,curItem.SD_ITEM_VALUE)
                        OBJ_CALC[key].itemValue_total += 1 // 不论哪一种情情况，总数都加1
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 1) { // 不为空且值为'是', 分子加1
                            OBJ_CALC[key].itemValue_num += 1
                        }
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 2) { // 不为空且值为'否', 分子加1。
                            OBJ_CALC[key].itemValue_num += 1
                            isClacChild = false //不计算子项
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                        }

                    } else if (isClacChild) { // 子项
                        // console.log('\t child: ',curItem.ITEM_NAME,isClacChild)
                        OBJ_CALC[key].itemValue_total += 1 // 如果需要计算子项，总数加1
                        if (curItem.SD_ITEM_VALUE) {
                            OBJ_CALC[key].itemValue_num += 1 // 如果子项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                        }
                    }
                }
                if (!curItem.ITEM_PARENT_CODE && curItem.ITEM_CODE !== parentCode) { // 独项
                    // console.log('-single:',curItem.ITEM_NAME)
                    OBJ_CALC[key].itemValue_total += 1 // 如果需要计算独项，总数加1
                    if (curItem.SD_ITEM_VALUE) {
                        OBJ_CALC[key].itemValue_num += 1 // 如果独项有值, 分子加1。
                    } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                    }
                }
            }
            OBJ_CALC[key].num += OBJ_CALC[key].itemValue_num
            OBJ_CALC[key].total += OBJ_CALC[key].itemValue_total
        };
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 患者基本信息
async function handlePatVisit(patientNo) {
    console.log('计算患者基本信息')
    try {
        // const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        await sql.connect(SQL_ADDR)
        const listPatVisit = await sql.query `SELECT
                PATIENT_NO,
                NAME,
                SEX,
                AGE,
                ADMISSION_DATE,
                DISCHARGE_DATE,
                OUT_STATUS,
                HOSPITAL_ID
            FROM
                [dbo].[PAT_VISIT]
            WHERE
                SD_CODE = 'YXA_O'
                AND PATIENT_NO IN(${patientNo})`,
            retPatVisit = listPatVisit.recordset

        for (let index = 0; index < retPatVisit.length; index++) {
            const element = retPatVisit[index],
                _id = element.PATIENT_NO;

            OBJ_CALC[_id] = Object.create(null) // 创建一个纯净的对象
            // 写入 id 和 name
            OBJ_CALC[_id].id = element.PATIENT_NO
            OBJ_CALC[_id].name = element.NAME

            //  _.compact([0, 1, false, 2, '', 3]);     返回 [1,2,3]
            OBJ_CALC[_id].num = OBJ_CALC[_id].patVisit_num = _.compact(Object.values(element)).length
            OBJ_CALC[_id].total = OBJ_CALC[_id].patVisit_total = Object.keys(element).length

        }
        // console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

(async function() {
    try {
        console.time('用时')
        await handlePatVisit(['345bda4fda79e57b','12e9717c4072c91a'])
        await handlePatItemResult()
        await handleDrainageTube()
        await handlePatFollowUp()
        await handlePatFollowUpResult()
        await handlePatFollowUpTreat()
        await saveCalcResult()
        console.timeEnd('用时')

    } catch (err) {
        // ... error checks
    }
})()