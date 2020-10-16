buf = new Buffer(26);
for (var i = 0; i < 26; i++) {
  buf[i] = i + 97;
}

console.log(buf.toString("ascii")); //输出：abcdefghijklmnopqrstuvwxyz
console.log(buf.toString("ascii", 0, 5)); //输出：abcde
console.log(buf.toString("utf8", 0, 5)); //输出：abcde
console.log(buf.toString(undefined, 0, 5)); //输出：’utf8'编码。并输出：abcde

//从缓存区读数据：
//语法： buf.toString([encoding[, start[, end]]])
//参数：  encoding 使用的编码，默认为'utf8'
//        start 指定开始读取的引索位置，默认为0
//        end   结束位置，默认为缓冲区的末尾
