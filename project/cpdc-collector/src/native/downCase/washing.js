/**
 * 清洗数据
 */

'use strict';
const XLSX = require("xlsx")

// 读取表格
function readXlsx() {
    const workbook = XLSX.readFile("./input/百济-200.xlsx", { cellStyles: true, bookFiles: true })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(worksheet);
    // console.log(json[0])
    // handleData([json[47]])
    handleData(json)
}

function handleData(data) {
    let ret = []
    for (let i = data.length - 1; i >= 0; i--) {
        const items = data[i],
            obj = {}
        // console.log(items)
        for (let key in items) {

            if (key == '化疗药物名称(通用名)#YXA_O_118' && !items['化疗药物名称(通用名)#YXA_O_118'].includes("+")) {
                // console.log(key,items[key].split("+"))
                obj['化疗药物名称(通用名)_1'] = items['化疗药物名称(通用名)#YXA_O_118'] || ""
                obj['化疗药物名称(商品名)_1'] = items['化疗药物名称(商品名)#YXA_O_905'] || ""
                obj['化疗药物剂量_1'] = items['化疗药物剂量#YXA_O_119'] || ""

            } else if (key == '化疗药物名称(通用名)#YXA_O_118' && items['化疗药物名称(通用名)#YXA_O_118'].includes("+")) {
                // console.log(key,items[key].split("+"))

                let _drug_general = (items['化疗药物名称(通用名)#YXA_O_118'] || "").split("+")
                let _drug_trade = (items['化疗药物名称(商品名)#YXA_O_905'] || "").split("+")
                let _drug_dose = (items['化疗药物剂量#YXA_O_119'] || "").split("+")

                // console.log(items['化疗药物名称(通用名)#YXA_O_118'], items['化疗药物名称(商品名)#YXA_O_905'], items['化疗药物剂量#YXA_O_119'])
                _drug_general.forEach((item, i) => {
                    // console.log(item, _drug_trade[i], _drug_dose[i])

                    obj['化疗药物名称(通用名)_' + (i + 1)] = item || ""
                    obj['化疗药物名称(商品名)_' + (i + 1)] = _drug_trade[i] || ""
                    obj['化疗药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                })

            }


            if (key == '药物名称（通用名）#YXA_O_301' && !items['药物名称（通用名）#YXA_O_301'].includes("+")) {
                // console.log(key,items[key].split("+"))
                obj['药物名称(通用名)_1'] = items['药物名称（通用名）#YXA_O_301'] || ""
                obj['药物名称(商品名)_1'] = items['药物名称（商品名）#YXA_O_302'] || ""
                obj['药物剂量_1'] = items['剂量#YXA_O_303'] || ""

            } else if (key == '药物名称（通用名）#YXA_O_301' && items['药物名称（通用名）#YXA_O_301'].includes("+")) {
                // console.log(key,items[key].split("+"))

                let _drug_general = (items['药物名称（通用名）#YXA_O_301'] || "").split("+")
                let _drug_trade = (items['药物名称（商品名）#YXA_O_302'] || "").split("+")
                let _drug_dose = (items['剂量#YXA_O_303'] || "").split("+")

                // console.log(items['药物名称（通用名）#YXA_O_301'], items['药物名称（商品名）#YXA_O_302'], items['剂量#YXA_O_303'])
                _drug_general.forEach((item, i) => {
                    // console.log(item, _drug_trade[i], _drug_dose[i])

                    obj['药物名称(通用名)_' + (i + 1)] = item || ""
                    obj['药物名称(商品名)_' + (i + 1)] = _drug_trade[i] || ""
                    obj['药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                })

            }


            if (key == '药物名称(通用名)#YXA_O_135' && !items['药物名称(通用名)#YXA_O_135'].includes("+")) {
                // console.log(key,items[key].split("+"))
                obj['药物名称(通用名)_1'] = items['药物名称(通用名)#YXA_O_135'] || ""
                obj['药物名称(商品名)_1'] = items['药物名称(商品名)#YXA_O_906'] || ""
                obj['药物剂量_1'] = items['剂量#YXA_O_136'] || ""

            } else if (key == '药物名称(通用名)#YXA_O_135' && items['药物名称(通用名)#YXA_O_135'].includes("+")) {
                // console.log(key,items[key].split("+"))

                let _drug_general = (items['药物名称(通用名)#YXA_O_135'] || "").split("+")
                let _drug_trade = (items['药物名称(商品名)#YXA_O_906'] || "").split("+")
                let _drug_dose = (items['剂量#YXA_O_136'] || "").split("+")

                // console.log(items['药物名称(通用名)#YXA_O_135'], items['药物名称(商品名)#YXA_O_906'], items['剂量#YXA_O_136'])
                _drug_general.forEach((item, i) => {
                    // console.log(item, _drug_trade[i], _drug_dose[i])

                    obj['药物名称(通用名)_' + (i + 1)] = item || ""
                    obj['药物名称(商品名)_' + (i + 1)] = _drug_trade[i] || ""
                    obj['药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                })

            }

            obj[key] = items[key]
        }
        ret.push(obj)
        // console.log(obj)
    }

    saveXlsx(ret)
}


function saveXlsx(ret) {
    try {

        // 构建 workbook 对象
        let wb = {
            SheetNames: ['基本信息', ],
            Sheets: {
                '基本信息': XLSX.utils.json_to_sheet(ret)
            }
            // Styles:workbook['Styles']
        }

        // 导出 Excel
        XLSX.writeFile(wb, './out/my/tmp.xlsx');
        console.log('-OK ', Date.now())
    } catch (e) {
        console.error('处理数据出错： ', e)
    }

}


readXlsx()