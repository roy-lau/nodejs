-- 查询患者基本信息
SELECT PATIENT_ID as '住院ID',INP_NO as '住院流水号',NAME as '患者姓名',SEX as '患者性别',AGE as '患者年龄',ADMISSION_DATE as '入院日期',DISCHARGE_DATE as '出院日期',OUT_STATUS as '离院方式'
FROM [dbo].[PAT_VISIT] WHERE INP_NO='2392449';

-- 合并基本信息和数据元表
-- [dbo].[PAT_VISIT] AS 					A 	患者基本信息表
-- [dbo].[PAT_SD_ITEM_RESULT] AS 	B 	数据元表
-- [dbo].[SD_ITEM_DICT] AS 				C 	数据项字段
-- [dbo].[SD_ITEM_CV_DICT] AS 		D 	数据元字典

SELECT
	A.PATIENT_NO,
	A.PATIENT_ID,
	A.NAME AS '患者姓名',
-- 	B.SD_ITEM_CODE,
	C.ITEM_NAME,
	C.ITEM_CV_CODE,
	B.SD_ITEM_VALUE,
	C.ITEM_UNIT as '单位'
FROM
	(
	[dbo].[PAT_VISIT] AS A
	INNER JOIN [dbo].[PAT_SD_ITEM_RESULT] AS B
	ON A.PATIENT_NO= B.PATIENT_NO
	)
	INNER JOIN [dbo].[SD_ITEM_DICT] AS C ON B.SD_ITEM_CODE= C.ITEM_CODE
-- 	INNER JOIN [dbo].[SD_ITEM_CV_DICT] AS D ON C.ITEM_CV_CODE= D.CV_CODE
WHERE
	A.INP_NO = '2392449';




-- 查询数据元结果 并对比数据项字典（多表查询，链接 select）
SELECT
	-- 	a.PATIENT_NO,
	b.ITEM_NAME,
	a.SD_ITEM_VALUE,
	b.ITEM_UNIT
	-- 	a.SD_ITEM_VALUE
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS a,
	[dbo].[SD_ITEM_DICT] AS b
WHERE
	a.PATIENT_NO= '13e5453656c6bf4d'
	AND a.SD_ITEM_CODE= b.ITEM_CODE
	AND b.ITEM_CV_CODE= ''
UNION ALL
SELECT
	b.ITEM_NAME,
	c.CV_VALUE_TEXT,
	b.ITEM_UNIT
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS a,
	[dbo].[SD_ITEM_DICT] AS b,
	[dbo].[SD_ITEM_CV_DICT] AS c
WHERE
	a.PATIENT_NO= '13e5453656c6bf4d'
	AND c.SD_CODE= 'YXA_O'
	AND a.SD_ITEM_CODE= b.ITEM_CODE
	AND b.ITEM_CV_CODE= c.CV_CODE
	AND a.SD_ITEM_VALUE= c.CV_VALUE

-- 查询数据元结果 并对比数据项字典（多表查询）
SELECT
	result.PATIENT_NO,
	result.SD_CODE,
	result.SD_ITEM_CODE,
	result.SD_ITEM_VALUE,
	b.ITEM_CODE,
	b.ITEM_NAME,
	b.ITEM_CV_CODE,
	c.CV_CODE,
	c.CV_VALUE,
	c.CV_VALUE_TEXT,
	b.ITEM_UNIT,
	'对比结果' = ( CASE result.SD_ITEM_VALUE WHEN c.CV_VALUE THEN c.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END ),
	b.DISPLAY_ORDER AS '排序'
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS result
	LEFT JOIN [dbo].[SD_ITEM_DICT] AS b ON result.SD_ITEM_CODE= b.ITEM_CODE
	LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS c ON b.ITEM_CV_CODE= c.CV_CODE
	AND result.SD_ITEM_VALUE= c.CV_VALUE
WHERE
	result.PATIENT_NO= '13e5453656c6bf4d'
	AND result.SD_CODE= 'YXA_O'
	ORDER BY b.DISPLAY_ORDER