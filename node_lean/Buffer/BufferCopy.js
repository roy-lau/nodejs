var buffer1 = new Buffer('ABC');
//拷贝一个缓冲区
var buffer2 = new Buffer(3);
buffer1.copy(buffer2);      //将buffer1的内容拷贝到buffer2

console.log("buffer2 concat:" + buffer2.toString());

//拷贝缓存区：
//语法：buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
//参数：  targetBuffer 要拷贝的Buffer对象。
//        targetStart  数字，可选，默认：0.
//        sourceStart 数字，可选，默认：0.
//        sourceEnd   数字，可选，默认：buffer.length。
