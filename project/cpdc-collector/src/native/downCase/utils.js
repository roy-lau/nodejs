const fs = require('fs')
/**
 * 脱敏函数
 * @param  {String} str      需要脱敏的字符串
 * @param  {Number} beginStr 开始位置
 * @param  {Number} endStr   结束位置
 * @return {String}          脱敏后的数据
 *
 * desensitization('刘强',1,3)
 * "刘**"
 * desensitization('河南省新郑市',3,8)
 * "河南省*****"
 * desensitization('13526636962',3,8)
 * "135*****962"
 *
 */

exports.desensitization = function(str, beginStr, endStr) {
    if (!str) return
    try {

        let len = String(str).length,
            leftStr = String(str).substring(0, beginStr),
            rightStr = String(str).substring(endStr, len),
            _str = ''

        for (let i = 0; i < endStr - beginStr; i++) {
            _str = _str + '*';
        }
        _str = leftStr + _str + rightStr;
        return _str;

    } catch (error) {
        console.error('desensitization error: ', error)
    }
}

/**
 * 写入文件
 * @param  {String} fileName 文件名
 * @param  {String} data     要保存的数据，需是字符串
 * @return {[type]}          [description]
 */
exports.saveFileSync = function(fileName, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, function(err) {
            if (err) {
                console.log(fileName, "数据写入失败！");
                reject(err)
            }
            resolve()
            console.log(fileName, "数据写入成功！");
        });
    });
}

exports.saveFile = function(fileName, data) {
    fs.writeFile(fileName, data, function(err) {
        if (err) {
            console.log(fileName, "数据写入失败！");
            return console.error(err);
        }
        console.log(fileName, "数据写入成功！");
    });
}

// module. exports={
// find:function(){},
// save:function(){}
// };