
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