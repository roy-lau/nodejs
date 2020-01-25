var connect = require('connect')

var app = connect()
	// .use(connect.bodyParser())
	.use(function(req, res){
		// ……注册用户……
		console.log(req)
		console.log(req.body)
		res.end("Registered new user:" + req.body.username)
	}).listen(3000);

	console.log("用法：curl -d '{'username':'tobi'}' -H 'Content-Type:application/json' http://localhost:3000")