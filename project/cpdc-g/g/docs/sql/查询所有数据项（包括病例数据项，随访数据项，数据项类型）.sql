
-- ----------------------------
-- 查询所有数据项（包括病例数据项，随访数据项，和数据项类型。 but 引流管，随访时间，随访化疗无数据项）
-- ----------------------------
		
SELECT
	title.ITEM_TYPE_NAME,
	title.ITEM_TYPE_CODE,
	title1.ITEM_TYPE_NAME,
	title1.ITEM_TYPE_CODE,
-- 	dist.ITEM_NAME,
-- 	dist.ITEM_CODE,
-- 	fu_dist.ITEM_NAME,
-- 	fu_dist.ITEM_CODE,
	CASE title.ITEM_TYPE_CODE WHEN 'DT_O9' THEN fu_dist.ITEM_NAME ELSE dist.ITEM_NAME END AS '数据项',
	CASE title.ITEM_TYPE_CODE WHEN 'DT_O9' THEN fu_dist.ITEM_CODE ELSE dist.ITEM_CODE END AS '数据项code'

FROM
	[dbo].[SD_ITEM_TYPE_DICT] AS title 
	LEFT JOIN [dbo].[SD_ITEM_TYPE_DICT] AS title1 ON title.ITEM_TYPE_CODE=title1.PARENT_TYPE_CODE AND title1.PARENT_TYPE_CODE IS NOT NULL AND title.SD_CODE='YXA_O' 
	LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE OR dist.ITEM_TYPE_CODE=title1.ITEM_TYPE_CODE AND dist.SD_CODE='YXA_O'
	LEFT JOIN [dbo].[FU_SD_ITEM_DICT] AS fu_dist ON fu_dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE
WHERE
	title.PARENT_TYPE_CODE IS NULL 
	AND title.SD_CODE= 'YXA_O'
	ORDER BY title.DISPLAY_ORDER



-- ----------------------------
-- 查询患者诊治的所有信息（TODO：多选结果值未处理）
-- ----------------------------

SELECT
	result.PATIENT_NO,
	title.ITEM_TYPE_NAME,
	title.ITEM_TYPE_CODE,
	title1.ITEM_TYPE_NAME,
	title1.ITEM_TYPE_CODE,
	dist.ITEM_NAME,
	dist.ITEM_CODE,
	-- 拼接多级数据项名称
	-- isnull( title.ITEM_TYPE_NAME, '' ) + '_' + isnull( title1.ITEM_TYPE_NAME, '' ) + '_' + dist.ITEM_NAME + isnull( '(' + dist.ITEM_UNIT+ ')', '' ) + '#' + dist.ITEM_CODE AS 'ITEM_NAME',
	'ret_value' = ( CASE result.SD_ITEM_VALUE WHEN cv.CV_VALUE THEN cv.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END ),
	dist.ITEM_FORMAT,
	dist.ITEM_CV_CODE,
  	dist.ITEM_UNIT
FROM
	[dbo].[SD_ITEM_TYPE_DICT] AS title 
	LEFT JOIN [dbo].[SD_ITEM_TYPE_DICT] AS title1 ON title.ITEM_TYPE_CODE=title1.PARENT_TYPE_CODE AND title1.PARENT_TYPE_CODE IS NOT NULL AND title.SD_CODE='YXA_O' 
	LEFT JOIN [dbo].[SD_ITEM_DICT] AS dist ON dist.ITEM_TYPE_CODE=title.ITEM_TYPE_CODE OR dist.ITEM_TYPE_CODE=title1.ITEM_TYPE_CODE AND dist.SD_CODE='YXA_O'
	LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS result ON result.SD_ITEM_CODE=dist.ITEM_CODE AND result.SD_CODE='YXA_O'
	LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS cv ON dist.ITEM_CV_CODE= cv.CV_CODE AND result.SD_ITEM_VALUE= cv.CV_VALUE
WHERE
	title.PARENT_TYPE_CODE IS NULL 
	AND title.SD_CODE= 'YXA_O'
	AND result.PATIENT_NO IN ('01c7bf8461693338')
	ORDER BY title.DISPLAY_ORDER
