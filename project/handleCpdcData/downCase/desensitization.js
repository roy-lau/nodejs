/**
 * 脱敏 去除敏感数据
 */
const XLSX = require("xlsx"),
    fs = require('fs')


/**
 * 读取表格数据
 * @return {[type]} [description]
 */
function readrXlsx(xlsxFileName,city) {
    const workbook = XLSX.readFile(xlsxFileName, { cellDates: true, dateNF: 'YYYY/MM/dd' }), // 获取表格数据
        sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
        worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet

    let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }) // 处理为 json 格式

    json.map(item => {

    	item['姓名'] = desensitization(item['姓名'],1,3)
    	item['患者身份证号#YXA_O_001'] = desensitization(item['患者身份证号#YXA_O_001'],4,17)
    	item['患者联系方式#YXA_O_004'] = desensitization(item['患者联系方式#YXA_O_004'],3,9)
    	item['患者住址#YXA_O_003'] = desensitization(item['患者住址#YXA_O_003'],3,18)
    	item['主刀医师#YXA_O_005'] = desensitization(item['主刀医师#YXA_O_005'],1,3).substr(0,2)

    	return item
    })
    // 构建 workbook 对象
    let wb = {
        SheetNames: [sheetNames[0],sheetNames[1],sheetNames[2],sheetNames[3]],
        Sheets: {
            [sheetNames[0]]: XLSX.utils.json_to_sheet(json),
            [sheetNames[1]]: workbook.Sheets[sheetNames[1]],
            [sheetNames[2]]: workbook.Sheets[sheetNames[2]],
            [sheetNames[3]]: workbook.Sheets[sheetNames[3]]
        }
    };

    // 导出 Excel
    XLSX.writeFile(wb, './out1/'+city+'.xlsx');
}

readrXlsx('./input/北京/检索病例_20190905200545.xlsx','北京')
readrXlsx('./input/广州/检索病例_20190905202056.xlsx','广州')
readrXlsx('./input/杭州/检索病例_20190905202716.xlsx','杭州')
readrXlsx('./input/黑龙江/检索病例_20190905205420.xlsx','黑龙江')
readrXlsx('./input/湖北/检索病例_20190905203743.xlsx','湖北')
readrXlsx('./input/江苏/检索病例_20190905203243.xlsx','江苏')
readrXlsx('./input/上海/检索病例_20190905201201.xlsx','上海')
readrXlsx('./input/四川/检索病例_20190905205120.xlsx','四川')
readrXlsx('./input/西安/检索病例_20190905204126.xlsx','西安')
readrXlsx('./input/重庆/检索病例_20190905205322.xlsx','重庆')
/**
 * 脱敏函数
 * @param  {String} str      需要脱敏的字符串
 * @param  {Number} beginStr 开始位置
 * @param  {Number} endStr   结束位置
 * @return {String}          脱敏后的数据
 *
 * desensitization('刘强',1,3)
 * "刘**"
 * desensitization('河南省新郑市',3,8)
 * "河南省*****"
 * desensitization('13526636962',3,8)
 * "135*****962"
 *
 */

function desensitization(str, beginStr, endStr) {
	if (!str) return
    var len = String(str).length;
    var leftStr = String(str).substring(0, beginStr);
    var rightStr = String(str).substring(endStr, len);
    var str = ''
    var i = 0;
    try {
        for (i = 0; i < endStr - beginStr; i++) {
            str = str + '*';
        }
    } catch (error) {

    }
    str = leftStr + str + rightStr;
    return str;
}