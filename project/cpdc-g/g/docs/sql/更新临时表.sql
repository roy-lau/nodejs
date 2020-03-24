-- ----------------------------
-- 创建并插入临时表
-- ----------------------------


-- 判断表是否存在
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[tmp_table]') AND type IN ('U'))
	DROP TABLE [dbo].[tmp_table]
GO


-- 创建表
CREATE TABLE [dbo].[tmp_table] ( id INT IDENTITY ( 1, 1 ), PATIENT_NO VARCHAR ( 100 ) );
GO

ALTER TABLE [dbo].[tmp_table] SET (LOCK_ESCALATION = TABLE)
GO

-- 开启插入
SET IDENTITY_INSERT [dbo].[tmp_table] ON
GO

INSERT INTO [dbo].[tmp_table] ([id],[PATIENT_NO]) VALUES ('1','fff879dec3cb26f9')
GO


SET IDENTITY_INSERT [dbo].[tmp_table] OFF
GO

