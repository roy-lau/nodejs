'use strict';

(async function() {
    try {
        const query = require('./query.js'),
            CALC = require('./core.js'),
            patientNo = await query(),
            calc = new CALC(patientNo)

        await calc.handlePatVisit()
        await calc.handlePatItemResult() // 数据项结果 验证通过 —— ok
        await calc.handleDrainageTube() // 引流管 验证通过 —— ok
        await calc.handlePatFollowUp()
        await calc.handlePatFollowUpResult()
        await calc.handlePatFollowUpTreat()
        await calc.handleCompleteRate()
        await calc.saveCalcResult('金薇薇')


        process.exit()
    } catch (err) {
        // ... error checks
        process.exit(err)
    }
})()