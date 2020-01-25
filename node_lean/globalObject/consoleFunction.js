console.info("程序开始执行：")


console.time("数据执行用时");

var counter = 0;

while (counter <= 100000){
	console.info("计数：%d", counter);
	counter++
	};
//
//这里执行了一些代码！---------/console.time是开始计时，console.timeEnd是结束计时
//
console.timeEnd("数据执行用时");	//console.time和console.timeEnd是一对，里面的内容必须一致
console.info("程序执行完毕.");
