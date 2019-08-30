'use strict';
const fs = require('fs')
const XLSX = require("xlsx")
const {isString} = require("../utils/is.js")
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
            SheetNames: ['PAT_VISIT', 'PAT_SD_ITEM_RESULT'],
            Sheets: {
                'PAT_VISIT': XLSX.utils.json_to_sheet(json.sheet_PAT_VISIT),
                'PAT_SD_ITEM_RESULT': XLSX.utils.json_to_sheet(json.sheet_PAT_SD_ITEM_RESULT)
            },
            // Styles:workbook['Styles']
        };

        // 导出 Excel
        XLSX.writeFile(wb, './out/OK-'+Date.now()+'.xlsx');
        console.log('OK')
    }
    /**
     * sheet 2. 处理生成 PAT_SD_ITEM_RESULT
     * @param  {[type]} list 原来的格式
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
    generate_sheet_PAT_SD_ITEM_RESULT(list) {

        let filterList = filterKeys(list.source, 1)
        let _source = list.source
        let _list = []
        for (let i = 0; i < filterList.length; i++) {
            for (let k in filterList[i]) {
                let json = {
                    PATIENT_NO: _source[i].PATIENT_NO,
                    SD_CODE: 'YXA_O',
                    SD_ITEM_CODE: k.split("#")[1],
                    SD_ITEM_VALUE: filterList[i][k],
                }
                _list.push(json)
            }
        }

        console.info("sheet2 处理数据元字典！")
        list.sheet_PAT_SD_ITEM_RESULT = _list
        return list
    }
    /**
     * sheet 1. 获取基本信息
     * @return {[type]} [description]
     */
    generate_sheet_PAT_VISIT(data) {
        let filterList = filterKeys(data.source, 0)

        let _list = []
        for (let i = 0; i < filterList.length; i++) {
            _list.push({
                PATIENT_NO: filterList[i].PATIENT_NO, // GUID
                PATIENT_ID: filterList[i]['病案号'] || null, // 患者id
                INP_NO: filterList[i]['病案号'] || null, // 病案号
                NAME: filterList[i]['患者姓名'] || filterList[i]['病人姓名'] || null, // 患者姓名
                SEX: filterList[i]['病人性别'] || null, // 性别
                AGE: filterList[i]['病人年龄'] || null, // 年龄
                ADMISSION_DATE: filterList[i]['入院日期'] || null, // 入院日期
                DISCHARGE_DATE: filterList[i]['出院日期'] || null, // 出院日期
                OUT_STATUS: '医嘱离院', // 离院方式，默认 医嘱离院
                SD_CODE: 'YXA_O', // 默认：YXA_O
                VERSION_NUM: '1.0', // 版本号，默认 1.0
                IS_ICF: null, //
            })
        }

        console.info("sheet1 处理基本信息！")
        data.sheet_PAT_VISIT = _list
        return data
    }

    /**
     * 将表格里的数据转换为 json
     * @return {[type]} [description]
     */
    async xlsxToJson(xlsxData) {
        let insertdData = await Check.insertPATIENT_NO(xlsxData) // 插入GUID

        saveFile(JSON.stringify(insertdData, null, 2), "out/2.xlsx-source.json")

        return { source: insertdData }
    }

    /**
     * 获取表格中 sheet 的数据
     * @return {[type]} [description]
     */
    filterXlsx(xlsxFileName) {
        return new Promise((resolve, reject) => {
            const workbook = XLSX.readFile(xlsxFileName,{ cellDates: true,dateNF:'YYYY/MM/dd'}), // 获取表格数据
                sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
                worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet

            let json = XLSX.utils.sheet_to_json(worksheet,{ raw: false }) // 处理为 json 格式
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
        const filterFile = './input/胰腺癌单病种数据元2018.1-2019.4——整理.xlsx' // 过滤的文件名

        // 第一步： 过滤数据并写入表格中，以便查阅
        this.filterXlsx(filterFile)

            // 将表格数据处理后转换为json
            .then(this.xlsxToJson)

            // 处理生成 PAT_VISIT sheet
            .then(this.generate_sheet_PAT_VISIT)

            // 处理生成 PAT_SD_ITEM_RESULT sheet
            .then(this.generate_sheet_PAT_SD_ITEM_RESULT)

            // 保存表格
            .then(this.saveXlsx)
    }
}

new HandleXlsx()


/**
 * 转换时间
 */
function transformDate(date) {
    if (isString(date)) {
        return moment(date).format('YYYY/MM/DD')
    } {
        return moment(new Date(1900, 0, date)).format('YYYY/MM/DD')
    }
}

/**
 * 过滤函数
 * @param  {[type]} fileData    [description]
 * @param  {Boolean} isCode     true 有井号，false没有井号
 * @return {[type]}             [description]
 */
function filterKeys(fileData, isCode) {

    let filterKeysMaps = []

    for (let i = 0; i < fileData.length; i++) {
        let haveData = {}, // 有 井号
            existData = {} // 没有 井号

        for (let key in fileData[i]) {
            if (key.indexOf("#") > -1) {
                haveData[key] = fileData[i][key]
            } else {
                existData[key] = fileData[i][key]
            }
        }
        filterKeysMaps.push(isCode ? haveData : existData)
    }

    return filterKeysMaps
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
        });

        writerStream.on('error', function(err) {
            console.log(err.stack);
        });
    }