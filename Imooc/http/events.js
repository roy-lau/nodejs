
var EventEmitter = require('events').EventEmitter
var life = new EventEmitter();
// EventEmitter函数默认只能监听10件事情（但是，可以修改）

// life.setMaxlisteners(12)    //设置事件监听的最大值（新的事件监听已经没有这个方法了）

// addEventListener
life.on('boss', function(who){
    var i = 0
    var arr = []
    while(i<=10000){
        i++
        arr.push(i)
    }
    arr.forEach(function(item){
        console.log('给 ' + who + '做' + item + '件事')
    })
})
life.emit('boss','老子')
