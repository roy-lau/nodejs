SELECT COUNT
	( * ) AS '胰腺癌晚期病例数'
FROM
	[dbo].[PAT_SD_ITEM_RESULT] 
WHERE
	SD_ITEM_CODE = 'YXA_O_224' 
	AND SD_CODE = 'YXA_O' 
	AND SD_ITEM_VALUE = '1' -- 注释掉是查询全部，打开是查询晚期胰腺癌