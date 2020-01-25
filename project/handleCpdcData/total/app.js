const XLSX = require("xlsx")
const fs = require('fs')
const path = require('path')

/**
 * 保存表格
 * @param  {Object}
   {
        '医院':
        '缺失病例总':
        '补充病例':
        '待补充':
        '备注':
    }
 * @param {Object } json
 */
function saveXlsx(json, filename) {
    // 构建 workbook 对象
    let wb = {
        SheetNames: ['统计'],
        Sheets: {
            '统计': XLSX.utils.json_to_sheet(json)
        }
        // Styles:workbook['Styles']
    }

    // 导出 Excel
    // XLSX.writeFile(wb, './input/9月3-总/总-' + filename);
    XLSX.writeFile(wb, './input/7月1-总/总-' + filename);
    console.log('OK ', Date.now())
}

function readXlsx(filename) {
    // 读取表格文件
    const workbook = XLSX.readFile(filename, { cellDates: true, dateNF: 'YYYY-MM-dd' });
    // 获取 Excel 中所有表名
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    // 获取第一个 sheet
    const worksheet = workbook.Sheets[sheetNames[0]];
    // 处理为 json 格式
    return XLSX.utils.sheet_to_json(worksheet, { raw: false })
}



// 处理表格数据

function paterenTableData(dir, filename, index, count) {
    let tableJson1 = readXlsx('input/9月3-诊治/'+filename)
    let tableJson2 = readXlsx('input/9月3-随访/'+filename)


    let tableMap = tableJson1.map(item => {
        if ( parseFloat(item['完整率']) < 100) {
            return { '医院': item['医院'], '住院ID': item['住院ID'], '病案号': item['住院流水号'], '姓名': item['姓名'], '完整率': item['完整率'] }
        }
    }).filter(item=>item) // 过滤掉空数据 (完整度大于 100的 )
    tableJson2.forEach(item => {
        tableMap.push({ '医院': '', '住院ID': item['住院ID号'], '病案号': item['病案号'], '姓名': item['姓名'], '完整率': item['第几次随访'] })
    })

    let sumId = [],
        sumNo = []
    tableMap.forEach(item => {
            sumId.push(item['住院ID'])
            sumNo.push(item['病案号'])
    })
    tableMap[0]['住院ID统计'] = new Set(sumId).size
    tableMap[0]['病案号统计'] = new Set(sumNo).size

    saveXlsx(tableMap, filename)
}
// paterenTableData()
// 遍历目录
function eachDirectory(file) {
    let fileDirectory = path.join(__dirname, file, );
    if (fs.existsSync(fileDirectory)) {
        fs.readdir(fileDirectory, function(err, files) {
            if (err) {
                console.log(err);
                return;
            }
            let count = files.length,
                num = 0;
            files.forEach(function(filename) {
                paterenTableData(fileDirectory, filename, num++, count)
            });
        });
    } else {
        console.log(fileDirectory + "  文件夹不存在！");
    }

}

// eachDirectory('input/9月3-诊治')
eachDirectory('input/7月1-诊治')