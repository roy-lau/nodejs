//匿名函数
//把一个函数作为变量传递。但是我们不一定要绕这个"先定义，再传递"的圈子，我们可以直接在另一个函数的括号中定义和传递这个函数： 
function execute(someFunction, value){
    someFunction(value);
};

execute(function(word){
    console.log(word)
},"Hello");
// 我们在 execute 接受第一个参数的地方直接定义了我们准备传递给 execute 的函数。

//用这种方式，我们甚至不用给这个函数起名字，这也是为什么它被叫做匿名函数
