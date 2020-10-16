// 串行化流程控制
var fs = require("fs");
var request = require("request");
var htmlparser = require("htmlparser");
var configFilename = "./rss_feeds.txt";

// 任务一：确保包含RSS预定原URL列表的文件存在
function checkForRSSfile() {
  fs.exists(configFilename, function (exists) {
    if (!exists) return next(new Error("Missing Rss file :" + configFilename)); // 错误返回
    next(null, configFilename);
  });
}

// 任务二：读取并解析包含预定原URL的文件
function readRSSFile(configFilename) {
  fs.readFile(configFilename, function (err, feedList) {
    if (err) return next(err);

    // 将预定原URL列表转换成字符串，然后分隔成一个数组；
    feedList = feedList
      .toString()
      .replace(/^\s+|\s+$/g, "")
      .split("\n");
    var random = Math.floor(Math.random() * feedList.length);
  });
}

// 任务三：向选定的预定原发送HTTP请求以获取数据
function downlasdRSSFeed(feedUrl) {
  request({ uri: feedUrl }, function (err, res, body) {
    if (err) return next(err);
    if (res.statusCode != 200)
      return next(new Error("Abnormal response status code"));
    next(null, body);
  });
}

// 任务四：将预定数据解析到一个条目数组中
function parseRSSFeed(rss) {
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.parser(handler);
  parser.parseComplete(rss);

  if (!handler.dom.items.length) return next(new Error("No RSS items found"));

  // 如果没有数据，显示第一个预定原条目的标题URL
  var item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}

// 把所有要做的任务按执行顺序添加到一个数组中
var tasks = [checkForRSSfile, readRSSFile, downlasdRSSFeed, parseRSSFeed];

// 负责执行任务的next函数
function next(err, result) {
  // 如果出错抛出异常
  if (err) console.log(err);
  // 从任务数组中取下个任务
  var currentTask = tasks.shift();

  if (currentTask) {
    // 执行当前任务
    currentTask(result);
  }
}
next(); // 开始任务的串行化执行
