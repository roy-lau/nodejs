
const Router = require('koa-router'),
  router = new Router({ prefix: '/topics' }),
  jwt = require('koa-jwt'),
  { secret } = require('../config.js'),
  { find, findById,
    create, update, 
    checkTopicExist,listFollowers,
    listQuestions } = require('../controllers/topics.js')

const auth = jwt({ secret })

router
  .get('/', find)
  .post('/', auth,create)
  .get('/:id', checkTopicExist,findById)
  .patch('/:id',auth,checkTopicExist, update)
  .get('/:id/followers', checkTopicExist,listFollowers)
  .get('/:id/questions', checkTopicExist,listQuestions)

module.exports = router;