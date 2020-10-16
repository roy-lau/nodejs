var fs = require("fs");
var path = require("path");
var args = process.argv.splice(2); // 去掉‘node cli_tasks.js’只留下参数
var command = args.shift(); // 取出第一个参数（命令）
var taskDescription = args.join(" "); // 合并剩余的参数
var file = path.join(process.cwd(), "/.tasks"); // 根据当前的工作目录解析数据库的相对路径

// 判断cli脚本采取什么动作
switch (command) {
  case "list":
    listTasks(file); // list 会列出所有已保存的任务
    break;
  case "add":
    addTasks(file, taskDescription); // add 会添加新任务
    break;
  default:
    // 其他任何参数都会显示帮助信息
    console.info(
      "用法:" +
        process.argv[0] +
        " " +
        __dirname +
        "\\cli_tasks.js " +
        " list | add [要添加的内容]"
    );
}

// 从文本文件中加载用json编码的数据
function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function (exists) {
    // 检查.tasks文件是否已经存在
    var tasks = [];
    if (exists) {
      fs.readFile(file, "utf8", function (err, data) {
        // 从.tasks文件中读取代办事项数据
        if (err) return console.log(err);
        var data = data.toString();
        var tasks = JSON.parse(data || "[]"); // 把json编码的待办事项数据解析到任务数组中
        cb(tasks);
      });
    } else {
      cb([]); // 如果.tasks文件不存在则创建空的任务数组
    }
  });
}

// 列出任务的函数
function listTasks(file) {
  loadOrInitializeTaskArray(file, function (tasks) {
    for (var i in tasks) {
      console.log(tasks[i]);
    }
  });
}

// 把任务保存到磁盘中
function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), "utf8", function (err) {
    if (err) return console.log(err);
    console.log("保存成功！");
  });
}

// 添加一项任务
function addTasks(file, taskDescription) {
  loadOrInitializeTaskArray(file, function (tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}
