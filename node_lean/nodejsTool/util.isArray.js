// util.isArray(object)
//如果给定的参数 "object" 是一个数组返回true，否则返回false。

//判断是否是数组

var util = require("util");

var a = util.isArray([]); //true
console.log(a);

var b = util.isArray(new Array()); //true
console.log(b);

var c = util.isArray({}); //false
console.log(c);
