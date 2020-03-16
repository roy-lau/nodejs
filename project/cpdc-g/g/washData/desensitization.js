/**
 * 下载病例 -- 百济
 * 修改最大堆栈 node --max-old-space-size=4096 app-baiji.js
 */
'use strict';
const sql = require('../dbs/SqlServer-t.js')
// const sql = require('../dbs/sqlServer.js')


/**
 * 脱敏函数
 * @param  {String} str      需要脱敏的字符串
 * @param  {Number} beginStr 开始位置
 * @param  {Number} endStr   结束位置
 * @param  {Blooean} showEnd   是否显示结束数据
 * @return {String}          脱敏后的数据
 *
 * desensitization('刘强',1,3)
 * "刘**"
 * desensitization('河南省新郑市',3,8)
 * "河南省*****"
 * desensitization('13526636962',3,8)
 * "135*****962"
 *
 */

function desensitization(str, beginStr, endStr,showEnd) {
    if (!str) return
    try {

        let len = String(str).length,
            leftStr = String(str).substring(0, beginStr),
            rightStr = String(str).substring(endStr, len),
            _str = ''

        for (let i = 0; i < endStr - beginStr; i++) {
            _str = _str + '*';
        }
        _str = leftStr + _str + (showEnd?rightStr:'');
        return _str;

    } catch (error) {
        console.error('desensitization error: ', error)
    }
}
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))


/**
 * 清洗 需要脱敏的数据
 * @return {[type]} [description]
 */
async function desensitization_PAT_VISIT() {
    console.info('脱敏 患者患者姓名')
    try {
        const lists = await sql.query(`SELECT TOP 2 PATIENT_NO,NAME FROM [dbo].[PAT_VISIT]`)
console.info(lists)
        for (let i = lists.length - 1; i >= 0; i--) {
            const element = lists
            [i]
            // await sleep(500) // 每次循环休息 50ms
            // console.log(element.NAME)
            // await sql.query(`UPDATE [dbo].[PAT_VISIT] SET NAME='${desensitization(element.NAME,1, 3)}' WHERE PATIENT_NO='${element.PATIENT_NO}'`)

        }

    } catch (err) {
        console.error('脱敏 患者患者姓名 ERR ', err)
    }
}

async function desensitization_PAT_SD_ITEM_RESULT() {
    console.info('脱敏 患者患者基本数据项表')
    try {
    	// YXA_O_001 身份证号
    	// YXA_O_003 地址
    	// YXA_O_004 联系方式
    	// YXA_O_005 主刀医师

        const lists = await sql.query(`SELECT PATIENT_NO,SD_ITEM_CODE,SD_ITEM_VALUE FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE IN ('YXA_O_001','YXA_O_003','YXA_O_004','YXA_O_005')`),
            rets = lists.recordset

        for (let i = rets.length - 1; i >= 0; i--) {
            const element = rets[i]

            await sleep(500) // 每次循环休息 50ms
            console.log(i)
            switch(element.SD_ITEM_CODE){
            	case 'YXA_O_001':
		            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] SET SD_ITEM_VALUE='${desensitization(element.SD_ITEM_VALUE,4,18)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
					break;
				case 'YXA_O_003':
		            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] SET SD_ITEM_VALUE='${desensitization(element.SD_ITEM_VALUE,3,15)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
					break;
				case 'YXA_O_004':
		            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] SET SD_ITEM_VALUE='${desensitization(element.SD_ITEM_VALUE,3,11)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
					break;
				case 'YXA_O_005':
		            await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] SET SD_ITEM_VALUE='${desensitization(element.SD_ITEM_VALUE,1,3)}' WHERE PATIENT_NO='${element.PATIENT_NO}' AND SD_ITEM_CODE='${element.SD_ITEM_CODE}'`)
					break;
				default:
					console.error(" 没有CODE！！！")
            }

        }

    } catch (err) {
        console.error('脱敏 患者患者基本数据项表 ERR ', err)
    }
}

async function main() {
    console.time("共用时")
    await desensitization_PAT_VISIT()
    // await desensitization_PAT_SD_ITEM_RESULT()
    console.timeEnd("共用时")

    process.exit('退出……')
}

main()