/**
 * 查询查询 SQL
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


module.exports = class QueryCalcSql {
    constructor(patientNo) {
        // 要处理的患者id
        this.patientNo = patientNo
        this.calcResult = []

    }

    // 查询 随访治疗信息
    async queryPatFollowUpTreat() {
        console.info('查询 随访治疗信息')
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
                    return retPatFollowUpTreat
            }
        } catch (err) {
            console.error('query ERR ', err)
        }
    }

    // 查询 随访结果表 2
    async queryPatFollowUpResult(OBJ_CALC) {
        console.info('查询 随访结果表')
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
                return retPatFollowUpResult
            };
        } catch (err) {
            console.error('query ERR ', err)
        }
    }
    /**
     * [_needFollowCount 查询此患者需随访次数]
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

            console.log(isDead, dateOfSurgery, key)
            if (isDead == '1') { // 院内死亡
                OBJ_CALC[key].needFollowCount = 0
                return
            } else {

            }
        } catch (err) {
            console.error('query ERR ', err)
        }
    }
    // 查询 随访时间 3
    async queryPatFollowUp(OBJ_CALC) {
        console.info('查询 随访时间')
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
            }
        } catch (err) {
            console.error('query ERR ', err)
        }
    }

    // 查询 引流管 3
    async queryDrainageTube(OBJ_CALC) {
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
                return retDrainageTube
            }
        } catch (err) {
            console.error('query ERR ', err)
        }
    }

    // 查询 数据项结果
    async queryPatItemResult(OBJ_CALC) {
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

                return retPatItemResult
            };
        } catch (err) {
            console.error('query ERR ', err)
        }
    }

    // 查询 患者基本信息
    async queryPatVisit() {
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

            return retPatVisit

        } catch (err) {
            console.error('query ERR ', err)
        }
    }

}