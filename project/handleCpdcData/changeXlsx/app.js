'use strict';
const fs = require('fs')
const XLSX = require("xlsx")
const { isString } = require("../utils/is.js")
const moment = require('moment')
const Check = require("./checkData.js")





class HandleXlsx {
    constructor() {

        // 储存文件内容
        this.fileData = []
        this.sheet_PAT_VISIT = null
        this.sheet_PAT_SD_ITEM_RESULT = null
        this.filterKeys = this.filterKeys

        // this.filterXlsx('瑞金胰腺癌患者补录数据_2017-2018.6——整理xlsx')
        // this.filterXlsx('胰腺癌单病种数据元2018.1-2019.4——整理.xlsx')

        this.readFilePromise("2.xlsx-source.json")
            .then(this.getbaseInfo)
            .then(this.toPattern)
            .then(this.saveXlsx)

        // .then(body => {
        //     this.saveFile(JSON.stringify(body, null, 2), "2.getbaseInfo.json")
        // })

    }
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
        XLSX.writeFile(wb, '3.toPattern.xlsx',{ cellDates: true });
    }
    /**
     * 获取基本信息，第一个 sheet 页
     * @return {[type]} [description]
     */
    getbaseInfo(data) {
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
     * 转为期望的格式
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
    toPattern(list) {

        let filterList = filterKeys(list.source, 1)
        let _source = JSON.parse(list.source)
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
            console.log(i, '/', filterList.length)
        }

        console.info("sheet2 处理数据元字典！")
        list.sheet_PAT_SD_ITEM_RESULT = _list
        return list
    }

    /**
     * 读取文件
     * @param  {String} fileName 文件名
     * @return {Buffer} fileData        文件内容
     */
    readFile(fileName = "tmp.json") {

        let _data = ""
        // 创建一个可以写入的流，写入到文件 output.txt 中
        const readerStream = fs.createReadStream(fileName);

        // 设置编码为 utf8。
        readerStream.setEncoding('UTF8');

        // 处理流事件 --> data, end, and error
        readerStream.on('data', function(chunk) {
            _data += chunk;
        });

        readerStream.on('end', function() {
            this.fileData = _data
            console.log(fileName, "读取完成。");
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
            // 创建一个可以写入的流，写入到文件 output.txt 中
            const readerStream = fs.createReadStream(fileName);

            // 设置编码为 utf8。
            readerStream.setEncoding('UTF8');

            // 处理流事件 --> data, end, and error
            readerStream.on('data', function(chunk) {
                _data += chunk;
            });

            readerStream.on('end', function() {
                this.fileData = _data
                resolve({ source: _data })
                console.log(fileName, "读取完成。");
            });

            readerStream.on('error', function(err) {
                reject(err)
                console.log(err.stack);
            });
        })
    }

    /**
     * 保存文件
     * @param  {[type]} data     文件内容
     * @param  {String} fileName 文件名
     * @return {[type]}          [description]
     */
    saveFile(data, fileName = "tmp.json") {
        // 创建一个可以写入的流，写入到文件 output.txt 中
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
    /**
     * 将表格里的数据转换为 json
     * @return {[type]} [description]
     */
    async xlsxToJson() {
        const workbook = XLSX.readFile('1.filterXlsx.xlsx',{ cellDates: true });
        // const workbook = XLSX.readFile('补录2017-2018.6——整理.xlsx');

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        const json = XLSX.utils.sheet_to_json(worksheet,{ dateNF: "YYYY/MM/DD" })
        const jsonInsertPATIENT_NO =  await Check.insertPATIENT_NO(json)

        // console.log(json)

        this.saveFile(JSON.stringify(jsonInsertPATIENT_NO, null, 2), "2.xlsx-source.json")
    }
    /**
     * 获取表格中 sheet 的数据
     * @return {[type]} [description]
     */
    filterXlsx(xlsxFileName) {
        const workbook = XLSX.readFile(xlsxFileName,{ cellDates: true, cellStyles:true });

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 处理为 json 格式
        let json = XLSX.utils.sheet_to_json(worksheet)
        const checkedJson = Check.PAT_SD_ITEM_RESULT(json)

        // 构建 workbook 对象
        let wb = {
            SheetNames: ['filterSheet'],
            Sheets: {
                'filterSheet': XLSX.utils.json_to_sheet(checkedJson)
            }
        };

        // 导出 Excel
        XLSX.writeFile(wb, '1.filterXlsx.xlsx');

        this.xlsxToJson()
    }
}

new HandleXlsx()
// let handleXlsx = new HandleXlsx()
// handleXlsx.get_PAT_SD_ITEM_RESULT()

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
 * @param  {[type]} fileData [description]
 * @param  {Boolean} isCode true 有井号，false没有井号
 * @return {[type]}          [description]
 */
function filterKeys(fileData, isCode) {

    let _fileData = JSON.parse(fileData),
        filterKeysMaps = []

    for (let i = 0; i < _fileData.length; i++) {
        let haveData = {}, // 有 井号
            existData = {} // 没有 井号

        for (let key in _fileData[i]) {
            if (key.indexOf("#") > -1) {
                haveData[key] = _fileData[i][key]
            } else {
                existData[key] = _fileData[i][key]
            }
        }
        filterKeysMaps.push(isCode ? haveData : existData)
    }

    return filterKeysMaps
}

// module.exports = HandleXlsx