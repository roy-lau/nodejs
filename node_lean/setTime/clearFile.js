var schedule = require('node-schedule'),   // 导入定时任务的模块
	exec = require('child_process').exec,     // 导入子进程的模块
	path = require('path');

var delPath = path.resolve(__dirname, '../downfile') // 要删除的路径 “__dirname:当前路径”

// 执行任务
var j = schedule.scheduleJob('00 00 24 * * 7', function(){
	console.log("开始执行删除任务"+ new Date() )

	var child = exec('rm -rf '+  delPath ,function(err,out) {
	  console.log(out); err && console.log(err);
	});

	console.log("结束执行删除任务"+ new Date() )
	j.cancel()
});