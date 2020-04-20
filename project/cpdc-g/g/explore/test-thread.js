/**
 * 测试线程 (需使用 `node --experimental-worker fileName` 执行)
 */


const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

function firstTest() {
    for (var i = 10; i >= 0; i--) {
        console.log(i)
    }
}
if (isMainThread) {
    const now = Date.now();

    const worker1 = new Worker(__filename, { workerData: { say: '我是 1'+now } })
    worker1.on("message", (links) => { console.log(links) });

    const worker2 = new Worker(__filename, { workerData: { say: '我是 2'+now } })
    worker2.on("message", (links) => { console.log(links) });

    const worker3 = new Worker(__filename, { workerData: { say: '我是 3' } })
    worker3.on("message", (links) => { console.log(links) });

    const worker4 = new Worker(__filename, { workerData: { say: '我是 4' } })
    worker4.on("message", (links) => { console.log(links) });

    const worker5 = new Worker(__filename, { workerData: { say: 'end' } })
    worker5.on("message", (links) => { console.log(links) });
} else {


    firstTest() // 有几个 Worker 就调用几次
    const number = workerData

    console.log('---', number)

    parentPort.postMessage('联系主线程')
    console.log("结束了")

}