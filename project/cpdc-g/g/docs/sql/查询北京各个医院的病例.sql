SELECT
	a.PATIENT_NO,
	a.NAME,
	a.DISCHARGE_DATE,
	b.HOSPITAL_ID,
	b.HOSPITAL_NAME 
FROM
	[dbo].[PAT_VISIT] AS a
	LEFT JOIN [dbo].[HOSPITAL_DICT] AS b ON a.HOSPITAL_ID= b.HOSPITAL_ID 
WHERE
	a.SD_CODE = 'YXA_O' 
	AND a.HOSPITAL_ID IN (
		'9a9d9e15796b3a8d',
		'12b2fd726e2f8a8d',
		'703034868f4eea8d',
		'e42df8e2237b8a8d',
		'e6b6133dd6518a8d',
		'8e91b6676d350a8d',
		'34d52b2d3c774a8d',
		'4456b5127cec8a8d',
		'37127accb1918a8d',
		'bab4d93b58698a8d',
		'df49613a52d18a8d',
		'a694149736118a8d',
		'28beb37d8c018a8d',
		'75fccd391df1ea8d',
		'53aefd7b76452a8d',
		'bdf2906bc6d18a8d',
		'd8823ba9be9b8a8d',
		'257a043c93028a8d',
		'8f1d6815d6618a8d',
		'3e162c637ca88a8d',
		'b307cc95cd9f8a8d',
		'5edc463fa828078d',
		'7fcb126c55918a8d',
		'3ab92297efa9aa8d',
		'c44d727c86454a8d',
		'e71f0fc9e4818a8d',
		'9c858253f9558a8d',
		'4cb0dbb153d18a8d',
		'82825591ac959a8d',
		'54bc034b46af0a8d',
		'8abc84d3a5601bcd',
		'77a8d6ce06310a8d',
		'a7d999487cb08a8d',
		'b6e0d079c5a98a8d',
		'ab77db2a6e42128d',
		'eaaa8731bbf18a8d',
		'9f22aa32f45eaa8d',
		'1a34d2a3ce30b28d' 
	) 
	AND a.DISCHARGE_DATE> '2016/01/01' 
	AND a.DISCHARGE_DATE< '2018/12/31'