'use strict';

const XLSX = require("xlsx")
const moment = require('moment')
const fs = require('fs-extra')
const Check = require("./checkData.js")
const filterKeys = require("./filterKeys.js")


module.exports = class GenerateSheet {
    constructor() {

        // 储存文件内容
        this.fileData = []

    }
    
    /**
     * 保存表格
     * @param {Object } json
     */
    saveXlsx(json) {
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['PAT_VISIT', 'PAT_SD_ITEM_RESULT', 'HOSPITAL_INFO', 'PAT_DRAINAGE_TUBE', 'PAT_FOLLOW_UP',],
            Sheets: {
                'PAT_VISIT': XLSX.utils.json_to_sheet(json.sheet_PAT_VISIT),
                'PAT_SD_ITEM_RESULT': XLSX.utils.json_to_sheet(json.sheet_PAT_SD_ITEM_RESULT),
                'HOSPITAL_INFO': XLSX.utils.json_to_sheet([{
                    'HOSPITAL_CODE': null,
                    'HOSPITAL_NAME': null
                }]),
                'PAT_DRAINAGE_TUBE': XLSX.utils.json_to_sheet(json.sheet_PAT_DRAINAGE_TUBE),
                'PAT_FOLLOW_UP': XLSX.utils.json_to_sheet(json.sheet_PAT_FOLLOW_UP)

            }
            // Styles:workbook['Styles']
        }

        // 导出 Excel
        XLSX.writeFile(wb, './out/OK-' + Date.now() + '.xlsx');
        console.log('OK ', Date.now())
        process.exit()
    }
    /**
     * sheet 5. 处理生成 PAT_FOLLOW_UP  随访时间
     * @param  {[type]} tableData [description]
     * @return {[type]}           [description]
     */
    generate_sheet_PAT_FOLLOW_UP(tableData) {
        console.info("sheet5 随访日期时长！")
        let filtertableData = filterKeys(tableData.source, 3)

        tableData.sheet_PAT_FOLLOW_UP = filtertableData.map(item => {
            return {
                "SD_CODE": "YXA_O",
                "PATIENT_NO": item.PATIENT_NO || null,
                "FU_TIMES": item.FU_TIMES || null,
                "FOLLOW_UP_DATE": item.FOLLOW_UP_DATE || null,
                "FOLLOW_UP_MONTHS": item.FOLLOW_UP_MONTHS || null,
                "FU_STATUS": item.FU_STATUS || null,
                "FU_REASON": item.FU_REASON || null,
                "DISPLAY_ORDER": item.DISPLAY_ORDER || null,
            }
        })
        return tableData
    }
    /**
     * sheet 3. 处理生成 PAT_SD_ITEM_RESULT 引流管
     * @param  {[type]} tableData [description]
     * @return {[type]}           [description]
     */
    generate_sheet_PAT_DRAINAGE_TUBE(tableData) {
        console.info("sheet3 处理引流管！")
        let filtertableData = filterKeys(tableData.source, 2)

        tableData.sheet_PAT_DRAINAGE_TUBE = filtertableData.map(item => {
            return {
                "SD_CODE": "YXA_O",
                "PATIENT_NO": item.PATIENT_NO || null,
                "TUBE_NAME": item.TUBE_NAME || null,
                "RETENTION_DAYS": item.RETENTION_DAYS || null,
                "POD1": item.POD1 || null,
                "POD3": item.POD3 || null,
                "POD7": item.POD7 || null,
                "AMY_POD1": item.AMY_POD1 || null,
                "AMY_POD3": item.AMY_POD3 || null,
                "AMY_POD7": item.AMY_POD7 || null,
                "AMY_POD_DRAW": item.AMY_POD_DRAW || null,
                "CREATE_DATE_TIME": item.CREATE_DATE_TIME || null
            }
        })
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

        return {
            source: insertdData
        }

    }

    /**
     * 获取表格中 sheet 的数据
     * @return {[type]} [description]
     */
    filterXlsx(xlsxFileName) {
        return new Promise((resolve, reject) => {
            try {
                const workbook = XLSX.readFile(xlsxFileName, {
                        cellDates: true,
                        dateNF: 'YYYY-MM-dd'
                    }), // 获取表格数据
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
            } catch (e) {
                reject(e)
                console.log('filterXlsx ERR ', e)
            }
        })
    }


}