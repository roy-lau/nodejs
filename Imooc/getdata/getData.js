function getHtml(pageid,cid){

 var url = 'http://daili.1688.com/daili/ajax.json?action=list/list_action&event_submit_doQueryFromList=true&pageNum='+pageid+'&pageSize=15&stdcategoryid1='+cid+'&_=1388454529278'

 var url = 'http://xtzy.chinacourt.org/'+pageid

 nodegrass.get(url,function(data,status,headers){

  
  alibabaToDb(data);

  return

 },'utf-8').on('error', function(e) {

     console.log("Got error: " + e.message);

 });

}

//数据提取 阿里巴巴 规则

function alibabaToDb(data){

 var list = eval('('+data+')');

 $.each(list.data, function(index, val) {

  console.log(val.tel);

  var value=[];

   value['companyname']= val.companyname;

   value['companyintroduction']= val.companyintroduction;

   value['stdcategoryid1']= val.stdcategoryid1;

   value['tel']= val.tel;

   value['winportdomain']= val.winportdomain;

   value['brandlogourl']= val.brandlogourl;

   value['createdTime']= timestamp();

   console.log(value);

   sqlInsert('enterprise',value);

 });

}

// 向数据库插入一条或多条数据的标准方法

function sqlInsert(table,fields){

 var field='';

 var val = '';

    for(key in fields){

     field += key+',';

     

      val += '"'+fields[key]+'",';

   // console.log(key);

  }

 field = field.substring(0, field.length-1)	

 val = val.substring(0, val.length-1)

 var sql = 'INSERT INTO '+ table +'('+ field +') VALUES('+ val+')';

 // console.log(sql);

 connection.query(sql, function(err,res,fields){

  if(err){

   return null

  }

  console.log(res); 

  return res;

  connection.end(); 

  } 

 );	

}