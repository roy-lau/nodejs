var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/main',function (req,res){
    res.send("应用启动,访问http://localhost:8080/images/logo.jpg")

});

var server = app.listen(8080, function(){

    var host = server.address().address
    var port = server.address().port

    console.log("应用启动,访问http://localhost:8080/images/logo.jpg")

})
