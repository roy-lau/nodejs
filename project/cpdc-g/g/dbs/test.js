const mssql = require('./SqlServer-t.js')

async function run () {
    try{
       const res =  await mssql.query('SELECT PATIENT_NO,NAME FROM [dbo].[PAT_VISIT]')
       console.log(res)
    }catch(err){
        console.error(err)
    }
} 

run()