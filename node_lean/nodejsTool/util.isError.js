// util.isError(object)
//如果给定的参数 "object" 是一个错误对象返回true，否则返回false。
//
//判断是否是错误类型

var util = require('util')

var error1 = util.isError(new Error());
console.log(error1)

var error2 = util.isError(new TypeError());
console.log(error2)

var error3 = util.isError({ name: 'Error', message: 'an error occurred' })
console.log(error3)
