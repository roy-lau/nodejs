// util.isRegExp(object)
//如果给定的参数 "object" 是一个正则表达式返回true，否则返回false。

//判断是否是正则

var util = require('util');

var reg1 = util.isRegExp(/some regexp/);
console.log(reg1)

var reg2 = util.isRegExp(new RegExp('another regexp'));
console.log(reg2)

var reg3 = util.isRegExp({});
console.log(reg3)
