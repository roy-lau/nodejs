// 变量作用域
var globalVariable = "这是一个全局变量1";

function globalFunction() {
  var localVariable = "这是一个局部变量1";

  console.log("全局/局部变量");
  console.log(globalVariable);
  console.log(localVariable);

  globalVariable = "这是修改后的全局变量";

  console.log(globalVariable);

  function localFunction() {
    var innerLoalVariable = "这是一个局部变量2";

    console.log("全局/局部变量");
    console.log(globalVariable);
    console.log(localVariable);
    console.log(innerLoalVariable);
  }
  localFunction();
}

globalFunction();
