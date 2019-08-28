const XLSX = require("xlsx")
const moment = require('moment')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const { isString } = require("../utils/is.js")
// const workbook = XLSX.readFile('output.xlsx');
const workbook = XLSX.readFile('2016-2018随访.xlsx');

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
console.log('sheetNames列表：', sheetNames)


class HandleXlsx {
    constructor() {
        // this.connection = connection;

        // this.getXlsxDiffData()
        // this.getDieDate()
        this.createDieSql()
        // this.createSql()
    }


    getXlsxDiffData() {
        const PAT_VISIT = require('./PAT_VISIT.json')
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet),
            diffData = []

        json.forEach(item => {
            // console.log(item['生存情况'])


            if (item['生存情况'] === '生存') {
                let cur = PAT_VISIT.filter(list => list.INP_NO == item['住院号']), // 当前患者基本信息
                    outDate = moment(cur[0].DISCHARGE_DATE).format('YYYY/MM/DD'), // 出院日期
                    lastFollowDate = moment(new Date(1900, 0, item['末次随访时间'])).format('YYYY/MM/DD'), // 末次随访日期
                    diffDate = moment(lastFollowDate).diff(outDate, 'y'); // 应随访次数

                for (let i = diffDate, k = 1; i >= 0; i--, k++) {
                    let followDate = moment(lastFollowDate).subtract(i, 'y').format('YYYY/MM/DD'),
                        diffMoth = moment(followDate).diff(outDate, 'M');
                    diffData.push({
                        'PATIENT_NO': cur[0].PATIENT_NO,
                        'FU_TIMES': 'roy' + uuidv4().split('-')[4],
                        '住院号': item['住院号'],
                        '出院日期': outDate,
                        '差值': diffDate,
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
                    outDate = moment(cur[0].DISCHARGE_DATE).format('YYYY/MM/DD'), // 出院日期
                    lastFollowDate = moment(new Date(1900, 0, item['死亡日期'])).format('YYYY/MM/DD'), // 死亡日期
                    diffDate = moment(lastFollowDate).diff(outDate, 'y'); // 应随访次数

                for (let i = diffDate, k = 1; i >= 0; i--, k++) {
                    let followDate = moment(lastFollowDate).subtract(i, 'y').format('YYYY/MM/DD'),
                        diffMoth = moment(followDate).diff(outDate, 'M');
                    diffData.push({
                        'PATIENT_NO': cur[0].PATIENT_NO,
                        'FU_TIMES': 'roy' + uuidv4().split('-')[4],
                        '住院号': item['住院号'],
                        '出院日期': outDate,
                        '差值': diffDate,
                        '随访时间': followDate,
                        '随访时长': diffMoth,
                        '死亡日期': lastFollowDate,
                        'order': k,
                        '备注': '死亡'
                    })
                    // console.log(i,diffDate)
                }
            }
        })
        this.saveXlsx(json, diffData)
        // this.saveSql(diffData)
    }
    getDieDate() {
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[1]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet),
            dieObj = []

        // let tmp = {}

        for (let i = 0; i < json.length; i++) {
            if (json[i]['备注'] === '死亡') {
                let arr = []

                for (let k = 0; k < json.length; k++) {
                    if (json[i]['PATIENT_NO'] === json[k]['PATIENT_NO']) {
                        arr.push(json[k])
                    }
                }

                let sortArr = arr.sort((a, b) => a['order'] - b['order'])

                dieObj.push(sortArr[sortArr.length - 1])
            }
        }

        // 数组对象去重
        var obj = {};
        let filterDieObj = dieObj.reduce(function(item, next) {
            obj[next.PATIENT_NO] ? '' : obj[next.PATIENT_NO] = true && item.push(next);
            return item;
        }, []);



        console.log('length', filterDieObj.length)

        this.saveXlsxDieDate(filterDieObj)
        // 创建一个可以写入的流，写入到文件 output.txt 中
        let writerStream = fs.createWriteStream('die.json');
        // console.log(SQL)
        // 使用 utf8 编码写入数据
        writerStream.write(JSON.stringify(filterDieObj), 'UTF8');

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

    createDieSql() {
        // SD_CODE PATIENT_NO  FU_TIMES    SD_ITEM_CODE    SD_ITEM_VALUE   SD_ITEM_U_VALUE
        // YXA_O   80f45ad98eedadea    5881e77aa357d306    YXA_O_256       1
        // YXA_O   80f45ad98eedadea    5881e77aa357d306    YXA_O_257       2018-09-21

        const dieList = require('./die.json')
            let SQL = ''

        dieList.forEach(item => {
            SQL += `INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_VALUE,SD_ITEM_U_VALUE)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','YXA_O_256','',1);
INSERT INTO PAT_FOLLOW_UP_RESULT(SD_CODE,PATIENT_NO,FU_TIMES,SD_ITEM_CODE,SD_ITEM_VALUE,SD_ITEM_U_VALUE)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','YXA_O_257','','${ moment(item['死亡日期']).format('YYYY-MM-DD')}');\n`

        })

           // 创建一个可以写入的流，写入到文件 output.txt 中
        let writerStream = fs.createWriteStream('sql-1.txt');
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
    //     {
    //   "SD_CODE": "YXA_O",
    //   "PATIENT_NO": "f1bee9130e70bcea",
    //   "FU_TIMES": "23eb13a3055c9a24",
    //   "FOLLOW_UP_DATE": "2018-07-31T16:00:00Z",
    //   "FOLLOW_UP_MONTHS": 20,
    //   "FU_STATUS": "1",
    //   "FU_REASON": "",
    //   "DISPLAY_ORDER": 2
    // },

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
            /*
                更新随访数据
             */
            // SQL += `UPDATE PAT_FOLLOW_UP SET SD_CODE='YXA_O' PATIENT_NO='${item.PATIENT_NO}' FU_TIMES='${item.FU_TIMES}' FOLLOW_UP_DATE='${item['随访时间']}' FOLLOW_UP_MONTHS=${item['随访时长']} FU_STATUS='1' FU_REASON='${item['备注']}' DISPLAY_ORDER='${item.order}' WHERE PATIENT_NO='${item.PATIENT_NO}';\n`

            /*
                插入随访数据
             */
            SQL += `INSERT INTO PAT_FOLLOW_UP(SD_CODE,PATIENT_NO,FU_TIMES,FOLLOW_UP_DATE,FOLLOW_UP_MONTHS,FU_STATUS,DISPLAY_ORDER)VALUES('YXA_O','${item.PATIENT_NO}','${item.FU_TIMES}','${item['随访时间']}','${item['随访时长']}','1','${item.order}');\n`


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
        XLSX.writeFile(wb, '2016-2018随访.xlsx');
    }

    saveXlsxDieDate(dieObj) {
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['dieObj'],
            Sheets: {
                'dieObj': XLSX.utils.json_to_sheet(dieObj)
            },
            // Styles:workbook['Styles']
        };

        // 导出 Excel
        XLSX.writeFile(wb, 'die.xlsx');
    }


}

new HandleXlsx()

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