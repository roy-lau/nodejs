/**
 * 测试 数据项结果计算的是否正确
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    config = require("../config.js"),
    Clac = require("./core.js")

let OBJ_CALC = Object.create(null)


class TestClac {
    constructor() {
        this.clac = new Clac(['345bda4fda79e57b', '12e9717c4072c91a', '179aa12a972196d9'])

    }
    async run() {
        OBJ_CALC = await this.clac.handlePatVisit()
        await this.handlePatItemResult()
    }
    // 计算 数据项结果 2
    async handlePatItemResult() {
        console.info('计算数据项结果')
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();
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

                OBJ_CALC[key].itemValue_num = 0
                OBJ_CALC[key].itemValue_total = 0

                let isClacChild = true, // 是否计算子项？ 默认计算
                    parentCode

                for (let i = 0, k = 1, len = retPatItemResult.length; i < len; i++, k++) {
                    if (k >= len) k = 0 // 最后一项和第一项进行比较
                    const curItem = retPatItemResult[i],
                        nextItem = retPatItemResult[k]

                    if (nextItem.ITEM_PARENT_CODE) {
                        parentCode = nextItem.ITEM_PARENT_CODE.split('#')[0]
                    }

                    if (curItem.ITEM_CODE === parentCode) { // 父项。 有三种情况：SD_ITEM_VALUE为1(是)，SD_ITEM_VALUE为2(否)，SD_ITEM_VALUE为空
                        console.log('Parent: ',i, curItem.ITEM_CODE,curItem.ITEM_NAME, curItem.SD_ITEM_VALUE)

                        OBJ_CALC[key].itemValue_total += 1 // 不论哪一种情情况，总数都加1
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 1) { // 不为空且值为'是', 分子加1

                            OBJ_CALC[key].itemValue_num += 1
                            isClacChild = true // 计算子项
                        } else if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 2) { // 不为空且值为'否', 分子加1。

                            OBJ_CALC[key].itemValue_num += 1
                            isClacChild = false // 不计算子项
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称
                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME)
                            isClacChild = true // 计算子项
                        }

                    } else if (curItem.ITEM_PARENT_CODE && isClacChild) { // 子项
                        console.log('\t child: ', i ,curItem.ITEM_CODE,curItem.ITEM_NAME, isClacChild , curItem.SD_ITEM_VALUE)

                        OBJ_CALC[key].itemValue_total += 1 // 如果需要计算子项，总数加1
                        if (curItem.SD_ITEM_VALUE) {

                            OBJ_CALC[key].itemValue_num += 1 // 如果子项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME)
                        }
                    }
                    if (!curItem.ITEM_PARENT_CODE && curItem.ITEM_CODE !== parentCode) { // 独项
                        // console.log('-single:', i,curItem.ITEM_NAME,curItem.SD_ITEM_VALUE)

                        OBJ_CALC[key].itemValue_total += 1 // 如果需要计算独项，总数加1
                        if (curItem.SD_ITEM_VALUE) {

                            OBJ_CALC[key].itemValue_num += 1 // 如果独项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称

                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME)
                        }
                    }
                }
                console.log(OBJ_CALC[key].dtMissingField.length + OBJ_CALC[key].itemValue_num, '=', OBJ_CALC[key].itemValue_total)
            }
            // console.log(OBJ_CALC)
        } catch (err) {
            console.error('SQL ERR ', err)
        }
    }
}

async function main() {
    const testClac = new TestClac()
    await testClac.run()
    process.exit()
}

main()