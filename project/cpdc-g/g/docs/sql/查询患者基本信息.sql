SELECT
	PATIENT_NO,
	PATIENT_ID AS '住院ID',
	INP_NO AS '住院流水号',
	NAME AS '患者姓名',
'患者性别' = ( CASE SEX WHEN '0' THEN '女' WHEN '1' THEN '男' END ),
	AGE AS '患者年龄',
	ADMISSION_DATE AS '入院日期',
	DISCHARGE_DATE AS '出院日期',
	OUT_STATUS AS '离院方式' 
FROM
	[dbo].[PAT_VISIT] 
