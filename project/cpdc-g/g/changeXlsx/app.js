'use strict';

const path = require('path')
const GenerateSheet = require('./libs/generateSheet.js')


// const filterFile = path.join(__dirname, './input/demo.xlsx')
const filterFile = path.join(__dirname, './input/胰腺癌单病种数据元2020.1-3——整理.xlsx')
const generateSheet = new GenerateSheet()


// 第一步： 过滤数据并写入表格中，以便查阅
generateSheet
    .filterXlsx(filterFile)

    // 将表格数据处理后转换为json
    .then(generateSheet.xlsxToJson)

    // 处理生成 PAT_VISIT sheet 患者基本信息
    .then(generateSheet.generate_sheet_PAT_VISIT)

    // 处理生成 PAT_SD_ITEM_RESULT sheet 数据项结果
    .then(generateSheet.generate_sheet_PAT_SD_ITEM_RESULT)

    // 处理生成 PAT_DRAINAGE_TUBE sheet 引流管
    .then(generateSheet.generate_sheet_PAT_DRAINAGE_TUBE)

    // 处理生成 PAT_FOLLOW_UP sheet 随访时间
    .then(generateSheet.generate_sheet_PAT_FOLLOW_UP)

    // 保存表格
    .then(generateSheet.saveXlsx)
