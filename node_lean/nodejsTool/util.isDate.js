// util.isDate(object)
//如果给定的参数 "object" 是一个日期返回true，否则返回false。
//
//判断是否是日期格式

var util = require('util');

var date1 = util.isDate(new Date());
console.log(date1)

var date2 = util.isDate(Date());    //没有new所以是string格式
console.log(date2);

var date3 = util.isDate({});
console.log(date3)
