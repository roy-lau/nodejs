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
    constructor() {
        this.oldName = null
        this.tmpFolder = null
    }
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
        try {
            const body = ctx.request.body,
                {
                    type,
                    chunkNum,
                    chunkCount,
                    fileName
                } = body;

            let result = []
            if (type && type === 'chunk') { // 上传分片
                const files = ctx.request.files.f1 // 分片文件

                const _parseTmp = path.parse(files.path),
                    _parseFile = path.parse(fileName),

                    chunkFile = path.join(_parseTmp.dir, String(chunkNum).padStart(2, "0") + "_" + _parseFile.name + "_" + _parseTmp.name)

                fs.renameSync(files.path, chunkFile);

                ctx.body = { "code": 0, "message": 'chunk save success' };
            } else if (type && type === 'merge') { // 合并分片

                const uploadDir = path.resolve(__dirname, '../../static/uploads'),
                    fileList = fs.readdirSync(uploadDir),
                    _parse = path.parse(fileName),
                    newFileName = _parse.name + "_" + Date.now() + _parse.ext,
                    filterFileList = fileList.filter(file => file.includes(_parse.name))

                for (let i = 0; i < filterFileList.length; i++) {
                    const name = filterFileList[i],
                        tmpFile = path.join(uploadDir, name),
                        chunks = fs.readFileSync(tmpFile) // 读取分片文件

                    fs.unlinkSync(tmpFile) // 删除临时文件
                    // 合并分片
                    fs.appendFileSync(path.join(uploadDir, newFileName), chunks);
                }
                ctx.body = { "code": 0, "message": 'merge success', "fileUrl": config.uploadHost + newFileName };
            } else {
                ctx.body = { "code": 1, "message": 'type is undefind' };
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
        if (item.size > 0 && oldPath) {
            const oldFilePath = path.dirname(oldPath), // 存放文件的原始路径（/root/to/path）
                oldFileName = path.parse(oldPath).name, // 原始文件名（upload_556d23584b2705ce6f6cc5b49fa35b3d）没有后缀
                ext = path.extname(fileName), // 客户端上传来的文件的后缀
                srcFileName = path.basename(fileName, ext), // 客户端上传来的文件的文件名，不包括后缀
                newPath = path.join(oldFilePath, srcFileName + "_" + oldFileName + ext) // 生成新的文件路径
            // 重命名文件 （koa-body已经自动写入了文件）
            fs.renameSync(oldPath, newPath);


            result.push(config.uploadHost + path.join(srcFileName + "_" + oldFileName + ext));
        }
    });

    return result
}

module.exports = new UploadFile()