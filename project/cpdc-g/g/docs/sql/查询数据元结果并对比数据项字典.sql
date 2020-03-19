-- [dbo].[PAT_SD_ITEM_RESULT] AS 		result 	数据项结果
-- [dbo].[SD_ITEM_DICT] AS				b  			数据项字典
-- [dbo].[SD_ITEM_CV_DICT] AS 			c 			数据元字典

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
	-- 	AND NOT b.ITEM_CODE IN ('YXA_O_006','YXA_O_007') 排除 患者身份证号,患者联系方式
	ORDER BY b.DISPLAY_ORDER