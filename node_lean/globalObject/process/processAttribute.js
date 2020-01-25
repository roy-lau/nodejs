//输出到终端
process.stdout.write("Hello World!" + "\n");

//通过参数读取
process.argv.forEach(function(val, index, array){
	console.log(index + ':' + val);
	});
//argv 属性返回一个数组，由命令行执行脚本时的各个参数组成。它的第一个成员总是node，第二个成员是脚本文件名，其余成员是脚本文件的参数。

console.log(process.execPath);  //返回执行当前脚本的 Node 二进制文件的绝对路径。

console.log(process.execArgv)  //返回一个数组，成员是命令行下执行脚本时，在Node可执行文件与脚本文件之间的命令行参数。

console.log(process.env)	//返回一个对象，成员为当前 shell 的环境变量

console.log(process.exitCode)   //进程退出时的代码，如果进程优通过 process.exit() 退出，不需要指定退出码。

console.log(process.version)	//Nodejs的版本号

console.log(process.versions)	//一个属性，包含了 node 的版本和依赖.

console.log(process.config)	//一个包含用来编译当前 node 执行文件的 javascript 配置选项的对象。它与运行 ./configure 脚本生成的 "config.gypi" 文件相同。

console.log(process.pid)	//当前进程号

console.log(process.title)	//进程名，默认值为"node"，可以自定义该值。

console.log(process.arch)	//当前 CPU 的架构：'arm'、'ia32' 或者 'x64'。

console.log(process.platform) 	//运行程序所在的平台系统 'darwin', 'freebsd', 'linux', 'sunos' 或 'win32'

console.log(process.mainModule)	//require.main 的备选方法。不同点，如果主模块在运行时改变，require.main可能会继续返回老的模块。可以认为，这两者引用了同一个模块。

console.log("以上是process的一些基本属性.")


