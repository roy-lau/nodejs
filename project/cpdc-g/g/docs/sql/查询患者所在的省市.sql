-- 澳门，台湾，香港 没有大区
SELECT
	* 
FROM
	[dbo].[CITY] AS city
	LEFT JOIN AREA_CITY AS area ON city.CITY_NAME=area.CITY_NAME
WHERE
	city.PARENT_ID =0


-- ----------------------------
-- 省市
-- ----------------------------


-- 查询患者所在的省市
SELECT
	* 
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS r
	LEFT JOIN [dbo].[CITY] AS city ON city.PARENT_ID= 0 
WHERE
	charindex( city.CITY_NAME, r.SD_ITEM_VALUE ) > 0 
	AND r.SD_ITEM_CODE = 'YXA_O_003'
	AND r.SD_CODE='YXA_O'

-- 查询各省市病例数
SELECT
	city.CITY_NAME,
	COUNT(r.PATIENT_NO) AS num
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS r
	LEFT JOIN [dbo].[CITY] AS city ON city.PARENT_ID= 0 
WHERE
	charindex( city.CITY_NAME, r.SD_ITEM_VALUE ) > 0 
	AND r.SD_ITEM_CODE = 'YXA_O_003'
	AND r.SD_CODE='YXA_O'
GROUP BY city.CITY_NAME
ORDER BY num DESC

-- ----------------------------
-- 省市 大区
-- ----------------------------

-- 查询患者所在的省市大区
SELECT
	r.PATIENT_NO,
	r.SD_ITEM_VALUE,
	city.CITY_NAME,
	area.AREA_NAME
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS r
	LEFT JOIN [dbo].[CITY] AS city ON city.PARENT_ID= 0 
	LEFT JOIN [dbo].[AREA_CITY] AS area ON area.CITY_NAME=city.CITY_NAME
WHERE
	charindex( city.CITY_NAME, r.SD_ITEM_VALUE ) > 0 
	AND r.SD_ITEM_CODE = 'YXA_O_003'
	AND r.SD_CODE='YXA_O'

-- 查询各大区的病例数
SELECT
	ISNULL(area.AREA_NAME, '港澳台，未知') AS '大区',
	COUNT(r.PATIENT_NO) AS 'num'
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS r
	LEFT JOIN [dbo].[CITY] AS city ON city.PARENT_ID= 0 
	LEFT JOIN [dbo].[AREA_CITY] AS area ON area.CITY_NAME=city.CITY_NAME
WHERE
	charindex( city.CITY_NAME, r.SD_ITEM_VALUE ) > 0 
	AND r.SD_ITEM_CODE = 'YXA_O_003'
	AND r.SD_CODE='YXA_O'
	GROUP BY area.AREA_NAME
	ORDER BY num DESC