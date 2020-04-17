
-- 查数据库每年上报数量(根据出院日期)
SELECT
	DateName( YEAR, ADMISSION_DATE ) AS 'tmp_year',
	COUNT(PATIENT_NO) AS '患者数'
FROM
	[dbo].[PAT_VISIT] 
WHERE
    SD_CODE='YXA_O'
    AND	SD_GROUP = '1'
GROUP BY DateName( YEAR, ADMISSION_DATE )
ORDER BY tmp_year