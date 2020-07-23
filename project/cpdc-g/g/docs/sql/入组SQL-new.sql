------------------------
--  楼教授 PPT 10237
------------------------
UPDATE PAT_VISIT SET SD_GROUP =NULL
UPDATE PAT_VISIT
SET SD_GROUP = 1
WHERE
  PATIENT_NO IN (
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND (
      ( b.SD_ITEM_VALUE LIKE '%[^样]癌%' OR b.SD_ITEM_VALUE LIKE '%恶%' )
      AND (
        b.SD_ITEM_VALUE NOT LIKE '%十二指%'
        AND b.SD_ITEM_VALUE NOT LIKE '%壶腹%'
        AND b.SD_ITEM_VALUE NOT LIKE '%透明%'
        AND b.SD_ITEM_VALUE NOT LIKE '%间变%'
        AND b.SD_ITEM_VALUE NOT LIKE '%印戒%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[腺滤]泡%'
        AND b.SD_ITEM_VALUE NOT LIKE '%未分化%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肉瘤%'
        AND b.SD_ITEM_VALUE NOT LIKE '%小细胞%'
        AND b.SD_ITEM_VALUE NOT LIKE '%内分泌%'
        AND b.SD_ITEM_VALUE NOT LIKE '%导管癌%'
        AND b.SD_ITEM_VALUE NOT LIKE '%假乳头%'
        AND b.SD_ITEM_VALUE NOT LIKE '%未见%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胆[管囊]%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肠型%'
        AND b.SD_ITEM_VALUE NOT LIKE '%鳞[状形]%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[黏粘浆]液%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胆总管%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胃%'
        AND b.SD_ITEM_VALUE NOT LIKE '%甲状腺%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肾%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[肝髓胶骨]样%'
        AND b.SD_ITEM_VALUE NOT LIKE '%淋巴瘤%'
      )
    ) UNION
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND ( b.SD_ITEM_VALUE LIKE '%[^管]癌%' OR b.SD_ITEM_VALUE LIKE '%恶%' )
    AND ( b.SD_ITEM_VALUE LIKE '%胰%' OR b.SD_ITEM_VALUE LIKE '%导管%' )
    AND b.SD_ITEM_VALUE NOT LIKE '%胰%内分泌%癌%' UNION
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND ( b.SD_ITEM_VALUE LIKE '%PDAC%' OR b.SD_ITEM_VALUE LIKE '%daoguanxianai%' )
  ) -- SELECT * FROM PAT_VISIT WHERE SD_CODE='yxa_o' and sd_group=1
--update PAT_VISIT set SD_GROUP=null



UPDATE PAT_VISIT SET SD_GROUP =NULL
UPDATE PAT_VISIT
SET SD_GROUP = 1
WHERE
  PATIENT_NO IN (
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND (
        b.SD_ITEM_VALUE LIKE '%腺癌%'
      AND (
        b.SD_ITEM_VALUE NOT LIKE '%十二指%'
        AND b.SD_ITEM_VALUE NOT LIKE '%壶腹%'
        AND b.SD_ITEM_VALUE NOT LIKE '%透明%'
        AND b.SD_ITEM_VALUE NOT LIKE '%间变%'
        AND b.SD_ITEM_VALUE NOT LIKE '%印戒%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[腺滤]泡%'
        AND b.SD_ITEM_VALUE NOT LIKE '%未分化%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肉瘤%'
        AND b.SD_ITEM_VALUE NOT LIKE '%小细胞%'
        AND b.SD_ITEM_VALUE NOT LIKE '%内分泌%'
        AND b.SD_ITEM_VALUE NOT LIKE '%导管癌%'
        AND b.SD_ITEM_VALUE NOT LIKE '%假乳头%'
        AND b.SD_ITEM_VALUE NOT LIKE '%未见%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胆[管囊]%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肠型%'
        AND b.SD_ITEM_VALUE NOT LIKE '%鳞[状形]%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[黏粘浆]液%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胆总管%'
        AND b.SD_ITEM_VALUE NOT LIKE '%胃%'
        AND b.SD_ITEM_VALUE NOT LIKE '%甲状腺%'
        AND b.SD_ITEM_VALUE NOT LIKE '%肾%'
        AND b.SD_ITEM_VALUE NOT LIKE '%[肝髓胶骨]样%'
        AND b.SD_ITEM_VALUE NOT LIKE '%淋巴瘤%'
      )
    ) UNION
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND b.SD_ITEM_VALUE LIKE '%腺癌%'
    AND b.SD_ITEM_VALUE LIKE '%导管%' UNION
  SELECT
    a.PATIENT_NO --distinct b.SD_ITEM_VALUE
--(select HOSPITAL_NAME from HOSPITAL_DICT where HOSPITAL_ID=a.HOSPITAL_ID) as hospital_name,a.HOSPITAL_ID,b.*

  FROM
    [PAT_VISIT] a,
    PAT_SD_ITEM_RESULT b
  WHERE
    a.PATIENT_NO= b.PATIENT_NO
    AND a.SD_CODE= b.SD_CODE
    AND b.SD_ITEM_CODE= 'YXA_O_210'
    AND a.SD_CODE= 'YXA_O'
    AND ( b.SD_ITEM_VALUE LIKE '%PDAC%' OR b.SD_ITEM_VALUE LIKE '%daoguanxianai%' )
  ) -- SELECT * FROM PAT_VISIT WHERE SD_CODE='yxa_o' and sd_group=1
--update PAT_VISIT set SD_GROUP=null


------------------------
--  陈汝福
------------------------


UPDATE PAT_VISIT
SET SD_GROUP = 1
WHERE
	PATIENT_NO IN (
	SELECT
		a.PATIENT_NO 
	FROM
		[PAT_VISIT] a,
		PAT_SD_ITEM_RESULT b 
	WHERE
		a.PATIENT_NO= b.PATIENT_NO 
		AND a.SD_CODE= b.SD_CODE 
		AND b.SD_ITEM_CODE= 'YXA_O_210' 
		AND a.SD_CODE= 'YXA_O' 
	AND ( b.SD_ITEM_VALUE LIKE '%导管腺癌%' OR b.SD_ITEM_VALUE LIKE '%PDAC%' OR b.SD_ITEM_VALUE LIKE '%daoguanxianai%' ) 
	)