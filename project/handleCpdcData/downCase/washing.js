/**
 * 清洗数据
 */

'use strict';
const XLSX = require("xlsx"),
{ saveFile } = require('./utils')


/**
 * 读取表格
 * @param  {String} xlsxFileName 读取路径
 * @param  {String} outName      导出表格文件名
 * @return {[type]}              [description]
 */
function readrXlsx(xlsxFileName, outName) {
    const workbook = XLSX.readFile(xlsxFileName,{ cellDates: true, dateNF: 'YYYY/MM/dd',cellStyles: true }), // 获取表格数据
        sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
        worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet

    let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }) // 处理为 json 格式
    saveFile('./out/washing/worksheet-style.json',JSON.stringify(worksheet,null,2))
    // saveFile('./out/washing/worksheet-date.json',JSON.stringify(worksheet,null,2))
    // saveFile('xlsx.json',JSON.stringify(json,null,2))
    // saveFile('./out/washing/worksheet-to-json.json',JSON.stringify(json,null,2))

    json.map(item => {
        // 其他既往史 高血压

        item['有无高血压'] = (/高血压/).test(item['其他既往史#YXA_O_024']) ?'有' : '无'

        return item
    })
    // 构建 workbook 对象
    let wb = {
        SheetNames: sheetNames,
        Sheets: {
            [sheetNames[0]]: XLSX.utils.json_to_sheet(json),
            [sheetNames[1]]: workbook.Sheets[sheetNames[1]],
            [sheetNames[2]]: workbook.Sheets[sheetNames[2]],
            [sheetNames[3]]: workbook.Sheets[sheetNames[3]]
        }
    };

    // 导出 Excel
    XLSX.writeFile(wb, './out/washing/' + outName + '.xlsx');
}

readrXlsx('./input/十地区病例.xlsx', '十地区病例_清洗')