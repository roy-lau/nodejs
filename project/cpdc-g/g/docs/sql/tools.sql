
-- ----------------------------
-- 遍历表中的每一行
-- ----------------------------

-- 创建临时表
SELECT SR_ITEM_NAME,SR_ITEM_CODE INTO #list FROM [dbo].[SR_ITEM_DICT]

-- 声明变量
DECLARE @code AS NVARCHAR(20),
        @name AS NVARCHAR(20),
        @join_str AS NVARCHAR(4000);
    
WHILE EXISTS(SELECT SR_ITEM_CODE FROM dbo.#list)
BEGIN
    -- 也可以使用top 1
    SET ROWCOUNT 1
    SELECT 
        @code = SR_ITEM_CODE,
        @name = SR_ITEM_NAME,
        @join_str = @code +' AS '+ @name
		FROM dbo.#list;
    SET ROWCOUNT 0
		
    PRINT(@join_str)
    DELETE FROM dbo.#list WHERE SR_ITEM_CODE=@code;
END

DROP TABLE dbo.#list


-- ----------------------------
-- 行转列
-- ----------------------------

-- 创建临时表
SELECT SR_ITEM_NAME,SR_ITEM_CODE INTO #list FROM [dbo].[SR_ITEM_DICT]

SELECT * FROM #list
--测试数据结束
DECLARE
	@SQL VARCHAR ( 8000 ) 
	SET @SQL = 'select SR_ITEM_NAME' 

SELECT
TOP 10
	@SQL =@SQL + ',SR_ITEM_CODE AS [' + [SR_ITEM_NAME] + ']' 
-- SR_ITEM_NAME,SR_ITEM_CODE
FROM
	#list
	
	SET @SQL =@SQL + ' from #list'
	PRINT ( @SQL )
	
	EXEC ( @SQL )



-- ----------------------------
-- 添加增列
-- ----------------------------

ALTER TABLE 表名 ADD 列名 INT IDENTITY ( 1, 1 ) NOT NULL

-- ----------------------------
-- 合并多选
-- ----------------------------

SELECT
	stuff(
		( SELECT '+' + [CV_VALUE_TEXT] FROM [dbo].[SD_ITEM_CV_DICT] WHERE CV_CODE = 'HLYWTYM' AND CV_VALUE IN ( '2', '10' ) FOR xml path ( '' ) ),
		1,
		1,
	'' 
	);

-- ----------------------------
-- 根据身份证号查询所在省份
-- ----------------------------
SELECT
	CASE
			LEFT ( '这里输入身份证号', 2 )   
			WHEN '11' THEN
			'北京市' 
			WHEN '12' THEN
			'天津市' 
			WHEN '13' THEN
			'河北省' 
			WHEN '14' THEN
			'山西省' 
			WHEN '15' THEN
			'内蒙古自治区' 
			WHEN '21' THEN
			'辽宁省' 
			WHEN '22' THEN
			'吉林省' 
			WHEN '23' THEN
			'黑龙江省' 
			WHEN '31' THEN
			'上海市' 
			WHEN '32' THEN
			'江苏省' 
			WHEN '33' THEN
			'浙江省' 
			WHEN '34' THEN
			'安徽省' 
			WHEN '35' THEN
			'福建省' 
			WHEN '36' THEN
			'江西省' 
			WHEN '37' THEN
			'山东省' 
			WHEN '41' THEN
			'河南省' 
			WHEN '42' THEN
			'湖北省' 
			WHEN '43' THEN
			'湖南省' 
			WHEN '44' THEN
			'广东省' 
			WHEN '45' THEN
			'广西壮族自治区' 
			WHEN '46' THEN
			'海南省' 
			WHEN '50' THEN
			'重庆市' 
			WHEN '51' THEN
			'四川省' 
			WHEN '52' THEN
			'贵州省' 
			WHEN '53' THEN
			'云南省' 
			WHEN '54' THEN
			'西藏自治区' 
			WHEN '61' THEN
			'陕西省' 
			WHEN '62' THEN
			'甘肃省' 
			WHEN '63' THEN
			'青海省' 
			WHEN '64' THEN
			'宁夏回族自治区' 
			WHEN '65' THEN
			'新疆维吾尔自治区' 
			WHEN '71' THEN
			'台湾省' 
			WHEN '81' THEN
			'香港特别行政区' 
			WHEN '82' THEN
			'澳门特别行政区' ELSE '未知'      
	END AS '身份证号所在省份'