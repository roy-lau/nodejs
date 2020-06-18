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


-- ----------------------------
-- 查询患者所在医院的 省市 大区
-- ----------------------------

-- 查询患者所在医院 的省市
SELECT
	u.PATIENT_NO,
	h.HOSPITAL_NAME,
	(CASE c.PARENT_ID WHEN '0' 
		THEN c.CITY_NAME ELSE ( SELECT a.CITY_NAME FROM [dbo].[CITY] AS a WHERE a.PARENT_ID= '0' AND a.ID= c.PARENT_ID ) 
		END ) AS 'province' 
	c.CITY_NAME 
FROM
	[dbo].[PAT_VISIT] AS u
	LEFT JOIN [dbo].[HOSPITAL_DICT] AS h ON u.HOSPITAL_ID= h.HOSPITAL_ID
	LEFT JOIN [dbo].[CITY] AS c ON c.CITY_NAME= REPLACE( h.HOSPITAL_CITY, '市', '' )


-- 查询患者所在医院 所在的的大区
SELECT
	area.AREA_NAME,
	COUNT ( area.AREA_NAME ) 
FROM
	(SELECT
			(CASE c.PARENT_ID WHEN '0' 
				THEN c.CITY_NAME ELSE ( SELECT a.CITY_NAME FROM [dbo].[CITY] AS a WHERE a.PARENT_ID= '0' AND a.ID= c.PARENT_ID ) 
				END ) AS 'province' 
		FROM
			[dbo].[PAT_VISIT] AS u
			LEFT JOIN [dbo].[HOSPITAL_DICT] AS h ON u.HOSPITAL_ID= h.HOSPITAL_ID
			LEFT JOIN [dbo].[CITY] AS c ON c.CITY_NAME= REPLACE( h.HOSPITAL_CITY, '市', '' ) 
			-- WHERE u.PATIENT_NO IN () -- 留着用了选择查询
		) AS list_c
		LEFT JOIN [dbo].[AREA_CITY] AS area ON list_c.province= area.CITY_NAME 
GROUP BY
	area.AREA_NAME