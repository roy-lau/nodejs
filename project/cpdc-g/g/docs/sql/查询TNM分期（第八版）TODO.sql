-- 2020年1月13日，查询TNM分期（第八版）

-- T(肿瘤最大径)：
-- 	T1: 小于等于2cm
--  T2: 大于2cm，且小于等于4cm
--  T3：大于4cm
--  T4：T本身为4（算前边的需要先排除T4）
-- N：N0。N在1-3枚（包括1和3）为N1。大于等于4为 N2
-- M: 否为 M0，是为 M1 （库里，1是，2否）


-- 分期规则：
-- IA：T1、N0、M0
-- IB：T2、N0、M0
-- IIA：T3、N0、M0
-- IIB：T1-T3、N1、M0
-- III：任何T、N2、M0。T4、任何N、M0。其实两个一起可以理解为 任何T、任何N、M0
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
			WHEN ret.M='0' THEN 'III'
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
						WHEN SD_ITEM_VALUE IN ('1','2','3') THEN '1' 
						WHEN SD_ITEM_VALUE>=4 THEN '2' END )
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