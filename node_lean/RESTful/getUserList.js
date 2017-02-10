var express = require('../Express/node_modules/express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function(req, res){
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function(err, data){
        console.log( data );
        res.end( data );
    });
})

var server = app.listen(8080, function(){

    var host = server.address().address
    var port = server.address().port

    console.log("请访问：127.0.0.1:8080/listUsers")
});
