/*
	给瑞金死亡患者生成随访时间
 */
const XLSX = require("xlsx")
const moment = require('moment')
const fs = require('fs')
const uuidv4 = require('uuid/v4');

// const fileName = '瑞金2016随访死亡.xlsx'
// const fileName = '瑞金2017-2018.6随访死亡.xlsx'
const fileName = '瑞金2018.1+2019.1-4随访死亡.xlsx'
const workbook = XLSX.readFile(fileName, { cellDates: true, dateNF: 'YYYY/MM/dd' });

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
console.log('sheetNames列表：', sheetNames)

getXlsxDiffData()

function getXlsxDiffData() {
    // 根据表名获取对应某张表
    const worksheet = workbook.Sheets[sheetNames[0]];
    // 处理为 json 格式
    let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }),
        diffData = []

    json.forEach(item => {
        if (item['死亡日期']) {
            let outDate = moment(item['出院时间']).format('YYYY/MM/DD'), // 出院日期
                lastFollowDate = moment(item['死亡日期']).format('YYYY/MM/DD'), // 死亡日期
                diffDate = moment(lastFollowDate).diff(outDate, 'y'); // 应随访次数

            for (let i = diffDate, k = 1; i >= 0; i--, k++) {
                let followDate = moment(outDate).add(k, 'y').format('YYYY/MM/DD'),
                    diffMoth = moment(followDate).diff(outDate, 'M');

                if (k >= diffDate + 1) {
                    diffData.push({
                        'PATIENT_NO': item.PATIENT_NO,
                        'FU_TIMES': item.FU_TIMES,
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
                        'PATIENT_NO': item.PATIENT_NO,
                        'FU_TIMES': 'roy' + uuidv4().split('-')[4],
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
    saveXlsx(json, diffData)
}

function saveXlsx(json, diffData) {
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
    XLSX.writeFile(wb, '瑞金2018.1+2019.1-4随访死亡-处理后.xlsx');
}