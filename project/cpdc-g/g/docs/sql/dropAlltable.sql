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

SELECT
	* 
FROM
	( SELECT PATIENT_NO FROM [dbo].[PAT_FOLLOW_UP] GROUP BY PATIENT_NO ) AS t1
	INNER JOIN ( SELECT DISTINCT MAX(FOLLOW_UP_DATE) FROM [dbo].[PAT_FOLLOW_UP] WHERE PATIENT_NO IN ( SELECT PATIENT_NO FROM [dbo].[PAT_FOLLOW_UP] GROUP BY PATIENT_NO ) ) AS t2 ON t1.PATIENT_NO = t2.PATIENT_NO
