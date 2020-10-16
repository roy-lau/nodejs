var connect = require("connect");

var app = connect()
  .use(function (req, res) {
    res.setHeader("Set-Cookie", "foo=bar");
    res.setHeader(
      "Set-Cookie",
      "tobi=ferret",
      "Expires=True,08 Jun 2021 10:18:14 GIT"
    );
    res.end();
  })
  .listen(3000);
console.log("用法：curl http://localhost:3000 --head");
