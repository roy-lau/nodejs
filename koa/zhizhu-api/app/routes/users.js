const { checkQuestioner } = require('../controllers/questions.js');

const Router = require('koa-router'),
  jwt = require('koa-jwt'),
  { secret } = require('../config.js'),
  router = new Router({ prefix: '/users' }),
  { find, findById,
    create, update, del,
    login,
    checkOwner, checkUserExist,
    listFollowers, listFollowing,
    follow, unfollow,
    followTopic, unfollowTopic, 
    listFollowingTopic,listQuestions,
    listLikingAnswers,likeAnswer,unLikeAnswer,
    listDisLikingAnswers,disLikeAnswer,unDisLikeAnswer,
    listCollectAnswers,collectAnswer,unCollectAnswer
   } = require('../controllers/users.js'),
  { checkTopicExist } = require('../controllers/topics.js'),
  { checkAnswerExist } = require('../controllers/answers.js')

// const auth = async (ctx,next) => {
//   const { authorization = '' } = ctx.request.header,
//     token = authorization.replace('Bearer ', '')
//     try{
//       const user = jwt.verify(token,secret)
//       ctx.state.user = user // 将用户信息写入 koa 全局变量里
//     }catch(err){
//       ctx.throw(401,err.message)
//     }
//     await next()
// }

const auth = jwt({ secret })

router
  .get('/', auth, find)
  .post('/', create)
  .get('/:id', findById)
  .patch('/:id', auth, checkOwner, update)
  .delete('/:id', auth, checkOwner, del)
  .post('/login', login)
  .get('/:id/following', listFollowing)
  .get('/:id/followers', listFollowers)
  .put('/following/:id', auth, checkUserExist, follow)
  .delete('/following/:id', auth, checkUserExist, unfollow)
  .get('/:id/followingTopics', auth, listFollowingTopic)
  .put('/followTopic/:id', auth, checkTopicExist, followTopic)
  .delete('/unfollowTopic/:id', auth, checkTopicExist, unfollowTopic)
  .get('/:id/questions', listQuestions)

  .get('/:id/likingAnswers', auth, listLikingAnswers)
  .put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer,unDisLikeAnswer)
  .delete('/likingAnswers/:id', auth, checkAnswerExist, unLikeAnswer)

  .get('/:id/dislikingAnswers', auth, listDisLikingAnswers)
  .put('/dislikingAnswers/:id', auth, checkAnswerExist, disLikeAnswer,unLikeAnswer)
  .delete('/dislikingAnswers/:id', auth, checkAnswerExist, unDisLikeAnswer)

  .get('/:id/collectAnswers', auth, listCollectAnswers)
  .put('/collectAnswers/:id', auth, checkAnswerExist, collectAnswer)
  .delete('/collectAnswers/:id', auth, checkAnswerExist, unCollectAnswer)

module.exports = router;