/**
 * 下载表头json
 */
'use strict';
const sql = require('mssql'),
    config = require("../config.js"),
    XLSX = require("xlsx"),
    { saveFileSync} = require('./utils')

async function queryParent() {
    console.log('-下载父项')
    try {
        await sql.connect(config.db_addr)
        const listParent = await sql.query `SELECT
                *
                FROM
                 [dbo].[SD_ITEM_TYPE_DICT] AS a
                WHERE
                    a.SD_CODE= 'YXA_O'`,
            retParent = listParent.recordset,
            listchild = await sql.query `SELECT
                    ITEM_CODE,
                    ITEM_NAME,
                    ITEM_TYPE_CODE,
                    ITEM_PARENT_CODE
                FROM
                    [dbo].[SD_ITEM_DICT]
                WHERE
                    SD_CODE = 'YXA_O'
                ORDER BY
                    DISPLAY_ORDER`,
            retchild = listchild.recordset

        // console.log(retParent)
        let parentArr = [],
            childArr = [],
            allArr = []
        for (let i = retchild.length - 1; i >= 0; i--) {
            if (!retchild[i].ITEM_PARENT_CODE) {

                retchild[i].childs = []
                childArr.push(retchild[i])
                for (let k = retchild.length - 1; k >= 0; k--) {
                    if (retchild[k].ITEM_PARENT_CODE && retchild[i].ITEM_CODE === retchild[k].ITEM_PARENT_CODE.split('#')[0]) {
                        retchild[i].childs.push(retchild[k])
                    }
                }
            }
        }


        for (let i = retParent.length - 1; i >= 0; i--) {
            if (!retParent[i].PARENT_TYPE_CODE) {

                parentArr.push({ key: retParent[i].ITEM_TYPE_CODE, name: retParent[i].ITEM_TYPE_NAME,childs: [] })

                for (let k = retParent.length - 1; k >= 0; k--) {
                    if (parentArr[i].key === retParent[k].PARENT_TYPE_CODE) {
                        parentArr[i].childs.push({ key: retParent[k].ITEM_TYPE_CODE, name: retParent[k].ITEM_TYPE_NAME,childs: [] })

                        for (let c = childArr.length - 1; c >= 0; c--) {
                            if (retParent[k].ITEM_TYPE_CODE === childArr[c].ITEM_TYPE_CODE) {
                                parentArr[i].childs[k].childs.push({ key: childArr[c].ITEM_CODE, name: childArr[c].ITEM_NAME,childs: [] })
                            }
                        }
                    }
                    console.log(parentArr)
                }

                // for (let c = childArr.length - 1; c >= 0; c--) {
                //     if (retParent[i].ITEM_TYPE_CODE === childArr[c].ITEM_TYPE_CODE) {
                //         console.log(parentArr)
                //         parentArr[i].childs.push({ key: childArr[c].ITEM_CODE, name: childArr[c].ITEM_NAME,childs: [] })
                //     }
                // }
            }else{
                parentArr.push({ key:null, name: null,childs: [] })
            }
        }


        // console.log(parentArr)
        // await saveFileSync('./out/parentArr.json', JSON.stringify(parentArr, null, 2))
        // console.log(childArr)
        // await saveFileSync('./out/childArr.json', JSON.stringify(childArr, null, 2))
        console.log(parentArr)
        // await saveFileSync('./out/retParent.json', JSON.stringify(parentArr, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function test() {
    try {
        await sql.connect(config.db_addr)
        const listParent = await sql.query `SELECT
                a.SD_CODE,
                a.ITEM_TYPE_CODE,
                a.PARENT_TYPE_CODE,
                a.ITEM_TYPE_NAME,
                b.ITEM_CODE,
                b.ITEM_TYPE_CODE,
                b.ITEM_PARENT_CODE,
                b.ITEM_NAME
            FROM
                [dbo].[SD_ITEM_TYPE_DICT] AS a
                LEFT JOIN [dbo].[SD_ITEM_DICT] AS b ON a.ITEM_TYPE_CODE= b.ITEM_TYPE_CODE
            WHERE
                a.SD_CODE= 'YXA_O' `,
            retParent = listParent.recordset

        for (var i = retParent.length - 1; i >= 0; i--) {
            const item = retParent[i]
        }

        // console.log(parentArr)
        // await saveFileSync('./out/parentArr.json', JSON.stringify(parentArr, null, 2))


    } catch (err) {
        console.error(err)
    }
}
async function main() {

    // await test()
    await queryParent()
    process.exit()
}

main()