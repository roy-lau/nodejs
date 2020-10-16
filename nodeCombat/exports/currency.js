var canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

// canadianToUS 函数设定在exports模块中，所以引入这个模块的代码可以使用它
exports.canadianToUS = function (canadian) {
  return roundTwoDecimals(canadian * canadianDollar);
};

// USToCanadian也设定在expoets模块中
exports.USToCanadian = function (us) {
  return roundTwoDecimals(us / canadianDollar);
};
