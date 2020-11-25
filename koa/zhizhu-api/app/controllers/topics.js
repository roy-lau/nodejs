/**
 * 话题控制器
 */
const Topic = require('../models/topics'),
  User = require('../models/users'),
  Question = require('../models/questions')


class TopicsCtl {
  // 查询全部话题
  async find(ctx) {
    const { per_page = 10 } = ctx.query,
      page = Math.max(ctx.query.page * 1, 1) - 1,
      perPage = Math.max(per_page * 1, 1)
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage)
  }
  // 查找一个话题
  async findById(ctx) {
    const { fields='' } = ctx.query,
      selectFields = fields.split(';').filter(f => f).map(m => ' +' + m).join(''),
      topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  // 创建一个话题
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  // 修改一个话题
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }
  // 校验话题存在与否
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }
  // 查询关注话题的人
  async listFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id })
    ctx.body = users
  }
  // 查询问题列表
  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id })
    ctx.body = questions
  }
}

module.exports = new TopicsCtl()