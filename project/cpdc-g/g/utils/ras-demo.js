
let ResFile = require('./res-file.js');
let async = require('async');
 
let encodeUtil = new ResFile.EncodeUtil();
 
 
zipEncode();
 
 
function zipEncode() {
    let fileList = utils.FileUtil.getDirFiles(__dirname);
    async.each(fileList, function (item, callback) {
        let filepath = item.path;
        let filename = utils.FileUtil.getFileName(filepath);
        utils.FileUtil.getFileContent(filepath, function (err, buf) {
            if (!err) {
                let bpstr = new Buffer(buf);
                utils.ZipUtil.gZip(bpstr, function (err, bufData) {
                    let encodeBuffer = encodeUtil.encode(bufData);//fs.readFileSync(curPath)
                    let resultPath = __dirname + "/resFile/" + filename;
 
                    utils.FileUtil.writeFileSync(resultPath, encodeBuffer);
                    callback(err);
                });
            } else {
                callback(err);
            }
        });
    }, function (err, resp) {
        if (err) {
            console.log("err :", err);
        } else {
            console.log("success");
            decodeUnzip();
        }
    });
}
 
function decodeUnzip() {
    let fileList = utils.FileUtil.getDirFiles(__dirname + "/resFile");
    async.each(fileList, function (item, callback) {
        let filepath = item.path;
        utils.FileUtil.getFileContent(filepath, function (err, buf) {
            if (!err) {
                let bpstr = new Buffer(buf);
                let decodeBuffer = encodeUtil.decode(bpstr);
                utils.ZipUtil.unZip(decodeBuffer, function (err, buf) {
                    console.log(JSON.parse(buf.toString()));
                    callback(err);
                });
            } else {
                callback(err);
            }
        });
    }, function (err, resp) {
        if (err) {
            console.log("err :", err);
        } else {
            console.log("success");
        }
    });
}