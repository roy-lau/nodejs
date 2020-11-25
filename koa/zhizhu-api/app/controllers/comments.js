/**
 * 评论 控制器
 */
const Comment = require('../models/comments'),
  User = require('../models/users')


class CommentCtl {
  // 查询全部评论
  async find(ctx) {
    const { per_page = 10 } = ctx.query,
      page = Math.max(ctx.query.page * 1, 1) - 1,
      perPage = Math.max(per_page * 1, 1),
      q = new RegExp(ctx.query.q),
      { questionId, answerId } = ctx.params,
      { rootCommentId } = ctx.query

    ctx.body = await Comment.find({ content: q, questionId, answerId, rootCommentId })
      .limit(perPage)
      .skip(page * perPage)
      .populate('commentator replyTo')
  }
  // 查找一个评论
  async findById(ctx) {
    const { fields = '' } = ctx.query,
      selectFields = fields.split(';').filter(f => f).map(m => ' +' + m).join(''),
      comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator replyTo')
    ctx.body = comment
  }
  // 创建一个评论
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    })
    const commentator = ctx.state.user._id,
      { questionId, answerId } = ctx.params

    const comment = await new Comment({ ...ctx.request.body, commentator, questionId, answerId }).save()
    ctx.body = comment
  }
  // 检查评论人是否存在
  async checkCommentator(ctx, next) {
    const { comment } = ctx.state
    if (comment.commentator.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  // 修改一个评论
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    const {content} = ctx.request.body
    await ctx.state.comment.update({content})
    ctx.body = ctx.state.comment
  }
  async delete(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

  // 校验评论存在与否
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) ctx.throw(404, '评论不存在')
    // 只有在删改查评论时候才检查此逻辑，赞和踩评论时候不检查
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此评论')
    // 只有在删改查答案时候才检查此逻辑，赞和踩答案时候不检查
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) ctx.throw(404, '该答案下没有此评论')
    ctx.state.comment = comment // 挂载评论到 koa 的 state 上
    await next()
  }
  // 查询关注评论的人
  async listFollowers(ctx) {
    const users = await User.find({ followingcomment: ctx.params.id })
    ctx.body = users
  }
}

module.exports = new CommentCtl()