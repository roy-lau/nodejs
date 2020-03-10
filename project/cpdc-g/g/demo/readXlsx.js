const XLSX = require("xlsx")
const { isString } = require("./is.js")
const moment = require('moment')
// const workbook = XLSX.readFile('output.xlsx');
const workbook = XLSX.readFile('inport.xlsx');

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
console.log('sheetNames列表：', sheetNames)


class HandleXlsx {
    constructor() {
        // this.connection = connection;

    }

    /**
     * 获取 PAT_VISIT sheet 数据
     * @return {[type]} [description]
     */
    get_PAT_VISIT() {
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet),
            data = []

        // console.log(json)
        json.forEach(item => {

            data.push({
                PATIENT_NO: item.PATIENT_NO.trim(),
                PATIENT_ID: item.PATIENT_ID,
                INP_NO: item.INP_NO,
                NAME: item.NAME,
                SEX: item.SEX,
                AGE: item.AGE,
                ADMISSION_DATE: transformDate(item.ADMISSION_DATE),
                DISCHARGE_DATE: transformDate(item.DISCHARGE_DATE),
                OUT_STATUS: item.OUT_STATUS,
                SD_CODE: item.SD_CODE,
                VERSION_NUM: item.VERSION_NUM,
            })
        })
        return data
    }

    /**
     * 获取 PAT_SD_ITEM_RESULT sheet信息
     * @return {[type]} [description]
     */
    get_PAT_SD_ITEM_RESULT() {
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[1]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet),
            data = []

        // console.log(json)
        json.forEach(item => {
            data.push({
                PATIENT_NO: item.PATIENT_NO.trim(),
                SD_CODE: item.SD_CODE,
                SD_ITEM_CODE: item.SD_ITEM_CODE,
                SD_ITEM_VALUE: item.SD_ITEM_VALUE,
            })
        })
        return data
    }
}

// let handleXlsx = new HandleXlsx()
// handleXlsx.get_PAT_SD_ITEM_RESULT()

/**
 * 转换时间
 */
function transformDate(date) {
    if (isString(date)) {
        return moment(date).format('YYYY/MM/DD')
    } {
        return moment(new Date(1900, 0, date)).format('YYYY/MM/DD')
    }
}

module.exports = HandleXlsx