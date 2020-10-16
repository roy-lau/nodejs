var buffer1 = new Buffer("runoob");
//剪裁缓冲区
var buffer2 = buffer1.slice(0, 2); //从第0位开始，剪裁两位！

console.log("buffer2 concat:" + buffer2.toString());

//缓冲区裁剪：
//语法：buf.slice([start[, end]])
//参数：    start 数字，可选，默认：0
//          end   数字，可选，默认：buffer.length
