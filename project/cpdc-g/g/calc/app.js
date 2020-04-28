
/**
 * 计算各个医院的完整度
 * 修改最大堆栈 node --max-old-space-size=4096 app-hospital.js
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    X_utils = XLSX.utils,
    _ = require("lodash"),
    // fs = require("fs-extra"),
    ProgressBar = require('progress')

class CALC {
    constructor() {
    }

    /**
     * 初始化变量
     */
    initVariables () {
        this.OBJ_CALC = Object.create(null)
        // 释放&&清空
        this.initPatVist = Object.create(null)
        this.initPatItemResult = Object.create(null)
        this.initFollowTreat = Object.create(null)
        this.follow_total = 0
        this.followDate_num = 0
        this.followMonths_num = 0
        this.followDist = {}
        this.tableArr = []
        this.calcFuCount = 0
        this.calcPatCount = 0
        this.calcAllCount = 0
    }
    /**
     * 运行某些患者的字段完整度
     */
    runField () {
        process.title = "计算各字段完整率"
        console.time("共用时")

        const querySql = require("./querySql.js")

        sql.query(querySql).then(async retPatientNo => {
            const len = retPatientNo.length
            if (len < 1) throw "sql.query 查询结果小于 0"
            this.initVariables()
            let bar = new ProgressBar('  进度 [:bar] :current/:total :percent :etas', {
                complete: '=', // 完成
                incomplete: ' ', // 未完成
                width: 50, // 宽度
                total: len // 总数
            });

            for (let index = 0; index < len; index++) {
                const element = retPatientNo[index],
                    patNo = element.PATIENT_NO;

                await this.calcPatVist(index, patNo)
                await this.calcPatItemResult(index, patNo)

                // await this.calcPatFollowUp(index, patNo)

                await this.calcPatFollowUpTreat(index, patNo)
                await this.calcPatFollowUpResult(index, patNo)
                bar.tick();

            }
            const patList = await retPatientNo.map(item => `'${item.PATIENT_NO}'`).join()
            await this.handlePatFollowUpT(len, patList)

            await this.formatCalcData()
            // console.log(this.tableArr)
            this.saveCalcResult('王伟')
            console.timeEnd("共用时")
        })
    }
    /**
     * 运行每个医院
     */
    runEveryHospital () {
        process.title = "计算各医院完整率"
        console.time("共用时")

        const querySql = `SELECT * FROM [dbo].[HOSPITAL_DICT] WHERE HOSPITAL_NAME IN ('上海交通大学医学院附属瑞金医院',
        '哈尔滨医科大学附属第一医院',
        '海军军医大学附属长海医院',
        '上海交通大学医学院附属瑞金医院',
        '复旦大学附属华东医院',
        '复旦大学附属肿瘤医院',
        '山东大学齐鲁医院',
        '华中科技大学同济医学院附属协和医院',
        '西安交通大学第一附属医院'
        )`
        // const querySql = `SELECT * FROM [dbo].[HOSPITAL_DICT] ORDER BY HOSPITAL_CODE`

        sql.query(querySql).then(async h => {
            this.initVariables()

            const len = h.length
            for (let index = 0; index < len; index++) {
                const element = h[index],
                    hId = element.HOSPITAL_ID,
                    hName = element.HOSPITAL_NAME;
                console.info(hName, index + "/" + len)
                const retPatientNo = await sql.query(`SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE HOSPITAL_ID='${hId}' AND SD_CODE='YXA_O'`)
                await this.runEveryField(retPatientNo, hName)
                console.table(this.tableArr)
            }
            this.tableArr.push({
                '医院': '总体',
                '诊治': (this.calcPatCount / len).toFixed(2) + '%',
                '随访': (this.calcFuCount / len).toFixed(2) + '%',
                '总完整率': (this.calcAllCount / len).toFixed(2) + '%'
            })
            this.saveCalcResult("各医院完整率")
            console.timeEnd("共用时")
        })
    }
    /**
     * 运行每个患者的字段
     */
    async runEveryField (retPatientNo, hName) {
        const len = retPatientNo.length
        let bar = new ProgressBar('\t进度 [:bar] :current/:total :percent :etas', {
            complete: '=', // 完成
            incomplete: ' ', // 未完成
            width: 50, // 宽度
            total: len // 总数
        });
        if (len < 1) {
            this.tableArr.push({ '医院': hName, '诊治': 0 + '%', '随访': 0 + '%', '总完整率': 0 + '%' })
            bar.tick();
            return
        }

        for (let index = 0; index < len; index++) {
            const element = retPatientNo[index],
                patNo = element.PATIENT_NO;

            await this.calcPatVist(index, patNo)
            await this.calcPatItemResult(index, patNo)

            await this.calcPatFollowUp(index, patNo)

            await this.calcPatFollowUpTreat(index, patNo)
            await this.calcPatFollowUpResult(index, patNo)
            bar.tick();

        }
        // const patList = await retPatientNo.map(item => `'${item.PATIENT_NO}'`).join()
        // await handlePatFollowUpT(len, patList)

        this.getCalcData(hName)

    }


    /**
     * 计算 患者基本信息 --- 验证通过
     * @param {Number} index 
     * @param {String} patNo 患者id
     */
    async calcPatVist (index, patNo) {
        try {
            const retPatVist = await sql.query(`SELECT
                        PATIENT_NO,
                        PATIENT_ID AS '基本信息_住院ID',
                        INP_NO AS '基本信息_住院流水号',
                        NAME AS '基本信息_患者姓名',
                        SEX AS '基本信息_性别',
                        AGE AS '基本信息_患者年龄',
                        ADMISSION_DATE AS '基本信息_入院日期',
                        DISCHARGE_DATE AS '基本信息_出院日期',
                        OUT_STATUS AS '基本信息_离院方式'
                    FROM
                        [dbo].[PAT_VISIT]
                    WHERE
                        PATIENT_NO= '${patNo}'`),
                _firstvistData = retPatVist[0]
            // console.log(key,index,_firstvistData)

            if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query）
                const _keys = Object.keys(_firstvistData)
                for (let k = 0; k < _keys.length; k++) {
                    this.initPatVist[_keys[k] + '_total'] = 0
                    this.initPatVist[_keys[k] + '_num'] = 0
                    this.OBJ_CALC[_keys[k]] = 0
                }
            }

            _.forEach(_firstvistData, (value, key) => {
                this.initPatVist[key + '_total'] += 1
                if (value) {
                    this.initPatVist[key + '_num'] += 1
                }
                this.OBJ_CALC[key] = (this.initPatVist[key + '_num'] / this.initPatVist[key + '_total'] * 100)
            });
        } catch (err) {
            console.error('handlePatVist ERR ', err)
        }
    }

    /**
     * 初始化 数据项结果表
     * return patItemDist 数据项字典
     */
    async initItemDist () {
        try {
            // console.info('初始化 数据项结果表')

            const retPatItemDist = await sql.query(`SELECT ITEM_CODE,ITEM_NAME FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE = 'YXA_O' ORDER BY DISPLAY_ORDER+0`)

            // console.log(retItemDist)
            let patItemDist = {}
            for (let i = 0; i < retPatItemDist.length; i++) {
                const _dist = retPatItemDist[i],
                    joinKey = _dist.ITEM_NAME + "#" + _dist.ITEM_CODE
                patItemDist[joinKey + '_total'] = 0
                patItemDist[joinKey + '_num'] = 0
                this.OBJ_CALC[joinKey] = 0
            }
            return patItemDist
        } catch (err) {
            console.error('initItemDist ERR ', err)
        }
    }

    /**
     * 计算 数据项结果 --- 验证通过
     * @param {Number} index 
     * @param {String} patNo 患者id
     */
    async calcPatItemResult (index, patNo) {
        try {
            if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
                this.initPatItemResult = await this.initItemDist() // 初始化数据项结果
            }

            const retPatItemResult = await sql.query(`SELECT
                    ret.PATIENT_NO,
                    dict.ITEM_NAME,
                    dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
                    ret.SD_ITEM_VALUE
                FROM
                    [dbo].[SD_ITEM_DICT] AS dict
                    LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS ret
                        ON dict.ITEM_CODE=ret.SD_ITEM_CODE
                        AND ret.PATIENT_NO = '${patNo}'
                WHERE
                    dict.SD_CODE = 'YXA_O'
                ORDER BY
                    dict.DISPLAY_ORDER+0`),
                _lenPatItemResult = retPatItemResult.length

            // console.log(key,index,retPatItemResult)
            for (let _item = 0; _item < _lenPatItemResult; _item++) {
                const _items = retPatItemResult[_item],
                    joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE

                // console.log(_items.ITEM_NAME,_items.SD_ITEM_VALUE,_items.ITEM_PARENT_CODE)
                // console.log( needExits(retPatItemResult,_items) )
                this.initPatItemResult[joinKey + '_total'] += 1
                if (_items.SD_ITEM_VALUE || needExits(retPatItemResult, _items)) {
                    this.initPatItemResult[joinKey + '_num'] += 1
                }
                this.OBJ_CALC[joinKey] = (this.initPatItemResult[joinKey + '_num'] / this.initPatItemResult[joinKey + '_total'] * 100)
            }

        } catch (err) {
            console.error('数据项结果 ERR ', err)
        }
    }


    /**
     * 计算 随访时间和时长 ---  验证通过
     * 
     * @param {Number} index id
     * @param {String} patNo 患者id
     * @description （死亡时间或者当前时间 - 手术时间 = 应随访次数）/ 随访时间的次数
     */
    async calcPatFollowUp (index, patNo) {
        try {
            const ret = await sql.query(`SELECT
                    -- a.PATIENT_NO,
                    DATEDIFF(
                        MM,
                        CONVERT (DATE, a.SD_ITEM_VALUE ),
                        CONVERT (DATE, ISNULL(b.SD_ITEM_VALUE, GETDATE()) )
                        ) / 12  AS 'fu_counted',
                    (SELECT COUNT(PATIENT_NO) FROM [dbo].[PAT_FOLLOW_UP] WHERE PATIENT_NO= a.PATIENT_NO AND FOLLOW_UP_DATE!='') AS 'fu_date_count',
                    (SELECT COUNT(PATIENT_NO) FROM [dbo].[PAT_FOLLOW_UP] WHERE PATIENT_NO= a.PATIENT_NO AND FOLLOW_UP_MONTHS!='') AS 'fu_month_count'
                FROM
                    [dbo].[PAT_SD_ITEM_RESULT] AS a
                    LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS b ON b.SD_ITEM_CODE = 'YXA_O_257' 
                    AND b.SD_ITEM_VALUE != '' 
                    AND a.PATIENT_NO= b.PATIENT_NO 
                WHERE
                    a.SD_ITEM_CODE = 'YXA_O_161' 
                    AND a.SD_ITEM_VALUE != '' 
                    AND a.PATIENT_NO='${patNo}'`)

            // 如果 ret.length 为 0（该患者没有手术时间），无法计算应随访次 return
            if (ret.length === 0) return

            /**
             * fu_counted 应随访次数
             * fu_date_count 随访时间 个数
             * fu_month_count 随访时长 个数 
             */
            let [{ fu_counted, fu_date_count, fu_month_count }] = ret

            // 如果 fu_counted 为0 (未到随访时间),将 应随访次数(fu_counted)随访时间个数(fu_date_count)随访时长个数(fu_month_count) ，所以完整率应为 100%
            if (fu_counted == 0) fu_counted = fu_date_count = fu_month_count = 1

            // 应随访次数最大为 5 次
            if (fu_counted > 5) fu_counted = 5

            // 随访时间次数 大于 应随访次数, 将随访时间次数和随访时长次数 设为 应随访次数
            if (fu_date_count > fu_counted) fu_date_count = fu_counted, fu_month_count = fu_counted

            this.follow_total += fu_counted
            this.followDate_num += fu_date_count
            this.followMonths_num += fu_month_count
            /**
             * 待优化，（参与计算次数过多，可以只在最后一次进行计算。但是写法不够优雅）
             */
            this.OBJ_CALC['随访_随访时间'] = (this.followDate_num / this.follow_total * 100)
            this.OBJ_CALC['随访_随访时长'] = (this.followMonths_num / this.follow_total * 100)
        } catch (err) {
            console.error('handlePatFollowUp ERR ', err)
        }
    }

    /**
     * 计算 随访时间和时长 ---  验证通过
     * 
     * @param {Number} count 总人数
     * @param {String} patNo 患者id
     * @description 总人数 / 随访时间个数 = 随访时间完整率
     * @description 总人数 / 随访时长个数 = 随访时长完整率
     */
    async handlePatFollowUpT (count, patArr) {
        try {
            console.info("计算 随访时间和时长 完整率")
            const fu_date_count= await sql.query(`SELECT PATIENT_NO, MAX(FOLLOW_UP_DATE) FROM [dbo].[PAT_FOLLOW_UP] WHERE PATIENT_NO IN ( ${patArr} ) GROUP BY PATIENT_NO`) // OR add FOLLOW_UP_DATE !='1900-01-01 00:00:00.000'
            const fu_month_count= await sql.query(`SELECT PATIENT_NO, MAX(FOLLOW_UP_MONTHS) FROM [dbo].[PAT_FOLLOW_UP] WHERE PATIENT_NO IN ( ${patArr} ) AND FOLLOW_UP_MONTHS !='' GROUP BY PATIENT_NO`)
            // console.log(count,fu_date_count,fu_month_count)
            this.OBJ_CALC['随访_随访时间'] = (fu_date_count.length / count * 100)
            this.OBJ_CALC['随访_随访时长'] = (fu_month_count.length / count * 100)
        } catch (err) {
            console.error('handlePatFollowUp ERR ', err)
        }
    }

    /**
     * 计算 随访治疗信息 ---  验证通过(需要根据应随访次数计算)
     * 
     * @param {Number} index id
     * @param {String} patNo 患者id
     */
    async calcPatFollowUpTreat (index, patNo) {
        try {
            const retPatFollowUpTreat = await sql.query(`SELECT
            TREAT_NAME AS '随访_治疗方式',
            DRUG_NAME AS '随访_药品名称(通用名)',
            DRUG_NAME_TRADE AS '随访_药品名称(商品名)',
            DRUG_DOSE AS '随访_剂量',
            TREAT_CYCLE AS '随访_疗程/周期',
            TREAT_METHOD AS '随访_化疗方法',
            TREAT_EFFECT AS '随访_是否好转',
            TREAT_COST AS '随访_化疗费用',
            CA199_FRONT AS '随访_治疗前CA199',
            CEA_FRONT AS '随访_治疗前CEA',
            CA125_FRONT AS '随访_治疗前CA125',
            TREAT_EVALUTE_FRONT AS '随访_治疗前CT评价',
            CA199_AFTER AS '随访_治疗后CA199',
            CEA_AFTER AS '随访_治疗后CEA',
            CA125_AFTER AS '随访_治疗后CA125',
            TREAT_EVALUTE_AFTER AS '随访_治疗后CT评价'
		FROM
			[dbo].[PAT_FOLLOW_UP_TREAT]
		WHERE
			PATIENT_NO= '${patNo}'`),
                _followUpTreatTotal = retPatFollowUpTreat.length

            // console.log(key,index,_followUpTreatTotal)
            if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query2）
                const _keys = ['随访_治疗方式',
                    '随访_药品名称(通用名)',
                    '随访_药品名称(商品名)',
                    '随访_剂量',
                    '随访_疗程/周期',
                    '随访_化疗方法',
                    '随访_是否好转',
                    '随访_化疗费用',
                    '随访_治疗前CA199',
                    '随访_治疗前CEA',
                    '随访_治疗前CA125',
                    '随访_治疗前CT评价',
                    '随访_治疗后CA199',
                    '随访_治疗后CEA',
                    '随访_治疗后CA125',
                    '随访_治疗后CT评价']
                for (let k = 0; k < _keys.length; k++) {

                    this.initFollowTreat[_keys[k] + '_total'] = 0
                    this.initFollowTreat[_keys[k] + '_num'] = 0
                    this.OBJ_CALC[_keys[k]] = 0
                }
            }
            for (let i = 0; i < _followUpTreatTotal; i++) {
                const _items = retPatFollowUpTreat[i]
                _.forEach(_items, (value, key) => {
                    // console.log(key,value);
                    this.initFollowTreat[key + '_total'] += 1
                    if (value) {
                        this.initFollowTreat[key + '_num'] += 1
                    }
                    this.OBJ_CALC[key] = (this.initFollowTreat[key + '_num'] / this.initFollowTreat[key + '_total'] * 100)
                });
            }
        } catch (err) {
            console.error('calcPatFollowUpTreat ERR ', err)
        }
    }

    /**
     * 初始化 随访结果表
     */
    async initFollowDist () {
        try {
            // console.info('初始化 随访结果表')

            const retPatFollowDist = await sql.query(`SELECT
                    dist.ITEM_CODE,
                    dist.ITEM_NAME
                FROM
                    [dbo].[FU_SD_ITEM_DICT] AS dist
                    ORDER BY dist.DISPLAY_ORDER+0`)
            // console.log(retPatFollowDist)
            let followDist = {}
            for (let i = 0; i < retPatFollowDist.length; i++) {
                const _dist = retPatFollowDist[i],
                    joinKey = _dist.ITEM_NAME + "#" + _dist.ITEM_CODE
                followDist[joinKey + '_total'] = 0
                followDist[joinKey + '_num'] = 0
                // this.OBJ_CALC[joinKey] = 0
            }
            return followDist
        } catch (err) {
            console.error('initFollowDist ERR ', err)
        }
    }

    /**
     * 计算 随访结果表 ---  验证通过(需要根据应随访次数计算)
     * 
     * @param {Number} index id
     * @param {String} patNo 患者id
     */
    async calcPatFollowUpResult (index, patNo) {
        try {
            if (index == 0) { // 第一次，初始化（如果第一个为空，将会报错 query）
                this.followDist = await this.initFollowDist() // 初始化随访数据项结果
            }
            const retPatFollowUpResult = await sql.query(`SELECT
					dict.ITEM_CODE,
                    dict.ITEM_PARENT_CODE,
					dict.ITEM_NAME,
					result.SD_ITEM_VALUE
				FROM
					[dbo].[FU_SD_ITEM_DICT] AS dict
					LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS result
					ON dict.ITEM_CODE=result.SD_ITEM_CODE
					AND result.PATIENT_NO='${patNo}'
                    ORDER BY dict.DISPLAY_ORDER+0`)

            // console.log(retPatFollowUpResult)
            for (let i = 0; i < retPatFollowUpResult.length; i++) {
                const _items = retPatFollowUpResult[i],
                    joinKey = _items.ITEM_NAME + "#" + _items.ITEM_CODE
                // console.log(_items)
                this.followDist[joinKey + '_total'] += 1
                if (_items.SD_ITEM_VALUE || needExits(retPatFollowUpResult, _items)) {
                    this.followDist[joinKey + '_num'] += 1
                }
                this.OBJ_CALC['随访_' + joinKey] = (this.followDist[joinKey + '_num'] / this.followDist[joinKey + '_total'] * 100)
            }
        } catch (err) {
            console.error('handlePatFollowUpResult ERR ', err)
        }
    }

    /**
     * 获取计算后的数据
     * 
     * @param {String} hName 医院名称
     */
    getCalcData (hName) {
        let pat_len = 0, fu_len = 0, count_len = 0,
            pat_num = 0, fu_num = 0, count_num = 0

        for (const key in this.OBJ_CALC) {
            const value = this.OBJ_CALC[key];
            const [typeName, itemName] = key.split('_')
            if (typeName == '随访') {
                fu_len += 1
                fu_num += Number(value)
            } else {
                pat_len += 1
                pat_num += Number(value)
            }
            count_len += 1
            count_num += Number(value)
        }
        const pat_Percent = (pat_num / pat_len)
        const fu_Percent = (fu_num / fu_len)
        const count_Percent = (count_num / count_len)
        // console.log(pat_Percent,fu_Percent,count_Percent)
        this.calcFuCount += Number(fu_Percent)
        this.calcPatCount += Number(pat_Percent)
        this.calcAllCount += Number(count_Percent)
        this.tableArr.push({
            '医院': hName,
            '诊治': pat_Percent.toFixed(2) + '%',
            '随访': fu_Percent.toFixed(2) + '%',
            '总完整率': count_Percent.toFixed(2) + '%'
        })
    }

    /**
     * 格式化计算结果
     */
    async formatCalcData () {
        const allDict = await sql.query(`SELECT
                isnull( title.ITEM_TYPE_NAME, '' ) + isnull( '_' + title1.ITEM_TYPE_NAME, '' )  AS 'typeName',
                isnull( dist.ITEM_CODE, fu_dist.ITEM_CODE ) AS 'itemCode'
            FROM
                [dbo].[SD_ITEM_TYPE_DICT] AS title 
                LEFT JOIN [dbo].[SD_ITEM_TYPE_DICT] AS title1 ON title.ITEM_TYPE_CODE=title1.PARENT_TYPE_CODE AND title1.PARENT_TYPE_CODE IS NOT NULL AND title.SD_CODE='YXA_O' 
                LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE OR dist.ITEM_TYPE_CODE=title1.ITEM_TYPE_CODE AND dist.SD_CODE='YXA_O'
                LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS fu_dist ON fu_dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE
            WHERE
                title.PARENT_TYPE_CODE IS NULL 
                AND title.SD_CODE= 'YXA_O'`)
        let _num = 0
        for (const key in this.OBJ_CALC) {
            const value = this.OBJ_CALC[key];
            const itemCode = key.split('#')[1]
            if (itemCode) {
                const [cutItem] = allDict.filter(dict => dict.itemCode == itemCode)
                if (cutItem) {
                    this.tableArr.push({ '类别': cutItem.typeName, '数据项': key.replace("随访_",""), '完整率': value.toFixed(2) + '%' })
                }
            } else {
                const [typeName, itemName] = key.split('_')
                this.tableArr.push({ '类别': typeName, '数据项': itemName, '完整率': value.toFixed(2) + '%' })
            }
            _num += Number(value)
        }
        // push 总完整率
        const totalPercent = (_num / this.tableArr.length).toFixed(2) + '%'
        this.tableArr.push({ '数据项': '总完整率', '完整率': totalPercent })

    }

    // 保存计算结果
    saveCalcResult (fileName="无文件名") {
        try {
            // 创建表格
            const wb = X_utils.book_new()
            // 插入 sheet
            X_utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(this.tableArr), "完整率")
            // 保存 Excel 文件
            XLSX.writeFile(wb, './out/字段完整度_' + fileName + Date.now() + '.xlsx', { compression: true });

            console.log(fileName, '-OK ', Date.now())
        } catch (e) {
            console.error('处理表格数据出错： ', e)
        }
    }


}



/**
 * 判断是否需要计入完整度(诊治结果表 和 随访结果表都调用里这个函数)
 * @param  {[type]} data  [description]
 * @param  {[type]} items [description]
 * @return {[type]}        true 是，不参与计算 。 null 否，参与计算
 * @description 父项为 是 和 空 的参与计算，为否的不参与计算
 */
function needExits (data, items) {
    // console.log(items)
    let _exit = null
    if (items.ITEM_PARENT_CODE) {
        let parentCode = items.ITEM_PARENT_CODE.replace(/\#1$/, '')
        data.forEach(list => {
            if (list.ITEM_CODE == parentCode) {
                // console.log(list.ITEM_CODE,parentCode,items.ITEM_NAME,list.SD_ITEM_VALUE)
                _exit = (list.SD_ITEM_VALUE == '2')
            }
        })
    }
    return _exit
}


const calc = new CALC()

// calc.runEveryHospital()
calc.runField()