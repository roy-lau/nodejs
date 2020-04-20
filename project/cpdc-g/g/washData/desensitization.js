/**
 * 患者信息脱敏
 * 修改最大堆栈 node --max-old-space-size=4096 desensitization.js
 */
'use strict';
const sql = require('../dbs/SqlServer-t.js')


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

function desensitization (str, beginStr, endStr, showEnd) {
    if (!str) return
    try {

        let len = String(str).length,
            leftStr = String(str).substring(0, beginStr),
            rightStr = String(str).substring(endStr, len),
            _str = ''

        for (let i = 0; i < endStr - beginStr; i++) {
            _str = _str + '*';
        }
        _str = leftStr + _str + (showEnd ? rightStr : '');
        return _str;

    } catch (error) {
        console.error('desensitization error: ', error)
    }
}
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

/**
 * 脱敏 SQL
 */
async function desensitizationSQL () {
    try {
        console.time()
        // 脱敏患者姓名
        await sql.query(`UPDATE [dbo].[PAT_VISIT] SET NAME = REPLACE( NAME, SUBSTRING ( NAME, 2, 3 ), '**' ) WHERE NAME != ''`)
        // 脱敏身份证
        await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] 
                            SET SD_ITEM_VALUE = REPLACE( SD_ITEM_VALUE, SUBSTRING ( SD_ITEM_VALUE, 4, LEN( SD_ITEM_VALUE ) -1 ), '**************' ) 
                        WHERE SD_ITEM_CODE = 'YXA_O_001' AND SD_ITEM_VALUE != ''`)
        // 脱敏地址
        await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] 
                            SET SD_ITEM_VALUE = REPLACE( SD_ITEM_VALUE, SUBSTRING ( SD_ITEM_VALUE, 4, LEN( SD_ITEM_VALUE ) ), '**********' ) 
                        WHERE SD_ITEM_CODE = 'YXA_O_003' AND SD_ITEM_VALUE != '' `)
        // 脱敏手机号
        await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] 
                            SET SD_ITEM_VALUE = REPLACE( SD_ITEM_VALUE, SUBSTRING ( SD_ITEM_VALUE, 4, 4 ), '****' ) 
                        WHERE SD_ITEM_CODE = 'YXA_O_004' AND SD_ITEM_VALUE != '' `)
        // 脱敏主刀医师        
        await sql.query(`UPDATE [dbo].[PAT_SD_ITEM_RESULT] 
                            SET SD_ITEM_VALUE = REPLACE( SD_ITEM_VALUE, SUBSTRING ( SD_ITEM_VALUE, 2, LEN( SD_ITEM_VALUE ) ), '**' ) 
                        WHERE SD_ITEM_CODE = 'YXA_O_005' AND SD_ITEM_VALUE != ''`)
        console.timeEnd()

    } catch (err) {
        console.error('脱敏 ERR ', err)
    }
}

desensitizationSQL()
process.exit('退出……')