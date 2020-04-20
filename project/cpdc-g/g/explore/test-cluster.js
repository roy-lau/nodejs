// /**
//  * - 加载clustr模块
//  * - 设定启动进程数为cpu个数
//  */
// var cluster = require('cluster')
// var numCPUs = require('os').cpus().length

// // 素数的计算

// let queue = []

// if (cluster.isMaster) {

//     for (var i = 0; i < numCPUs; i++) {
//         const worker = cluster.fork() // 启动子进程
//         //  在主进程中，这会发送消息给特定的工作进程
//         worker.send(i)

//         worker.on('message', (id) => {
//             run_queue(id)
//         // console.log(msg)
//             worker.kill()
//         })

//     }
//     // 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件
//     cluster.on('exit', function (worker, code, signal) {
//         console.log('worker ' + worker.process.pid + ' 关闭')
//     })
// } else {
//     // 监听子进程发送的信息
//     process.on('message', (id) => {
//         // 在工作进程中，这会发送消息给主进程
//         process.send(id)
//     })
// }
// let primes = [
//     function a1(){
//         setTimeout(()=>{
//             console.log("a1")
//         },1000)
//     },
// function a2(){console.log("a2")},
// function a3(){console.log("a3")},
// function a4(){console.log("a4")},
// ],index=0
// function run_queue (cpuId) {
//     // primes.push(index++)
//     // console.log("cpuId:", cpuId, primes)
//     primes[0]()
//     console.log(primes,index++)
//     primes.shift()
// }
const async = require("async")
const sleep = (timeout = 2000) => new Promise(resolve => setTimeout(resolve, timeout))
async function a1 () {
    console.log("start a1")
    await sleep()
    console.log("end a1")
}
async function a2 () { console.log("start a2");await sleep(); console.log("end a2") }
async function a3 () { await sleep(); console.log("a3") }
async function a4 () { await sleep(); console.log("a4") }
async.parallel([async function a1 () {
    console.log("start a1")
    await sleep()
    console.log("end a1")
},a2])

async function run () {
    Promise.all([a1(), a2(), a3(), a4()])

}
// run()