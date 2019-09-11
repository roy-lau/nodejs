/**
 * 清洗数据
 */

'use strict';
const XLSX = require("./libs/xlsx"),
    { sheet_to_json } = require('./xlsx-utils'),
    { saveFile } = require('../downCase/utils.js')


/**
 * 读取表格
 * @param  {String} xlsxFileName 读取路径
 * @param  {String} outName      导出表格文件名
 * @return {[type]}              [description]
 */
function readrXlsx(xlsxFileName, outName) {
    const workbook = XLSX.readFile(xlsxFileName, { cellDates: true, dateNF: 'YYYY/MM/dd', cellStyles: true }), // 获取表格数据
        sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
        worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet

    // let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }) // 处理为 json 格式

    worksheet["!rows"][1] = {
          "hpt": 30,
          "hpx": 30
    }

    worksheet["!cols"][3] =  {
      "width": 'auto',
      "customwidth": "1",
      "wpx": 163,
      "wch": 19.75,
      "MDW": 8
    }
    worksheet["!cols"][4].hidden = true

    worksheet.B2.s = {color: 'red'}
    // 加备注
    if(!worksheet.A1.c) worksheet.A1.c = [];
    worksheet.A1.c.hidden = true
    worksheet.A1.c.push({a:"SheetJS", t: "I'm a little comment, short and stout!"});

saveFile(JSON.stringify(worksheet,null,2),'./workbook-style.json')
    // console.log(worksheet)
     // 构建 workbook 对象
    let wb = {
        SheetNames: sheetNames,
        Sheets: {
            [sheetNames[0]]: worksheet,
        }
    };

    // 导出 Excel
    XLSX.writeFile(wb, './' + outName + '.xlsx');
}

readrXlsx('./demo.xlsx', 'out')