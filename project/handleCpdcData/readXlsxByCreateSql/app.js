const XLSX = require("xlsx")
const fs = require('fs')
const { isString } = require("../utils/is.js")


const workbook = XLSX.readFile('胰腺癌单病种数据元2016（含随访）——完成.xlsx');

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

let SQL = ''

/**
 * 基本信息表
 * @return {[type]} [description]
 */
function generate_PAT_VISIT() {

    const worksheet = workbook.Sheets[sheetNames[0]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)
    SQL += `INSERT INTO PAT_VISIT(PATIENT_NO,PATIENT_ID,INP_NO,NAME,SEX,AGE,ADMISSION_DATE,DISCHARGE_DATE,OUT_STATUS,SD_CODE,VERSION_NUM) VALUES `

    sheetJson.forEach(item => {
        SQL += `('${item.PATIENT_NO}','${item.PATIENT_ID}','${item.INP_NO}','${item.NAME}','${item.SEX}','${item.AGE}','${item.ADMISSION_DATE}','${item.DISCHARGE_DATE}','${item.OUT_STATUS}','YXA_O','1.0'),`
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')

}

/**
 * 数据项结果表
 * @return {[type]} [description]
 */
function generate_PAT_SD_ITEM_RESULT() {

    const worksheet = workbook.Sheets[sheetNames[1]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)

    SQL += `INSERT INTO PAT_VISIT(PATIENT_NO,SD_CODE,SD_ITEM_CODE,SD_ITEM_VALUE) VALUES `

    sheetJson.forEach(item => {
        if (item.SD_ITEM_VALUE) {
            SQL += `('${item.PATIENT_NO}','${item.SD_CODE}','${item.SD_ITEM_CODE}','${item.SD_ITEM_VALUE}'),`
        }
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')

}

// 医院信息表(暂不处理) HOSPITAL_INFO 2



/**
 * 引流管表
 * @return {[type]} [description]
 */
function generate_PAT_DRAINAGE_TUBE() {

    const worksheet = workbook.Sheets[sheetNames[3]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)

    SQL += `INSERT INTO PAT_VISIT(SD_CODE,PATIENT_NO,TUBE_NAME,RETENTION_DAYS,POD1,POD3,POD7,AMY_POD1,AMY_POD3,AMY_POD7,AMY_POD_DRAW,CREATE_DATE_TIME) VALUES `

    sheetJson.forEach(item => {
        if (item.TUBE_NAME) {
            SQL += `('${item.SD_CODE}','${item.PATIENT_NO}','${item.TUBE_NAME}',${item.RETENTION_DAYS},'${item.POD1}','${item.POD3}','${item.POD7}','${item.AMY_POD1}','${item.AMY_POD3}','${item.AMY_POD7}','${item.AMY_POD_DRAW}','${item.CREATE_DATE_TIME}'),`
        }
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')
}

/**
 * 随访时间表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP() {

    const worksheet = workbook.Sheets[sheetNames[4]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)

    SQL += `INSERT INTO PAT_VISIT(SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_REASON) VALUES `

    sheetJson.forEach(item => {
        if (item.FOLLOW_UP_DATE) {
            SQL += `('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}',${item.FOLLOW_UP_DATE},'${item.FOLLOW_UP_MONTHS}','${item.FU_REASON}'),`
        }
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')
}

/**
 * 随访数据表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP_RESULT() {

    const worksheet = workbook.Sheets[sheetNames[5]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)

    SQL += `INSERT INTO PAT_VISIT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_U_VALUE) VALUES `

    sheetJson.forEach(item => {
        if (item.SD_ITEM_VALUE) {
            SQL += `('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}',${item.SD_ITEM_CODE},'${item.SD_ITEM_U_VALUE}'),`
        }
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')
}

/**
 * 随访结果表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP_TREAT() {

    const worksheet = workbook.Sheets[sheetNames[6]];
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet)

    SQL += `INSERT INTO PAT_VISIT(SD_CODE,PATIENT_NO,FU_TIMES,TREAT_NAME,DRUG_DOSE,TREAT_EFFECT,TREAT_COST,CA199_FRONT,CEA_FRONT,CA125_FRONT,TREAT_EVALUTE_FRONT,CA199_AFTER,CEA_AFTER,CA125_AFTER,TREAT_EVALUTE_AFTER,CREATE_DATE_TIME,TREAT_CYCLE,DRUG_NAME_TRADE) VALUES `

    sheetJson.forEach(item => {
        // if (item.TREAT_NAME) {
        SQL += `('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}',${item.TREAT_NAME},'${item.DRUG_NAME}','${item.DRUG_DOSE}','${item.TREAT_METHOD}','${item.TREAT_EFFECT}','${item.TREAT_COST}','${item.CA199_FRONT}','${item.CEA_FRONT}','${item.CA125_FRONT}','${item.TREAT_EVALUTE_FRONT}','${item.CA199_AFTER}','${item.CEA_AFTER}','${item.TREAT_EVALUTE_AFTER}','${item.CREATE_DATE_TIME}','${item.TREAT_CYCLE}','${item.DRUG_NAME_TRADE}'),\n`
        // }
    })
    SQL+=';\n'
    SQL.replace(/,$/, ';\n')
    console.log(SQL)
}



/**
 * 保存文件
 * @param  {[type]} data     [description]
 * @param  {String} fileName [description]
 * @return {[type]}          [description]
 */
function saveFile(data, fileName = 'db.sql') {
    // 创建一个可以写入的流，写入到文件中
    let writerStream = fs.createWriteStream(fileName);

    // 使用 utf8 编码写入数据
    writerStream.write(data, 'UTF8');

    // 标记文件末尾
    writerStream.end();

    // 处理流事件 --> data, end, and error
    writerStream.on('finish', function() {
        console.log("写入完成。");
    });

    writerStream.on('error', function(err) {
        console.log(err.stack);
    });
}

generate_PAT_VISIT()
generate_PAT_SD_ITEM_RESULT()
generate_PAT_DRAINAGE_TUBE()
generate_PAT_FOLLOW_UP()
generate_PAT_FOLLOW_UP_RESULT()
generate_PAT_FOLLOW_UP_TREAT()

saveFile(SQL)
