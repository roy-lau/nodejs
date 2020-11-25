const Router = require('koa-router'),
  router = new Router({ prefix: '/questions' }),
  jwt = require('koa-jwt'),
  { secret } = require('../config.js'),
  { find, findById,
    create, update,
    delete: del,
    checkQuestionExist, checkQuestioner } = require('../controllers/questions.js')

const auth = jwt({ secret })

router
  .get('/', find)
  .post('/', auth, create)
  .get('/:id', checkQuestionExist, findById)
  .patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
  .del('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router;