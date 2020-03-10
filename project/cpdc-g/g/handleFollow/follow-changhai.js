/*
	生成长海 随访时间sql 和 随访结果sql
 */
const XLSX = require("xlsx"),
    moment = require('moment'),
    _ = require("lodash"),
    fs = require('fs')

const fileName = '长海三年随访_19年10月14日更新_整理.xlsx',
    // const fileName = '长海三年随访更新_test.xlsx',
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
            // console.log(row.PATIENT_NO,row.FU_TIMES,row.DISPLAY_ORDER,row['随访时间'],row.FOLLOW_UP_MONTHS)
            sql += `INSERT INTO PAT_FOLLOW_UP (SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_STATUS,FU_REASON,DISPLAY_ORDER) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${row['随访时间']}','${row.FOLLOW_UP_MONTHS}','1','暂无其他数据','${row.DISPLAY_ORDER}');\n`
        })

        this.saveSql(sql)
    }
    // 生成 随访结果表 sql数据
    handleFollowResult() {
        let xlsxData = this.getXlsxData()
        let sql = ''

        // INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O')
        xlsxData.forEach(row => {
            _.forOwn(row, (value, key) => {
                let code = key.split('#')[1]
                if (code && value) {
                    let ret = value == '是' ? 1 : value == '否' ? 2 : value
                    // console.log(`INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${code}',NULL,'${ret}')`)
                    sql += `INSERT INTO PAT_FOLLOW_UP_RESULT (SD_CODE, PATIENT_NO, FU_TIMES, SD_ITEM_CODE, SD_ITEM_VALUE, SD_ITEM_U_VALUE) VALUES ('YXA_O','${row.PATIENT_NO}','${row.FU_TIMES}','${code}',NULL,'${ret}');\n`
                }
            })
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