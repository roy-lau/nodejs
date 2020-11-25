/**
 * 回答 控制器
 */
const answers = require('../models/answers')
const Answer = require('../models/answers'),
  User = require('../models/users')


class AnswersCtl {
  // 查询全部答案
  async find(ctx) {
    const { per_page = 10 } = ctx.query,
      page = Math.max(ctx.query.page * 1, 1) - 1,
      perPage = Math.max(per_page * 1, 1),
      q = new RegExp(ctx.query.q)

    ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId })
      .limit(perPage)
      .skip(page * perPage)
  }
  // 查找一个答案
  async findById(ctx) {
    const { fields='' } = ctx.query,
      selectFields = fields.split(';').filter(f => f).map(m => ' +' + m).join(''),
      answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    ctx.body = answer
  }
  // 创建一个答案
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const answerer = ctx.state.user._id,
      { questionId } = ctx.params
    const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save()
    ctx.body = answer
  }
  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  // 修改一个答案
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }
  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

  // 校验答案存在与否
  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) ctx.throw(404, '答案不存在')
    // 只有在删改查答案时候才检查此逻辑，赞和踩答案时候不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) ctx.throw(404, '该答案下没有此答案')
    ctx.state.answer = answer // 挂载答案到 koa 的 state 上
    await next()
  }
  // 查询关注答案的人
  async listFollowers(ctx) {
    const users = await User.find({ followingAnswers: ctx.params.id })
    ctx.body = users
  }
}

module.exports = new AnswersCtl()