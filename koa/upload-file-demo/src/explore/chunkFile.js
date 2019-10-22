const fs = require('fs'),
    path = require('path')


/**
 * 文件切片
 * @param  {[type]} inputFile 要切片的文件路径
 * @param  {[type]} splitSize 切片大小
 * @return {[type]}
 */
function fileSplit(inputFile, splitSize) {
    try {

        /**
         * 验证文件是否存在
         * fs.existsSync()
         * http://nodejs.cn/api/fs.html#fs_fs_existssync_path
         */
        if (fs.existsSync(inputFile)) {
            /**
             * 获取文件信息
             * fs.statSync()
             * http://nodejs.cn/api/fs.html#fs_fs_statsync_path_options
             */
            const { size: fileTotalSize } = fs.statSync(inputFile),
                /**
                 * 将文件路径格式化
                 * path.parse()
                 * http://nodejs.cn/api/path.html#path_path_parse_path
                 */
                _parse = path.parse(inputFile)

            /**
             * 判断文件是否需要切片：
             * 切片大小(splitSize) 小于 文件总大小(fileTotalSize) 需切片
             */
            if (splitSize < fileTotalSize) {
                /**
                 * 生成临时文件名 + 8位随机字符串的目录
                 * fs.mkdtempSync()
                 * http://nodejs.cn/api/fs.html#fs_fs_mkdtempsync_prefix_options
                 */
                const folder = fs.mkdtempSync(path.join(__dirname, _parse.name)),
                    // 一共需要切出来多少个文件 as 循环次数
                    count = fileTotalSize / splitSize

                for (let i = 0, k = 1; i < count; i++, k++) {
                    let start = i * splitSize, // 开始字节： 从 0 开始，每次循环增加 2M (splitSize)
                        end = k * splitSize // 结束字节： 从 1 开始，每次循环增加 2M (splitSize)
                    /**
                     * 开始切片，利用 fs.createReadStream 的参数。 读取 开始(start)结束(end) 字节
                     * http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options
                     */
                    fs.createReadStream(inputFile, { start, end })
                        .pipe(fs.createWriteStream(path.join(folder, "" + i)));
                }


            } else { // 否则不用切片直接写入
                const writePath = path.join(_parse.dir, _parse.name + '_' + Date.now() + _parse.ext)

                fs.createReadStream(inputFile)
                    .pipe(fs.createWriteStream(writePath));

            }
        } else {
            console.error(inputFile, "文件不存在")
        }

    } catch (e) {
        console.error(e)
    }

}
// const inputFile = path.join(__dirname, './chunkFile.js'),
    const inputFile = path.join(__dirname, './Xshell6_wm.exe'),
    splitSize = 2 * 1024 * 1024; // 2M

fileSplit(inputFile, splitSize, __dirname)