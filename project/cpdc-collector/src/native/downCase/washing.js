/**
 * 清洗数据
 */

'use strict';
const XLSX = require("xlsx")

// 读取表格
function readXlsx() {
    const workbook = XLSX.readFile("./out/my/百济-get_3year_in_group.xlsx", { cellStyles: true, cellDates: true })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(worksheet);
    // console.log(json[0])
    // handleData([json[47]])
    handleData(json)
}

const listDiffDrug = {
    // '氟尿嘧啶': '氟尿嘧啶',
    // '艾恒': '奥沙利铂',
    // '乐沙定': '奥沙利铂',
    // '同奥': '亚叶酸钙',
    // '艾力': '伊立替康',
    // '开普拓': '伊立替康',
    // 'ABX': '白蛋白紫杉醇',
    // '艾越': '白蛋白紫杉醇',
    // '克艾力': '白蛋白紫杉醇',
    // '凯素': '白蛋白紫杉醇',
    // '爱斯万': '替吉奥',
    // '维康达': '替吉奥',
    // '艾奕': '替吉奥',
    // '苏立': '替吉奥',
    // '艾坦': '阿帕替尼',
    // '希罗达': '卡培他滨',
    // '卓伦': '卡培他滨',
    // '艾滨': '卡培他滨',
    // '艾素': '多西他赛',
    // '泰索帝': '多西他赛',
    // '择菲': '吉西他滨',
    // '健择': '吉西他滨',
    // '辰涛': '吉西他滨',
    // '泰素': '紫杉醇',
    // '力扑素': '紫杉醇',
    // '善龙': '奥曲肽',
    // '雷莫芦单抗': 'Ramucirumab',
    // '泰欣生': '尼妥珠单抗',
    // '诺欣': '顺铂',
    // '洛铂': '洛铂',
    // '索坦': '舒尼替尼',
    // 'S1': 'S1',
    // '不详': '不详'

    '1': '1',
    '2': '2',
    '3': '2',
    '4': '3',
    '5': '4',
    '6': '4',
    '7': '5',
    '8': '5',
    '9': '5',
    '10': '5',
    '11': '6',
    '12': '6',
    '13': '6',
    '14': '6',
    '15': '7',
    '16': '8',
    '17': '8',
    '18': '8',
    '19': '9',
    '20': '9',
    '21': '10',
    '22': '10',
    '23': '10',
    '24': '11',
    '25': '11',
    '26': '12',
    '27': '13',
    '28': '14',
    '29': '15',
    '30': '16',
    '31': '17',
    '32': '18',
    '33': '19'
}

function handleData(data) {
    let ret = []
    for (let i = data.length - 1; i >= 0; i--) {
        const items = data[i],
            obj = {}
        // console.log(items)
        for (let key in items) {


            /*
                是否放化疗 章节
             */
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
                _drug_general.forEach((drugGeneral, i) => {
                    // console.log(drugGeneral, _drug_trade[i], _drug_dose[i])

                    const drugTrade = _drug_trade[i]

                    // 先把药物商品名和通用名相同的匹配出来
                    if (listDiffDrug[drugGeneral] === drugGeneral) {

                        obj['化疗药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['化疗药物名称(商品名)_' + (i + 1)] = drugGeneral || ""
                        obj['化疗药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else if (drugGeneral !== listDiffDrug[drugTrade] && listDiffDrug[drugTrade] && listDiffDrug[drugTrade] !== '不详') {

                        let curDrugTrade = _drug_trade.find(item => {
                            if (listDiffDrug[item] === drugGeneral) return item
                        })

                        obj['化疗药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['化疗药物名称(商品名)_' + (i + 1)] = curDrugTrade || ""
                        obj['化疗药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else {
                        obj['化疗药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['化疗药物名称(商品名)_' + (i + 1)] = _drug_trade[i] || ""
                        obj['化疗药物剂量_' + (i + 1)] = _drug_dose[i] || ""
                    }

                })

            }

            /*
                是否化疗
             */
            if (key == '药物名称（通用名）#YXA_O_301' && !items['药物名称（通用名）#YXA_O_301'].includes("+")) {
                // console.log(key,items[key].split("+"))
                obj['1.药物名称(通用名)_1'] = items['药物名称（通用名）#YXA_O_301'] || ""
                obj['1.药物名称(商品名)_1'] = items['药物名称（商品名）#YXA_O_302'] || ""
                obj['1.药物剂量_1'] = items['剂量#YXA_O_303'] || ""

            } else if (key == '药物名称（通用名）#YXA_O_301' && items['药物名称（通用名）#YXA_O_301'].includes("+")) {
                // console.log(key,items[key].split("+"))

                let _drug_general = (items['药物名称（通用名）#YXA_O_301'] || "").split("+")
                let _drug_trade = (items['药物名称（商品名）#YXA_O_302'] || "").split("+")
                let _drug_dose = (items['剂量#YXA_O_303'] || "").split("+")

                // console.log(items['药物名称（通用名）#YXA_O_301'], items['药物名称（商品名）#YXA_O_302'], items['剂量#YXA_O_303'])
                _drug_general.forEach((drugGeneral, i) => {

                    const drugTrade = _drug_trade[i]

                    // 先把药物商品名和通用名相同的匹配出来
                    if (listDiffDrug[drugGeneral] === drugGeneral) {

                        obj['1.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['1.药物名称(商品名)_' + (i + 1)] = drugGeneral || ""
                        obj['1.药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else if (drugGeneral !== listDiffDrug[drugTrade] && listDiffDrug[drugTrade] && listDiffDrug[drugTrade] !== '不详') {

                        let curDrugTrade = _drug_trade.find(item => {
                            if (listDiffDrug[item] === drugGeneral) return item
                        })

                        obj['1.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['1.药物名称(商品名)_' + (i + 1)] = curDrugTrade || ""
                        obj['1.药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else {
                        obj['1.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['1.药物名称(商品名)_' + (i + 1)] = drugTrade || ""
                        obj['1.药物剂量_' + (i + 1)] = _drug_dose[i] || ""
                    }



                })

            }

            /*
                是否更改治疗方案
             */
            // 处理 单药和其他 的情况，直接返回
            if (key == '药物名称(通用名)#YXA_O_135' && !items['药物名称(通用名)#YXA_O_135'].includes("+")) {
                // console.log(key,items[key].split("+"))
                obj['2.药物名称(通用名)_1'] = items['药物名称(通用名)#YXA_O_135'] || ""
                obj['2.药物名称(商品名)_1'] = items['药物名称(商品名)#YXA_O_906'] || ""
                obj['2.药物剂量_1'] = items['剂量#YXA_O_136'] || ""

            } else if (key == '药物名称(通用名)#YXA_O_135' && items['药物名称(通用名)#YXA_O_135'].includes("+")) {
                // console.log(key,items[key].split("+"))

                let _drug_general = (items['药物名称(通用名)#YXA_O_135'] || "").split("+")
                let _drug_trade = (items['药物名称(商品名)#YXA_O_906'] || "").split("+")
                let _drug_dose = (items['剂量#YXA_O_136'] || "").split("+")

                // console.log(items['药物名称(通用名)#YXA_O_135'], items['药物名称(商品名)#YXA_O_906'], items['剂量#YXA_O_136'])
                _drug_general.forEach((drugGeneral, i) => {


                    const drugTrade = _drug_trade[i]
                    // console.log(drugGeneral,drugTrade, _drug_dose[i])

                    // 先把药物商品名和通用名相同的匹配出来
                    if (listDiffDrug[drugGeneral] === drugGeneral) {

                        obj['2.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['2.药物名称(商品名)_' + (i + 1)] = drugGeneral || ""
                        obj['2.药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else if (drugGeneral !== listDiffDrug[drugTrade] && listDiffDrug[drugTrade] && listDiffDrug[drugTrade] !== '不详') {

                        // console.log(drugGeneral, '===', listDiffDrug[drugTrade], '===',drugTrade,_drug_trade, i)

                        let curDrugTrade = _drug_trade.find(item => {
                            if (listDiffDrug[item] === drugGeneral) return item
                        })
                        // console.log(curDrugTrade)

                        obj['2.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['2.药物名称(商品名)_' + (i + 1)] = curDrugTrade || ""
                        obj['2.药物剂量_' + (i + 1)] = _drug_dose[i] || ""

                    } else {
                        obj['2.药物名称(通用名)_' + (i + 1)] = drugGeneral || ""
                        obj['2.药物名称(商品名)_' + (i + 1)] = drugTrade || ""
                        obj['2.药物剂量_' + (i + 1)] = _drug_dose[i] || ""
                    }



                })

            }


            obj[key] = items[key]
        }
        ret.push(obj)
        // console.log(obj)
    }

    saveXlsx(ret)
}

// 替换（通用名）
function diff_drug_general(key) {
    // 通用名

    let listDrug = {
        "氟尿嘧啶": 1,
        "奥沙利铂": 2,
        "亚叶酸钙": 3,
        "伊立替康": 4,
        "白蛋白紫杉醇": 5,
        "替吉奥": 6,
        "阿帕替尼": 7,
        "卡培他滨": 8,
        "多西他赛": 9,
        "吉西他滨": 10,
        "紫杉醇": 11,
        "奥曲肽": 12,
        "Ramucirumab": 13,
        "尼妥珠单抗": 14,
        "顺铂": 15,
        "洛铂": 16,
        "舒尼替尼": 17,
        "替加氟": 18,
        "不详": 19
    }
    return listDrug[key]
}
// 替换（商品名）
function diff_drug_trade(key) {
    // 商品名
    let listDrug = {
        '氟尿嘧啶': 1,
        '艾恒': 2,
        '乐沙定': 3,
        '同奥': 4,
        '艾力': 5,
        '开普拓': 6,
        'ABX': 7,
        '艾越': 8,
        '克艾力': 9,
        '凯素': 10,
        '爱斯万': 11,
        '维康达': 12,
        '艾奕': 13,
        '苏立': 14,
        '艾坦': 15,
        '希罗达': 16,
        '卓伦': 17,
        '艾滨': 18,
        '艾素': 19,
        '泰索帝': 20,
        '择菲': 21,
        '健择': 22,
        '辰涛': 23,
        '泰素': 24,
        '力扑素': 25,
        '善龙': 26,
        '雷莫芦单抗': 27,
        '泰欣生': 28,
        '诺欣': 29,
        '洛铂': 30,
        '索坦': 31,
        'S1': 32
    }
    return listDrug[key]
}

function diff_drug_general_m(str) {
    let ret = ''
    if (/氟尿嘧啶/.test(str)) ret += '1+'
    if (/奥沙利铂/.test(str)) ret += '2+'
    if (/亚叶酸钙/.test(str)) ret += '3+'
    if (/伊立替康/.test(str)) ret += '4+'
    if (/白蛋白紫杉醇/.test(str)) {
        ret += '5+'
    } else if (/紫杉醇/.test(str)) {
        ret += '11+'
    }
    if (/替吉奥/.test(str)) ret += '6+'
    if (/阿帕替尼/.test(str)) ret += '7+'
    if (/卡培他滨/.test(str)) ret += '8+'
    if (/多西他赛/.test(str)) ret += '9+'
    if (/吉西他滨/.test(str)) ret += '10+'
    if (/奥曲肽/.test(str)) ret += '12+'
    if (/Ramucirumab/i.test(str)) ret += '13+'
    if (/尼妥珠单抗/.test(str)) ret += '14+'
    if (/顺铂/.test(str)) ret += '15+'
    if (/洛铂/.test(str)) ret += '16+'
    if (/舒尼替尼/.test(str)) ret += '17+'
    if (/替加氟/.test(str)) ret += '18+'
    if (/不详/.test(str)) ret += '19+'

    return ret.replace(/\+$/g, '')

}

function diff_drug_trad_m(str) {
    let ret = ''
    if (/氟尿嘧啶/.test(str)) ret += "1+"
    if (/艾恒/.test(str)) ret += "2+"
    if (/乐沙定/.test(str)) ret += "3+"
    if (/同奥/.test(str)) ret += "4+"
    if (/艾力/.test(str)) ret += "5+"
    if (/开普拓/.test(str)) ret += "6+"
    if (/ABX/i.test(str)) ret += "7+"
    if (/艾越/.test(str)) ret += "8+"
    if (/克艾力/.test(str)) ret += "9+"
    if (/凯素/.test(str)) ret += "10+"
    if (/爱斯万/.test(str)) ret += "11+"
    if (/维康达/.test(str)) ret += "12+"
    if (/艾奕/.test(str)) ret += "13+"
    if (/苏立/.test(str)) ret += "14+"
    if (/艾坦/.test(str)) ret += "15+"
    if (/希罗达/.test(str)) ret += "16+"
    if (/卓伦/.test(str)) ret += "17+"
    if (/艾滨/.test(str)) ret += "18+"
    if (/艾素/.test(str)) ret += "19+"
    if (/泰索帝/.test(str)) ret += "20+"
    if (/择菲/.test(str)) ret += "21+"
    if (/健择/.test(str)) ret += "22+"
    if (/辰涛/.test(str)) ret += "23+"
    if (/泰素/.test(str)) ret += "24+"
    if (/力扑素/.test(str)) ret += "25+"
    if (/善龙/.test(str)) ret += "26+"
    if (/雷莫芦单抗/.test(str)) ret += "27+"
    if (/泰欣生/.test(str)) ret += "28+"
    if (/诺欣/.test(str)) ret += "29+"
    if (/洛铂/.test(str)) ret += "30+"
    if (/索坦/.test(str)) ret += "31+"
    if (/S1/i.test(str)) ret += "32+"

    return ret.replace(/\+$/g, '')
}

function diff_folfox(str) {
    let ret = ""
    if (str == 'FOLFIRINOX(亚叶酸钙+氟尿嘧啶+伊立替康+奥沙利铂)') ret = '1'
    if (str == 'mFOLFIRINOX(亚叶酸钙+氟尿嘧啶+伊立替康+奥沙利铂)') ret = '2'
    if (str == 'FOLFIRI(亚叶酸钙+氟尿嘧啶+伊立替康)') ret = '3'
    if (str == 'AG(白蛋白紫杉醇+吉西他滨)') ret = '4'
    if (str == 'AS1(白蛋白紫杉醇+替吉奥)') ret = '5'
    if (str == 'GP(吉西他滨+顺铂)') ret = '6'
    if (str == 'Gemox(吉西他滨+奥沙利铂)') ret = '7'
    if (str == 'GX(吉西他滨+卡培他滨)') ret = '8'
    if (str == 'GS(吉西他滨+替吉奥)') ret = '9'
    if (str == 'DS(多西他赛+替吉奥)') ret = '10'
    if (str == 'DX(多西他赛+卡培他滨)') ret = '11'
    if (str == 'XELOX(卡培他滨+奥沙利铂)') ret = '12'
    if (str == '单药') ret = '13'
    if (str == '其他') ret = '14'
    return ret
}

function saveXlsx(ret) {
    try {

        // 构建 workbook 对象
        let wb = {
            SheetNames: ['sheet', ],
            Sheets: {
                'sheet': XLSX.utils.json_to_sheet(ret)
            }
        }

        // 导出 Excel
        const fileName = './out/washing/百济-三年入组.xlsx'
        XLSX.writeFile(wb, fileName);
        console.log(fileName + ' -OK ', Date.now())
    } catch (e) {
        console.error('处理表格数据出错： ', e)
    }

}


readXlsx()