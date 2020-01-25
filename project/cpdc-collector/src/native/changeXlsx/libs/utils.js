const fs= require('fs')
/**
 * 写入文件
 * @param  {String} fileName 文件名
 * @param  {String} data     要保存的数据，需是字符串
 * @return {[type]}          [description]
 */
exports.saveFileSync = async function(fileName, data) {
    fs.writeFile(fileName, data, function(err) {
        if (err) {
            console.log(fileName, "数据写入失败！");
            return console.error(err);
        }
        console.log(fileName, "数据写入成功！");
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