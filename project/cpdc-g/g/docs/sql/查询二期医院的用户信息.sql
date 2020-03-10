SELECT
	h.HOSPITAL_NAME AS '医院',
	u.USER_NAME AS '姓名',
	'性别' = ( CASE u.SEX WHEN '0' THEN '男' WHEN '1' THEN '女' END ),
	u.DEPT_NAME AS '科室',
	t.DICT_NAME AS '职称',
	u.MOBILE_PHONE AS '手机',
	u.EMAIL AS '邮箱' 
FROM
	[dbo].[USERS] AS u
	LEFT JOIN [dbo].[HOSPITAL_DICT] AS h ON u.HOSPITAL_CODE= h.HOSPITAL_ID
	LEFT JOIN [dbo].[CPDC_DICT_DETAIL] AS t ON t.CLASS_CODE= 'DOC_TITLE' AND u.DOC_TITLE=t.DICT_CODE
WHERE
	h.HOSPITAL_NAME IN (
		'北京大学人民医院',
		'首都医科大学附属北京朝阳医院',
		'首都医科大学附属北京友谊医院',
		'中国医学科学院肿瘤医院',
		'上海交通大学医学院附属新华医院',
		'中山大学附属第六医院',
		'南方医科大学南方医院',
		'中山大学附属第三医院',
		'天津市中西医结合医院',
		'天津医科大学总医院',
		'山西大医院',
		'内蒙古医科大学附属医院',
		'吉林大学第一医院',
		'吉林大学第二医院',
		'吉林大学中日联谊医院',
		'哈尔滨医科大学第二附属医院',
		'山东省立医院',
		'安徽医科大学第一附属医院',
		'浙江大学医学院附属邵逸夫医院',
		'福建医科大学附属第一医院',
		'郑州大学第一附属医院',
		'武汉大学中南医院',
		'中南大学湘雅二医院',
		'川北医学院附属医院',
		'四川省人民医院',
		'重庆医科大学附属第一医院',
		'贵州医科大学附属医院',
		'昆明医科大学第一附属医院',
		'西安交通大学第二附属医院',
		'石河子大学医学院第一附属医院',
		'新疆医科大学第一附属医院',
		'广西医科大学第一附属医院',
		'甘肃省人民医院',
		'青海省人民医院',
		'南昌大学第二附属医院',
		'西藏自治区人民医院',
	'常州市第二人民医院' 
	)