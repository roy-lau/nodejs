/**
 *  计算患者数据字段
 */
'use strict';
const sql = require('mssql'),
    XLSX = require("xlsx"),
    config = require("../config.js"),
    _ = require("lodash"),
    OBJ_CALC = Object.create(null)

// {id:{
//     id: '',
//     name: '',
//     num: 0, // 上报字段数
//     total: 0, // 应上报字段数
//     info: ''
// }}


module.exports = class CALC {
    constructor(patientNo) {
        // 要处理的患者id
        this.patientNo = patientNo
        this.calcResult = []

    }
    // 保存计算结果
    async saveCalcResult(fileName) {
        try {

            // 构建 workbook 对象
            let wb = {
                SheetNames: ['统计'],
                Sheets: {
                    '统计': XLSX.utils.json_to_sheet(this.calcResult),
                }
            }

            // 导出 Excel
            XLSX.writeFile(wb, './out/' + fileName + '.xlsx');
            console.log(fileName, '-OK ', Date.now())
        } catch (e) {
            console.error('处理数据出错： ', e)
        }
    }
    // 处理完整率
    async handleCompleteRate() {
        const _data = Object.values(OBJ_CALC)
        let ret = []
        _data.forEach(item => {

            const totalIntegrityRate = (item.num / item.total * 100).toFixed(2) + '%',

                DTIntegrityRate = ((item.patVisit_num + item.itemValue_num + item.drainageTube_num) /
                    (item.patVisit_total + item.itemValue_total + item.drainageTube_total) *
                    100).toFixed(2) + '%',

                followIntegrityRate = ((item.patFollowUp_num + item.patFollowUpResult_num + item.patFollowUpTreat_num) /
                    (item.patFollowUp_total + item.patFollowUpResult_total + item.patFollowUpTreat_total) *
                    100).toFixed(2) + '%'

            ret.push({
                "住院号": item.patientId,
                "病案号": item.inpNo,
                "姓名": item.name,
                "诊治完整率": DTIntegrityRate,
                "随访完整率": followIntegrityRate,
                "总完整率": totalIntegrityRate,
                "缺失字段": item.dtMissingField.join()
            })
        })
        this.calcResult = ret
        // console.log(ret)
    }
    // 计算 随访治疗信息 3
    async handlePatFollowUpTreat() {
        console.info('计算 随访治疗信息')
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();
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
            console.error('handle ERR ', err)
        }
    }

    // 计算 随访结果表 2
    async handlePatFollowUpResult() {
        console.info('计算 随访结果表')
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();

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
            console.error('handle ERR ', err)
        }
    }
    /**
     * [_needFollowCount 计算此患者需随访次数]
     * @param  {String} key 患者id
     * @return {Number}     需随访次数
     */
    async _needFollowCount(key) {
        // PAT_SD_ITEM_RESULT       YXA_O_209 院内死亡 -> 6c45d5448d05847a
        // PAT_SD_ITEM_RESULT       YXA_O_161 手术日期
        // PAT_FOLLOW_UP_RESULT     YXA_O_256 是否死亡
        // PAT_FOLLOW_UP_RESULT     YXA_O_257 死亡日期
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();
            // 查询 是否院内死亡 和 手术日期
            const listIsDeadAndDateOfSurgery = await pool.query `SELECT
                            *
                        FROM
                            [dbo].[PAT_SD_ITEM_RESULT] AS a
                        WHERE
                            PATIENT_NO = ${key}
                            AND (
                            a.SD_ITEM_CODE= 'YXA_O_209'
                            OR a.SD_ITEM_CODE= 'YXA_O_161')`,
                retIsDeadAndDateOfSurgery = listIsDeadAndDateOfSurgery.recordset,
                _dateOfSurgery = retIsDeadAndDateOfSurgery[0],
                _isDead = retIsDeadAndDateOfSurgery[1],
                dateOfSurgery = _dateOfSurgery.SD_ITEM_VALUE, // 手术日期
                isDead = _isDead.SD_ITEM_VALUE // 是否院内死亡

            // console.log(isDead, dateOfSurgery, key)
            if (isDead == '1') { // 院内死亡
                OBJ_CALC[key].needFollowCount = 0
                return
            } else {

            }
        } catch (err) {
            console.error('handle ERR ', err)
        }
    }
    // 计算 随访时间 3
    async handlePatFollowUp() {
        console.info('计算 随访时间')
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();
            for (const key in OBJ_CALC) {
                const needFollowCount = await this._needFollowCount(key)
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
            // console.log(OBJ_CALC)
        } catch (err) {
            console.error('handle ERR ', err)
        }
    }

    // 计算 引流管 3
    async handleDrainageTube() {
        console.log('计算引流管字段')
        try {
            const pool = await new sql.ConnectionPool(config.db_addr).connect();
            for (const key in OBJ_CALC) {
                const listDrainageTube = await pool.query `SELECT
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
                    WHERE
                    PATIENT_NO=${key}`,
                    retDrainageTube = listDrainageTube.recordset

                OBJ_CALC[key].drainageTube_num = 0
                OBJ_CALC[key].drainageTube_total = 0

                for (let i = 0; i < retDrainageTube.length; i++) {
                    const element = retDrainageTube[i]

                    OBJ_CALC[key].drainageTube_num += _.compact(Object.values(element)).length
                    OBJ_CALC[key].drainageTube_total += Object.keys(element).length

                    getkey(element).map(item => OBJ_CALC[key].dtMissingField.push(`引流管${i+1}——${item}`))

                }

                OBJ_CALC[key].num += OBJ_CALC[key].drainageTube_num
                OBJ_CALC[key].total += OBJ_CALC[key].drainageTube_total
            }
            console.log(OBJ_CALC)
        } catch (err) {
            console.error('handle ERR ', err)
        }
    }

    // 计算 数据项结果 2
    async handlePatItemResult() {
        console.time('计算数据项结果')
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
                    }

                    if (curItem.ITEM_CODE === parentCode) { // 父项。 有三种情况：SD_ITEM_VALUE为1(是)，SD_ITEM_VALUE为2(否)，SD_ITEM_VALUE为空
                        // console.log('Parent: ',curItem.ITEM_NAME,curItem.SD_ITEM_VALUE)
                        OBJ_CALC[key].itemValue_total += 1 // 不论哪一种情情况，总数都加1
                        if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 1) { // 不为空且值为'是', 分子加1
                            OBJ_CALC[key].itemValue_num += 1
                            isClacChild = true // 计算子项
                        } else if (curItem.SD_ITEM_VALUE && curItem.SD_ITEM_VALUE == 2) { // 不为空且值为'否', 分子加1。
                            OBJ_CALC[key].itemValue_num += 1
                            isClacChild = false //不计算子项
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称
                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME + '#' + curItem.ITEM_CODE)
                            isClacChild = true // 计算子项
                        }

                    } else if (curItem.ITEM_PARENT_CODE && isClacChild) { // 子项
                        // console.log('\t child: ',curItem.ITEM_NAME,isClacChild)
                        OBJ_CALC[key].itemValue_total += 1 // 如果需要计算子项，总数加1
                        if (curItem.SD_ITEM_VALUE) {
                            OBJ_CALC[key].itemValue_num += 1 // 如果子项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称
                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME + '#' + curItem.ITEM_CODE)
                        }
                    }
                    if (!curItem.ITEM_PARENT_CODE && curItem.ITEM_CODE !== parentCode) { // 独项
                        // console.log('-single:',curItem.ITEM_NAME)
                        OBJ_CALC[key].itemValue_total += 1 // 如果需要计算独项，总数加1
                        if (curItem.SD_ITEM_VALUE) {
                            OBJ_CALC[key].itemValue_num += 1 // 如果独项有值, 分子加1。
                        } else { // SD_ITEM_VALUE为空, 总数加1，分子不增加。 TODO：获取空项数据项名称
                            OBJ_CALC[key].dtMissingField.push(curItem.ITEM_NAME + '#' + curItem.ITEM_CODE)
                        }
                    }
                }
                // OBJ_CALC[key].dtMissingFieldNum = OBJ_CALC[key].dtMissingField.length // 不能每次都获取长度，最后获取一次就行了
                OBJ_CALC[key].num += OBJ_CALC[key].itemValue_num
                OBJ_CALC[key].total += OBJ_CALC[key].itemValue_total
            };
            // console.log(OBJ_CALC)
            console.timeEnd('计算数据项结果')
        } catch (err) {
            console.timeEnd('计算数据项结果')
            console.error('handle ERR ', err)
        }
    }

    // 计算 患者基本信息
    async handlePatVisit() {
        console.time('计算患者基本信息')
        try {
            // const pool = await new sql.ConnectionPool(config.db_addr).connect();
            await sql.connect(config.db_addr)
            const listPatVisit = await sql.query `SELECT
                    PATIENT_NO,
                    PATIENT_ID,
                    INP_NO,
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
                    AND PATIENT_NO IN(${this.patientNo})`,
                retPatVisit = listPatVisit.recordset

            for (let index = 0; index < retPatVisit.length; index++) {
                const element = retPatVisit[index],
                    _id = element.PATIENT_NO;

                OBJ_CALC[_id] = Object.create(null) // 创建一个纯净的对象
                OBJ_CALC[_id].dtMissingField = [] // 创建一个数组，用来存放诊治缺失字段
                OBJ_CALC[_id].fuMissingField = [] // 创建一个数组，用来存放随访缺失字段

                // 写入 id 和 name
                OBJ_CALC[_id].id = element.PATIENT_NO
                OBJ_CALC[_id].patientId = element.PATIENT_ID
                OBJ_CALC[_id].inpNo = element.INP_NO
                OBJ_CALC[_id].name = element.NAME

                //  _.compact([0, 1, false, 2, '', 3]);     返回 [1,2,3]
                OBJ_CALC[_id].num = OBJ_CALC[_id].patVisit_num = _.compact(Object.values(element)).length
                OBJ_CALC[_id].total = OBJ_CALC[_id].patVisit_total = Object.keys(element).length
                OBJ_CALC[_id].dtMissingField = getkey(element)
            }
            // console.log(OBJ_CALC)
            console.timeEnd('计算患者基本信息')
            return OBJ_CALC

        } catch (err) {
            console.timeEnd('计算患者基本信息')
            console.error('handle ERR ', err)
        }
    }

}

/**
 * 获取 json对象里，值为空的 key
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function getkey(e) {
    const arr = []
    for (let k in e) {
        if (!e[k]) arr.push(k)
    }
    return arr
}