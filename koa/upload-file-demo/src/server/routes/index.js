
const uploadFile = require('./uploadFile');

module.exports = (routes) => {
    routes
        .get('/test', (ctx, next) => {
            ctx.body = { message: 'hi! this is test API , ok ', }
        })

        .post('/upload-base',uploadFile.base)
        .post('/upload-multiple',uploadFile.multiple)
}