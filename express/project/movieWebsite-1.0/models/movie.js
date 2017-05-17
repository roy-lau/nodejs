// 模型
var mongoose = require('mongoose')
var MovieSchema = require('../Schemas/movie')
// 通过mongoose.module方法编译生成Movie这个模型
var Movie = mongoose.module('Movie', MovieSchema)

module.exports = Movie