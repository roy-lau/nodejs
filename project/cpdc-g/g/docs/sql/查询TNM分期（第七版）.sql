-- 2020年1月13日，查询TNM分期（第七版）

-- T：根据具体数值计算
-- N：0 为 N0，其他为 N1
-- M: 否为 M0，是为 M1 （库里，1是，2否）


-- 分期规则：
-- IA：T1、N0、M0
-- IB：T2、N0、M0
-- IIA：T3、N0、M0
-- IIB：T1-T3、N1、M0
-- III：T4、任何N、M0
-- IV：任何T、任何N、M1

SELECT 
		ret.PATIENT_NO,
		ret.T,
		ret.N,
		ret.M,
		(CASE
			WHEN ret.T='1' AND ret.N='0' AND ret.M='0' THEN 'IA'
			WHEN ret.T='2' AND ret.N='0' AND ret.M='0' THEN 'IB'
			WHEN ret.T='3' AND ret.N='0' AND ret.M='0' THEN 'IIA'
			WHEN ret.T IN ('1','2','3') AND ret.N='1' AND ret.M='0' THEN 'IIB'
			WHEN ret.T='4' AND ret.M='0' THEN 'III'
			WHEN ret.M='1' THEN 'IV'
			ELSE NULL
		END
		) AS '分期'
FROM (

	SELECT
		a.PATIENT_NO,
			( SELECT SD_ITEM_VALUE FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_220' AND SD_ITEM_VALUE != '' ) AS 'T',
			
			(SELECT ( CASE 
						WHEN SD_ITEM_VALUE='0' THEN '0' 
						ELSE '1' END )
			 FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_222' AND SD_ITEM_VALUE != '') AS 'N',

			( SELECT (CASE SD_ITEM_VALUE
									WHEN '1' THEN '1'
									WHEN '2' THEN '0'
								END) 
				FROM [dbo].[PAT_SD_ITEM_RESULT] WHERE PATIENT_NO = a.PATIENT_NO AND SD_ITEM_CODE = 'YXA_O_224' AND SD_ITEM_VALUE != '' ) AS 'M'

		FROM [dbo].[PAT_VISIT] AS a 
		WHERE a.SD_CODE= 'YXA_O' AND a.SD_GROUP= '1'
	
) AS ret
WHERE ret.T!='' AND ret.N!='' AND ret.M!=''