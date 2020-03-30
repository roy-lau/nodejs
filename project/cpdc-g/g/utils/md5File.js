/*zlib.createGzip() // 压缩
zlib.createGunzip() // 解压缩*/

const fs = require('fs'),
    path = require('path'),
    zlib = require('zlib'),
    crypto = require('crypto'),
    hash = crypto.createHash('md5')

let readFileName = path.join(__dirname, "demo.txt")
const input = fs.createReadStream(readFileName);
const output = fs.createWriteStream("demo1.gz");

fs.readFile(readFileName, function (err, buf) {
    console.log(err, buf);
});

let consts = {
    cryptkey: 'S62rgt9rf!nYS5b3',
    iv: "Og'Y6Jm-'i#io9Op"
};

let prot = {}

// md5 加密（解不开）
prot.md5 = function (str) {
    let md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};
// 加密
prot.encode = function (dataStr) {
    console.log(dataStr)
    // let content=new Buffer(buf);
    // let cipher = crypto.createCipheriv('aes-128-cbc', consts.cryptkey, consts.iv);
    // cipher.setAutoPadding(true);
    // let bf = [];
    // bf.push(cipher.update(content));
    // bf.push(cipher.final());
    // return Buffer.concat(bf);
    let cipherChunks = new Buffer();
    let decipher = crypto.createCipheriv('aes-128-cbc', consts.cryptkey, consts.iv);
    decipher.setAutoPadding(true);
    cipherChunks.concat(decipher.update(dataStr, 'base64', 'utf8'));
    cipherChunks.concat(decipher.final('utf8'));
    return cipherChunks

};

// 解密
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

input
    .pipe(prot.encode)
    .pipe(zlib.createGzip())
    .on('error', (err) => {
        console.log("压缩出错：", err)
    })
    .pipe(output)
    .on('error', (err) => {
        console.log("写入出错：", err)
    });