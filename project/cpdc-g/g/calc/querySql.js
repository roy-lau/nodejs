// 一年内死亡的患者 id
const oneYearDie = `SELECT
    DISTINCT a.PATIENT_NO
    FROM
    [dbo].[PAT_SD_ITEM_RESULT] AS a
    LEFT JOIN [dbo].[PAT_FOLLOW_UP_RESULT] AS b ON b.SD_ITEM_CODE = 'YXA_O_257' -- 随访死亡日期

    AND b.SD_ITEM_VALUE != ''
    WHERE
    a.SD_ITEM_CODE= 'YXA_O_161' -- 手术日期

    AND a.SD_ITEM_CODE!= ''
    AND b.PATIENT_NO= a.PATIENT_NO
    AND a.PATIENT_NO IN (
    SELECT
        PATIENT_NO
    FROM
        [dbo].[PAT_SD_ITEM_RESULT]
    WHERE
        SD_ITEM_CODE = 'YXA_O_151'
        AND ( SD_ITEM_VALUE = '1' OR SD_ITEM_VALUE = '2' OR SD_ITEM_VALUE = '3' OR SD_ITEM_VALUE = '12' )
        AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )
    )
    AND DATEDIFF(
        mm,
        CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
        CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
    ) <= '12'
    AND DATEDIFF(
        mm,
        CONVERT ( VARCHAR ( 100 ), a.SD_ITEM_VALUE, 120 ),
    CONVERT ( VARCHAR ( 100 ), b.SD_ITEM_VALUE, 120 )
    ) >= '0'
    ORDER BY a.PATIENT_NO`

// 一年内随访的患者 + 有死亡时间的患者
const oneYearFuDieDate = `SELECT
    DISTINCT PATIENT_NO
    FROM
    [dbo].[PAT_FOLLOW_UP_RESULT]
    WHERE
    SD_ITEM_CODE = 'YXA_O_257'
    AND SD_ITEM_VALUE != ''
    AND PATIENT_NO IN (SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O')

    UNION
    SELECT
    DISTINCT PATIENT_NO
    FROM
    [dbo].[PAT_FOLLOW_UP]
    WHERE
    FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
    AND FOLLOW_UP_MONTHS!=''
    AND FOLLOW_UP_MONTHS > 12
    AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`


// 查询16年做过胰头手术的患者（金佳斌）
const yitou16 = `SELECT
    PATIENT_NO
    FROM
    [dbo].[PAT_SD_ITEM_RESULT] 
    WHERE
    SD_ITEM_CODE = 'YXA_O_152' 
    AND SD_ITEM_VALUE IN ( '1', '2', '3' ) 
    AND PATIENT_NO IN ( 
    SELECT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] 
    WHERE SD_ITEM_CODE = 'YXA_O_161' AND SD_ITEM_VALUE >= '2016-01-01 00:00:00' AND SD_ITEM_VALUE <= '2016-12-31 00:00:00' )`

// 金巍巍
const jinWeiWei = `SELECT 
    DISTINCT PATIENT_NO 
    FROM
    [dbo].[PAT_SD_ITEM_RESULT] 
    WHERE
    SD_ITEM_CODE = 'YXA_O_152'
    AND SD_ITEM_VALUE IN ( '1', '2', '3' ) 
    AND PATIENT_NO IN (
    SELECT DISTINCT
        PATIENT_NO 
    FROM
        [dbo].[PAT_SD_ITEM_RESULT] 
    WHERE
        SD_ITEM_CODE = 'YXA_O_151' 
        AND SD_ITEM_VALUE IN ( '1', '2', '3' ) 
        AND PATIENT_NO IN ( SELECT DISTINCT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE = 'YXA_O_224' AND SD_ITEM_VALUE = '2' ) 
    )`

// 金巍巍2
const jinWeiWei2 = `SELECT DISTINCT PATIENT_NO  FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_210' AND SD_ITEM_VALUE LIKE '%导管%腺癌%' AND PATIENT_NO IN (
    SELECT 
        DISTINCT PATIENT_NO 
        FROM
        [dbo].[PAT_SD_ITEM_RESULT] 
        WHERE
        SD_ITEM_CODE = 'YXA_O_152'
        AND SD_ITEM_VALUE IN ( '1', '3' ) 
        AND PATIENT_NO IN (
        SELECT DISTINCT
            PATIENT_NO 
        FROM
            [dbo].[PAT_SD_ITEM_RESULT] 
        WHERE
            SD_ITEM_CODE = 'YXA_O_151' 
            AND SD_ITEM_VALUE IN ( '1', '2', '3' ) 
            AND PATIENT_NO IN ( SELECT DISTINCT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE = 'YXA_O_224' AND SD_ITEM_VALUE = '2' ) 
        )
    
    )`
// 一期医院
const firstPhaseOfHospital= `SELECT
    PATIENT_NO 
    FROM
    [dbo].[PAT_VISIT] 
    WHERE
    HOSPITAL_ID IN ( SELECT TOP 38 HOSPITAL_ID FROM [dbo].[HOSPITAL_DICT] ORDER BY HOSPITAL_CODE ) 
    AND SD_CODE = 'YXA_O'`

// 入组的患者中有随访记录的
const groupInFolluw = `SELECT
    DISTINCT PATIENT_NO
    FROM
    [dbo].[PAT_FOLLOW_UP]
    WHERE
    FOLLOW_UP_DATE != '1900-01-01 00:00:00.000'
    AND FOLLOW_UP_MONTHS!=''
    AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' )`
// 广东省人民
const guangdong = `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE HOSPITAL_ID='54bc034b46af0a8d' AND SD_CODE='YXA_O'`

// 陈汝福入组条件
const chen = `SELECT PATIENT_NO FROM [dbo].[calc_chen]`

// 王伟入组条件
const wagnwei = `SELECT PATIENT_NO FROM [dbo].[calc_wagnwei]`

const one = `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO IN ('42c4ff6470cac2ba','86bb1a938fc08710','5b4f0f0181fac940') AND SD_CODE='YXA_O'`
// 三年内入组的患者
const threeYearInGroup = `SELECT
    TOP 5000
    PATIENT_NO
    FROM
    [dbo].[PAT_VISIT]
    WHERE
    SD_GROUP = '1'
    AND SD_CODE = 'YXA_O'
    AND DISCHARGE_DATE >= '2016-01-01 00:00:00.000'
    AND DISCHARGE_DATE <= '2018-12-31 00:00:00.000'`

module.exports = wagnwei