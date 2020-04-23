-- 判断表是否存在
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[rowToCol]') AND type IN ('U'))
	DROP TABLE [dbo].[rowToCol]
GO

-- ----------------------------
-- 创建表(用来存放转列后的数据)
-- ----------------------------
CREATE TABLE [dbo].[rowToCol] ( id INT IDENTITY ( 1, 1 ));
-- 先插入一列（PATIENT_NO）
ALTER TABLE [dbo].[rowToCol] ADD PATIENT_NO VARCHAR ( 100 )
GO

-- ----------------------------
-- 定义变量
-- ----------------------------
DECLARE @id AS INT,
		@table_len AS INT,
		@table_title AS NVARCHAR(200)

SET @id=0
	
-- 查询表的总长度，并储存到变量中
SELECT @table_len=COUNT(ITEM_CODE) FROM [dbo].[SD_ITEM_DICT]  WHERE SD_CODE='YXA_O'

-- ----------------------------
-- 遍历表的长度
-- ----------------------------
WHILE @id < @table_len
BEGIN
	
	-- 	每遍历一次表长度变量减一
	SET @id = @id + 1
	
	-- 遍历表的每一行
		SELECT
			@table_title = t.ITEM_NAME+'#'+t.ITEM_CODE
		FROM
			( SELECT row_number ( ) OVER ( ORDER BY DISPLAY_ORDER ) AS RowNum,* FROM [dbo].[SD_ITEM_DICT] WHERE SD_CODE='YXA_O' ) AS t 
		WHERE
			t.RowNum=@id
	

    PRINT('ALTER TABLE [dbo].[rowToCol] ADD ['+ @table_title +'] VARCHAR ( 100 )')
	EXEC('ALTER TABLE [dbo].[rowToCol] ADD ['+ @table_title +'] VARCHAR ( 100 )')
END



-- ----------------------------
-- 创建数据项结果临时表
-- ----------------------------
SELECT
	result.PATIENT_NO,
	b.ITEM_CODE,
	b.ITEM_NAME,
	'ret_v' = ( CASE result.SD_ITEM_VALUE WHEN c.CV_VALUE THEN c.CV_VALUE_TEXT ELSE result.SD_ITEM_VALUE END )
	INTO #ret
FROM
	[dbo].[PAT_SD_ITEM_RESULT] AS result
	LEFT JOIN [dbo].[SD_ITEM_DICT] AS b ON result.SD_ITEM_CODE= b.ITEM_CODE
	LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS c ON b.ITEM_CV_CODE= c.CV_CODE 
	AND result.SD_ITEM_VALUE= c.CV_VALUE 
WHERE
	result.SD_CODE= 'YXA_O'
	
	
-- SELECT * FROM #ret

-- ----------------------------
-- 遍历表中的每一行,并插入数据
-- ----------------------------

-- 声明变量
DECLARE @id AS NVARCHAR ( 50 ),
@val AS NVARCHAR ( 50 ),
@name AS NVARCHAR ( 50 );
WHILE
		EXISTS ( SELECT ret_v FROM #ret ) BEGIN-- 也可以使用top 1
			
		SET ROWCOUNT 1 
		SELECT
			@id = PATIENT_NO,
			@val = ret_v,
			@name = ITEM_NAME + '#' + ITEM_CODE 
		FROM
			dbo.#ret;
	
		SET ROWCOUNT 0 
		
		-- PRINT(@name)
		IF NOT EXISTS ( SELECT PATIENT_NO FROM [dbo].[rowToCol] WHERE PATIENT_NO =@id ) 
			-- 插入一行
			INSERT INTO [dbo].[rowToCol] ( [PATIENT_NO] ) VALUES ( @id ) 
			ELSE 
				-- 更新一行
				UPDATE [dbo].[rowToCol] SET @name =@val WHERE PATIENT_NO =@id 
			
		DELETE FROM dbo.#ret WHERE PATIENT_NO =@id;
	
END DROP TABLE dbo.#ret