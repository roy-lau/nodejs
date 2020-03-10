-- 查询胰腺导管腺癌（入组）患者数
SELECT
	* 
FROM
	[dbo].[PAT_VISIT] 
WHERE
	SD_GROUP = '1' 
	AND SD_CODE = 'YXA_O'