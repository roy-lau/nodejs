// 构造函数 回调
function lean(something) {
  console.log(something);
}

function we(callback, something) {
  something += "is good";
  callback(something);
}

we(lean, "nodejs");

// 匿名函数 回调
we(function (something) {
  console.log(something);
}, "Jade");
