-- 	术前评估“可切除”的（9036）胰腺导管腺癌+至少一次随访（7066）-围手术期死亡（30天内死亡（88）+院内死亡(76)）(156)-其它原因死亡（出血+心脑血管疾病+意外）（7038）
-- 查询并创建入组表（6961）
	
	-- 至少一次随访
	SELECT DISTINCT
		PATIENT_NO 
		INTO #in_group
	FROM
		[dbo].[PAT_FOLLOW_UP] 
	WHERE
		FOLLOW_UP_DATE != '1900-01-01 00:00:00.000' 
		AND PATIENT_NO IN (
		-- 可切除
		SELECT
			ids.PATIENT_NO 
		FROM
			[dbo].[tmp_id] AS ids
			LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS r ON ids.PATIENT_NO= r.PATIENT_NO 
		WHERE
			SD_ITEM_CODE = 'YXA_O_149' 
			AND SD_ITEM_VALUE = '1' 
		) 
		AND PATIENT_NO NOT IN (-- 其它原因死亡（出血+心脑血管疾病+意外）
		SELECT
			r.PATIENT_NO 
		FROM
			[dbo].[PAT_FOLLOW_UP_RESULT] AS r
			LEFT JOIN [dbo].[SD_ITEM_CV_DICT] AS d ON r.SD_ITEM_VALUE= d.CV_VALUE 
			AND d.CV_CODE= 'SWYY' 
		WHERE
			SD_ITEM_CODE = 'YXA_O_258' 
			AND d.CV_VALUE_TEXT!= '' 
			AND d.CV_VALUE IN ( '3', '4', '5' ) 
		) 
		AND PATIENT_NO NOT IN (-- 查询围手术期(30天内)死亡的患者 将查询到的 PATIENT_NO 放在这里
			'10bc74efcc0ae52d',
			'10f02ebbc8255683',
			'12f9dcae646ae92',
			'13ba52be45c135bd',
			'13f5302c50b5c6b3',
			'1492e25b4c11a1e0',
			'153dad32c64bcd9b',
			'16900b4038ca8630',
			'17877880',
			'19efa0207b7506e9',
			'1c749ec9a6dd5707',
			'1df749d80d6ead40',
			'1e14d6dc7a1c37ba',
			'1e1516bac5350f9c',
			'1f0a64ea7b5b00f3',
			'214e1e0054b4cca7',
			'21918e0646efaf10',
			'231541efefd7d62a',
			'24a80bfd43f0fa07',
			'2a81ddfc94b38dbe',
			'2b4a6023ee7a43de',
			'2bd61e429416aff9',
			'2cef2331d3025b9c',
			'2dc8a7ba370f24f8',
			'2e38a45155be28c2',
			'32086ac56e905f32',
			'3478bdb30cac7d9',
			'34cf443313abb949',
			'3a34d3061fc43969',
			'3be81eaf616bc140',
			'3c7e7f463740a9fd',
			'40c4174e4ee881ab',
			'41cff3026ff76d08',
			'4225eb49898169fd',
			'440eec740973886a',
			'461db03a120e35de',
			'46cc1f0cbbe6ee42',
			'496dabe068041b44',
			'4a836087f1f4b450',
			'4b383c040d76bcea',
			'4bc15179068c63de',
			'4bda86dcffa57313',
			'4cb96774d72ebd34',
			'4d8473ddc3e8bce4',
			'50b4aa35984dd6b2',
			'51f9349625c1cd7d',
			'528bc25be222b5d',
			'5301913167d2911b',
			'535e5d574b6a36b8',
			'573fa1029133a980',
			'582ab5bb26492621',
			'5f0dfc052fa1752d',
			'6116551a428205c6',
			'6465b558e969967c',
			'67b75c6e671cd7b5',
			'6a3b14c48a65e878',
			'6b04e91cbc4216b0',
			'6c2f702605234b9c',
			'6c45d5448d05847a',
			'6d414f9c9c3148a2',
			'6d478f8772260b30',
			'6f583dff25b23621',
			'72971b69e2c969fd',
			'75c36c9896f1a1af',
			'772712fdd49131f3',
			'780ff1c3189d8c5d',
			'789b7eee8a372d3d',
			'7a7ff15241a463fa',
			'7ac4422a5166b8e',
			'7b2d56d6fb02b275',
			'7c40870f0bc7f153',
			'7cdd68c5f1125a64',
			'7e0899e915b69fa3',
			'7e23a9378ed14cc',
			'7e56551be5ad380a',
			'7e85fcad941bd467',
			'7f409c2214f2896a',
			'805b21bb284c8f5d',
			'80847dbe6075d40b',
			'8154e9e38f612230',
			'81aa695a2fd3f5d8',
			'824ca47f529d8450',
			'856681cb3d13725d',
			'860ab5d1daeb667f',
			'884ea87c37dd01cd',
			'8c0e44d1b5178dbe',
			'8e04ef0ddf67f60d',
			'8eb85270626d19c0',
			'8ed27e0faddae083',
			'91dacecfd25d518e',
			'920f56db899c588e',
			'923819bc10839ed2',
			'930c3ffb5a1a38a7',
			'932c9ef707b1bdd6',
			'975457a59b49e75e',
			'97f33c31e7d6918e',
			'9918bd09765a3169',
			'9b751957c44cd415',
			'9e9a4c528c8c9625',
			'9ee6d5baec6ad451',
			'a09f1249d5e716d',
			'a15c840c83487525',
			'a30654d5986ff58f',
			'a362e3336d5c2f6b',
			'a49cabb5e6109540',
			'a5f0427a14eff165',
			'a8f50ac6440fd15c',
			'aa08e3821a8a3170',
			'af927abb71d66255',
			'b186d67c6edf1f47',
			'b319dab040ed0952',
			'b3d071d6cbc0c37c',
			'b45177989ac2ddac',
			'b6fc6a140ab50c7',
			'b8ef8e915cc969fd',
			'b96c55138b184ef9',
			'bb178b78a5b2d569',
			'bb2c89d90ca2152a',
			'bb7489fdf887704f',
			'bc37dadfa7ae8630',
			'bee78215a9ab4145',
			'c1644aa080714907',
			'c1f2362f7eaf2fc7',
			'c273175402d1c630',
			'c7ae8927ae7a774e',
			'cbef235e670a5abe',
			'cd7bc6f291273c58',
			'cf82f0c51a366630',
			'd1a357bd5e0adcf8',
			'd335c82647c28764',
			'd3b243a6bacae52d',
			'd3ce7173a67eee06',
			'd5366f0547308940',
			'd63099debd1ecaf7',
			'd85384fbfa93c15f',
			'db87772d63380777',
			'dba73dab4c3fe48d',
			'ddc8ab1c05cbfac0',
			'debd1b902ef4bcfa',
			'e048e1e7783cec2d',
			'e8ffe488b831c5f0',
			'eb6cb247c5530b60',
			'ee461f1bb294b0fe',
			'ee6021a7e3c7a41e',
			'ef4d8f9f4e07cd3d',
			'ef9c8905bd198450',
			'f2561538d97a8630',
			'f33acfe826ab55a8',
			'f6a7ea4e77f28630',
			'f9e179495ba006be',
			'faf759de778855f6',
			'fb8506555516d7d',
			'fd2b7f7be3eae57c',
			'fd79a6c1884654f7',
			'fdae251bf7d73630',
			'fdbec2fe472a2700',
			'fe32de0582cc1cbf',
			'fe94d1331de7a9f0' 
		) 
		


-- 	6961里有复发转移时间的（1899）

SELECT DISTINCT
	a1.PATIENT_NO 
FROM
	[dbo].[PAT_FOLLOW_UP_RESULT] AS a1
-- 	LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS a2 ON a1.PATIENT_NO= a2.PATIENT_NO 
-- 	AND a2.SD_ITEM_CODE= 'YXA_O_161'  -- 手术时间
WHERE
	a1.SD_ITEM_CODE IN ('YXA_O_251','YXA_O_254') -- 有复发转移的
	AND a1.SD_ITEM_VALUE != '' 
	-- 	AND DATEDIFF(mm,CONVERT ( VARCHAR ( 100 ), a2.SD_ITEM_VALUE, 120 ),CONVERT ( VARCHAR ( 100 ), a1.SD_ITEM_VALUE, 120 ) ) <='12'
	-- 	AND DATEDIFF(mm,CONVERT ( VARCHAR ( 100 ), a2.SD_ITEM_VALUE, 120 ),CONVERT ( VARCHAR ( 100 ), a1.SD_ITEM_VALUE, 120 ) ) >='0'
	
	AND a1.PATIENT_NO IN (
	
		SELECT PATIENT_NO FROM #in_group
	)
	
	
	
-- 	从6961入组中找出有死亡时间的（2106）

SELECT DISTINCT
	a1.PATIENT_NO 
FROM
	[dbo].[PAT_FOLLOW_UP_RESULT] AS a1
-- 	LEFT JOIN [dbo].[PAT_SD_ITEM_RESULT] AS a2 ON a1.PATIENT_NO= a2.PATIENT_NO 
-- 	AND a2.SD_ITEM_CODE= 'YXA_O_161'  -- 手术时间
WHERE
	a1.SD_ITEM_CODE = 'YXA_O_257' -- 有死亡时间的
	AND a1.SD_ITEM_VALUE != '' 
-- 		AND DATEDIFF(mm,CONVERT ( VARCHAR ( 100 ), a2.SD_ITEM_VALUE, 120 ),CONVERT ( VARCHAR ( 100 ), a1.SD_ITEM_VALUE, 120 ) ) <='12'
-- 		AND DATEDIFF(mm,CONVERT ( VARCHAR ( 100 ), a2.SD_ITEM_VALUE, 120 ),CONVERT ( VARCHAR ( 100 ), a1.SD_ITEM_VALUE, 120 ) ) >='0'
	
	AND a1.PATIENT_NO IN (
	
		SELECT PATIENT_NO FROM #in_group
	)

	