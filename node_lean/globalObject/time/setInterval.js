var i = 0;
function printHello(){
	console.log("Hello. World!--" + i++);
	}
	//每隔两秒执行以上函数
	setInterval(printHello, 2000);
