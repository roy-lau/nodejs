var mongoose = require('mongoose');
// 链接mongodb数据库
mongoose
  .connect('mongodb://localhost/upPhoto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('mongoose concnet success!')
  }).catch(err => {
    console.error('mongoose ERR:', err)
  });

// 设置存储数据的类型
var schema = new mongoose.Schema({
  name: String,
  path: String
});

module.exports = mongoose.model('upPhoto', schema);

