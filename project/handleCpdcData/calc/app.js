'use strict';

(async function() {
    try {
        const CALC = require('./core.js'),
            // query = require('./query.js'),
            // patientNo = await query.getHospitalIdByPatientNo('上海交通大学医学院附属瑞金医院'),
            // calc = new CALC(patientNo)
            calc = new CALC(['345bda4fda79e57b', '12e9717c4072c91a','179aa12a972196d9'])

        await calc.handlePatVisit()
        await calc.handlePatItemResult() // 数据项结果 验证通过 —— ok
        await calc.handleDrainageTube() // 引流管 验证通过 —— ok
        // await calc.handlePatFollowUp()
        // await calc.handlePatFollowUpResult()
        // await calc.handlePatFollowUpTreat()
        // await calc.handleCompleteRate()
        // await calc.saveCalcResult('test')


        process.exit()
    } catch (err) {
        // ... error checks
        process.exit(err)
    }
})()