/**
 * 清洗数据
 */

'use strict';
const XLSX = require("./libs/xlsx"),
    {
        saveFile
    } = require('../downCase/utils.js')


/**
 * 读取表格
 * @param  {String} xlsxFileName 读取路径
 * @param  {String} outName      导出表格文件名
 * @return {[type]}              [description]
 */
function readrXlsx(xlsxFileName, outName) {
    var workbook = XLSX.readFile("demo.xlsx", {
        cellStyles: true,
        bookFiles: true
    })
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // var result = XLSX.utils.sheet_to_formulae(worksheet);
    // console.log(worksheet['B2'])
    // worksheet['A1'].s = {
    //     font: {
    //         color: {
    //             rgb: 'FF0000FF'
    //         }
    //     }
    // }

    // worksheet['B1'].s = {
    //     fill: {
    //         fgColor: {
    //             rgb: 'FF0000FF'
    //         }
    //     }
    // }

    XLSX.utils.cell_add_comment(worksheet['C1'], 'hi this is a text', 'my')
    const json = XLSX.utils.sheet_to_json(worksheet);
    // if(!json[1]['身份证'].comment) json[1]['身份证'].comment = [];
    // json[1]['身份证'].comment.hidden = true;
    // json[1]['身份证'].comment.push({a:"SheetJS", t:"This comment will be hidden"});
    // console.log(json)
  // 构建 workbook 对象
  let wb = {
    SheetNames: ['sheet'],
    Sheets: {
        'sheet': XLSX.utils.json_to_sheet(json)
    }
    // Styles:workbook['Styles']
}
    // saveFile('B2.json', JSON.stringify(worksheet, null, 2))
    // 导出 Excel
    XLSX.writeFile(wb, './' + outName + '-' + Date.now() + '.xlsx', {
        cellStyles: true
    });
}

readrXlsx('./demo.xlsx', 'out')
// readrXlsx('./out.xlsx', 'out1')