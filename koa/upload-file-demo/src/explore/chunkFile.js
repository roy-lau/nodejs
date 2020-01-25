const fs = require('fs'),
    path = require('path')

/**
 * 合并切片文件
 * @param  {[type]} dir       文件目录
 * @param  {[type]} ext       文件后缀
 * @param  {[type]} splitSize 切片大小
 * @return {[type]}           [description]
 */
function fileMerge(dir, ext, splitSize) {
    try {
        /**
         * 获取目录下的文件列表
         * fs.readdir()
         * http://nodejs.cn/api/fs.html#fs_fs_readdir_path_options_callback
         */
        fs.readdir(dir, (err, fileList) => {
            console.log(fileList)
            for (let i = 0; i < fileList.length; i++) {
                const fileName = fileList[i],
                    _path = path.join(dir, fileName)
                /**
                 * 流式写入文件
                 * 设置写入开始(start)位置 (相当于追加)，flag 必须为 r+
                 */
                fs.createReadStream(_path)
                    .pipe(fs.createWriteStream(dir + ext, { flag: 'r+', start: i * splitSize }));
                // fs.appendFileSync(dir + ext, ,fileStream);
            }
        })
    } catch (e) {
        console.log(e)
    }
}

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
                const folder = fs.mkdtempSync(path.join(__dirname, _parse.name + "_")),
                    // 一共需要切出来多少个文件 as 循环次数
                    count = fileTotalSize / splitSize

                for (let i = 0, k = 1; i < count; i++, k++) {
                    let start = i * splitSize, // 开始字节： 从 0 开始，每次循环增加 2M (splitSize)
                        end = k * splitSize, // 结束字节： 从 1 开始，每次循环增加 2M (splitSize)
                        chiunks = String(i).padStart(2, "0") // 以循环的下标为文件名（补零）
                    /**
                     * 开始切片，利用 fs.createReadStream 的参数。 读取 开始(start)结束(end) 字节
                     * http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options
                     */
                    // fs.createReadStream(inputFile, { start, end })
                    //     .pipe(fs.createWriteStream(path.join(folder, chiunks)));


                    const rs = fs.createReadStream(inputFile, { start, end }); // 文件读取流
                    const ws = fs.createWriteStream(path.join(folder, chiunks)); // 文件写入流
                    // rs.pipe(ws);  // 管道

                    rs.on('data', function(chunk) {
                        // 65536  chunk就是一个Buffer(存放16进制数据的"数组",长度以B字节计算(两个16进制为一个元素))
                        // console.log(chunk.length);
                        // Node中的Buffer不占用垃圾回收机制中的内存。  Buffer是由C/C++模块维护。  'data'+chunk会在内部自动调用toString()函数。 建议直接返回buffer节省处理字符串的性能开销。
                        ws.write(chunk);
                    });

                    rs.on('close',()=>{
                        ws.close();
                        // 切片完成后，调用合并切片函数
                        if (end >= fileTotalSize) {
                            fileMerge(folder, _parse.ext, splitSize)
                        }
                    })
                    rs.on("error",(e)=>{
                        console.error(e)
                    })
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
const inputFile = path.join(__dirname, './big.txt'),
    splitSize = 2 * 1024 * 1024; // 2M

fileSplit(inputFile, splitSize, __dirname)