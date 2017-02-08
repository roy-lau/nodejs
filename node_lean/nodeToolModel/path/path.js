var path = require('path');

// 格式化路径
console.log("normalization(格式化):" + path.normalize('/test/test1/shell/tab/..'));

// 链接路径
console.log("joint path(链接路径):" + path.join('/test','test1','shell','tab','..'));

// 转换为绝对路径
console.log('resolve(转换为绝对路径):' + path.resolve('path.js'));

// 路径中 文件的后缀名
console.log('exit name(后缀名):' + path.extname('path.js'));

