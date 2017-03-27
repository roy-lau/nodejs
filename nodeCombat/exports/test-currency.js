var currency = require('./currency');

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currency.canadianToUS(50));     // 使用currency模块的canadianToUS函数

console.log('30 US dollars equals this amount of Canadian dollars:');
console.log(currency.USToCanadian(30));     // 使用currency模块的USToCanadian函数
