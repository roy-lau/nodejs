/**
 * 清洗数据
 */

'use strict';
const XLSX = require("xlsx"),
    { saveFile } = require('../downCase/utils.js')


/**
 * 读取表格
 * @param  {String} xlsxFileName 读取路径
 * @param  {String} outName      导出表格文件名
 * @return {[type]}              [description]
 */
function readrXlsx(xlsxFileName, outName) {
    var workbook = XLSX.readFile("demo.xlsx", { cellStyles: true, bookFiles: true })
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // var result = XLSX.utils.sheet_to_formulae(worksheet);
    // console.log(worksheet['B2'])
    worksheet['A1'].s = {
        font: {
            color: {
                rgb: 'FF0000FF'
            }
        }
    }

    worksheet['B1'].s = {
        fill: {
            fgColor: {
                rgb: 'FF0000FF'
            }
        }
    }

XLSX1.utils.cell_add_comment(worksheet['C1'],'hi this is a text','my')

    saveFile('B2.json', JSON.stringify(worksheet, null, 2))
    // 导出 Excel
    XLSX1.writeFile(workbook, './' + outName + '-' + Date.now() + '.xlsx', { cellStyles: true });
}

readrXlsx('./demo.xlsx', 'out')
// readrXlsx('./out.xlsx', 'out1')