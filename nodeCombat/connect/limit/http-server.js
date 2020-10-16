var http = require("http");

http
  .createServer(function (req, res, data) {
    console.log(res);
  })
  .listen(3000);
console.log("server running at http://127.0.0.1:3000");
