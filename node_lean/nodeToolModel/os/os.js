//操作系统模块
var os = require("os");

//CPU 的字节
console.log("endianness(字节数):" +os.endianness());

//操作系统名
console.log('type:' + os.type());

//操作系统名
console.log("platform:" +os.platform());

//系统内存总量
console.log('total memory(总内存):' + os.totalmem() + "bytes");

//操作系统空间内存量
console.log('free memory(释放内存):' +os.freemem() + "bytes");
