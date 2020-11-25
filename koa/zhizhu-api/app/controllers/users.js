/**
 * 用户控制器
 */
const jwt = require('jsonwebtoken'),
  { secret } = require('../config.js'),
  User = require('../models/users'),
  Question = require('../models/questions'),
  Answers = require('../models/answers')

class UsersCtl {
  // 查询所有用户
  async find(ctx) {
    const { per_page = 10 } = ctx.query,
      page = Math.max(ctx.query.page * 1, 1) - 1,
      perPage = Math.max(per_page * 1, 1)
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage)
  }
  /**
   * 查询某个用户
   * @param {*} ctx 
   * @demo 过滤字段 http://localhost:3000/users/5fa7936c0514be1fc9cb8e69?fields=locations;employments
   */
  async findById(ctx) {
    const { fields = '' } = ctx.query,
      selectFields = fields.split(';').filter(f => f).map(m => ' +' + m).join(''),
      populateStr = fields.split(';').filter(f => f).map(m => {
        if (m === 'employments') return 'employments.company employments.job'
        else if (m === 'educations') return 'educations.school educations.major'
        else return m
      }).join(' '),
      user = await User.findById(ctx.params.id)
        .select(selectFields)
        .populate(populateStr)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) ctx.throw(403, '没有权限,当前登录用户不能删除其他用户') // A 用户无权修改 B 用户的信息
    await next()
  }
  // 创建一个用户
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const _name = ctx.request.body.name,
      repeatedUser = await User.findOne({ "name": _name })
    if (repeatedUser) ctx.throw(409, "用户名已存在")

    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  // 更新用户
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  // 删除一个用户
  async del(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
    ctx.status = 204
  }
  // 登陆接口
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')
    const { _id, name } = user
    const token = jwt.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }
  // 获取某人关注的人列表
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.following
  }
  // 查询某人的粉丝列表
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }
  // 校验用户存在与否
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    await next()
  }
  // 关注某人
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  // 取消关注
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following'),
      index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  // 获取用户关注的话题列表
  async listFollowingTopic(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.followingTopics
  }
  // 关注话题
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  // 取消关注话题
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics'),
      index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  // 列出问题列表
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id })
    ctx.body = questions
  }
  /**
   * 答案
   */

  // -- 赞答案

  // 列出赞过的答案列表
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+likingAnswers')
      .populate('likingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.likingAnswers
  }

  // 喜欢的答案
  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id)
      me.save()
      await Answers.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } })
    }
    ctx.status = 204
    await next()
  }
  // 取消点赞的答案
  async unLikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers'),
      index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.likingAnswers.splice(index, 1)
      me.save()
      await Answers.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } })
    }
    ctx.status = 204
  }

  // -- 踩答案
  // 列出踩过的答案列表
  async listDisLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+disLikingAnswers')
      .populate('disLikingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.disLikingAnswers
  }

  // 踩的答案
  async disLikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+disLikingAnswers')
    if (!me.disLikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.disLikingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
    await next()
  }
  // 取消点踩的答案
  async unDisLikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+disLikingAnswers'),
      index = me.disLikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.disLikingAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  // -- 收藏答案
  // 列出收藏过的答案列表
  async listCollectAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+collectingAnswers')
      .populate('collectingAnswers')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.collectingAnswers
  }

  // 收藏的答案
  async collectAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
    await next()
  }
  // 取消点收藏的答案
  async unCollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers'),
      index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.collectingAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}

module.exports = new UsersCtl()