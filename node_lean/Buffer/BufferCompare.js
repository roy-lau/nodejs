//缓存区比较
var buffer1 = new Buffer("ABC");
var buffer2 = new Buffer("ABCD");
var result = buffer1.compare(buffer2);

if (result < 0) {
  console.log(buffer1 + "在" + buffer2 + "之前");
} else if (result == 0) {
  console.log(buffer1 + "与" + buffer2 + "相同");
} else {
  console.log(buffer1 + "在" + buffer2 + "之后");
}
//如果buffer1的比buffer2小，返回值为 ‘’‘-1’
//如果buffer1的比buffer2大，返回值为 ‘’‘1’
//如果buffer1和buffer2相同，返回值为 ‘’ 0’
