/**
 * 下载字典 json
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    fs = require('fs-extra')

const dowSql = async () => {
    try {
        const dict = await sql.query(`SELECT ITEM_CODE,ITEM_NAME,ITEM_CV_CODE,ITEM_UNIT FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE!='YXA'`)
        const cv_dict = await sql.query(`SELECT * FROM [dbo].[SD_ITEM_CV_DICT] WHERE SD_CODE!='YXA'`)

        fs.writeJsonSync('./data/sd_item_dict.json', dict)
        fs.writeJsonSync('./data/sd_item_cv_dict.json', cv_dict) // or JSON.stringify(cv_dict, null, 2)
    } catch (err) {
        console.error(err)
    }
}

dowSql()