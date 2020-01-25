var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/upPhoto');    // 链接mongodb数据库

// 设置存储数据的类型
var schema = new mongoose.Schema({
  name: String,
  path: String
});

module.exports = mongoose.model('upPhoto', schema);

