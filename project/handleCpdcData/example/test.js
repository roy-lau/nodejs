const XLSX = require("xlsx")

const workbook = XLSX.readFile('手术名称测试.xlsx');

// 获取 Excel 中所有表名
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
// console.log('sheetNames列表：',sheetNames)

// 根据表名获取对应某张表
const worksheet = workbook.Sheets[sheetNames[0]];



function compareDataFile(data) {

    const splitCode = data.itemCode.split("#")[1]

    const SD_ITEM_DICT = require("../changeXlsx/sd_item_dict.json")

    let checkedValue = ''
    for (let i = 0; i < SD_ITEM_DICT.length; i++) {
        if (SD_ITEM_DICT[i].ITEM_CODE === splitCode) { // 先判断 code 是否相同

            // console.log(SD_ITEM_DICT[i], data.itemValue)

            if (SD_ITEM_DICT[i].ITEM_CV_CODE) { // 如果有字典
                const SD_ITEM_CV_DICT = require("../changeXlsx/sd_item_cv_dict.json")

                // 通过字典code过滤出一个数组
                const filterCvDist = SD_ITEM_CV_DICT.filter(item => item.CV_CODE === SD_ITEM_DICT[i].ITEM_CV_CODE)

                for (let k = 0; k < filterCvDist.length; k++) {
                        // console.log(filterCvDist[k])
                        if (filterCvDist[k].CV_VALUE_TEXT === data.itemValue || filterCvDist[k].CV_VALUE === data.itemValue) {
                            return filterCvDist[k].CV_VALUE
                        }else{
                            // console.log(filterCvDist[k].CV_VALUE_TEXT == data.itemValue)
                            checkedValue = data.itemValue
                        }

                }
                    return checkedValue
            } else {

            }
        }
    }

}



function handleData(data) {

    // let filterList = filterKeys(data,1)
    let filterKeysMaps = []

    for (let i = 0; i < data.length; i++) {
        let _data = {}

        for (let key in data[i]) {
            if (key.indexOf("#") > -1) {
                _data[key] = compareDataFile({ itemCode: key, itemValue: data[i][key] }) // 有 井号
                // console.count(_data[key])
            } else {
                _data[key] = data[i][key] // 没有 井号
            }
        }
        // console.log("表格字典比对进度：", i + 1, '/', data.length)
        filterKeysMaps.push(_data)
    }

    return filterKeysMaps

}


let _json = XLSX.utils.sheet_to_json(worksheet)

let changed = handleData(_json)


// 构建 workbook 对象
let wb = {
    SheetNames: ['mySheet', 'changed'],
    Sheets: {
        'mySheet': worksheet,
        'changed': XLSX.utils.json_to_sheet(changed),
    }
};

// 导出 Excel
XLSX.writeFile(wb, '手术名称测试.xlsx');