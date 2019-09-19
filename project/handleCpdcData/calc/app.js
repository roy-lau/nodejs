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

async function over() {
    console.log(OBJ_CALC)
}

// 计算 随访时间 TODO……
async function handlePatFollowUp() {
    console.log('计算 随访时间')
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

            OBJ_CALC[key].PatFollowUp_num = 0
            OBJ_CALC[key].PatFollowUp_total = 0
            for (let i = 0; i < retPatFollowUp.length; i++) {
                const element = retPatFollowUp[i],
                    _id = element.PATIENT_NO;

                // console.log(_id,_.compact(Object.values(element)).length)
                OBJ_CALC[_id].num += OBJ_CALC[_id].PatFollowUp_num += _.compact(Object.values(element)).length
                OBJ_CALC[_id].total += OBJ_CALC[_id].PatFollowUp_total += Object.keys(element).length
            }
        }
        console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}
// 计算 引流管
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
                const element = retDrainageTube[i],
                    _id = element.PATIENT_NO;

                // console.log(_id,_.compact(Object.values(element)).length)
                OBJ_CALC[_id].num += OBJ_CALC[_id].drainageTube_num += _.compact(Object.values(element)).length
                OBJ_CALC[_id].total += OBJ_CALC[_id].drainageTube_total += Object.keys(element).length
            }
        }
        console.log(OBJ_CALC)
    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 数据项结果 TODO……
async function handlePatItemResult() {
    try {
        const pool = await new sql.ConnectionPool(SQL_ADDR).connect();
        // _.forEach 使用例子：
        // _.forEach({ 'a': 1, 'b': 2 }, function(value, key) { console.log(key); });
        // => Logs 'a' then 'b' (iteration order is not guaranteed).
        _.forEach(OBJ_CALC, async (value, key) => {
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
            OBJ_CALC[key].drainageTube_num = 0
            OBJ_CALC[key].drainageTube_total = 0
            // for(let i = 0;i<retPatItemResult.length;i++){
            //     const item = retPatItemResult[i]
            //     if (item.ITEM_PARENT_CODE) {
            //         console.log(item.ITEM_PARENT_CODE)

            //     }
            // }
            console.log(key)
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
                    nextItem = retPatItemResult[k],
                    _id = curItem.PATIENT_NO

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

                    if (curItem.ITEM_CODE === parentCode) { // 父项
                        // console.log(parentCode)
                        console.log('Parent: ',curItem.ITEM_NAME,curItem.SD_ITEM_VALUE)
                        // if(curItem.SD_ITEM_VALUE == 2) isClacChild = false
                    }else if(isClacChild) { // 子项
                        console.log('\t child: ',curItem.ITEM_NAME,isClacChild)
                    }
                }
                if(!curItem.ITEM_PARENT_CODE && curItem.ITEM_CODE !== parentCode){ // 独项
                        console.log('-single:',curItem.ITEM_NAME)
                }
                //         // OBJ_CALC[_id].num += OBJ_CALC[_id].itemValue_num += _.compact(Object.values(curItem)).length
                //         // OBJ_CALC[_id].total += OBJ_CALC[_id].itemValue_total += Object.keys(curItem).length

            }

        });


    } catch (err) {
        console.error('SQL ERR ', err)
    }
}

// 计算 患者基本信息
async function handlePatVisit() {
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
                AND PATIENT_NO IN('4cb915fd7c0543a1','44da1ff33c8e14a4')`,
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
        await handlePatVisit()
        await handlePatItemResult()
        // await handleDrainageTube()
        // await handlePatFollowUp()

        // await over()
    } catch (err) {
        // ... error checks
    }
})()