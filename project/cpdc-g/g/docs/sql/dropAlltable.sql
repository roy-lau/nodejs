------------------------
--  删除数据库下的所有表格
------------------------

USE cpdc1111 
GO

-- 定义变量
DECLARE @drop_all_sql VARCHAR ( 8000 ) 
	
-- 循环判断是否还有表未删除
WHILE ( SELECT COUNT ( * ) FROM sysobjects WHERE type = 'U' ) > 0 

BEGIN		
    -- 拼接SQL
    SELECT
        @drop_all_sql = 'drop table ' + name 
    FROM
        sysobjects 
    WHERE
        ( type = 'U' ) 
    ORDER BY
        'drop table ' + name 
    -- 执行SQL
    EXEC ( @drop_all_sql ) 
END