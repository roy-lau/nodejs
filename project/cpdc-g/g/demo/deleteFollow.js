'use strict';

const ADODB = require('node-adodb'),
    config = require('../config.js'),
    connection = ADODB.open(config.access_addr_c)


// async function deleteFollw(){
// 	try	{
// 		const res = await connection.execute(`DELETE
// 			a
// 			FROM
// 				[dbo].[PAT_FOLLOW_UP] AS a
// 				LEFT JOIN [dbo].[PAT_FOLLOW_UP_TREAT] AS b ON a.FU_TIMES= b.FU_TIMES
// 				LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS c ON a.FU_TIMES= c.FU_TIMES
// 			WHERE
// 				a.FOLLOW_UP_DATE = ''
// 				AND a.FU_REASON = ''`)
// 		console.log(res)


// 	} catch (error) {
// 		console.error(error)
// 	}
// }
// deleteFollw()
async function queryFllow(){
	try	{
		 const userList = await connection.query(`SELECT * FROM [PAT_FOLLOW_UP] WHERE FU_REASON='' AND FOLLOW_UP_DATE=''`);
		 console.log(JSON.stringify(userList, null, 2));


	} catch (error) {
		console.error(error)
	}
}
queryFllow()
