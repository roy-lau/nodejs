/*
 * 并行流程化控制
 * 获取text文件夹下的每个文件内容，并统计每个单词出现的次数
 *
 */

var fs = require("fs"),
  completedTasks = 0,
  tasks = [],
  wordCounts = {},
  filesDir = "./text";

function checkOfComplete() {
  completedTasks++;
  if (completedTasks == tasks.length) {
    for (var i in wordCounts) {
      // 当所有任务全部完成后，列出文件中用到每个单词以及用了多少次
      console.log(i + " __出现次数:__ " + wordCounts[i]);
    }
  }
}

function countWordsInText(text) {
  var words = text.toString().toLowerCase().split(/\W+/).sort();
  // 对文本中出现的单词计数
  for (var i in words) {
    var word = words[i];
    if (word) {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
    }
  }
}

fs.readdir(filesDir, function (err, files) {
  if (err) return err;
  // 得到text目录中文件列表
  for (var i in files) {
    var task = (function (file) {
      return function () {
        fs.readFile(file, function (err, text) {
          if (err) return err;
          countWordsInText(text);
          checkOfComplete();
        });
      };
    })(filesDir + "/" + files[i]);
    // 把所有任务都添加到函数调用数组中
    tasks.push(task);
  }
  // 开始并行执行所有任务
  for (var task in tasks) {
    tasks[task]();
  }
});
