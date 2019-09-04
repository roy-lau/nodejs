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
function saveXlsx(json) {
    // 构建 workbook 对象
    let wb = {
        SheetNames: ['统计'],
        Sheets: {
            '统计': XLSX.utils.json_to_sheet(json)
        }
        // Styles:workbook['Styles']
    }

    // 导出 Excel
    XLSX.writeFile(wb, './out/OK-' + Date.now() + '.xlsx');
    console.log('OK ', Date.now())
}
function saveXlsx1(filename) {
    // 构建 workbook 对象
    let wb = {
        SheetNames: ['sheet1'],
        Sheets: {
            'sheet1':[]
        }
        // Styles:workbook['Styles']
    }

    // 导出 Excel
    XLSX.writeFile(wb, './out/总-'+filename);
    console.log('OK ', Date.now())
}

/**
 * 读取表格，返回json
 * @param  {String} fileName 文件名
 * @return {Object}          表格里的数据，json
 */
function readXlsx(fileName) {
    const workbook = XLSX.readFile(fileName, { cellDates: true, dateNF: 'YYYY-MM-dd' });

    // 获取 Excel 中所有表名
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    // 获取第一个 sheet
    const worksheet = workbook.Sheets[sheetNames[0]];
    // 处理为 json 格式
    return XLSX.utils.sheet_to_json(worksheet, { raw: false })

}


let ret =[]
// 处理表格数据
function paterenTableData(dir, filename, index, count) {
    // let filePath = path.join(dir, filename),
    //     tableJson = readXlsx(filePath)

        // for (let key in ret) {
        //     if (key && key === filename) {

        //         tableJson.forEach(item => {
        //             ret[filename].push(item.PATIENT_NO)
        //         })

        //     } else {
        //         ret[filename] = []

        //         tableJson.forEach(item => {
        //             ret[filename].push(item.PATIENT_NO)
        //         })
        //     }
        // }
                // ret[filename] = []

                // tableJson.forEach(item => {
                //     ret.push({[filename]:item.PATIENT_NO})
                // })
saveXlsx1(filename)

}


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

eachDirectory('input/1.随访')
// eachDirectory('input/1.诊治')
// setTimeout(_=>{

// saveXlsx(ret)
// },30)