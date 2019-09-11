/**
 * 清洗数据
 */

'use strict';
const Excel = require('exceljs'),
    { saveFile } = require('./utils')



const workBook = new Excel.Workbook(),
    Xlsx = workBook.xlsx,
    // readPath = './input/demo.xlsx',
    readPath = './input/十地区病例.xlsx',
    writePath = './out/washing/十地区病例_清洗-' + Date.now() + '.xlsx'

/**
 * 根据 其他既往史#YXA_O_024（ AF ）列，新增一列 有无高血压
 */
function addHighBlood(firstWS) {
    let col_AF = firstWS.getColumn('AF'), // 其他既往史#YXA_O_024（ AF ）
        col_AF1 = [],
        col_AG = []

    col_AF.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
        // console.log(rowNumber)
        col_AF1[rowNumber - 1] = cell.value
        col_AG[rowNumber - 1] = (/高血压/).test(cell.value) ? '有' : '无'

    });
    col_AG[0] = '有无高血压'

    // 删除一行并再插入两行
    firstWS.spliceColumns(col_AF.number, 1, col_AF1, col_AG);
    firstWS.getColumn(col_AF.number + 1).font = {
        color: { argb: 'FFAA0000' },
        bold: true
    };
}

function commentLN(firstWS) {
    let col_ER = firstWS.getColumn('ER') // N：LN检测总数#YXA_O_223

    col_ER.eachCell(function(cell, rowNumber) {
        if (cell.value > 30) {
            cell.note = '超过 30'

            console.log(cell.address)

            cell.font = { bold: true };
        }
    });

}

Xlsx.readFile(readPath)
    .then(res => {
        const worksheet = workBook.worksheets,
            firstWS = worksheet[0]; // 获取第一个 sheet


        addHighBlood(firstWS)
        commentLN(firstWS)


        return Xlsx.writeFile(writePath)
    }).then(res => {
        console.log('表格写入完成！', writePath)
    }).catch(error => {
        console.error('exceljs catch in: ', error)
    })