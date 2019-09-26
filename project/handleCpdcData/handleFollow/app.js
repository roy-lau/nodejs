const XLSX = require("xlsx"),
    moment = require('moment'),
    fs = require('fs'),
    uuidv4 = require('uuid/v4'),
    { isString } = require("../utils/is.js")

const fileName = '海军长海_2016-2018随访.xlsx',
    workbook = XLSX.readFile(fileName, { cellDates: true, dateNF: 'YYYY/MM/dd' });

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
console.log('sheetNames列表：', sheetNames)


class HandleXlsx {
    constructor() {
        // this.connection = connection;

        this.getXlsxDiffData()
        this.createSql()
    }


    getXlsxDiffData() {
        const PAT_VISIT = require('./PAT_VISIT.json')
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }),
            diffData = []

        json.forEach(item => {
            // console.log(item['生存情况'])


            if (item['生存情况'] === '生存') {
                let cur = PAT_VISIT.filter(list => list.INP_NO == item['住院号']), // 当前患者基本信息
                    outDate = moment(cur[0].DISCHARGE_DATE).format('YYYY-MM-DD'), // 出院日期
                    lastFollowDate = moment(item['末次随访时间']).format('YYYY-MM-DD'), // 末次随访日期
                    diffDate = moment(lastFollowDate).diff(outDate, 'y'); // 应随访次数

                for (let i = diffDate, k = 1; i >= 0; i--, k++) {
                    let followDate = moment(lastFollowDate).subtract(i, 'y').format('YYYY-MM-DD'),
                        diffMoth = moment(followDate).diff(outDate, 'M');
                    diffData.push({
                        'PATIENT_NO': cur[0].PATIENT_NO,
                        'FU_TIMES': 'roy' + uuidv4().split('-')[4],
                        '住院号': item['住院号'],
                        '出院日期': outDate,
                        '应随访次数': diffDate + 1,
                        '随访时间': followDate,
                        '随访时长': diffMoth,
                        '末次随访时间': lastFollowDate,
                        'order': k,
                        '备注': '生存'
                    })
                    // console.log(i,diffDate)
                }
                // console.log(outDate,diffDate,lastFollowDate)
            } else if (item['生存情况'] === '死亡') {
                let cur = PAT_VISIT.filter(list => list.INP_NO == item['住院号']), // 当前患者基本信息
                    outDate = moment(cur[0].DISCHARGE_DATE).format('YYYY-MM-DD'), // 出院日期
                    lastFollowDate = moment(item['死亡日期']).format('YYYY-MM-DD'), // 死亡日期
                    diffDate = moment(lastFollowDate).diff(outDate, 'y'); // 应随访次数

                for (let i = diffDate, k = 1; i >= 0; i--, k++) {
                    let followDate = moment(lastFollowDate).subtract(i, 'y').format('YYYY-MM-DD'),
                        diffMoth = moment(followDate).diff(outDate, 'M');

                    if (k >= diffDate + 1) {
                        diffData.push({
                            'PATIENT_NO': cur[0].PATIENT_NO,
                            'FU_TIMES': 'roy' + uuidv4().split('-')[4],
                            '住院号': item['住院号'],
                            '出院日期': outDate,
                            '应随访次数': diffDate + 1,
                            '随访时间': followDate,
                            '随访时长': diffMoth,
                            '死亡日期': lastFollowDate,
                            'order': k,
                            '备注': '死亡'
                        })
                    } else { // 死亡前随访
                        diffData.push({
                            'PATIENT_NO': cur[0].PATIENT_NO,
                            'FU_TIMES': 'roy' + uuidv4().split('-')[4],
                            '住院号': item['住院号'],
                            '出院日期': outDate,
                            '应随访次数': diffDate + 1,
                            '随访时间': followDate,
                            '随访时长': diffMoth,
                            '末次随访时间': lastFollowDate,
                            'order': k,
                            '备注': '生存'
                        })
                    }
                }
            }
        })
        this.saveXlsx(json, diffData)
        // this.saveSql(diffData)
    }

    createSql() {
        const worksheet = workbook.Sheets[sheetNames[1]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet)
        /*
            UPDATE PAT_FOLLOW_UP
            SET SD_CODE='' PATIENT_NO='' FU_TIMES='' FOLLOW_UP_DATE='' FOLLOW_UP_MONTHS='' FU_STATUS='' FU_REASON='' DISPLAY_ORDER=''
            WHERE name='菜鸟教程';
        */
        let SQL = ''
        json.forEach(item => {
            if (item['备注'] === '死亡') {
                /*
                    更新随访时间数据
                */
                // SQL += `UPDATE PAT_FOLLOW_UP SET SD_CODE='YXA_O' PATIENT_NO='${item.PATIENT_NO}' FU_TIMES='${item.FU_TIMES}' FOLLOW_UP_DATE='${item['随访时间']}' FOLLOW_UP_MONTHS=${item['随访时长']} FU_STATUS='1' FU_REASON='${item['备注']}' DISPLAY_ORDER='${item.order}' WHERE PATIENT_NO='${item.PATIENT_NO}';\n`

                /////////////////////////////////////////////////////////////////////////////////////
                // SD_CODE PATIENT_NO  FU_TIMES    SD_ITEM_CODE    SD_ITEM_VALUE   SD_ITEM_U_VALUE  //
                // YXA_O   80f45ad98eedadea    5881e77aa357d306    YXA_O_256       1                //
                // YXA_O   80f45ad98eedadea    5881e77aa357d306    YXA_O_257       2018-09-21       //
                /////////////////////////////////////////////////////////////////////////////////////
                /*
                    插入 随访时间 是否死亡（是），死亡日期
                 */
                SQL += `INSERT INTO PAT_FOLLOW_UP(SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_STATUS,DISPLAY_ORDER)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','${item['随访时间']}','${item['随访时长']}','1','${item.order}');
INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_VALUE,SD_ITEM_U_VALUE)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','YXA_O_256','',1);
INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_VALUE,SD_ITEM_U_VALUE)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','YXA_O_257','','${ moment(item['死亡日期']).format('YYYY-MM-DD')}');\n`
            } else {
                /*
                    插入 随访时间 是否死亡（否）
                 */
                SQL += `INSERT INTO PAT_FOLLOW_UP(SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_STATUS,DISPLAY_ORDER)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','${item['随访时间']}','${item['随访时长']}','1','${item.order}');
INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_VALUE,SD_ITEM_U_VALUE)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','YXA_O_256','',2);\n`

            }



        })
        /*
         将 Sql 语句写入文件
         */
        // 创建一个可以写入的流，写入到文件 output.txt 中
        let writerStream = fs.createWriteStream('sql.txt');
        // console.log(SQL)
        // 使用 utf8 编码写入数据
        writerStream.write(SQL, 'UTF8');

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
    saveXlsx(json, diffData) {
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['PAT_VISIT', 'diff'],
            Sheets: {
                'PAT_VISIT': XLSX.utils.json_to_sheet(json),
                'diff': XLSX.utils.json_to_sheet(diffData)
            },
            // Styles:workbook['Styles']
        };

        // 导出 Excel
        XLSX.writeFile(wb, fileName);
    }


}

new HandleXlsx()

/**
 * 转换时间
 */
function transformDate(date) {
    if (isString(date)) {
        return moment(date).format('YYYY-MM-DD')
    } {
        return moment(new Date(1900, 0, date)).format('YYYY-MM-DD')
    }
}