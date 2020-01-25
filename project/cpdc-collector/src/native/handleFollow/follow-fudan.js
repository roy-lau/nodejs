/**
 * 处理 复旦肿瘤 随访数据
 */

const XLSX = require("xlsx"),
    moment = require('moment'),
    _ = require("lodash"),
    fs = require('fs')

const fileName = '复旦肿瘤_随访_update_2019-11-6.xlsx',
    workbook = XLSX.readFile(fileName, { cellDates: true, dateNF: 'YYYY/MM/dd' }),
    // 获取 Excel 中所有表名
    sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']


class UpdateFollow {
    constructor() {}
    getXlsxData() {
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet, { raw: false })

        return json
    }
    handleFollowUp() {
        let xlsxData = this.getXlsxData()
        let sql = ''

        // INSERT INTO PAT_FOLLOW_UP (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O');\n
        xlsxData.forEach(row => {
	        /////////////////
        	// 生成随访时间表 SQL //
	        /////////////////
        	if (row['随访日期']) {
	            // console.log(row.PATIENT_NO,row.FU_TIMES,row['随访日期'],row.FOLLOW_UP_MONTHS,row.DISPLAY_ORDER,row['一般状况'])
                sql += `INSERT INTO PAT_FOLLOW_UP (SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_STATUS,FU_REASON,DISPLAY_ORDER) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${row['随访日期']}','${row.FOLLOW_UP_MONTHS}','1','','${row.DISPLAY_ORDER}');\n`
        	}
        })

        this.handleFollowResult(sql)
    }
    // 生成 随访结果表 sql数据
    handleFollowResult(sql) {
        let xlsxData = this.getXlsxData()
        // let sql = ''

        // INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O')
        xlsxData.forEach(row => {
        	let _obj = {}

            _.forOwn(row, (value, key) => {
                let resultCode = key.split('#')[1],
                	treatCode = key.split('@')[1]
	               /////////////////
               	// 生成随访结果表 SQL //
	               /////////////////
                if (resultCode && value) {
                    // console.log(`INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${resultCode}',NULL,'${value}');\n`)
                    sql += `INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${resultCode}',NULL,'${value}');\n`
                }

                if (treatCode && value) {
                	_obj[treatCode] = value
                }
            })
            /////////////////
            // 生成随访化疗表 SQL //
            /////////////////
            if (_obj.TREAT_NAME) {
	            // console.log(`INSERT INTO PAT_FOLLOW_UP_TREAT
	            // 	(SD_CODE, PATIENT_NO, FU_TIMES, TREAT_NAME, DRUG_NAME, DRUG_DOSE, TREAT_METHOD, TREAT_EFFECT,TREAT_COST,CA199_FRONT,CEA_FRONT,CA125_FRONT,TREAT_EVALUTE_FRONT,CA199_AFTER,CEA_AFTER,CA125_AFTER,TREAT_EVALUTE_AFTER,CREATE_DATE_TIME,TREAT_CYCLE,DRUG_NAME_TRADE)
	            // 	VALUES
	            // 	('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${_obj.TREAT_NAME}','${_obj['DRUG_NAME']}','${_obj['TREAT_METHOD']}','${_obj['TREAT_EFFECT']}',NULL,'${_obj['CA199_FRONT']}','${_obj['CEA_FRONT']}','${_obj['CA125_FRONT']}','${_obj['TREAT_EVALUTE_FRONT']}','${_obj['CA199_AFTER']}','${_obj['CEA_AFTER']}','${_obj['CA125_AFTER']}','${_obj['TREAT_EVALUTE_AFTER']}',NULL,'${_obj['TREAT_CYCLE']}','${_obj['DRUG_NAME_TRADE']}';\n`.replace(/'undefined'/g,'NULL'))
	            sql += `INSERT INTO PAT_FOLLOW_UP_TREAT (SD_CODE, PATIENT_NO, FU_TIMES, TREAT_NAME, DRUG_NAME, DRUG_DOSE, TREAT_METHOD, TREAT_EFFECT,TREAT_COST,CA199_FRONT,CEA_FRONT,CA125_FRONT,TREAT_EVALUTE_FRONT,CA199_AFTER,CEA_AFTER,CA125_AFTER,TREAT_EVALUTE_AFTER,CREATE_DATE_TIME,TREAT_CYCLE,DRUG_NAME_TRADE) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${_obj.TREAT_NAME}','${_obj['DRUG_NAME']}','${_obj['DRUG_DOSE']}','${_obj['TREAT_METHOD']}','${_obj['TREAT_EFFECT']}',NULL,'${_obj['CA199_FRONT']}','${_obj['CEA_FRONT']}','${_obj['CA125_FRONT']}','${_obj['TREAT_EVALUTE_FRONT']}','${_obj['CA199_AFTER']}','${_obj['CEA_AFTER']}','${_obj['CA125_AFTER']}','${_obj['TREAT_EVALUTE_AFTER']}',NULL,'${_obj['TREAT_CYCLE']}','${_obj['DRUG_NAME_TRADE']}');\n`.replace(/'undefined'/g,'NULL')
            }

        })

        this.saveSql(sql)
    }
    /*
    	 将 Sql 语句写入文件
     */
    saveSql(data) {
        // 创建一个可以写入的流，写入到文件 output.txt 中
        let writerStream = fs.createWriteStream('sql.txt');
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
}

function run() {
    const updateFollow = new UpdateFollow()
    updateFollow.handleFollowUp()
}

run()
