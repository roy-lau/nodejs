var buf = require('buffer')

buf = new Buffer(256);
len = buf.write("www.baidu.com");

console.log("写入字节数" + len);
//写入缓存：
//语法：buf.write(string[, offset[, length]][, encoding])
//参数：  string 写入缓存区的字符串
//        offset 缓存区开始写入的引索值，默认为0
//       length 写入的字节数，默认为buffer.lenght
//       encoding 使用的编码。默认为'utf8'.
