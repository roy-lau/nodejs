

### 安装
npm install node-schedule

### Code

```javaScript
var schedule = require('node-schedule');    // 导入定时任务的模块
var exec = require('child_process').exec,child;     // 导入子进程的模块

// 执行任务
var j = schedule.scheduleJob('00 00 24 * * 7', function(){
  console.log('The answer to life, the universe, and everything!');
});

// 取消任务
j.cancel()

child = exec('rm -rf test',function(err,out) { 
  console.log(out); err && console.log(err); 
});
```

### 备注

* * * * * *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ |
│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

6个占位符从左到右分别代表：秒、分、时、日、月、周几

'*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推

下面可以看看以下传入参数分别代表的意思

每分钟的第30秒触发： '30 * * * * *'

每小时的1分30秒触发 ：'30 1 * * * *'

每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

每周1的1点1分30秒触发 ：'30 1 1 * * 1'
