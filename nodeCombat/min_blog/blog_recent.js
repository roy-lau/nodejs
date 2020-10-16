var http = require("http");
var fs = require("fs");

/* 方法一：下面这是一个普遍的nodejs（回调）写法
http.createServer(function(req,res){	// 创建HTTP服务器并用回调定义响应逻辑
	if (req.url == '/') {			
		fs.readFile('./title.json', function(err, data){	// 读取json文件并用回调定义如何处理其中的内容
			if (err) {					// 如果出错，输出错误日志，并给客户端返回"Server Error"
				console.error(err);
				res.end('Server Error');
			}else{
				var title = JSON.parse(data.toString());	// 从json文本里解析数据

				fs.readFile('./template.html', function(err, data){	// 读取HTML模板，并在加载完成后使用回调
					if (err) {
						console.error(err);
						res.end('Server Error');
					}else{
						var tmpl = data.toString();

						var html = tmpl.replace('%', title.join('</li><li>'));	// 组装博客页面以显示博客标题
						res.writeHead(200, {"content-type":"text/html"});
						res.end(html);			// 将HTML页面发送给用户
					}
				});
			}
		});
	}
}).listen(3000);*/

/* 方法二：下面这个例子创建了中间函数，可以减少回调和嵌套
var server = http.createServer(function(req,res){	// 客户端请求一开始会进到这里
	getTitle(res);			// 控制权转交给了getTitle
}).listen(3000);

// 获取标题（title.json）并将控制权转交给getTpl
function getTitle(res){
	fs.readFile('./title.json', function(err, data){
		if(err){
			hedError(err, res);
		}else{
			getTpl(JSON.parse(data.toString()),res);
		}
	})
}

// getTpl读取模板文件，并将控制权转交给 formatHtml
function getTpl(title, res){
	fs.readFile('./template.html', function(err, data){
		if (err) {
			hadError(err,res);
		}else{
			formatHtml(title, data.toString(),res);
		}
	})
}

// foramtHtml得到标题和模板，渲染一个响应给客户端
function formatHtml(title,tmpl,res){
	var html = tmpl.replace('%', title.join('</li><li>'));
	res.writeHead(200, {'content-type':'text/html'});
	res.end(html);
}

// 如果这个过程中出现了错误，hadError会将错误输出到控制台，并给客户端返回"Server Error"
function hadError(err, res){
	console.error(err);
	res.end('Server Error');
}*/

/* 方法三：尽早的返回可以减少嵌套(回调)*/

var server = http
  .createServer(function (req, res) {
    getTitle(res);
  })
  .listen(3000);

function getTitle(res) {
  fs.readFile("./title.json", function (err, data) {
    // 在这里不再创建一个else分支，而是直接return，因为如果出错的话，也没必要继续执行这个函数了
    if (err) return hadError(err, res);

    getTpl(JSON.parse(data.toString()), res);
  });
}

function getTpl(title, res) {
  fs.readFile("./template.html", function (err, data) {
    if (err) return hadError(err, res);
    formatHtml(title, data.toString(), res);
  });
}

function formatHtml(title, tmpl, res) {
  var html = tmpl.replace("%", title.join("</li><li>"));
  res.writeHead(200, { "content-type": "text/html" });
  res.end(html);
}

function hadError(err, res) {
  console.error(err);
  res.end("Server Error");
}

console.log("Server running at http://127.0.0.1:3000/");
