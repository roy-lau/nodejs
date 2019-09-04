'use strict';
const sql = require('mssql')
const fs = require("fs");

const CONNECT_SQL = 'mssql://sa:sa@123@192.168.1.253/RYCPDC_C20190827'

/**
 * 根据数据库做字典对比，稍慢
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
async function compareDataSql(data) {
    try {

        const splitCode = data.itemCode.split("#")[1]
        let checkedValue = ""
        // 剔除 空 值
        if (!data.itemValue) {
            return data.itemValue
        }
        const pool1 = await new sql.ConnectionPool(CONNECT_SQL).connect()
        const ret = await pool1.query `SELECT * FROM [dbo].[SD_ITEM_DICT] WHERE ITEM_CODE=${splitCode} AND SD_CODE='YXA_O'`
        // const ret = await sql.query `SELECT ITEM_CODE,ITEM_NAME,ITEM_CV_CODE,ITEM_UNIT FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE='YXA_O'`

        let _item = ret.recordset[0]
        if (_item.ITEM_CV_CODE) {

            const _cvItem = await pool1.query `SELECT * FROM [dbo].[SD_ITEM_CV_DICT] where CV_CODE=${_item.ITEM_CV_CODE} AND SD_CODE='YXA_O'`
            let _cvValue = _cvItem.recordset

            for (let i = 0; i < _cvValue.length; i++) {
                if (data.itemValue == _cvValue[i].CV_VALUE_TEXT) { // 根据 文本 找到对应的 code
                    checkedValue = _cvValue[i].CV_VALUE
                } else if (data.itemValue == _cvValue[i].CV_VALUE) { // 文本就是code，直接返回code
                    checkedValue = data.itemValue
                } else { // 未找到
                    checkedValue = data.itemValue
                }
            }

            await pool1.close();

        }

        return checkedValue
        await pool1.close();
    } catch (err) {
        console.error(err)
    }
}

/**
 * 根据文件做字典对比，文件从数据库下载
 *
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function compareDataFile(data) {

    const splitCode = data.itemCode.split("#")[1]

    const SD_ITEM_DICT = require("../data/sd_item_dict.json")


    let checkedValue = ''
    for (let i = 0; i < SD_ITEM_DICT.length; i++) {
        if (SD_ITEM_DICT[i].ITEM_CODE === splitCode) { // 先判断 code 是否相同

            // console.log(SD_ITEM_DICT[i], data.itemValue)

            if (SD_ITEM_DICT[i].ITEM_CV_CODE) { // 如果有字典
                const SD_ITEM_CV_DICT = require("../data/sd_item_cv_dict.json")

                // 通过字典code过滤出一个数组
                const filterCvDist = SD_ITEM_CV_DICT.filter(item => item.CV_CODE === SD_ITEM_DICT[i].ITEM_CV_CODE)

                for (let k = 0; k < filterCvDist.length; k++) {
                    if (filterCvDist[k].CV_VALUE_TEXT === data.itemValue || filterCvDist[k].CV_VALUE === data.itemValue) {
                        return filterCvDist[k].CV_VALUE
                    } else if(!/无|不做|未测/.test(data.itemValue)){
                        checkedValue = data.itemValue
                    }
                }
                return checkedValue
            } else if(!/无|不做|未测/.test(data.itemValue)){ // 如果没有字典且……
                return data.itemValue
            }
        }else{ //code 不同可能是 引流管 随访……
            return data.itemValue
        }
    }

}

module.exports = {

    // 插入 PATIENT_NO
   async insertPATIENT_NO(json) {
            // return sql.connect(CONNECT_SQL)
            //     .then(() => {
            //         console.log(json)
            //         for (let i = 0; i < json.length; i++) {
            //             let result = sql.query`SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_ID=${json[i]['病案号']} AND SD_CODE='YXA_O'`

            //             json[i].PATIENT_NO = result.recordset[0].PATIENT_NO
            //         }

            //         return json

            //     }).catch(err => {
            //        console.error('ERR insert ',err)
            //     })



        try {
            await sql.connect(CONNECT_SQL)

            for (let i = 0; i < json.length; i++) {
                // console.log(PAT_VISIT[i]['病案号'])
                const list = await sql.query `SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_ID=${json[i]['病案号']} AND SD_CODE='YXA_O'`
                json[i].PATIENT_NO = list.recordset[0].PATIENT_NO
                // console.log(list.recordset[0].PATIENT_NO, list.recordset[0].PATIENT_ID, patint_id[id])
            }

            return json
        } catch (err) {
            console.error(err)
        }
    },

    PAT_SD_ITEM_RESULT(list) {

        let filterKeysMaps = []
        for (let i = 0; i < list.length; i++) {
            let _data = {}

            for (let key in list[i]) {

                if (key.indexOf("#") > -1) {
                    _data[key] = compareDataFile({ itemCode: key, itemValue: list[i][key] }) // 有 井号
                } else {
                    _data[key] = list[i][key] // 没有 井号
                }
            }
            // console.log("表格字典比对进度：", i + 1, '/', list.length)
            filterKeysMaps.push(_data)
        }

        return filterKeysMaps

    }
}