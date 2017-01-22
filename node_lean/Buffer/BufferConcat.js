var buffer1 = new Buffer('菜鸟教程');
var buffer2 = new Buffer('www.runoob.com');
var buffer3 = new Buffer.concat([buffer1,buffer2]);

console.log("buffer3的内容为：" + buffer3.toString());
//缓冲区合并：
//语法：Buffer.concat(list[, totalLength])
//参数：  list 用于合并的Buffer对象数组列表
//        totalLenght 指定组合后Buffer对象总长度
