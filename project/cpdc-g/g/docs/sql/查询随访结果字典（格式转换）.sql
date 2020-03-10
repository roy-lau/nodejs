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