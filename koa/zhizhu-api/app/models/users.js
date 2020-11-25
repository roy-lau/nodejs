/**
 * 用户 模型
 */
const mongoose = require('mongoose'),
  { Schema, model } = mongoose,

  UserSchema = new Schema({
    __v: { type: Number, select: false },
    // 用户名
    name: { type: String, required: true },
    // 密码
    password: { type: String, required: true, select: false },
    // 头像
    avatar_url: { type: String },
    // 性别
    gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
    // 一句话介绍
    headline: { type: String },
    // 地址
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    // 所在行业
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    // 职业经历
    employments: {
      type: [{
        company: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 公司
        job: { type: Schema.Types.ObjectId, ref: 'Topic' } // 职位
      }], select: false
    },
    // 教育经历
    educations: {
      type: [{
        school: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 学校
        major: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 专业方向
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 学历
        entrance_year: { type: Number }, // 入学年份
        graduation_year: { type: Number }, // 毕业年份
      }], select: false
    },
    // 关注的用户
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      select: false
    },
    // 关注的话题
    followingTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
      select: false
    },
    // 赞过的回答
    likingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false
    },
    // 踩过的回答
    disLikingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false
    },
    // 收藏答案
    collectingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false
    },
  }, { timestamps: true })

module.exports = model('User', UserSchema)