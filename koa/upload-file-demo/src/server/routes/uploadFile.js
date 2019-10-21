const fs = require('fs'),
    path = require('path'),
    config = require('../config.js')

/**
 * class UploadFile 上传文件类
 * @description
 *  koa-body 中间件配置后会自动上传的保存文件，这个接口只是修改了下文件名
 *  ctx.request.files  koa 使用 koa-body 中间件后获取上传文件的方法
 */
class UploadFile {
    /**
     * 上传单文件的 基础方法
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    single(ctx) {
        try {
            // console.log(ctx.request.files);
            const files = ctx.request.files.f1
            if (Array.isArray(files)) {
                return ctx.body = { "code": 2, "message": "一次只能上传一个文件" };
            }
            const result = _handleFile(files)

            ctx.body = {
                "code": 0,
                "message": "success",
                "fileUrl": result
            };
        } catch (e) {
            console.error('UploadFile multiple ERR: ', e)
            ctx.body = { "code": 1, "message": 'error -' + e };
        }
    }

    /**
     * 上传多文件
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    multiple(ctx) {
        try {
            // console.log(ctx.request.files);
            const result = _handleFile(ctx.request.files.f1)

            ctx.body = {
                "code": 0,
                "message": "success",
                "fileUrl": result
            };
        } catch (e) {
            console.error('UploadFile multiple ERR: ', e)
            ctx.body = { "code": 1, "message": 'error -' + e };
        }
    }
    /**
     * [fragmentation 大文件分片上传]
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    fragmentation(ctx) {
        var body = ctx.request.body;
        var files = ctx.request.files ? ctx.request.files.f1 : []; //得到上传文件的数组
        var result = [];
        var fileToken = ctx.request.body.token; // 文件标识
        var fileIndex = ctx.request.body.index; //文件顺序

        // console.log('files');
        // console.log(files);

        if (files && !Array.isArray(files)) { //单文件上传容错
            files = [files];
        }

        files && files.forEach(item => {
            var path = item.path;
            var fname = item.name; //原文件名称
            var nextPath = path.slice(0, path.lastIndexOf('/') + 1) + fileIndex + '-' + fileToken;
            if (item.size > 0 && path) {
                //得到扩展名
                var extArr = fname.split('.');
                var ext = extArr[extArr.length - 1];
                //var nextPath = path + '.' + ext;
                //重命名文件
                fs.renameSync(path, nextPath);

                result.push(config.uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1));
            }
        });

        ctx.body = {
            "code": 0,
            "message": "success",
            "fileUrl": result
        };

        if (body.type === 'merge') {
            //合并文件
            var filename = body.filename,
                chunkCount = body.chunkCount,
                folder = path.resolve(__dirname, '../../static/uploads') + '/';

            var writeStream = fs.createWriteStream(`${folder}${filename}`);

            var cindex = 0;
            //合并文件
            function fnMergeFile() {
                var fname = `${folder}${cindex}-${fileToken}`;
                var readStream = fs.createReadStream(fname);
                readStream.pipe(writeStream, { end: false });
                readStream.on("end", function() {
                    fs.unlink(fname, function(err) {
                        if (err) {
                            throw err;
                        }
                    });
                    if (cindex + 1 < chunkCount) {
                        cindex += 1;
                        fnMergeFile();
                    }
                });
            }

            fnMergeFile();

            ctx.body = {
                "code": 0,
                "message": "merge ok 200"
            };
        }

    }
    fragmentation1(ctx) {
        try {
            const body = ctx.request.body,
                {
                    token: fileToken, // 文件标识
                    index: fileIndex // 文件顺序
                } = body,
                files = ctx.request.files ? ctx.request.files.f1 : []; // 得到上传文件的数组

            // console.log('files:---', files);
            if (files) {

                const result = _handleFile(files)

                ctx.body = {
                    "code": 0,
                    "message": "success"
                };
            } else if (body.type === 'merge') {
                // 合并文件
                let filename = body.filename,
                    chunkCount = body.chunkCount,
                    folder = path.resolve(__dirname, '../../static/uploads') + '/';
                // console.log(filename)
                let writeStream = fs.createWriteStream(`${folder}${filename}`);

                let cindex = 0;
                // 合并文件
                function fnMergeFile() {
                    let fname = `${folder}${cindex}-${fileToken}`;
                    let readStream = fs.createReadStream(fname);
                    readStream.pipe(writeStream, { end: false });
                    readStream.on("end", function() {
                        fs.unlink(fname, function(err) {
                            if (err) {
                                throw err;
                            }
                        });
                        if (cindex + 1 < chunkCount) {
                            cindex += 1;
                            fnMergeFile();
                        }
                    });
                }

                fnMergeFile();

                ctx.body = { "code": 0, "message": 'merge ok 200' };

            } else {
                ctx.body = { "code": 2, "message": '发送参数有误！' };
            }
        } catch (e) {
            console.error('UploadFile fragmentation ERR: ', e)
            ctx.body = { "code": 1, "message": 'error -' + e };
        }
    }
}

/**
 * 处理文件的方法（只在内部使用）
 * @param  {Object} files 文件对象
 * @return {Array}        文件路径数组
 */
function _handleFile(files) {
    let result = [];

    //单文件上传容错
    if (files && !Array.isArray(files)) {
        files = [files];
    }

    files && files.forEach(item => {
        const oldPath = item.path, // 文件路径
            fileName = item.name; // 原文件名称
        console.log(fileName)
        if (item.size > 0 && oldPath) {
            const oldFilePath = path.dirname(oldPath), // 存放文件的原始路径（/root/to/path）
                oldFileName = path.parse(oldPath).name, // 原始文件名（upload_556d23584b2705ce6f6cc5b49fa35b3d）没有后缀
                ext = path.extname(fileName), // 客户端上传来的文件的后缀
                srcFileName = path.basename(fileName, ext), // 客户端上传来的文件的文件名，不包括后缀
                newPath = path.join(oldFilePath, srcFileName + "_" + oldFileName + ext) // 生成新的文件路径
            // 重命名文件
            // fs.renameSync(oldPath, newPath);
            // 流式读写文件
            // const zlib = require('zlib')
            fs.createReadStream(oldPath) // 流式读取
                // .pipe(zlib.createGunzip()) // 压缩文件
                .pipe(fs.createWriteStream(newPath)) // 流式写入


            result.push(config.uploadHost + path.join(srcFileName + "_" + oldFileName + ext));
        }
    });

    return result
}

module.exports = new UploadFile()