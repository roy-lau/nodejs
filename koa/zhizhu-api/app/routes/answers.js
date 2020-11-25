const Router = require('koa-router'),
  router = new Router({ prefix: '/questions/:questionId/answers' }),
  jwt = require('koa-jwt'),
  { secret } = require('../config.js'),
  { find, findById,
    create, update,
    delete: del,
    checkAnswerExist, checkAnswerer } = require('../controllers/answers.js')

const auth = jwt({ secret })

router
  .get('/', find)
  .post('/', auth, create)
  .get('/:id', checkAnswerExist, findById)
  .patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
  .del('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router;