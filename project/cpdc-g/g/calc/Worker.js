// 工作线程
const { Worker } = require('worker_threads');

// new Worker('../downCase/app.js')
new Worker('./dev-hosp.js')