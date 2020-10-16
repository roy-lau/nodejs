// 模型
var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie");
// 通过mongoose.model方法编译生成Movie这个模型
var Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
