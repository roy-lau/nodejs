SELECT
	log.UP_USER AS '上报用户id',
	users.USER_NAME AS '用户名',
	log.UP_DATE AS '上报时间',
	a.HOSPITAL_NAME AS '医院',
	log.PAT_ADD_COUNT AS '新增数',
	log.PAT_UPDATE_COUNT AS '更新数',
	log.PAT_ERROR_COUNT AS '失败数',
	log.PAT_COUNT AS '总数'
FROM
	[dbo].[UPLOAD_PATS_LOG] AS log
	LEFT JOIN  [dbo].[USERS] AS users ON log.UP_USER=users.USER_ID
	LEFT JOIN [dbo].[HOSPITAL_DICT] AS a  ON log.HOSPITAL_ID=a.HOSPITAL_ID
WHERE
	log.UP_DATE > '2019-07-01 00:00:00.000' 
	AND 	HOSPITAL_NAME IN (
		'中国医学科学院北京协和医院',
		'中国人民解放军总医院',
		'北京大学第一医院',
		'北京大学第三医院',
		'北京大学肿瘤医院',
		'首都医科大学宣武医院',
		'北京医院',
		'上海交通大学医学院附属瑞金医院',
		'海军军医大学附属长海医院',
		'复旦大学附属肿瘤医院',
		'复旦大学附属中山医院',
		'复旦大学附属华山医院',
		'复旦大学附属华东医院',
		'海军军医大学附属长征医院',
		'中山大学附属第一医院',
		'中山大学孙逸仙纪念医院',
		'中山大学肿瘤防治中心',
		'广东省人民医院',
		'山东大学齐鲁医院',
		'南京医科大学第一附属医院',
		'南京军区南京总医院',
		'浙江大学医学院附属第一医院',
		'浙江大学医学院附属第二医院',
		'浙江省人民医院',
		'温州医科大学附属第一医院',
		'福建医科大学附属协和医院',
		'华中科技大学同济医学院附属同济医院',
		'华中科技大学同济医学院附属协和医院',
		'中南大学湘雅医院',
		'四川大学华西医院',
		'陆军军医大学第一附属医院',
		'空军军医大学西京医院',
		'西安交通大学第一附属医院',
		'哈尔滨医科大学附属第一医院',
		'中国医科大学附属第一医院',
		'大连医科大学附属一院',
		'天津医科大学肿瘤医院',
	'河北医科大学第二医院' 
	)
ORDER BY
	a.HOSPITAL_NAME DESC