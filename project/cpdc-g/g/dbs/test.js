const mssql = require('./SqlServer-t.js')
const fs = require('fs-extra')

async function run () {
    try{
       const res =  await mssql.query(`SELECT TOP 10 PATIENT_NO FROM [dbo].[PAT_VISIT]`)
       console.log(res)
    //    fs.writeJsonSync('PAT_VISIT.json', res )
    }catch(err){
        console.error(err)
    }
} 

run()