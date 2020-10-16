process.on("exit", function (code) {
  //以下代码永远不会运行
  setTimeout(function () {
    console.log("该代码永远不会执行");
  }, 0);

  console.log("退出码为：", code);
});

console.log("程序执行结束！");
