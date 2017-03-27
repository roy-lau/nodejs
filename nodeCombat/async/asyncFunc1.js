function asyncFunc(cb){
  setTimeout(cb,200)
}
var color = 'blue';
(function(color){       // 自执行函数
  asyncFunc(function(){
    console.log('This color is: ' + color);     // 输出 ‘blue’
  });
})(color);
color = 'green';
