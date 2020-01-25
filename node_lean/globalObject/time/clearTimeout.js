function printHello(){
	console.log("Hello,World!");
	}
	//两秒后执行printHwllo
	var t = setTimeout(printHello, 2000);

	//清除定时器
	clearTimeout(t);

	//什么都没输出，正常
