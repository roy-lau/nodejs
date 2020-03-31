/**
 * 文件加密解密
 * 参考： http://nodejs.cn/api/crypto.html
 */
const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');

const algorithm = 'aes-192-cbc';
const password = '用于生成密钥的密码';
// 改为使用异步的 `crypto.scrypt()`。
const key = crypto.scryptSync(password, '盐值', 24);
// 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
const iv = Buffer.alloc(16, 0); // 初始化向量。

/**
 * 解密文件
 * @param {String} fileName 文件名
 */
function encryptFile (fileName) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const input = fs.createReadStream(fileName);
    const output = fs.createWriteStream(fileName + '.enc');

    input
        // .pipe(zlib.createGzip())
        .pipe(cipher)
        .pipe(output);
    console.log(fileName + ' 加密成功')
}

/**
 * 加密文件
 * @param {String} fileName 文件名
 */
function decryptFile (fileName) {

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const input = fs.createReadStream(fileName + '.enc');
    const output = fs.createWriteStream(fileName);

    input
        // .pipe(zlib.createGunzip())
        .pipe(decipher)
        .pipe(output);
    console.log(fileName + ' 解密成功')
}

const fileName = 'demo.txt'

// encryptFile(fileName)
// decryptFile(fileName)