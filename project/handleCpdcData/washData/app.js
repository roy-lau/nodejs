/*
	清洗数据
 */

'use strict';
const sql = require('mssql'),
    config = require("../config.js"),
    _ = require("lodash")


/**
 * 清洗数据
 */

// 清洗 胰肠吻合方式#YXA_O_159
async function wash_YCWHFS() {
    console.info('清洗 胰肠吻合方式#YXA_O_159')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_159'`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_value = element.SD_ITEM_VALUE

            let ret = ''
			// 1:胰肠吻合；2:套入式吻合；3:端端吻合；4:端侧吻合；5:端端套入式吻合；6:端端捆绑式吻合；7:端侧套入式吻合；8:端侧导管对黏膜吻合；9:侧侧吻合；10:其它
			if(/胰肠吻合/.test(_value)) ret+='1#'
			if(/套入式吻合/.test(_value)) ret+='2#'
			if(/端端吻合/.test(_value)) ret+='3#'
			if(/端侧吻合/.test(_value)) ret+='4#'
			if(/端端套入式吻合/.test(_value)) ret+='5#'
			if(/端端捆绑式吻合/.test(_value)) ret+='6#'
			if(/端侧套入式吻合/.test(_value)) ret+='7#'
			if(/端侧导管对黏膜吻合|胰管空肠黏膜对黏膜|黏膜吻合|D-M吻合/.test(_value)) ret+='8#'
			if(/侧侧吻合/.test(_value)) ret+='9#'

            if (!ret) {
            	ret+='10#'
            	// console.log(_value)
            }

            console.log(delLastHashtag(ret),_value)
            // console.log(element.PATIENT_NO)
            // await pool.query `UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE=${delLastHashtag(ret)} WHERE PATIENT_NO=${element.PATIENT_NO} AND SD_ITEM_CODE='YXA_O_159'`

        }

    } catch (err) {
        console.error('清洗 胰肠吻合方式#YXA_O_159 ERR ', err)
    }
}

// 清洗 其他既往史#YXA_O_024
async function wash_QTJWS() {
    console.info('清洗 其他既往史#YXA_O_024')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_024'`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_value = element.SD_ITEM_VALUE

			// 1:高血压、2:高血脂、3:糖尿病、4:脑梗、5:胆囊结石、6:冠心病、7:心律失常、8:心脏瓣膜病、9:其它、10:无
            let ret = ''
			if(/高血压/.test(_value)) ret+='1#'
			if(/高血脂|高脂血症/.test(_value)) ret+='2#'
			if(/糖尿病/.test(_value)) ret+='3#'
			if(/脑梗/.test(_value)) ret+='4#'
			if(/胆囊结石|胆结石|LC|胆囊切除术后|胆切术后/.test(_value)) ret+='5#'
			if(/冠心病|冠脉支架术后|心脏支架植入术|PCI术后|CABG术后|心梗|心脏搭桥|冠状动脉搭桥|心肌缺血/.test(_value)) ret+='6#'
			if(/心律失常|房颤|室性早搏/.test(_value)) ret+='7#'
			if(/心脏瓣膜病/.test(_value)) ret+='8#'
			if(/-|\/|无/.test(_value)) ret+='10#'

            if (!ret) {
            	ret+='9#'
            	// console.log(_value)
            }

            console.log(delLastHashtag(ret),_value)
            // console.log(element.PATIENT_NO)
            // await pool.query `UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE=${delLastHashtag(ret)} WHERE PATIENT_NO=${element.PATIENT_NO} AND SD_ITEM_CODE='YXA_O_024'`

        }

    } catch (err) {
        console.error('清洗 其他既往史#YXA_O_024 ERR ', err)
    }
}

// 清洗 其他并发症#YXA_O_195
async function wash_QTBFZ() {
    console.info('清洗 其他并发症#YXA_O_195')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_195'`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_value = element.SD_ITEM_VALUE

			// 1：胸腹腔积液；2：肠瘘；3：肾衰；4：淋巴瘘；5：脑梗；6：导管相关感染；7：静脉血栓；8：切口愈合不良；9：腹泻；10：假性动脉瘤；11：无
			/*
			“胸腹腔积液”对应：腹水、胸腔积液、腹腔积液；
			“肠瘘”对应：小肠穿孔、空肠肠袢漏、吻合口瘘、消化道瘘；
			“肾衰”对应：急性肾损伤；
			“淋巴瘘”对应：乳糜漏、脑梗、导管相关感染、
			“静脉血栓”对应：下肢肌间静脉血栓；
			“切口愈合不良”对应切口裂开
			 */
            let ret = ''
			if(/胸腹腔积液|腹水|胸腔积液|腹腔积液/.test(_value)) ret+='1#'
			if(/肠瘘|小肠穿孔|空肠肠袢漏|吻合口瘘|消化道瘘/.test(_value)) ret+='2#'
			if(/肾衰|急性肾损伤/.test(_value)) ret+='3#'
			if(/淋巴瘘|乳糜漏|脑梗|导管相关感染/.test(_value)) ret+='4#'
			if(/脑梗/.test(_value)) ret+='5#'
			if(/导管相关感染/.test(_value)) ret+='6#'
			if(/静脉血栓|下肢肌间静脉血栓/.test(_value)) ret+='7#'
			if(/切口愈合不良|切口裂开/.test(_value)) ret+='8#'
			if(/腹泻/.test(_value)) ret+='9#'
			if(/假性动脉瘤/.test(_value)) ret+='10#'

            if (!ret) {
            	ret+='11#'
            	// console.log(_value)
            }

            console.log(delLastHashtag(ret),_value)
            // console.log(element.PATIENT_NO)
            // await pool.query `UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE=${delLastHashtag(ret)} WHERE PATIENT_NO=${element.PATIENT_NO} AND SD_ITEM_CODE='YXA_O_195'`

        }

    } catch (err) {
        console.error('清洗 其他并发症#YXA_O_195 ERR ', err)
    }
}

// 清洗 其他后续计划治疗方案#YXA_O_314
async function wash_QTHXZLFA() {
    console.info('清洗 其他后续计划治疗方案#YXA_O_314')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_314'`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_value = element.SD_ITEM_VALUE

			// 1：二次手术；2：化疗；3：放疗；4：中药治疗；5:离子植入；6:射频治疗；7:姑息治疗；8:未治疗仅随访
            let ret = ''
			if(/二次手术/.test(_value)) ret+='1#'
			if(/化疗/.test(_value)) ret+='2#'
			if(/放疗/.test(_value)) ret+='3#'
			if(/中药/.test(_value)) ret+='4#'
			if(/离子植入|粒子置入/.test(_value)) ret+='5#'
			if(/射频治疗/.test(_value)) ret+='6#'
			if(/姑息治疗/.test(_value)) ret+='7#'

            if (!ret) {
            	ret+='8#'
            	// console.log(_value)
            }

            console.log(delLastHashtag(ret),_value)
            // console.log(element.PATIENT_NO)
            // await pool.query `UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE=${delLastHashtag(ret)} WHERE PATIENT_NO=${element.PATIENT_NO} AND SD_ITEM_CODE='YXA_O_314'`

        }

    } catch (err) {
        console.error('清洗 其他后续计划治疗方案#YXA_O_314 ERR ', err)
    }
}

// --- 下面是随访相关字段
//
// 清洗 死亡原因#YXA_O_258
async function wash_SWYY() {
    console.info('清洗 死亡原因#YXA_O_258')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT * FROM [dbo].[PAT_FOLLOW_UP_RESULT] WHERE SD_ITEM_CODE='YXA_O_258'`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_value = element.SD_ITEM_VALUE

			// 1:肿瘤复发转移；2:多器官功能衰竭；3:出血；4:心脑血管疾病；5:意外；6:不详
			/*
				“肿瘤复发转移”对应：病情进展；
				“多器官功能衰竭”对应：MODS、肺部感染、肝衰竭、呼吸衰竭；
				“出血”对应：消化道出血、胰瘘出血、腹腔出血；
				“心脑血管疾病”对应：脑梗、心梗、脑出血；
			 */
            let ret = ''
			if(/肿瘤|复发|转移|病情进展/.test(_value)) ret+='1#'
			if(/多器官功能衰竭|多衰|MODS|肺部感染|肝衰竭|呼吸衰竭/.test(_value)) ret+='2#'
			if(/出血|消化道出血|胰瘘出血|腹腔出血/.test(_value)) ret+='3#'
			if(/心脑血管疾病|脑梗|心梗|脑出血/.test(_value)) ret+='4#'
			if(/意外|车祸|火灾/.test(_value)) ret+='5#'
			if(/不祥|不知|未知/.test(_value)) ret+='6#'

            if (!ret) {
            	ret += '8#'
            	// console.log(_value)
            }

            console.log(delLastHashtag(ret),_value)
            // console.log(element.PATIENT_NO)
            // await pool.query `UPDATE [dbo].[PAT_FOLLOW_UP_RESULT]  SET SD_ITEM_VALUE=${delLastHashtag(ret)} WHERE PATIENT_NO=${element.PATIENT_NO} AND SD_ITEM_CODE='YXA_O_258'`

        }

    } catch (err) {
        console.error('清洗 死亡原因#YXA_O_258 ERR ', err)
    }
}

// 清洗 治疗前CT评价 AND 治疗后CT评价
async function wash_fu_ct() {
    console.info('清洗 治疗前CT评价 AND 治疗后CT评价')
    try {
        const pool = await new sql.ConnectionPool(config.db_addr).connect();

        const lists = await pool.query `SELECT FU_TIMES,TREAT_EVALUTE_FRONT,TREAT_EVALUTE_AFTER FROM [dbo].[PAT_FOLLOW_UP_TREAT]`,
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
            	_ct_front = element.TREAT_EVALUTE_FRONT, // 治疗前CT评价
            	_ct_after = element.TREAT_EVALUTE_AFTER // 治疗后CT评价


            let ret_ct_front = '', ret_ct_after=''
            // 1:无复发转移；2:复发转移；
            /*
				“无复发转移”对应：未见明显异常、术后无改变、较前无明显变化；
				“复发转移”对应：肝转移、考虑转移、转移瘤较前增大、转移可能、局部复发、考虑复发。
             */
			if(/无复发转移|无转移复发|未见复发|未见转移|未见明显异常|术后无改变|较前无明显变化|无复发|无转移|无异常|未见异常|无特殊|稳定/.test(_ct_front)){
				ret_ct_front='无复发转移'
			}else if(/复发转移|肝转移|淋巴结转移|考虑转移|转移瘤较前增大|转移可能|局部复发|考虑复发/.test(_ct_front)){
				ret_ct_front='复发转移'
			}

			if (!ret_ct_front) {
	            await pool.query `UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_FRONT=NULL WHERE FU_TIMES=${element.FU_TIMES}`
			}else{
	            await pool.query `UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_FRONT=${ret_ct_front} WHERE FU_TIMES=${element.FU_TIMES}`
			}
			// 1:无复发转移；2:病情进展；
			/*
				“无复发转移”对应：未见复发转移征象、好转、未见复发、较前变化不大、无复发、无进展、未见明显异常；
				“病情进展”对应：肝转移、病灶增大、怀疑复发、肿瘤进展、肿瘤复发转移、肿瘤复发可能、考虑转移可能性大
			 */
			if(/无复发转移|无转移复发|未见复发|未见转移|未见复发转移征象|好转|较前变化不大|无进展|未见明显异常|无复发|无转移|无异常|未见异常|无特殊|稳定/.test(_ct_after)){
				ret_ct_after='无复发转移'
			}else if(/病情进展|肝转移|病灶增大|怀疑复发|肿瘤进展|肿瘤复发转移|肿瘤复发可能|考虑转移可能性大/.test(_ct_after)){
				ret_ct_after='病情进展'
			}

			if (!ret_ct_after) {
	            await pool.query `UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_AFTER=NULL WHERE FU_TIMES=${element.FU_TIMES}`
			}else{
	            await pool.query `UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_AFTER=${ret_ct_after} WHERE FU_TIMES=${element.FU_TIMES}`
			}
        }

    } catch (err) {
        console.error('清洗 治疗前CT评价 AND 治疗后CT评价 ERR ', err)
    }
    console.log('搞定')
}

/**
 * 工具函数
 */

/**
 * 删除末尾的井号
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function delLastHashtag(str){
	return str.replace(/#$/,'')
}


async function run(){
	// 清洗 其他既往史#YXA_O_024
	// await wash_QTJWS() // ok
	// 清洗 胰肠吻合方式#YXA_O_159
	// await wash_YCWHFS() // ok
	// 清洗 其他并发症#YXA_O_195
	// await wash_QTBFZ() // ok
	// 清洗 其他后续计划治疗方案#YXA_O_314
	// await wash_QTHXZLFA() // ok
	// 清洗 死亡原因#YXA_O_258
	// await wash_SWYY() // ok
	// 清洗随访 ct
	await wash_fu_ct()
}

run()