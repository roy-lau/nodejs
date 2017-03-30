var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/upPhoto');    // 链接mongodb数据库

var schema = new mongoose.Schema({
  name: String,
  path: String
});

module.exports = mongoose.model('Photo', schema);

