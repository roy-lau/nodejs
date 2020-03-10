USE master;  
GO  
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[tmp_xh]') AND type IN ('U'))
	DROP TABLE [dbo].[tmp_xh]
GO
CREATE TABLE [dbo].[tmp_xh] ( id INT IDENTITY ( 1, 1 ), PATIENT_NO VARCHAR ( 100 ) );
GO
SET IDENTITY_INSERT [dbo].[tmp_xh] ON
GO
INSERT INTO [dbo].[tmp_xh] (id,PATIENT_NO) VALUES (1,'1012142e0efd69fd');
GO
SET IDENTITY_INSERT [dbo].[tmp_xh] OFF
GO