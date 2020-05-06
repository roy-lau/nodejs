-- 待处理，肿瘤长宽高不是数值的情况
	SELECT
		PATIENT_NO,
		SD_ITEM_VALUE
	FROM
		[dbo].[PAT_SD_ITEM_RESULT] 
	WHERE
		SD_ITEM_CODE IN ( 'YXA_O_212', 'YXA_O_213', 'YXA_O_214' ) 
		AND SD_ITEM_VALUE != ''
		AND PATINDEX('%[^0-9|.]%', SD_ITEM_VALUE)>0 -- 大于0 ，说明不是数值类型

-- 查询肿瘤最大径（排出格式不正确的数据）
	SELECT
		PATIENT_NO,
		MAX ( CONVERT(FLOAT,SD_ITEM_VALUE) ) AS 'tmax' 
	FROM
		[dbo].[PAT_SD_ITEM_RESULT] 
	WHERE
		SD_ITEM_CODE IN ( 'YXA_O_212', 'YXA_O_213', 'YXA_O_214' ) 
		AND SD_ITEM_VALUE != ''
		AND PATINDEX('%[^0-9|.]%', SD_ITEM_VALUE)=0 -- 等于0 ，说明是数值类型
		GROUP BY PATIENT_NO