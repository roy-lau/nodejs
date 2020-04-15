// 放置 SQL 常量



const startDate16 = '2016-01-01 00:00:00.000',
    endDate16 = '2016-12-31 00:00:00.000',
    startDate17 = '2017-01-01 00:00:00.000',
    endDate17 = '2017-12-31 00:00:00.000',
    startDate18 = '2018-01-01 00:00:00.000',
    endDate18 = '2018-12-31 00:00:00.000',
    address = '上海%'


const test = `SELECT top 1 PATIENT_NO FROM [dbo].[PAT_VISIT]`

// 查询有死亡时间的患者
const in_die = `SELECT DISTINCT TOP 2080
    PATIENT_NO
FROM
    [dbo].[PAT_FOLLOW_UP_RESULT]
WHERE
    SD_ITEM_CODE = 'YXA_O_257'
    AND SD_ITEM_VALUE != ''
    AND PATIENT_NO IN (
    SELECT
        PATIENT_NO
    FROM
        [dbo].[PAT_VISIT]
    WHERE
        SD_GROUP = '1'
        AND SD_CODE = 'YXA_O')`

// 胰腺癌晚期 后续化疗
const late_pancreatic_cancer2 = `SELECT
    a.PATIENT_NO
FROM
    [dbo].[PAT_SD_ITEM_RESULT] AS a
    LEFT JOIN [dbo].[PAT_FOLLOW_UP_TREAT] AS b ON a.PATIENT_NO= b.PATIENT_NO
WHERE
    a.SD_ITEM_CODE= 'YXA_O_224'
    AND a.SD_ITEM_VALUE = '1'
    AND b.TREAT_NAME= '化疗'`

// 胰腺癌晚期 进行术前放化疗患者
const late_pancreatic_cancer1 = `SELECT
    a.PATIENT_NO
FROM
    [dbo].[PAT_SD_ITEM_RESULT] AS a
WHERE
    (a.SD_ITEM_CODE = 'YXA_O_224'
    OR a.SD_ITEM_CODE = 'YXA_O_117')
    AND a.SD_ITEM_CODE = 'YXA_O_117'
    AND a.SD_ITEM_VALUE = '1'
    AND a.SD_CODE = 'YXA_O'`

// 查询某年有放化疗的患者
const list_select_fhl = `SELECT
    a.PATIENT_NO
    -- a.NAME,
    -- b.SD_ITEM_CODE,
    -- b.SD_ITEM_VALUE
FROM
    [dbo].[PAT_VISIT] AS a
    LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS b ON a.PATIENT_NO= b.PATIENT_NO
WHERE
    a.SD_CODE='YXA_O'
    AND a.DISCHARGE_DATE> ${startDate16}
    AND a.DISCHARGE_DATE< ${endDate18}
    AND b.SD_ITEM_CODE='YXA_O_117' -- 是否放化疗
    AND b.SD_ITEM_VALUE='1' -- 是`

// 查询某地某年的患者
const list_select_year = `SELECT
        a.PATIENT_NO
        -- a.NAME,
        -- a.DISCHARGE_DATE,
        -- b.SD_ITEM_VALUE
    FROM
        [dbo].[PAT_VISIT] AS a
        LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS b ON a.PATIENT_NO= b.PATIENT_NO
    WHERE
        a.SD_CODE= 'YXA_O'
        AND b.SD_ITEM_CODE= 'YXA_O_003'
        AND b.SD_ITEM_VALUE LIKE ${address}
        AND a.DISCHARGE_DATE>${startDate16}
        AND a.DISCHARGE_DATE<${endDate18}`

// 查询麻醉方式是多选的患者
const mz_m = `SELECT TOP 1 * FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_172' AND LEN(SD_ITEM_VALUE)>1`


// 查询胰腺导管腺癌三年的数据
const get_3year_in_group = `SELECT PATIENT_NO FROM [dbo].[PAT_VISIT]
    WHERE SD_GROUP = '1'
    AND SD_CODE = 'YXA_O'
    AND DISCHARGE_DATE>='${startDate16}' AND DISCHARGE_DATE<='${endDate18}'`

// 查询北大入组6666患者
const tmp_beida = `SELECT PATIENT_NO FROM [dbo].[tmp_beida]`

// 查询北大 胡同学的入组患者
const pkufh_hu = `SELECT PATIENT_NO FROM [dbo].[pkufh_hu]`
const pkufh_hu_diff = `SELECT PATIENT_NO FROM [dbo].[pkufh_hu_diff_number]`

// 查询所有有糖尿病史的患者
const tnb = `SELECT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE SD_ITEM_CODE='YXA_O_020' AND SD_ITEM_VALUE='1'`
// 长海17年至少一次随访
const ch17OneFU = `SELECT DISTINCT
        PATIENT_NO 
        FROM
        PAT_FOLLOW_UP AS fu 
        WHERE
        PATIENT_NO IN (

        SELECT PATIENT_NO FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE
        SD_ITEM_CODE='YXA_O_161'
        AND SD_ITEM_VALUE>='2017/01/01 00:00:00'
        AND SD_ITEM_VALUE<'2018/01/01 00:00:00'
        AND PATIENT_NO IN (
        SELECT
            pat.PATIENT_NO 
        FROM
            [dbo].[PAT_VISIT] AS pat
            LEFT JOIN [dbo].[HOSPITAL_DICT] AS h ON pat.HOSPITAL_ID= h.HOSPITAL_ID 
        WHERE
        h.HOSPITAL_CODE= 'H015' )
    )`

module.exports = pkufh_hu_diff