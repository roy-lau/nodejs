
/*
    将处理后的表格，转换为 SQL
 */
const XLSX = require("xlsx")
const fs = require('fs-extra')

const FILE_NAME = "./out/OK_1587721609741"
const workbook = XLSX.readFile(FILE_NAME+'.xlsx',{ cellDates: true,dateNF:'YYYY-MM-dd'});

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

let SQL = ''

/**
 * 基本信息表
 * @return {[type]} [description]
 */
function generate_PAT_VISIT() {

    const worksheet = workbook.Sheets[sheetNames[0]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })

    sheetJson.forEach(item => {

        SQL += `INSERT INTO PAT_SD_QUEUE(SD_CODE,PATIENT_NO,VERSION_NUM,CREATE_USER_ID,CREATE_DATE) VALUES ('${item.SD_CODE}','${item.PATIENT_NO}','1.0','02',NOW);\n`
        SQL += `INSERT INTO PAT_VISIT(PATIENT_NO,PATIENT_ID,INP_NO,NAME,SEX,AGE,ADMISSION_DATE,DISCHARGE_DATE,OUT_STATUS,IS_ICF) VALUES ('${item.PATIENT_NO}','${item.PATIENT_ID}','${item.INP_NO}','${item.NAME}','${item.SEX}','${item.AGE}','${item.ADMISSION_DATE}','${item.DISCHARGE_DATE}','${item.OUT_STATUS}','1');\n`

    })

}

/**
 * 数据项结果表
 * @return {[type]} [description]
 */
function generate_PAT_SD_ITEM_RESULT() {

    const worksheet = workbook.Sheets[sheetNames[1]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })

    sheetJson.forEach(item => {
        if (item.SD_ITEM_VALUE) {
            SQL += `INSERT INTO PAT_SD_ITEM_RESULT(PATIENT_NO,SD_CODE,SD_ITEM_CODE,SD_ITEM_U_VALUE) VALUES ('${item.PATIENT_NO}','${item.SD_CODE}','${item.SD_ITEM_CODE}','${item.SD_ITEM_VALUE}');\n`
        }
    })
    // SQL = SQL.replace(/,$/,";\n") // 将最后一个逗号换成分号加换行

}

// 医院信息表(暂不处理) HOSPITAL_INFO 2



/**
 * 引流管表
 * @throws 有些空值需要手动处理
 * @return {[type]} [description]
 */
function generate_PAT_DRAINAGE_TUBE() {

    const worksheet = workbook.Sheets[sheetNames[3]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })

    sheetJson.forEach(item => {
        if (item.TUBE_NAME) {
            SQL += `INSERT INTO PAT_DRAINAGE_TUBE(SD_CODE,PATIENT_NO,TUBE_NAME,RETENTION_DAYS,POD1,POD3,POD7,AMY_POD1,AMY_POD3,AMY_POD7,AMY_POD_DRAW,CREATE_DATE_TIME) VALUES ('${item.SD_CODE}','${item.PATIENT_NO}','${item.TUBE_NAME}',${item.RETENTION_DAYS},'${item.POD1}','${item.POD3}','${item.POD7}','${item.AMY_POD1}','${item.AMY_POD3}','${item.AMY_POD7}','${item.AMY_POD_DRAW}','${item.CREATE_DATE_TIME}');\n`
        }
    })
}

/**
 * 随访时间表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP() {

    const worksheet = workbook.Sheets[sheetNames[4]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })


    sheetJson.forEach(item => {
        if (item.FOLLOW_UP_DATE) {
            SQL += `INSERT INTO PAT_FOLLOW_UP(SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_REASON) VALUES  ('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}',${item.FOLLOW_UP_DATE},'${item.FOLLOW_UP_MONTHS}','${item.FU_REASON}');\n`
        }
    })
}

/**
 * 随访数据表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP_RESULT() {

    const worksheet = workbook.Sheets[sheetNames[5]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })

    sheetJson.forEach(item => {
        if (item.SD_ITEM_VALUE) {
            SQL += `INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_U_VALUE) VALUES ('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}','${item.SD_ITEM_CODE}','${item.SD_ITEM_U_VALUE}');\n`
        }
    })
}

/**
 * 随访结果表
 * @return {[type]} [description]
 */
function generate_PAT_FOLLOW_UP_TREAT() {

    const worksheet = workbook.Sheets[sheetNames[6]];
    if (!worksheet) return
    // 处理为 json 格式
    let sheetJson = XLSX.utils.sheet_to_json(worksheet,{ raw: false })

    sheetJson.forEach(item => {
        // if (item.TREAT_NAME) {
        SQL += `INSERT INTO PAT_FOLLOW_UP_TREAT(SD_CODE,PATIENT_NO,FU_TIMES,TREAT_NAME,DRUG_DOSE,TREAT_EFFECT,TREAT_COST,CA199_FRONT,CEA_FRONT,CA125_FRONT,TREAT_EVALUTE_FRONT,CA199_AFTER,CEA_AFTER,CA125_AFTER,TREAT_EVALUTE_AFTER,CREATE_DATE_TIME,TREAT_CYCLE,DRUG_NAME_TRADE) VALUES ('${item.SD_CODE}','${item.PATIENT_NO}','${item.FU_TIMES}','${item.TREAT_NAME}','${item.DRUG_NAME}','${item.DRUG_DOSE}','${item.TREAT_METHOD}','${item.TREAT_EFFECT}','${item.TREAT_COST}','${item.CA199_FRONT}','${item.CEA_FRONT}','${item.CA125_FRONT}','${item.TREAT_EVALUTE_FRONT}','${item.CA199_AFTER}','${item.CEA_AFTER}','${item.TREAT_EVALUTE_AFTER}','${item.CREATE_DATE_TIME}','${item.TREAT_CYCLE}','${item.DRUG_NAME_TRADE}');\n`
        // }
    })
}

generate_PAT_VISIT()
generate_PAT_SD_ITEM_RESULT()
generate_PAT_DRAINAGE_TUBE()
// generate_PAT_FOLLOW_UP()
// generate_PAT_FOLLOW_UP_RESULT()
// generate_PAT_FOLLOW_UP_TREAT()

// 写入生成的 SQL
fs.writeFileSync(FILE_NAME+'.sql',SQL.replace(/'undefined'|undefined/g,`NULL`))

// fs.writeFileSync('C:\\SmartMedical\\CPDC\\sql\\sql.txt',SQL.replace(/'undefined'|undefined/g,`NULL`))

