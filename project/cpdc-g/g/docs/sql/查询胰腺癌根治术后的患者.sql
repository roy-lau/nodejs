-- 查询胰腺癌根治术后的患者 
-- 胰腺癌根治术 = 1 胰十二指肠切除术+ 12 根治性顺行模块胰体尾脾切除术 +2 胰十二指肠切除术（联合门静脉壁切除）+ 3 胰十二指肠切除术（保留幽门）
SELECT
	* 
FROM
	[dbo].[PAT_SD_ITEM_RESULT] 
WHERE
	SD_ITEM_CODE = 'YXA_O_151' 
	AND SD_CODE = 'YXA_O' 
	AND ( SD_ITEM_VALUE = '1' OR SD_ITEM_VALUE = '2' OR SD_ITEM_VALUE = '3' OR SD_ITEM_VALUE = '12' ) 
	AND PATIENT_NO IN (
	SELECT
		PATIENT_NO 
	FROM
		[dbo].[PAT_VISIT] 
	WHERE
	SD_GROUP = '1' 
	AND SD_CODE = 'YXA_O')