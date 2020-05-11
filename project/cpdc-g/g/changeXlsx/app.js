'use strict';
const path = require('path'),
    sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    X_utils = XLSX.utils,
    fs = require('fs-extra'),
    ProgressBar = require('progress'),
    uuid = require("uuid");

const filePath = path.join(__dirname, './input/2019年01月-4月(5月11).xlsx')

class PatternData {
    constructor(filePath) {
        this.itemDict
        this.itemCvDict
        this.dowDict()

        // 创建表格
        this.wb = X_utils.book_new()

        this.readXlsx(filePath)

        // 保存 Excel 文件
    }

    /**
     * 读取表格
     * 
     * @param {String} xlsxFileName 文件名
     */
    readXlsx (xlsxFileName) {
        const workbook = XLSX.readFile(xlsxFileName, {
            cellDates: true,
            dateNF: 'YYYY-MM-dd'
        }), // 获取表格数据
            sheetNames = workbook.SheetNames, // 获取表格里的每个 sheet
            worksheet = workbook.Sheets[sheetNames[0]]; // 获取第一个 sheet
        let json = X_utils.sheet_to_json(worksheet, { raw: false }) // 处理为 json 格式
        // 添加患者 id
        this.splitTableTitle(json)

    }
    /**
     * 根据表头拆分数据
     * @param {Array} lists 表格 json 数组
     */
    async splitTableTitle (lists) {
        // fs.writeJsonSync('table.json', lists)
        // const Bar = new ProgressBar('  进度 [:bar] :current/:total :percent :etas', {
        //     complete: '=', // 完成
        //     incomplete: ' ', // 未完成
        //     width: 50, // 宽度
        //     total: lists.length // 总数
        // });
        let patVistArr = [],
            patItemArr = [],
            draingaeTubeArr = [{}],
            followUpArr = [{}]
        for (let i = 0; i < lists.length; i++) {
            const items = lists[i]
            await this.addPatNo(items)

            patVistArr.push(
                this.generatePatVist(items)
            )

            for (let title in items) {
                /**
                 * 诊治 和 引流管
                 */
                if (title.indexOf("#") > -1) {
                    const keys = title.split('#'),
                        len = keys.length,
                        titleName = keys[0], // 表头 name （对应数据项名称）
                        titleCode = keys[1] // 表头 code （对应数据项code）
                    let cellData = items[title] // 单元格数据
                    if (!cellData) continue
                    /**
                     * 一个 # 号（诊治）
                     */
                    if (len === 2) {
                        cellData = this.compareDict(cellData, titleCode, titleName)
                        patItemArr.push({
                            PATIENT_NO: items.PATIENT_NO,
                            SD_CODE: 'YXA_O',
                            SD_ITEM_CODE: titleCode,
                            SD_ITEM_VALUE: cellData,
                        })

                    } else if (len === 3) { // 两个 # 号(引流管)
                        // 表头ID（只有引流管有）
                        const titleId = keys[2]
                        draingaeTubeArr = this.generateDraingaeTube(items, cellData, titleCode, titleId)
                    }

                } else if (title.indexOf("@") > -1) { // 随访相关
                    const keys = title.split('@'),
                        len = keys.length,
                        titleName = keys[0], // 表头 name （对应数据项名称）
                        titleCode = keys[1], // 表头 code （对应数据项code）
                        titleId = keys[2] // 表头ID
                    let cellData = items[title] // 单元格数据
                    followUpArr = this.generatFollowUp(items, cellData, titleCode, titleId)

                } else { // 没有 井号 (基本信息和特殊情况)

                }
            }
            // Bar.tick()
        }
        // 插入 sheet
        X_utils.book_append_sheet(this.wb, XLSX.utils.json_to_sheet(patVistArr), "PAT_VISIT")
        X_utils.book_append_sheet(this.wb, XLSX.utils.json_to_sheet(patItemArr), "PAT_SD_ITEM_RESULT")
        X_utils.book_append_sheet(this.wb, XLSX.utils.json_to_sheet([{
            'HOSPITAL_CODE': '',
            'HOSPITAL_NAME': ''
        }]), "HOSPITAL_INFO")
        X_utils.book_append_sheet(this.wb, XLSX.utils.json_to_sheet(this.endDraingaeTubeSheet(draingaeTubeArr)), "PAT_DRAINAGE_TUBE")
        X_utils.book_append_sheet(this.wb, XLSX.utils.json_to_sheet(this.endFollowUp(followUpArr)), "PAT_FOLLOW_UP")

        // 保存表格
        XLSX.writeFile(this.wb, path.join(__dirname, './out/OK_' + Date.now() + '.xlsx'), { compression: true });
    }

    /**
     * 增加 PATIENT_NO
     * @param {Object} json 表格的 json 数据
     * @description 先通过表格里的 病案号 到数据库里查找 PATIENT_NO
     *              如果没有查到 PATIENT_NO，通过 uuid.v4() 生成一个
     */
    async addPatNo (item) {
        try {
            if(item.PATIENT_NO) return // 如果已经有 PATIENT_NO，万事皆休

            let patId = item['病案号'] || item['患者ID']
            if (!patId) {
                console.error("病案号为空，无法辨别如何增加 PATIENT_NO");
                return;
            }

            const list = await sql.query(`SELECT * FROM [dbo].[PAT_VISIT] WHERE PATIENT_ID='${patId}' AND SD_CODE='YXA_O'`)
            if (list.length>0) { // PATIENT_NO 能从数据库中查到（修改）
                item.PATIENT_NO = list[0].PATIENT_NO
            } else {// PATIENT_NO 不能从数据库中查到（新增）
                let _uuid4 = uuid.v4().replace(/-/g, '')
                item.PATIENT_NO = _uuid4.substr(5, 16)
            }

        } catch (err) {
            console.error('插入 PATIENT_NO ERR: ', err)
        }
    }

    /**
     * 生成基本信息表的格式
     * 
     * @param {Object} item 基本信息的json
     * @returns {Object} 
     */
    generatePatVist (item) {
        return {
            PATIENT_NO: item.PATIENT_NO, // GUID
            PATIENT_ID: item['病案号'] || item['患者ID'] || null, // 患者id
            INP_NO: item['住院号'] || item['病案号'] || null, // 病案号
            NAME: item['患者姓名'] || item['病人姓名'] || item['姓名'] || null, // 患者姓名
            SEX: item['病人性别'] || item['性别'] || null, // 性别
            AGE: item['病人年龄'] || item['年龄'] || null, // 年龄
            ADMISSION_DATE: item['入院日期'] || null, // 入院日期
            DISCHARGE_DATE: item['出院日期'] || null, // 出院日期
            OUT_STATUS: item['离院方式'] || '医嘱离院', // 离院方式，默认 医嘱离院
            SD_CODE: 'YXA_O', // 默认：YXA_O
            VERSION_NUM: '1.0', // 版本号，默认 1.0
            IS_ICF: '1', // 患者知情同意书
        }
    }


    /**
     * 对比字典
     * 
     * @description 通过对比字典修改单元格的值
     * @todo 还有其他几个类型可以优化处理
     * 
     * @param {any} cellData 单元格数据
     * @param {String} titleCode 表头code
     * @param {String} titleName 表头name
     * 
     */
    compareDict (cellData, titleCode, titleName) {
        let curItem = this.itemDict.find(dict => dict.ITEM_CODE == titleCode)
        if (!curItem) {
            console.log("字典表中未找到此Code: ", titleCode)
            return
        }
        /**
             ITEM_RESULT_FORM 1 数值
             ITEM_RESULT_FORM 2 字符串
             ITEM_RESULT_FORM 3 日期
             ITEM_RESULT_FORM 4 日期时间
             ITEM_RESULT_FORM 5 单选
             ITEM_RESULT_FORM 6 多选 
         */
        if (curItem.ITEM_FORMAT === '1' && typeof Number(cellData) !== 'number') {

            console.info(titleName, curItem.ITEM_CV_CODE, titleCode, '的', cellData, '应为数值')

        } else if (curItem.ITEM_FORMAT === '5' || curItem.ITEM_FORMAT === '6') {
            const curCvItem = this.itemCvDict.filter(cvDict => cvDict.CV_CODE == curItem.ITEM_CV_CODE)
            const curCell = curCvItem.find(cv => cv.CV_VALUE == cellData || cv.CV_VALUE_TEXT == cellData)

            if (curCell) {
                cellData = curCell.CV_VALUE
            } else {
                console.info(curItem.ITEM_FORMAT === '5' ? '单选：' : "多选（暂不处理）：", cellData, '不在', titleName, curItem.ITEM_CV_CODE, titleCode, '中')
                return // 注释掉这个 return 可以写入单选多选字典中不存在的值
            }
        }
        return cellData
    }

    tube_tmpArr = []
    tube_tmpObj = {}
    tube_objArr = []
    /**
     * 生成引流管数据
     * @param {Object} source       源数据
     * @param {Any}    cellData     单元格数据
     * @param {String} titleCode    表头code
     * @param {String} titleId      表头id
     * @return {Array}  返回展开后的引流管数组
     */
    generateDraingaeTube (source, cellData, titleCode, titleId) {
        if (this.tube_tmpArr.indexOf(titleId) > -1) {
            this.tube_tmpObj[titleCode] = cellData
        } else {
            this.tube_tmpArr = []
            this.tube_tmpObj = {}
            this.tube_tmpObj.PATIENT_NO = source.PATIENT_NO
            this.tube_tmpObj[titleCode] = cellData
            this.tube_objArr.push(this.tube_tmpObj)

            this.tube_tmpArr.push(titleId)
        }
        return this.tube_objArr

    }
    /**
     * 整合引流管数据(只在最后一次触发)
     * @param  {[type]} tableData [description]
     * @return {[type]}           [description]
     */
    endDraingaeTubeSheet (draingaeTubeSheet) {
        const data = draingaeTubeSheet.map(item => {
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
        return data
    }

    fu_tmpArr = []
    fu_tmpObj = {}
    fu_objArr = []
    /**
     * 生成引流管数据
     * @param {Object} source       源数据
     * @param {Any}    cellData     单元格数据
     * @param {String} titleCode    表头code
     * @param {String} titleId      表头id
     * @return {Array}  返回展开后的引流管数组
     */
    generatFollowUp (source, cellData, titleCode, titleId) {
        if (this.fu_tmpArr.indexOf(titleId) > -1) {
            this.fu_tmpObj[titleCode] = cellData
        } else {
            this.fu_tmpArr = []
            this.fu_tmpObj = {}
            this.fu_tmpObj.PATIENT_NO = source.PATIENT_NO
            this.fu_tmpObj[titleCode] = cellData
            this.fu_objArr.push(this.fu_tmpObj)

            this.fu_tmpArr.push(titleId)
        }
        return this.fu_objArr
    }

    /**
     * 整合随访时间数据(只在最后一次触发)
     * @param  {[type]} tableData [description]
     * @return {[type]}           [description]
     */
    endFollowUp (followUpSheet) {
        const data = followUpSheet.map(item => {
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
        return data
    }

    // 下载字典 (在没有字典的情况下需优化)
    dowDict () {
        if (fs.existsSync('./data/sd_item_dict.json') && fs.existsSync('./data/sd_item_cv_dict.json')) {
            this.itemDict = require("./data/sd_item_dict.json")
            this.itemCvDict = require("./data/sd_item_cv_dict.json")
            return
        }

        console.log("下载字典……")
        sql.query(`SELECT ITEM_CODE,ITEM_NAME,ITEM_CV_CODE,ITEM_FORMAT,ITEM_UNIT FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE!='YXA'`)
            .then(dict => {
                fs.writeJsonSync('./data/sd_item_dict.json', dict)
            }).catch(err => {
                console.error("查询数据项字典失败: " + err)
            })

        sql.query(`SELECT * FROM [dbo].[SD_ITEM_CV_DICT] WHERE SD_CODE!='YXA'`)
            .then(cv_dict => {
                fs.writeJsonSync('./data/sd_item_cv_dict.json', cv_dict) // or JSON.stringify(cv_dict, null, 2)
            }).catch(err => {
                console.error("查询数据项字典失败: " + err)
            })
    }

}
// 获取实例
function getInstance (filePath) {
    // 单例模式，避免多次 new
    let instance
    if (!instance) {
        instance = new PatternData(filePath);
    }
    return instance
}
getInstance(filePath)
