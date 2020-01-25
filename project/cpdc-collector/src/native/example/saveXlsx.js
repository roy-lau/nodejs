const XLSX = require("xlsx")


/**
 * 保存表格
 * @param  {Array}  headers  ['id', 'name', 'age', 'country', 'remark']
 * @param  {Array}  data     [ { id: '1',
                name: 'test1',
                age: '30',
                country: 'China',
                remark: 'hello' },
              { id: '2',
                name: 'test2',
                age: '20',
                country: 'America',
                remark: 'world' },
              { id: '3',
                name: 'test3',
                age: '18',
                country: 'Unkonw',
                remark: '???' } ]
 * @param  {String} fileName 文件名
 * @return {[type]}          null
 */
const saveXlsx = async (headers=[],data=[],fileName='output.xlsx') => {


  let _headers = headers
                  // 为 headers 添加对应的单元格位置
                  // [ { v: 'id', position: 'A1' },
                  //   { v: 'name', position: 'B1' },
                  //   { v: 'age', position: 'C1' },
                  //   { v: 'country', position: 'D1' },
                  //   { v: 'remark', position: 'E1' } ]
                  .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
                  // 转换成 worksheet 需要的结构
                  // { A1: { v: 'id' },
                  //   B1: { v: 'name' },
                  //   C1: { v: 'age' },
                  //   D1: { v: 'country' },
                  //   E1: { v: 'remark' } }
                  .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

  let _data = data
                // 匹配 _headers 的位置，生成对应的单元格数据
                // [ [ { v: '1', position: 'A2' },
                //     { v: 'test1', position: 'B2' },
                //     { v: '30', position: 'C2' },
                //     { v: 'China', position: 'D2' },
                //     { v: 'hello', position: 'E2' } ],
                //   [ { v: '2', position: 'A3' },
                //     { v: 'test2', position: 'B3' },
                //     { v: '20', position: 'C3' },
                //     { v: 'America', position: 'D3' },
                //     { v: 'world', position: 'E3' } ],
                //   [ { v: '3', position: 'A4' },
                //     { v: 'test3', position: 'B4' },
                //     { v: '18', position: 'C4' },
                //     { v: 'Unkonw', position: 'D4' },
                //     { v: '???', position: 'E4' } ] ]
                .map((v, i) => headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
                // 对刚才的结果进行降维处理（二维数组变成一维数组）
                // [ { v: '1', position: 'A2' },
                //   { v: 'test1', position: 'B2' },
                //   { v: '30', position: 'C2' },
                //   { v: 'China', position: 'D2' },
                //   { v: 'hello', position: 'E2' },
                //   { v: '2', position: 'A3' },
                //   { v: 'test2', position: 'B3' },
                //   { v: '20', position: 'C3' },
                //   { v: 'America', position: 'D3' },
                //   { v: 'world', position: 'E3' },
                //   { v: '3', position: 'A4' },
                //   { v: 'test3', position: 'B4' },
                //   { v: '18', position: 'C4' },
                //   { v: 'Unkonw', position: 'D4' },
                //   { v: '???', position: 'E4' } ]
                .reduce((prev, next) => prev.concat(next))
                // 转换成 worksheet 需要的结构
                //   { A2: { v: '1' },
                //     B2: { v: 'test1' },
                //     C2: { v: '30' },
                //     D2: { v: 'China' },
                //     E2: { v: 'hello' },
                //     A3: { v: '2' },
                //     B3: { v: 'test2' },
                //     C3: { v: '20' },
                //     D3: { v: 'America' },
                //     E3: { v: 'world' },
                //     A4: { v: '3' },
                //     B4: { v: 'test3' },
                //     C4: { v: '18' },
                //     D4: { v: 'Unkonw' },
                //     E4: { v: '???' } }
                .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

  // 合并 _headers 和 _data
  let output = Object.assign({}, _headers, _data);
  // 获取所有单元格的位置
  let outputPos = Object.keys(output);
  // 计算出范围
  let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

  // 构建 workbook 对象
  let wb = {
      SheetNames: ['mySheet'],
      Sheets: {
          'mySheet': Object.assign({}, output, { '!ref': ref })
      }
  };

  // 导出 Excel
  XLSX.writeFile(wb, fileName);
}

module.exports = saveXlsx