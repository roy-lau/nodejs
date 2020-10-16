var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("res.send() 方法直接返回内容到页面！");
});

module.exports = router;
