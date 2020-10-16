var redis = require("redis"),
  db = redis.createClient(); // 创建Redis客户端实例

module.exports = Entry; // 从模块中输出Entry函数

function Entry(obj) {
  for (var key in obj) {
    // 循环遍历传入对象中的键
    this[key] = obj[key]; // 和并值
  }
}

Entry.prototype.save = function (fn) {
  var entryJSON = JSON.stringify(this); // 将保存的消息转换成JSON字符串

  // 将JSON字符串保存到Redis列表中
  db.lpush("entries", entryJSON, function (err) {
    if (err) return fn(err);
    fn();
  });
};

Entry.getRange = function (form, to, fn) {
  db.lrange("entries", form, to, function (err, items) {
    // 用来获取消息记录的Redis lrange函数
    if (err) return fn(err);
    var entries = [];

    items.forEach(function (item) {
      entries.push(JSON.parse(item)); // 解码之前保存为JSON的消息记录
    });
    fn(null, entries);
  });
};

// 获取列表的总条数
Entry.count = function (fn) {
  db.llen("entries", fn);
};
