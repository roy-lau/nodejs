/**
 * 清洗数据
 */

'use strict';
const XLSX = require("./libs/xlsx"),
    { utils } = XLSX


/**
 * 读取表格
 * @param  {String} xlsxFileName 读取路径
 * @param  {String} outName      导出表格文件名
 * @return {[type]}              [description]
 */
function createXlsx (xlsxFileName, outName) {

    const workBook = utils.book_new(); // 创建一个工作簿

    // 通过 json 生成一个 sheet
    const workSheet = utils.json_to_sheet([
        { '列1': 1, '列2': 2, '列3': 3 },
        { '列1': 4, '列2': 5, '列3': 6 }
    ], {
        header: ['列1-1', '列2', '列3']
    })

    // 给 sheet 添加数据
    utils.sheet_add_json(workSheet, [
        { '列1': 'new-A', '列2': 'new-B', '列3': 'new-C' },
        { '列1': 7, '列2': 8, '列3': 9 }
    ], {
        origin: 'A10',// 从A2开始增加内容
        skipHeader: true// 跳过上面的标题行
    });

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

    // // 添加注释
    XLSX.utils.cell_add_comment(workSheet['A10'], 'hi \n 从这开始新增的', 'my')
    workSheet['A10'].c.hidden = true;

    // 向工作簿中追加工作表
    utils.book_append_sheet(workBook, workSheet, 'helloWorld');


    // 导出 Excel
    // XLSX.writeFile(workBook, './new-' + Date.now() + '.xlsx', {
    //     cellStyles: true,
    //     compression: true // 开启zip压缩
    // });
}
createXlsx()
// readrXlsx('./demo.xlsx', 'out')
// readrXlsx('./out.xlsx', 'out1')