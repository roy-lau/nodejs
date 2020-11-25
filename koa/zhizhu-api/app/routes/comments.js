const Router = require('koa-router'),
  router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' }),
  jwt = require('koa-jwt'),
  { secret } = require('../config.js'),
  { find, findById,
    create, update,
    delete: del,
    checkCommentExist, checkCommentator } = require('../controllers/comments.js')

const auth = jwt({ secret })

router
  .get('/', find)
  .post('/', auth, create)
  .get('/:id', checkCommentExist, findById)
  .patch('/:id', auth, checkCommentExist, checkCommentator, update)
  .del('/:id', auth, checkCommentExist, checkCommentator, del)

module.exports = router;