-- 简单的 if else 判断

DECLARE @strWhere VARCHAR ( 100 ) 
DECLARE @strSQL VARCHAR ( 100 )

IF @strWhere != '' 	
		SET @strSQL = '@strWhere不为空' 
ELSE 	
		SET @strSQL = '@strWhere为空' 
PRINT ( @strSQL )  -- 输出： @strWhere为空



-- 判断两个表是否相同
IF ( SELECT checksum_agg(binary_checksum(*)) FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO = '01c7bf8461693338' ) 
=
(SELECT checksum_agg(binary_checksum(*)) FROM [dbo].[PAT_VISIT] WHERE PATIENT_NO = '02ea33d4d02bf8bd' ) 
PRINT ( '相等' ) 
ELSE 
PRINT ( '不相等')