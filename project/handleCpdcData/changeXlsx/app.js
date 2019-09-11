'use strict';
const fs = require('fs')
const XLSX = require("xlsx")
const moment = require('moment')
const Check = require("./libs/checkData.js")


class HandleXlsx {
    constructor() {

        // 储存文件内容
        this.fileData = []


        this.init() // 初始化

    }
    /**
     * 读取文件
     * @param  {String} fileName 文件名
     * @return {Buffer} fileData        文件内容
     */
    readFile(fileName = "tmp.json") {

        let _data = ""
        // 创建一个可以写入的流，写入到文件 out.txt 中
        const readerStream = fs.createReadStream(fileName);

        // 设置编码为 utf8。
        readerStream.setEncoding('UTF8');

        // 处理流事件 --> data, end, and error
        readerStream.on('data', function(chunk) {
            _data += chunk;
        });

        readerStream.on('end', function() {
            console.log(fileName, "读取完成。");
            return _data
        });

        readerStream.on('error', function(err) {
            console.log(err.stack);
        });
    }

    /**
     * 读取文件 Promise
     * @param  {String} fileName 文件名
     * @return {Buffer} fileData        文件内容
     */
    readFilePromise(fileName = "tmp.json") {
        return new Promise((resolve, reject) => {

            let _data = ""
            // 创建一个可以写入的流，写入到文件 out.txt 中
            const readerStream = fs.createReadStream(fileName);

            // 设置编码为 utf8。
            readerStream.setEncoding('UTF8');

            // 处理流事件 --> data, end, and error
            readerStream.on('data', function(chunk) {
                _data += chunk;
            });

            readerStream.on('end', function() {
                this.fileData = _data
                resolve({
                    source: _data
                })
                console.log(fileName, "读取完成。");
            });

            readerStream.on('error', function(err) {
                reject(err)
                console.log(err.stack);
            });
        })
    }


    /**
     * 保存表格
     *
     * @param {Object } json
     */
    saveXlsx(json) {
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['PAT_VISIT', 'PAT_SD_ITEM_RESULT', 'HOSPITAL_INFO', 'PAT_DRAINAGE_TUBE'],
            Sheets: {
                'PAT_VISIT': XLSX.utils.json_to_sheet(json.sheet_PAT_VISIT),
                'PAT_SD_ITEM_RESULT': XLSX.utils.json_to_sheet(json.sheet_PAT_SD_ITEM_RESULT),
                'HOSPITAL_INFO': XLSX.utils.json_to_sheet([{ 'HOSPITAL_CODE': null, 'HOSPITAL_NAME': null }]),
                // 'PAT_DRAINAGE_TUBE': XLSX.utils.json_to_sheet(json.sheet_PAT_DRAINAGE_TUBE)
            }
            // Styles:workbook['Styles']
        }

        // 导出 Excel
        XLSX.writeFile(wb, './out/OK-' + Date.now() + '.xlsx');
        console.log('OK ', Date.now())
    }
    /**
     * sheet 3. 处理生成 PAT_SD_ITEM_RESULT 引流管
     * @param  {[type]} tableData [description]
     * @return {[type]}           [description]
     */
    generate_sheet_PAT_DRAINAGE_TUBE(tableData) {
        let filtertableData = filterKeys(tableData.source, 2)
        console.log(filtertableData)


        console.info("sheet3 处理引流管！")
        tableData.sheet_PAT_DRAINAGE_TUBE = filtertableData
        return tableData
    }

    /**
     * sheet 2. 处理生成 PAT_SD_ITEM_RESULT
     * @param  {[type]} tableData 原来的格式
     * @return {[type]}      期望的格式
     * [{
            PATIENT_NO:'',
            SD_CODE:'',
            SD_ITEM_CODE:'',
            SD_ITEM_VALUE:'',
        },{
            PATIENT_NO:'',
            SD_CODE:'',
            SD_ITEM_CODE:'',
            SD_ITEM_VALUE:'',
        }]
     */
    generate_sheet_PAT_SD_ITEM_RESULT(tableData) {

        let list = filterKeys(tableData.source, 1)
        // let _source = tableData.source
        // let _tableData = []
        // for (let i = 0; i < filtertableData.length; i++) {
        //     for (let k in filtertableData[i]) {
        //         let json = {
        //             PATIENT_NO: _source[i].PATIENT_NO,
        //             SD_CODE: 'YXA_O',
        //             SD_ITEM_CODE: k.split("#")[1],
        //             SD_ITEM_VALUE: filtertableData[i][k],
        //         }
        //         _tableData.push(json)
        //     }
        // }

        console.info("sheet2 处理数据元字典！")
        tableData.sheet_PAT_SD_ITEM_RESULT = list
        return tableData
    }
    /**
     * sheet 1. 获取基本信息
     * @return {[type]} [description]
     */
    generate_sheet_PAT_VISIT(data) {
        let list = filterKeys(data.source, 0)

        // let _tableData = []
        // for (let i = 0; i < filtertableData.length; i++) {
        //     _tableData.push({
        //         PATIENT_NO: filtertableData[i].PATIENT_NO, // GUID
        //         PATIENT_ID: filtertableData[i]['病案号'] || null, // 患者id
        //         INP_NO: filtertableData[i]['病案号'] || null, // 病案号
        //         NAME: filtertableData[i]['患者姓名'] || filtertableData[i]['病人姓名'] || null, // 患者姓名
        //         SEX: filtertableData[i]['病人性别'] || null, // 性别
        //         AGE: filtertableData[i]['病人年龄'] || null, // 年龄
        //         ADMISSION_DATE: filtertableData[i]['入院日期'] || null, // 入院日期
        //         DISCHARGE_DATE: filtertableData[i]['出院日期'] || null, // 出院日期
        //         OUT_STATUS: '医嘱离院', // 离院方式，默认 医嘱离院
        //         SD_CODE: 'YXA_O', // 默认：YXA_O
        //         VERSION_NUM: '1.0', // 版本号，默认 1.0
        //         IS_ICF: null, //
        //     })
        // }

        console.info("sheet1 处理基本信息！")
        data.sheet_PAT_VISIT = list
        return data
    }

    /**
     * 将表格里的数据转换为 json
     * @return {[type]} [description]
     */
    async xlsxToJson(tableData) {
        let insertdData = await Check.insertPATIENT_NO(tableData) // 插入GUID

        saveFile(JSON.stringify(insertdData, null, 2), "out/2.xlsx-source.json")

        return { source: insertdData }
    }

    /**
     * 获取表格中 sheet 的数据
     * @return {[type]} [description]
     */
    filterXlsx(xlsxFileName) {
        return new Promise((resolve, reject) => {
            const workbook = XLSX.readFile(xlsxFileName, { cellDates: true, dateNF: 'YYYY/MM/dd' }), // 获取表格数据
                sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
                worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet

            let json = XLSX.utils.sheet_to_json(worksheet, { raw: false }) // 处理为 json 格式
            /*
             * 通过对比字典，返回相应的code
             */
            const checkedJson = Check.PAT_SD_ITEM_RESULT(json)

            // 构建 workbook 对象
            let wb = {
                SheetNames: ['filterSheet'],
                Sheets: {
                    'filterSheet': XLSX.utils.json_to_sheet(checkedJson)
                }
            };

            // 导出 Excel
            XLSX.writeFile(wb, 'out/1.filterXlsx.xlsx');
            resolve(checkedJson)
        })
    }

    init() {
        // const filterFile = './input/瑞金胰腺癌患者补录数据_2017-2018.6——整理.xlsx' // 过滤的文件名
        // const filterFile = './input/胰腺癌单病种数据元2018.1-2019.4——整理.xlsx' // 过滤的文件名
        const filterFile = './input/胰腺癌单病种数据元2019.5-7——整理.xlsx' // 过滤的文件名
        // const filterFile = './input/demo.xlsx' // 过滤的文件名

        // 第一步： 过滤数据并写入表格中，以便查阅
        this.filterXlsx(filterFile)

            // 将表格数据处理后转换为json
            .then(this.xlsxToJson)

            // 处理生成 PAT_VISIT sheet 患者基本信息
            .then(this.generate_sheet_PAT_VISIT)

            // 处理生成 PAT_SD_ITEM_RESULT sheet
            .then(this.generate_sheet_PAT_SD_ITEM_RESULT)

            // 处理生成 PAT_DRAINAGE_TUBE sheet 引流管
            .then(this.generate_sheet_PAT_DRAINAGE_TUBE)

            // 保存表格
            .then(this.saveXlsx)
    }
}

new HandleXlsx()



/**
 * 过滤函数
 * @param  {[type]} fileData    [description]
 * @param  {Number} code        0  没有井号     1 有一个井号     2 两个井号
 * @return {[type]}             [description]
 */
function filterKeys(fileData, code) {

    let filterKeysMaps = [],
        list_PAT_VISIT = [],
        list_PAT_SD_ITEM_RESULT = [],
        list_PAT_DRAINAGE_TUBE = []

    for (let i = 0; i < fileData.length; i++) {
        let haveData = {}, // 一个 # 号
            existData = {}, // 没有 井号
            AData = {}

        for (let key in fileData[i]) {
            if (key.indexOf("#") > -1) {
                let len = key.split('#').length

                if (len === 2) { // 一个 # 号
                    // haveData[key] = fileData[i][key]
                    let list = pattern_sheet_PAT_SD_ITEM_RESULT(fileData[i], key, fileData[i][key])
                    list_PAT_SD_ITEM_RESULT.push(list)

                } else if (len === 3) { // 两个井号
                    // AData[key] = fileData[i][key]
                   let list = pattern_sheet_PAT_DRAINAGE_TUBE(fileData[i], key, fileData[i][key])
                    list_PAT_DRAINAGE_TUBE.push(list)
                }

            } else { // 没有 井号 (基本信息和特殊情况)
                existData = pattern_sheet_PAT_VISIT(fileData[i])
            }
        }
                list_PAT_VISIT.push(existData)
    }

    return [list_PAT_VISIT,list_PAT_SD_ITEM_RESULT,list_PAT_DRAINAGE_TUBE][code]
}

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
        IS_ICF: null, //
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

function pattern_sheet_PAT_DRAINAGE_TUBE(source,key,value) {
    return {
        PATIENT_NO:  source.PATIENT_NO,
        [key]: value
    }
}

/**
 * 保存文件
 * @param  {[type]} data     文件内容
 * @param  {String} fileName 文件名
 * @return {[type]}          [description]
 */
function saveFile(data, fileName = "tmp.json") {
    // 创建一个可以写入的流，写入到文件 out.txt 中
    const writerStream = fs.createWriteStream(fileName);
    // 使用 utf8 编码写入数据
    writerStream.write(data, 'UTF8');

    // 标记文件末尾
    writerStream.end();

    // 处理流事件 --> data, end, and error
    writerStream.on('finish', function() {
        console.log(fileName, "写入完成。");
        process.exit()
    });

    writerStream.on('error', function(err) {
        console.log(err.stack);
    });
}