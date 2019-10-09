/*zlib.createGzip() // 压缩
zlib.createGunzip() // 解压缩*/

const fs = require('fs'),
    zlib = require('zlib'),
    crypto = require('crypto'),
    hash = crypto.createHash('md5')

const input = fs.createReadStream('md5.ry');
const output = fs.createWriteStream("abc.txt");

hash.setEncoding('hex');

input
    .pipe(hash)
    // .pipe(zlib.createGunzip())
    .pipe(output);

hash.on('data', function(data) {
    console.log('# ', data);
});