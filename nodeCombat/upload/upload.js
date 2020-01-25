// 接收上传文件的HTTP服务器
var http = require('http');
var formidable = require('formidable');
var server = http.createServer(function(req, res){
  switch(req.method){
    case 'GET':
      show(req, res);
      break;
    case 'POST':
      upload(req,res);
      break;
  }
});

// 提供带有文件上传控件的HTML表单
function show(req, res){
  var html = ''
    + '<form method="post" action="/" enctype="multipart/form-data">'
    + '<p><input type="text" name="name" /> </p>'
    + '<p><input type="file" name="file" /> </p>'
    + '<p><input type="submit" value="Upload" /> </p>'
    + '</form>';
  res.setHeader('content-type', 'text/html');
  res.setHeader('content-type', Buffer.byteLength(html));
  res.end(html);
}

// 上传逻辑
function upload(req, res){
  if(!isFormData(req)){
    res.statusCode = 400;       // 400HTTP状态码，表示服务器不能理解请求的语法
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }

  // 使用formidable API
  var form = new formidable.IncomingForm();
  
  // 响应form 的type=text事件
  form.on('field', function(field, value){
    console.log('name值：'+field);                 // form表单的name值
    console.log('value值：'+value);                 // form表单的value值
  });
  // 响应form 的 type=file事件
  form.on('file', function(name, file){
    console.log(name);                  // form表单的name值
    console.log(file.name);             //  文件名
    console.log(file);                  //  上传文件的文件信息
  });
  form.on('end', function(){
    res.end('upload complete OK!');        // 文件上传成功后，返回给浏览器的信息
  });
  // 响应上传进度事件
  form.on('progress', function(bytesReceived, bytesExpected){
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log('当前进度:'+percent);
  })
  form.parse(req);

// 调用API，精简上面代码如下：  
//  form.parse(req, function(err, fields, files){
//    console.log(fields);
//    console.log(files);
//    res.end('upload complete!');
//  });
}

// 判断post头信息是否为multipart/form-data
function isFormData(req){
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}

server.listen(3000);
console.log('server running at http://localhost:3000')
