/**
 * 过滤函数
 * @param  {[type]} fileData    [description]
 * @param  {Number} code        0  没有井号     1 有一个井号     2 两个井号
 * @return {[type]}             [description]
 */
module.exports = function filterKeys(fileData, code) {

    let filterKeysMaps = [],
        list_PAT_VISIT = [],
        list_PAT_SD_ITEM_RESULT = [],
        list_PAT_DRAINAGE_TUBE = [],
        list_PAT_FOLLOW_UP = [],
        list_PAT_FOLLOW_UP_RESULT = []

    for (let i = 0; i < fileData.length; i++) {
        let haveData = {}, // 一个 # 号
            existData = {} // 没有 井号

        for (let key in fileData[i]) {
            if (key.indexOf("#") > -1) { // 诊治 和 引流管
                const len = key.split('#').length

                if (len === 2) { // 一个 # 号（诊治）
                    if (fileData[i][key]) {
                        let list = pattern_sheet_PAT_SD_ITEM_RESULT(fileData[i], key, fileData[i][key])
                        list_PAT_SD_ITEM_RESULT.push(list)
                    }
                } else if (len === 3 && code === 2) { // 两个井号 且必须是 引流管函数调用
                    if (fileData[i][key]) {
                        list_PAT_DRAINAGE_TUBE = pattern_sheet_PAT_DRAINAGE_TUBE(fileData[i], key, fileData[i][key])
                    }
                }

            } else if (key.indexOf("@") > -1) { // 随访相关
            	console.log(key, fileData[i][key])
                list_PAT_FOLLOW_UP = splitFollow(code, fileData[i], key, fileData[i][key])

            } else { // 没有 井号 (基本信息和特殊情况)
                existData = pattern_sheet_PAT_VISIT(fileData[i])
            }
        }
        list_PAT_VISIT.push(existData)
    }

    return [list_PAT_VISIT, list_PAT_SD_ITEM_RESULT, list_PAT_DRAINAGE_TUBE, list_PAT_FOLLOW_UP][code]
}

/**
 * 设计基本信息表的格式
 * 
 * @param {Object} value 基本信息的json
 * @returns {Object} 
 */
function pattern_sheet_PAT_VISIT(value) {
    return {
        PATIENT_NO: value.PATIENT_NO, // GUID
        PATIENT_ID: value['病案号'] || null, // 患者id
        INP_NO: value['病案号'] || null, // 病案号
        NAME: value['患者姓名'] || value['病人姓名'] || null, // 患者姓名
        SEX: value['病人性别'] || null, // 性别
        AGE: value['病人年龄'] || null, // 年龄
        ADMISSION_DATE: value['入院日期'] || null, // 入院日期
        DISCHARGE_DATE: value['出院日期'] || null, // 出院日期
        OUT_STATUS: '医嘱离院', // 离院方式，默认 医嘱离院
        SD_CODE: 'YXA_O', // 默认：YXA_O
        VERSION_NUM: '1.0', // 版本号，默认 1.0
        IS_ICF: '1', // 患者知情同意书
    }
}

function pattern_sheet_PAT_SD_ITEM_RESULT(source, key, value) {
    return {
        PATIENT_NO: source.PATIENT_NO,
        SD_CODE: 'YXA_O',
        SD_ITEM_CODE: key.split("#")[1],
        SD_ITEM_VALUE: value,
    }
}
/**
 * 引流管
 * @param {Object} source 源数据
 * @param {String} key 键
 * @param {Any} value 值
 * @return {[type]}        [description]
 */
let tube_tmpArr = [],
    tube_tmpObj = {},
    tube_objArr = []

function pattern_sheet_PAT_DRAINAGE_TUBE(source, key, value) {
    // console.log(key, value)

    const _splitKey = key.split('#')

    if (tube_tmpArr.indexOf(_splitKey[2]) > -1) {
        tube_tmpObj[_splitKey[1]] = value
    } else {
        tube_tmpArr = []
        tube_tmpObj = {}
        tube_tmpObj['PATIENT_NO'] = source.PATIENT_NO
        tube_tmpObj[_splitKey[1]] = value
        tube_objArr.push(tube_tmpObj)

        tube_tmpArr.push(_splitKey[2])
    }
    return tube_objArr
}


function splitFollow(code, source, key, value) {
    const splitKey = key.split('@'),
        name = splitKey[1],
        len = splitKey.length,
        _data = convertSamePatientNo(source, splitKey, value)

    // console.log(source['出院日期'])

    // console.log(_data)
    return _data

    // if (len === 2) { // 一个 @ 号（随访相关字段）
    //     if (fileData[i][key]) {
    //         // let list = pattern_sheet_PAT_FOLLOW_UP_RESULT(fileData[i], key, fileData[i][key])
    //         // list_PAT_FOLLOW_UP_RESULT.push(list)
    //     }
    // } else if (len === 3 && code === 3) { // 两个 @ 号（随访日期时长……）
    // }
}
/**
 * 将 PatientNo 相同行的数据转换为多列
 *
 * @param  {[type]} source   [description]
 * @param  {[type]} splitKey [description]
 * @param  {[type]} value    [description]
 * @return {[type]}          [description]
 */
let follow_tmpArr = [],
    follow_tmpObj = {},
    follow_objArr = []
function convertSamePatientNo(source, splitKey, value) {

    if (follow_tmpArr.indexOf(splitKey[2]) > -1) {
        follow_tmpObj[splitKey[1]] = value
    } else {
        follow_tmpArr = []
        follow_tmpObj = {}
        follow_tmpObj['PATIENT_NO'] = source.PATIENT_NO
        follow_tmpObj[splitKey[1]] = value
        follow_objArr.push(follow_tmpObj)

        follow_tmpArr.push(splitKey[2])
    }
    return follow_objArr

}
/**
 * 随访时长
 * @param {Object} source 源数据
 * @param {String} key 键
 * @param {Any} value 值
 * @return {[type]}        [description]
 */
function pattern_sheet_PAT_FOLLOW_UP(source, splitKey, value) {
    // console.log(source.PATIENT_NO, key, value)

    if (tmpArr.indexOf(splitKey[2]) > -1) {
        tmpObj[splitKey[1]] = value
    } else {
        tmpArr = []
        tmpObj = {}
        tmpObj['PATIENT_NO'] = source.PATIENT_NO
        tmpObj[splitKey[1]] = value
        objArr.push(tmpObj)

        tmpArr.push(splitKey[2])
    }
    console.log(objArr)
    return objArr
}