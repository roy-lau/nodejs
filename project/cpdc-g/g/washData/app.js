/*
	清洗数据
 */

'use strict';

const sql = require('../dbs/sqlServer-t.js'),
 _ = require("lodash")



// 清洗 胰肠吻合方式#YXA_O_159 --OK
async function wash_YCWHFS () {
    console.info('清洗 胰肠吻合方式#YXA_O_159')
    try {
        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_159'`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            let ret = ''
            // 1:胰肠吻合；2:套入式吻合；3:端端吻合；4:端侧吻合；5:端端套入式吻合；6:端端捆绑式吻合；7:端侧套入式吻合；8:端侧导管对黏膜吻合；9:侧侧吻合；10:其它
            if (/胰肠吻合/.test(_value)) ret += '1#'
            if (/套入式吻合/.test(_value)) ret += '2#'
            if (/端端吻合/.test(_value)) ret += '3#'
            if (/端侧吻合/.test(_value)) ret += '4#'
            if (/端端套入式吻合/.test(_value)) ret += '5#'
            if (/端端捆绑式吻合/.test(_value)) ret += '6#'
            if (/端侧套入式吻合/.test(_value)) ret += '7#'
            if (/黏膜|D-M/i.test(_value)) ret += '8#'
            if (/侧侧吻合/.test(_value)) ret += '9#'

            if (!ret) {
                ret += '10#'
                console.log(delHashtag(ret), _value)
            }

            // console.log(element.PATIENT_NO)
            // await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='YXA_O_159'`)

        }

    } catch (err) {
        console.error('清洗 胰肠吻合方式#YXA_O_159 ERR ', err)
    }
}

// 清洗 其他既往史#YXA_O_024
async function wash_QTJWS () {
    console.info('清洗 其他既往史#YXA_O_024')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_024'`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            // 1:高血压、2:高血脂、3:糖尿病、4:脑梗、5:胆囊结石、6:冠心病、7:心律失常、8:心脏瓣膜病、9:其它、10:无
            /*
	            “高血脂”对应：高脂血症；
				“胆囊结石”对应：胆结石、LC、LC术后、胆囊切除术后、胆切术后；
				“冠心病”对应：冠脉支架术后、心脏支架植入术、PCI术后、CABG术后、心梗、心脏搭桥、冠状动脉搭桥、心肌缺血；
				“心律失常”对应：房颤、室性早搏。
             */
            let ret = ''
            if (/高血压/.test(_value)) ret += '1#'
            if (/高血脂|高脂血症/.test(_value)) ret += '2#'
            if (/糖尿病/.test(_value)) ret += '3#'
            if (/脑梗/.test(_value)) ret += '4#'
            if (/胆囊结石|胆结石|LC|胆囊切除术后|胆切术后/.test(_value)) ret += '5#'
            if (/冠心病|冠脉支架术后|心脏支架植入术|PCI术后|CABG术后|心梗|心脏搭桥|冠状动脉搭桥|心肌缺血/.test(_value)) ret += '6#'
            if (/心律失常|房颤|室性早搏/.test(_value)) ret += '7#'
            if (/心脏瓣膜病/.test(_value)) ret += '8#'
            if (/-|\/|无/.test(_value) && _value) ret += '10#'

            if (!ret) {
                ret += '9#'
            }
            // console.log(delHashtag(ret), _value)

            // console.log(element.PATIENT_NO)
            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='YXA_O_024'`)

        }

    } catch (err) {
        console.error('清洗 其他既往史#YXA_O_024 ERR ', err)
    }
}

// 清洗 其他并发症#YXA_O_195
async function wash_QTBFZ () {
    console.info('清洗 其他并发症#YXA_O_195')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_195'`)

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
            if (/腹水|积液/.test(_value)) ret += '1#'
            if (/肠瘘|小肠穿孔|空肠肠袢漏|吻合口瘘|消化道瘘/.test(_value)) ret += '2#'
            if (/肾衰|急性肾损伤/.test(_value)) ret += '3#'
            if (/淋巴瘘|乳糜漏/.test(_value)) ret += '4#'
            if (/脑梗/.test(_value)) ret += '5#'
            if (/导管相关感染/.test(_value)) ret += '6#'
            if (/静脉血栓/.test(_value)) ret += '7#'
            if (/切口/.test(_value)) ret += '8#'
            if (/腹泻/.test(_value)) ret += '9#'
            if (/假性动脉瘤/.test(_value)) ret += '10#'

            if (!ret) {
                ret += '11#'
                // console.log(_value)
            }

            // console.log(delHashtag(ret), _value)

            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='YXA_O_195'`)

        }

    } catch (err) {
        console.error('清洗 其他并发症#YXA_O_195 ERR ', err)
    }
}

// 清洗 其他后续计划治疗方案#YXA_O_314
async function wash_QTHXZLFA () {
    console.info('清洗 其他后续计划治疗方案#YXA_O_314')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_314'`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            // 1：二次手术；2：化疗；3：放疗；4：中药治疗；5:离子植入；6:射频治疗；7:姑息治疗；8:未治疗仅随访
            let ret = ''
            if (/二次手术/.test(_value)) ret += '1#'
            if (/化疗/.test(_value)) ret += '2#'
            if (/放疗/.test(_value)) ret += '3#'
            if (/中药|中医/.test(_value)) ret += '4#'
            if (/离子|植入|粒子|置入/.test(_value)) ret += '5#'
            if (/射频/.test(_value)) ret += '6#'
            if (/姑息/.test(_value)) ret += '7#'

            if (!ret) {
                ret += '8#'
            }

            // console.log(delHashtag(ret), _value)
            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='YXA_O_314'`)

        }

    } catch (err) {
        console.error('清洗 其他后续计划治疗方案#YXA_O_314 ERR ', err)
    }
}

// 清洗 术前化疗药物剂量#YXA_O_119 && 其他后续计划治疗药物剂量#YXA_O_303 && 是否更改治疗方案药物剂量 #YXA_O_136
async function wash_DRUG_DOSE () {
    console.info('清洗 术前化疗药物剂量#YXA_O_119 && 其他后续计划治疗药物剂量#YXA_O_303 && 是否更改治疗方案药物剂量 #YXA_O_136')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE IN ('YXA_O_119','YXA_O_303','YXA_O_136')`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            let ret = ''
            if (_value) {
                if (Number.isNaN(Number(_value))) {
                    let _arr = _value.match(/\d{1,5}mg|\d{1,5}g|\d{1,5}.\d{1,5}g/ig)
                    ret = _arr && _arr.join('+')
                    // console.log(_value)
                } else {
                    if (Number(_value) >= 1000) {
                        ret = _value + 'mg'
                    } else if (Number(_value) < 1000) {
                        ret = _value + 'g'
                    }
                }
                if (ret !== null) {
                    // console.log(ret)
                    await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${ret}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
                } else {
                    await sql.query(`DELETE [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
                }
            }


        }

    } catch (err) {
        console.error('清洗 术前化疗药物剂量#YXA_O_119 && 其他后续计划治疗药物剂量#YXA_O_303 && 是否更改治疗方案药物剂量 #YXA_O_136 ERR ', err)
    }
}


// --- 下面是随访相关字段
//
// 清洗 死亡原因#YXA_O_258
async function wash_SWYY () {
    console.info('清洗 死亡原因#YXA_O_258')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_FOLLOW_UP_RESULT] WHERE SD_ITEM_CODE='YXA_O_258'`)

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
            if (/复发|转移|病情进展/.test(_value)) ret += '1#'
            if (/多衰|MODS|肺部感染|衰竭/.test(_value)) ret += '2#'
            if (/出血|消化道出血|胰瘘出血|腹腔出血/.test(_value)) ret += '3#'
            if (/心脑血管疾病|脑梗|心梗|脑出血/.test(_value)) ret += '4#'
            if (/意外|祸|灾/.test(_value)) ret += '5#'

            if (!ret) {
                ret += '6#'
                // console.log(_value)
            }

            // console.log(delHashtag(ret), _value)

            await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='YXA_O_258'`)

        }

    } catch (err) {
        console.error('清洗 死亡原因#YXA_O_258 ERR ', err)
    }
}

// 清洗 治疗前CT评价 AND 治疗后CT评价
async function washFuByCT () {
    console.info('清洗 治疗前CT评价 AND 治疗后CT评价')
    try {
        const rets = await sql.query(`SELECT FU_TIMES,TREAT_EVALUTE_FRONT,TREAT_EVALUTE_AFTER FROM [dbo].[PAT_FOLLOW_UP_TREAT]`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _ct_front = element.TREAT_EVALUTE_FRONT, // 治疗前CT评价
                _ct_after = element.TREAT_EVALUTE_AFTER, // 治疗后CT评价
                _drug_name = element.DRUG_NAME, // 随访化疗药物（通用名）
                _drug_name_trade = element.DRUG_NAME_TRADE // 随访化疗药物（商品名）


            let ret_ct_front = '',
                ret_ct_after = ''
            // 1:无复发转移；2:复发转移；
            /*
				“无复发转移”对应：未见明显异常、术后无改变、较前无明显变化；
				“复发转移”对应：肝转移、考虑转移、转移瘤较前增大、转移可能、局部复发、考虑复发。
             */
            if (/无|未见|稳定/.test(_ct_front)) {
                ret_ct_front = '无复发转移'
            } else if (/复发转移|肝转移|淋巴结转移|考虑转移|转移瘤较前增大|转移可能|局部复发|考虑复发/.test(_ct_front)) {
                ret_ct_front = '复发转移'
            }

            if (!ret_ct_front) {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET TREAT_EVALUTE_FRONT=NULL WHERE FU_TIMES='${element.FU_TIMES}'`)
            } else {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET TREAT_EVALUTE_FRONT='${ret_ct_front}' WHERE FU_TIMES='${element.FU_TIMES}'`)
            }
            // 1:无复发转移；2:病情进展；
            /*
            	“无复发转移”对应：未见复发转移征象、好转、未见复发、较前变化不大、无复发、无进展、未见明显异常；
            	“病情进展”对应：肝转移、病灶增大、怀疑复发、肿瘤进展、肿瘤复发转移、肿瘤复发可能、考虑转移可能性大
             */
            if (/无|未见|稳定/.test(_ct_after)) {
                ret_ct_after = '无复发转移'
            } else if (/病情进展|肝转移|病灶增大|怀疑复发|肿瘤进展|肿瘤复发转移|肿瘤复发可能|考虑转移可能性大/.test(_ct_after)) {
                ret_ct_after = '病情进展'
            }

            if (!ret_ct_after) {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_AFTER=NULL WHERE FU_TIMES='${element.FU_TIMES}'`)
            } else {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT]  SET TREAT_EVALUTE_AFTER='${ret_ct_after}' WHERE FU_TIMES='${element.FU_TIMES}'`)
            }

        }

    } catch (err) {
        console.error('清洗 治疗前CT评价 AND 治疗后CT评价 ERR ', err)
    }
}
// 清洗 随访化疗药物（商品名和通用名）
async function washFuByDrug () {
    console.info('清洗 随访化疗药物（商品名和通用名）')
    try {
        const rets = await sql.query(`SELECT FU_TIMES,DRUG_NAME,DRUG_NAME_TRADE FROM [dbo].[PAT_FOLLOW_UP_TREAT] WHERE TREAT_NAME='化疗'`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _drug_name = element.DRUG_NAME, // 随访化疗药物（通用名）
                _drug_name_trade = element.DRUG_NAME_TRADE // 随访化疗药物（商品名）

            // 清洗 随访化疗药物（通用名）
            const drug_name = await common_drug_general(_drug_name)
            if (drug_name) {
                let text = await common_fu_drug_general(drug_name)

                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET DRUG_NAME='${text}' WHERE FU_TIMES='${element.FU_TIMES}'`)
            } else {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET DRUG_NAME=NULL WHERE FU_TIMES='${element.FU_TIMES}'`) // 没有就更新为空
            }


            // 清洗 随访化疗药物（商品名）
            const drug_name_trade = await common_drug_trade(_drug_name_trade)
            if (drug_name_trade) {
                let text = await common_fu_drug_trade(drug_name_trade)

                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET DRUG_NAME_TRADE='${text}' WHERE FU_TIMES='${element.FU_TIMES}'`)
            } else {
                await sql.query(`UPDATE [dbo].[PAT_FOLLOW_UP_TREAT] SET DRUG_NAME_TRADE=NULL WHERE FU_TIMES='${element.FU_TIMES}'`) // 没有就更新为空
            }

        }

    } catch (err) {
        console.error('清洗 随访化疗药物（商品名和通用名）ERR ', err)
    }
}

/**
	术前化疗
	化疗药物名称(通用名) # YXA_O_118
	化疗药物名称(商品名) # YXA_O_905

	后续计划治疗方案（化疗）
	药物名称（通用名）# YXA_O_301
	药物名称（商品名）# YXA_O_302
 */

// 清洗 术前化疗 化疗药物名称(通用名) # YXA_O_118 && 后续计划治疗方案（化疗） 药物名称（通用名）# YXA_O_301 && 是否更改治疗方案 药物名称（通用名）#YXA_O_135
async function wash_drug_general () {
    console.info('清洗 术前术后化疗药物（通用名）')
    try {
        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT_src] WHERE SD_ITEM_CODE IN ('YXA_O_118','YXA_O_301','YXA_O_135') AND SD_ITEM_VALUE!=''`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            let ret = await common_drug_general(_value)
            console.log(delHashtag(ret), '-->', _value)

            // console.log(element.PATIENT_NO)
            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)

        }

    } catch (err) {
        console.error('清洗 术前术后化疗药物（通用名） ERR ', err)
    }
}
// 清洗 化疗药物名称(商品名) # YXA_O_905 && 后续计划治疗方案（化疗） 药物名称（商品）# YXA_O_302 && 是否更改治疗方案 药物名称（商品）#YXA_O_906
async function wash_drug_trade () {
    console.info('清洗 术前术后化疗药物（商品名）')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE IN ('YXA_O_905','YXA_O_302','YXA_O_906') AND SD_ITEM_VALUE!=''`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _value = element.SD_ITEM_VALUE

            let ret = await common_drug_trade(_value)
            // console.log(delHashtag(ret),'-->',_value)

            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT]  SET SD_ITEM_VALUE='${delHashtag(ret)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)

        }

    } catch (err) {
        console.error('清洗 术前术后化疗药物（商品名） ERR ', err)
    }
}

// 添加术前化疗方案
async function addFolfoxFront () {
    console.info('添加术前化疗方案#YXA_O_918')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_118' AND SD_ITEM_VALUE!=''`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _folfox = element.SD_ITEM_VALUE

            let ret = await common_diff_FOLFOX(_folfox)
            // console.log(delHashtag(ret),'-->',_folfox)
            await sql.query(`INSERT INTO [dbo].[PAT_SD_ITEM_RESULT] VALUES ('${element.PATIENT_NO}', 'YXA_O','YXA_O_918', '${ret}')`)

        }

    } catch (err) {
        console.error('添加术前化疗方案#YXA_O_918 ERR ', err)
    }
}

// 添加后续计划化疗方案
async function addFolfoxAfter () {
    console.info('添加后续计划化疗方案#YXA_O_919')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_301' AND SD_ITEM_VALUE!=''`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _folfox = element.SD_ITEM_VALUE

            let ret = await common_diff_FOLFOX(_folfox)
            // console.log(delHashtag(ret),'-->',_folfox)
            await sql.query(`INSERT INTO [dbo].[PAT_SD_ITEM_RESULT] VALUES ('${element.PATIENT_NO}', 'YXA_O','YXA_O_919', '${ret}')`)

        }

    } catch (err) {
        console.error('添加后续计划化疗方案#YXA_O_918 ERR ', err)
    }
}

// 添加 更改治疗方案
async function addFolfoxChange () {
    console.info('添加更改治疗方案#YXA_O_920')
    try {

        const rets = await sql.query(`SELECT * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_135' AND SD_ITEM_VALUE!=''`)

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i],
                _folfox = element.SD_ITEM_VALUE

            let ret = await common_diff_FOLFOX(_folfox)
            // console.log(delHashtag(ret),'-->',_folfox)
            await sql.query(`INSERT INTO [dbo].[PAT_SD_ITEM_RESULT] VALUES ('${element.PATIENT_NO}', 'YXA_O','YXA_O_920', '${ret}')`)

        }

    } catch (err) {
        console.error('添加更改治疗方案#YXA_O_920 ERR ', err)
    }
}

/**
 * 公共函数
 */
// 化疗药 通用名
async function common_drug_general (_value) {
    let ret = ''
    if (/5-FU|5氟尿嘧啶|氟尿嘧啶/i.test(_value)) ret += '1#'
    if (/奥沙|奥铂|艾恒|乐沙定/.test(_value)) ret += '2#'
    if (/亚叶酸钙|同奥/.test(_value)) ret += '3#'
    if (/伊立替康|艾力|开普拓/.test(_value)) ret += '4#'
    if (/蛋白紫杉醇|蛋白结合型|ABX|艾越|哀越|克艾力|凯素|abraxane/i.test(_value)) {
        ret += '5#'
    } else if (/紫杉醇/i.test(_value)) {
        ret += '11#'
    }
    if (/替吉奥|S-1|S1|爱斯万|艾斯万|维康达|艾奕/i.test(_value)) ret += '6#'
    if (/阿帕替尼|艾坦/.test(_value)) ret += '7#'
    if (/卡培他滨|希罗达|卓伦/.test(_value)) ret += '8#'
    if (/多西他赛|艾素|泰索帝/.test(_value)) ret += '9#'
    if (/GEM|Gemcitabine|吉他西滨|吉西他滨|吉丁他滨|吉西他|吉他滨|西他滨|择菲|泽菲|泽非|健择|健泽/i.test(_value)) ret += '10#'
    if (/泰素|力扑素/.test(_value)) ret += '11#'
    if (/奥曲肽|善龙/.test(_value)) ret += '12#'
    if (/Ramucirumab|雷莫芦单抗/i.test(_value)) ret += '13#'
    if (/尼妥珠单抗|泰欣生/.test(_value)) ret += '14#'
    if (/顺铂|诺欣/.test(_value)) ret += '15#'
    if (/洛铂/.test(_value)) ret += '16#'
    if (/舒尼替尼|索坦/.test(_value)) ret += '17#'
    if (/替加氟/.test(_value)) ret += '18#'

    if (/FOLFIRINOX|FOLFOXIRI|FORFIRINOX|Forfrinox方案|FOLFOXIRI方案|Folfori|FOFIRINOX|FORFIRINOX|Forfirnox|FOLFORINOX|Folfori|FULFIRINOX/i.test(_value)) ret += '3#1#4#2#'
    if (/mFOLFIRINOX|mFOLFOROX/i.test(_value)) ret += '3#1#4#2#'
    if (/FOLFIRI/i.test(_value)) ret += '3#1#4#'
    if (/AG/i.test(_value)) ret += '5#10#'
    if (/AS1|AS/i.test(_value)) ret += '5#6#'
    if (/GP/i.test(_value)) ret += '10#15#'
    if (/Gemox/i.test(_value)) ret += '10#2#'
    if (/GX/i.test(_value)) ret += '10#8#'
    if (/GS/i.test(_value)) ret += '10#6#'
    if (/DS/i.test(_value)) ret += '9#6#'
    if (/DX/i.test(_value)) ret += '9#8#'
    if (/XELOX/i.test(_value)) ret += '8#2#'

    if (ret) { // 去重
        let _set = new Set(ret.split('#'))
        ret = Array.from(_set).sort((a, b) => a - b).join('#')
    } else {
        ret = '19#'
        // console.log(delHashtag(ret),'-->',_value)
    }
    return ret
}
// 化疗药 商品名
async function common_drug_trade (_value) {
    let ret = ''

    if (/氟尿嘧啶/.test(_value)) ret += '1#'
    if (/艾恒/.test(_value)) ret += '2#'
    if (/乐沙定/.test(_value)) ret += '3#'
    if (/同奥/.test(_value)) ret += '4#'
    if (/艾力/.test(_value)) ret += '5#'
    if (/开普拓/.test(_value)) ret += '6#'
    if (/ABX/.test(_value)) ret += '7#'
    if (/艾越|艾岳/.test(_value)) ret += '8#'
    if (/克艾力/.test(_value)) ret += '9#'
    if (/凯素/.test(_value)) ret += '10#'
    if (/爱斯万|艾斯万/.test(_value)) ret += '11#'
    if (/维康达/.test(_value)) ret += '12#'
    if (/艾奕/.test(_value)) ret += '13#'
    if (/苏立/.test(_value)) ret += '14#'
    if (/艾坦/.test(_value)) ret += '15#'
    if (/希罗达/.test(_value)) ret += '16#'
    if (/卓伦|卓仑/.test(_value)) ret += '17#'
    if (/艾滨/.test(_value)) ret += '18#'
    if (/艾素/.test(_value)) ret += '19#'
    if (/泰索帝/.test(_value)) ret += '20#'
    if (/择菲|泽菲/.test(_value)) ret += '21#'
    if (/健择|健泽/.test(_value)) ret += '22#'
    if (/辰涛/.test(_value)) ret += '23#'
    if (/泰素/.test(_value)) ret += '24#'
    if (/力扑素/.test(_value)) ret += '25#'
    if (/善龙/.test(_value)) ret += '26#'
    if (/雷莫芦单抗/.test(_value)) ret += '27#'
    if (/泰欣生/.test(_value)) ret += '28#'
    if (/诺欣/.test(_value)) ret += '29#'
    if (/洛铂/.test(_value)) ret += '30#'
    if (/索坦/.test(_value)) ret += '31#'
    if (/s1|s-1/i.test(_value)) ret += '32#'

    if (ret) { // 去重
        let _set = new Set(ret.split('#'))
        ret = Array.from(_set).sort((a, b) => a - b).join('#')
    } else {
        ret = '33#'
        // console.log(delHashtag(ret),'-->',_value)
    }
    return ret
}
// 随访化疗药物（通用名）
async function common_fu_drug_general (str) {
    const _arr = str.replace(/^#$/, '').split('#'),
        // 通用名
        listDrug = [
            { key: 1, name: "氟尿嘧啶" },
            { key: 2, name: "奥沙利铂" },
            { key: 3, name: "亚叶酸钙" },
            { key: 4, name: "伊立替康" },
            { key: 5, name: "白蛋白紫杉醇" },
            { key: 6, name: "替吉奥" },
            { key: 7, name: "阿帕替尼" },
            { key: 8, name: "卡培他滨" },
            { key: 9, name: "多西他赛" },
            { key: 10, name: "吉西他滨" },
            { key: 11, name: "紫杉醇" },
            { key: 12, name: "奥曲肽" },
            { key: 13, name: "Ramucirumab" },
            { key: 14, name: "尼妥珠单抗" },
            { key: 15, name: "顺铂" },
            { key: 16, name: "洛铂" },
            { key: 17, name: "舒尼替尼" },
            { key: 18, name: "替加氟" },
            { key: 19, name: "不详" },
        ]
    return await common_diff_drug(_arr, listDrug)
}
// 随访化疗药物（商品名）
async function common_fu_drug_trade (str) {
    const _arr = str.replace(/^#$/, '').split('#'),
        // 商品名
        listDrug = [
            { key: 1, name: '氟尿嘧啶' },
            { key: 2, name: '艾恒' },
            { key: 3, name: '乐沙定' },
            { key: 4, name: '同奥' },
            { key: 5, name: '艾力' },
            { key: 6, name: '开普拓' },
            { key: 7, name: 'ABX' },
            { key: 8, name: '艾越' },
            { key: 9, name: '克艾力' },
            { key: 10, name: '凯素' },
            { key: 11, name: '爱斯万' },
            { key: 12, name: '维康达' },
            { key: 13, name: '艾奕' },
            { key: 14, name: '苏立' },
            { key: 15, name: '艾坦' },
            { key: 16, name: '希罗达' },
            { key: 17, name: '卓伦' },
            { key: 18, name: '艾滨' },
            { key: 19, name: '艾素' },
            { key: 20, name: '泰索帝' },
            { key: 21, name: '择菲' },
            { key: 22, name: '健择' },
            { key: 23, name: '辰涛' },
            { key: 24, name: '泰素' },
            { key: 25, name: '力扑素' },
            { key: 26, name: '善龙' },
            { key: 27, name: '雷莫芦单抗' },
            { key: 28, name: '泰欣生' },
            { key: 29, name: '诺欣' },
            { key: 30, name: '洛铂' },
            { key: 31, name: '索坦' },
            { key: 32, name: 'S1' }
        ]
    return await common_diff_drug(_arr, listDrug)
}
// 区分对应不同的药品
async function common_diff_drug (arr, listDrug) {
    let text = ""
    arr.forEach(k => {
        listDrug.forEach(item => {
            if (item.key == k) {
                text += item.name + "+"
            }
        })
    })
    return text.replace(/\+$/, '')
}


// 对比化疗方案 (术前+后续治疗方案)
async function common_diff_FOLFOX (folfox) {
    let ret
    if ('1#2#3#4' === folfox) ret = '1'
    if ('1#2#3#4' === folfox) ret = '2'
    if ('1#3#4' === folfox) ret = '3'
    if ('5#10' === folfox) ret = '4'
    if ('5#6' === folfox) ret = '5'
    if ('10#15' === folfox) ret = '6'
    if ('2#10' === folfox) ret = '7'
    if ('8#10' === folfox) ret = '8'
    if ('6#10' === folfox) ret = '9'
    if ('6#9' === folfox) ret = '10'
    if ('8#9' === folfox) ret = '11'
    if ('2#8' === folfox) ret = '12'
    if (folfox && !/#/.test(folfox)) ret = '13' // 单药(通用名存在，且 其中不包含井号)
    if (!ret) ret = '14' // 其他
    return ret
}
/**
 * 工具函数
 */

/**
 * 删除字符串前后的井号
 * @param  {[type]} str 需要处理的字符串
 * @return {[type]}     [description]
 */
function delHashtag (str) {
    return str.replace(/^#|#$/g, '')
}


async function run () {
    console.time('共用时')
    // // 清洗 胰肠吻合方式#YXA_O_159
    // await wash_YCWHFS() // ok
    // // 清洗 其他既往史#YXA_O_024
    // await wash_QTJWS() // ok
    // // 清洗 其他并发症#YXA_O_195
    // await wash_QTBFZ() // ok
    // // 清洗 其他后续计划治疗方案#YXA_O_314
    // await wash_QTHXZLFA() // ok
    // 清洗 术前化疗药物剂量#YXA_O_119 和 其他后续计划治疗药物剂量#YXA_O_303
    // await wash_DRUG_DOSE() // ok*
    // // 清洗 死亡原因#YXA_O_258
    // await wash_SWYY() // ok
    // 清洗随访 ct
    // await washFuByCT()
    // 清洗随访化疗用药
    // await washFuByDrug()
    /*
    	处理化疗药品名称
     */
    // 清洗 通用名
    // await wash_drug_general()
    // 清洗 商品名
    // await wash_drug_trade()
    // 添加术前化疗方案
    // await addFolfoxFront()
    // await addFolfoxAfter()
    // await addFolfoxChange()

    console.timeEnd('共用时')

    process.exit()
}

run()