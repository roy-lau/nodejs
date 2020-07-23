
-- ----------------------------
-- 查询随访化疗信息
-- ----------------------------

SELECT
	PATIENT_NO,
	FU_TIMES,
	TREAT_NAME AS '治疗方式',
	DRUG_NAME AS '药品名称(通用名)',
	DRUG_NAME_TRADE AS '药品名称(商品名)',
	DRUG_DOSE AS '剂量',
	TREAT_CYCLE AS '疗程/周期',
	TREAT_METHOD AS '化疗方法',
	TREAT_EFFECT AS '是否好转',
	TREAT_COST AS '化疗费用',
	CA199_FRONT AS '治疗前CA199',
	CEA_FRONT AS '治疗前CEA',
	CA125_FRONT AS '治疗前CA125',
	TREAT_EVALUTE_FRONT AS '术前CT评价',
	CA199_AFTER AS '治疗后CA199',
	CEA_AFTER AS '治疗后CEA',
	CA125_AFTER AS '治疗后CA125',
	TREAT_EVALUTE_AFTER AS '术后CT评价' 
FROM
	[dbo].[PAT_FOLLOW_UP_TREAT]

-- ----------------------------
-- 查询随访超过一年的患者数
-- ----------------------------
SELECT
	PATIENT_NO,
	MAX ( FOLLOW_UP_MONTHS ) AS '随访月份'
FROM
	[dbo].[PAT_FOLLOW_UP] 
WHERE
	FOLLOW_UP_DATE != '1900-01-01 00:00:00.000' 
	AND FOLLOW_UP_MONTHS!=''
	AND FOLLOW_UP_MONTHS > 12 -- 超过12个月
	AND PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_VISIT] WHERE SD_GROUP = '1' AND SD_CODE = 'YXA_O' ) 
GROUP BY
	PATIENT_NO


-- ----------------------------
-- 查询患者末次随访的 FU_TIMES
-- ----------------------------
SELECT DISTINCT
	fu_b.FU_TIMES 
FROM
	( SELECT 
			PATIENT_NO, 
			MAX ( FOLLOW_UP_DATE ) AS m 
		FROM [dbo].[PAT_FOLLOW_UP]
		-- 	WHERE PATIENT_NO='' -- 查询一个患者末次随访的数据
		GROUP BY PATIENT_NO ) AS fu_a
	LEFT JOIN [dbo].[PAT_FOLLOW_UP] AS fu_b ON fu_a.PATIENT_NO= fu_b.PATIENT_NO AND fu_a.m= fu_b.FOLLOW_UP_DATE

-- ----------------------------
-- 查询患者末次随访的日期
-- ----------------------------
SELECT
	PATIENT_NO,
	MAX ( FOLLOW_UP_DATE ) 
FROM
	[dbo].[PAT_FOLLOW_UP] 
-- 	WHERE PATIENT_NO='' -- 查询一个患者末次随访的数据
GROUP BY
	PATIENT_NO

	
-- ------------------------------------------
--      查询随访结果字典（格式转换）
-- ------------------------------------------

--  1 数值
--  2 字符串
--  3 日期
--  4 日期时间
--  5 单选
--  6 多选
SELECT
	ITEM_CODE,
	ITEM_NAME,
	ITEM_UNIT,
	ITEM_FORMAT,
	format = ( CASE ITEM_FORMAT WHEN '1' THEN '数字' WHEN '2' THEN '文字' WHEN '3' THEN '日期' WHEN '4' THEN '没有' WHEN '5' THEN '单选' END ) 
FROM
	[dbo].[FU_SD_ITEM_DICT]