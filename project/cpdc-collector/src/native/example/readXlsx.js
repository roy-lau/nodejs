
const XLSX = require("xlsx")
// const workbook = XLSX.readFile('output.xlsx');
const workbook = XLSX.readFile('demo.xlsx',{cellStyles:true});

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
// console.log('sheetNames列表：',sheetNames)

// 根据表名获取对应某张表
const worksheet = workbook.Sheets[sheetNames[0]];
// 获取 A1 单元格对象
let a1 = worksheet['A1']; // 返回 { v: 'hello', t: 's', ... }
// 获取 A1 中的值
console.log(a1.v) // 返回 'hello'

console.dir(workbook['Styles'])

let _json = XLSX.utils.sheet_to_json(worksheet)

  // 构建 workbook 对象
  let wb = {
      SheetNames: ['mySheet'],
      Sheets: {
          'mySheet':worksheet
      },
      Styles:workbook['Styles'],
      Themes:workbook['Themes']
  };

  // 导出 Excel
  XLSX.writeFile(wb, 'output-test.xlsx');

// 获取表的有效范围
// 返回 'A1:B20'
console.log(worksheet['!ref'])
// 返回 range 对象，{ s: { r: 0, c: 0}, e: { r: 100, c: 2 } }
console.log(worksheet['!range'])

// 获取合并过的单元格
// 返回一个包含 range 对象的列表，[ {s: { r: 0, c: 0 }, c: { r: 2, c: 1 } } ]
console.log(worksheet['!merges'])