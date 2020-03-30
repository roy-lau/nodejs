let fs = require('fs');
let zlib = require('zlib');
let crypto = require('crypto');


function geFileList (path) {
    let filesList = [];
    readFile(path, filesList);
    return filesList;
}

function readFile (path, filesList) {
    files = fs.readdirSync(path);
    files.forEach(walk);
    function walk (file) {
        states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            readFile(path + '/' + file, filesList);
        }
        else {
            let obj = new Object();
            obj.size = states.size;
            obj.name = file;
            obj.path = path + '/' + file;
            filesList.push(obj);
        }
    }
}

let getFileName = function (path) {
    let pathList = path.split("/");
    let fileName = pathList[pathList.length - 1];
    return fileName;
};


let getFileContent = function (filePath, cb) {
    fs.readFile(filePath, function (err, buf) {
        cb(err, buf);
    });
};

let writeFileSync = function (filePath, text) {
    fs.writeFileSync(filePath, text);
};

let writeFileAsync = function (filePath, text, cb) {
    fs.writeFile(filePath, text, function (err) {
        cb(err);
    });
};

/********************加密解密部分**************************/

let consts = {
    cryptkey: 'S62rgt9rf!nYS5b3',
    iv: "Og'Y6Jm-'i#io9Op"
};

function util () {

}
let prot = util.prototype;

prot.md5 = function (str) {
    let md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

prot.encode = function (content) {
    let cipher = crypto.createCipheriv('aes-128-cbc', consts.cryptkey, consts.iv);
    cipher.setAutoPadding(true);
    let bf = [];
    bf.push(cipher.update(content));
    bf.push(cipher.final());
    return Buffer.concat(bf);
};


prot.decode = function (content) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', consts.cryptkey, consts.iv);
    decipher.setAutoPadding(true);
    try {
        let a = [];
        a.push(decipher.update(content));
        a.push(decipher.final());
        return Buffer.concat(a);
    } catch (e) {
        console.error('decode error:', e.message);
        return null;
    }
};


/**********************压缩解压缩部分************************/
function gZip (strText, cb) {
    zlib.gzip(strText, function (err, bufData) {
        cb(err, bufData);
    });
}

function unZip (buffer, cb) {
    zlib.unzip(buffer, function (err, buf) {
        cb(err, buf);
    });
}



module.exports = {
    "FileUtil": {
        "getDirFiles": geFileList,
        "getFileName": getFileName,
        "writeFileAsync": writeFileAsync,
        "writeFileSync": writeFileSync,
        "getFileContent": getFileContent
    },
    "EncodeUtil": util,
    "ZipUtil": {
        "gZip": gZip,
        "unZip": unZip
    }
};
